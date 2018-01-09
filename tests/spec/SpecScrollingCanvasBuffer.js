describe("scrollingCanvasBuffer", function() {
  var canvas2dContext = jasmine.createSpyObj('canvas2dContext', ['drawImage']);
  var mockedBufferCanvas = jasmine.createSpyObj('canvas', ['getContext']);
  mockedBufferCanvas.getContext.and.callFake(function(param) {if(param == '2d'){return canvas2dContext}});
  var environmentTilesCanvas = {};
  var camera = jasmine.createSpyObj('camera', ['addListener']);
  var environment = {spriteCanvas : environmentTilesCanvas};
  environment.grid = [
      [{tileId: 0},{tileId: 0},{tileId: 0},{tileId: 0},{tileId: 0}],
      [{tileId: 0},{tileId: 1},{tileId: 1},{tileId: 1},{tileId: 0}],
      [{tileId: 0},{tileId: 1},{tileId: 1},{tileId: 1},{tileId: 0}],
      [{tileId: 0},{tileId: 1},{tileId: 1},{tileId: 1},{tileId: 0}],
      [{tileId: 0},{tileId: 0},{tileId: 0},{tileId: 0},{tileId: 0}]
    ];
    environment.tileSize=20;
    environment.tilesData = [{x:0,y:0},{x:1,y:0}];
    var displayCanvasWidth = environment.tileSize*3;
    var displayCanvasHeight = environment.tileSize*2;

  it("should initialize correctly", function() {
    var viewPortX = 0;
    var viewPortY = 0;
    var viewPortWidth = 100;
    var viewPortHeight = 80;
    var viewPort = {x:viewPortX, y:viewPortY, width: viewPortWidth, height: viewPortHeight};
    camera._viewPort = viewPort;
    scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
    //camera-listener added
    expect(camera.addListener.calls.any()).toBe(true);
    //initial draw
    expect(canvas2dContext.drawImage.calls.count()).toEqual(12);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[0]).toBe(environmentTilesCanvas);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[1]).toEqual(environment.tilesData[environment.grid[i][j].tileId].x*environment.tileSize); 
    expect(canvas2dContext.drawImage.calls.argsFor(0)[2]).toEqual(environment.tilesData[environment.grid[i][j].tileId].y*environment.tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[3]).toEqual(environment.tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[4]).toEqual(environment.tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[5]).toEqual(0);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[6]).toEqual(0);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[7]).toEqual(environment.tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[8]).toEqual(environment.tileSize);
    //test the second tile
    expect(canvas2dContext.drawImage.calls.argsFor(1)[5]).toEqual(0);
    expect(canvas2dContext.drawImage.calls.argsFor(1)[6]).toEqual(20);
    //test the 7th tile
    expect(canvas2dContext.drawImage.calls.argsFor(4)[5]).toEqual(20);
    expect(canvas2dContext.drawImage.calls.argsFor(4)[6]).toEqual(20);
    //test the background-view-port initialization
    expect(scrollingBufferCanvas.backgroundViewPort.x).toEqual(0);
    expect(scrollingBufferCanvas.backgroundViewPort.y).toEqual(0);
  });

  it("should render correctly", function() {
    var viewPortX = 20;
    var viewPortY = 30;
    var viewPortWidth = 100;
    var viewPortHeight = 80;
    var viewPort = {x:viewPortX, y:viewPortY, width: viewPortWidth, height: viewPortHeight};
    camera._viewPort = viewPort;
    scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
    var displayCanvas2dContext = jasmine.createSpyObj('canvas2dContext', ['drawImage']);
    var mockedDisplayCanvas = jasmine.createSpyObj('canvas', ['getContext']);
    mockedDisplayCanvas.getContext.and.callFake(function(param) {if(param == '2d'){return displayCanvas2dContext}});
    scrollingBufferCanvas.render(viewPort, mockedDisplayCanvas);
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[0]).toBe(mockedBufferCanvas);
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[1]).toBe(viewPort.x-(scrollingBufferCanvas.backgroundViewPort.x*scrollingBufferCanvas._environment.tileSize));
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[2]).toEqual(viewPort.y-(scrollingBufferCanvas.backgroundViewPort.y*scrollingBufferCanvas._environment.tileSize));
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[3]).toEqual(viewPort.width);
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[4]).toEqual(viewPort.height);
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[5]).toEqual(0);
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[6]).toEqual(0);
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[7]).toEqual(viewPort.width);
    expect(displayCanvas2dContext.drawImage.calls.argsFor(0)[8]).toEqual(viewPort.height);
  });

  describe("when view-port moves", function() {

    it("to the right less than a tile-size distance, should not move the buffer-canvas", function() {
      var viewPort = {x:0, y:0};
      xOffset = 19;
      yOffset = 0;
      camera._viewPort = viewPort;
      scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
      spyOn(scrollingBufferCanvas, 'moveBackgroundCanvasToRight').and.callThrough();
      scrollingBufferCanvas.moveViewPort(viewPort, xOffset, yOffset);
      expect(scrollingBufferCanvas.moveBackgroundCanvasToRight.calls.any()).toBe(false);
      expect(scrollingBufferCanvas.backgroundViewPort.x).toEqual(0);
    });

    it("to the right more than a tile-size distance, should move the buffer-canvas to right", function() {
      var viewPort = {x:0, y:0};
      xOffset = 21;
      yOffset = 0;
      camera._viewPort = viewPort;
      scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
      spyOn(scrollingBufferCanvas, 'moveBackgroundCanvasToRight').and.callThrough();
      scrollingBufferCanvas.moveViewPort(viewPort, xOffset, yOffset);
      expect(scrollingBufferCanvas.moveBackgroundCanvasToRight.calls.any()).toBe(true);
      expect(scrollingBufferCanvas.backgroundViewPort.x).toEqual(1);
    });

    it("to the left less than a tile-size distance, should not move the buffer-canvas", function() {
      var viewPort = {x:30, y:0};
      xOffset = -5;
      yOffset = 0;
      camera._viewPort = viewPort;
      scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
      spyOn(scrollingBufferCanvas, 'moveBackgroundCanvasToLeft').and.callThrough();
      scrollingBufferCanvas.moveViewPort(viewPort, xOffset, yOffset);
      expect(scrollingBufferCanvas.moveBackgroundCanvasToLeft.calls.any()).toBe(false);
      expect(scrollingBufferCanvas.backgroundViewPort.x).toEqual(1);
    });

    it("to the right more than a tile-size distance, should move the buffer-canvas to right", function() {
      var viewPort = {x:20, y:0};
      xOffset = -1;
      yOffset = 0;
      camera._viewPort = viewPort;
      scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
      spyOn(scrollingBufferCanvas, 'moveBackgroundCanvasToLeft').and.callThrough();
      scrollingBufferCanvas.moveViewPort(viewPort, xOffset, yOffset);
      expect(scrollingBufferCanvas.moveBackgroundCanvasToLeft.calls.any()).toBe(true);
      expect(scrollingBufferCanvas.backgroundViewPort.x).toEqual(0);
    });

    it("to the bottom less than a tile-size distance, should not move the buffer-canvas", function() {
      var viewPort = {x:0, y:30};
      xOffset = 0;
      yOffset = 5;
      camera._viewPort = viewPort;
      scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
      spyOn(scrollingBufferCanvas, 'moveBackgroundCanvasToBottom').and.callThrough();
      scrollingBufferCanvas.moveViewPort(viewPort, xOffset, yOffset);
      expect(scrollingBufferCanvas.moveBackgroundCanvasToBottom.calls.any()).toBe(false);
      expect(scrollingBufferCanvas.backgroundViewPort.y).toEqual(1);
    });

    it("to the bottom more than a tile-size distance, should move the buffer-canvas to bottom", function() {
      var viewPort = {x:0, y:30};
      xOffset = 0;
      yOffset = 10;
      camera._viewPort = viewPort;
      scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
      spyOn(scrollingBufferCanvas, 'moveBackgroundCanvasToBottom').and.callThrough();
      scrollingBufferCanvas.moveViewPort(viewPort, xOffset, yOffset);
      expect(scrollingBufferCanvas.moveBackgroundCanvasToBottom.calls.any()).toBe(true);
      expect(scrollingBufferCanvas.backgroundViewPort.y).toEqual(2);
    });

    it("to the top less than a tile-size distance, should not move the buffer-canvas", function() {
      var viewPort = {x:0, y:30};
      xOffset = 0;
      yOffset = -5;
      camera._viewPort = viewPort;
      scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
      spyOn(scrollingBufferCanvas, 'moveBackgroundCanvasToTop').and.callThrough();
      scrollingBufferCanvas.moveViewPort(viewPort, xOffset, yOffset);
      expect(scrollingBufferCanvas.moveBackgroundCanvasToTop.calls.any()).toBe(false);
      expect(scrollingBufferCanvas.backgroundViewPort.y).toEqual(1);
    });

    it("to the top more than a tile-size distance, should move the buffer-canvas to top", function() {
      var viewPort = {x:0, y:30};
      xOffset = 0;
      yOffset = -11;
      camera._viewPort = viewPort;
      scrollingBufferCanvas = new scrollingCanvasBuffer(environment, displayCanvasWidth, displayCanvasHeight, camera, mockedBufferCanvas);
      spyOn(scrollingBufferCanvas, 'moveBackgroundCanvasToTop').and.callThrough();
      scrollingBufferCanvas.moveViewPort(viewPort, xOffset, yOffset);
      expect(scrollingBufferCanvas.moveBackgroundCanvasToTop.calls.any()).toBe(true);
      expect(scrollingBufferCanvas.backgroundViewPort.y).toEqual(0);
    });

  });
});
