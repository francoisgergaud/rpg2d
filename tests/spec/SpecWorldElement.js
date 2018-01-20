describe("worldElement", function() {
  var worldElement;
  var mockSpriteCanvas = {};
  var xPosition = 1;
  var yPosition = 2;
  var xStartingPoint = 0;
  var yStartingPoint = -2;
  var xTopLeftSpriteDataPosition = 1;
  var yTopLeftSpriteDataPosition = 4;
  var widthSpriteDataPosition = 2;
  var heightSpriteDataPosition = 3;
  var tileSize = 10;
  var position = {x: xPosition, y: yPosition};
  var spriteData = {
    startingPoint: {x: xStartingPoint, y: yStartingPoint}, 
    spriteDataPosition: {
      topLeft: {x: xTopLeftSpriteDataPosition,y: yTopLeftSpriteDataPosition}, 
      width: widthSpriteDataPosition,
      height: heightSpriteDataPosition
   }
  };

  beforeEach(function() {
    worldElement = new WorldElement(position, mockSpriteCanvas, spriteData, tileSize);
  });

  it("initializes correctly", function() {
    expect(worldElement._girdPosition.x).toEqual(xPosition);
    expect(worldElement._girdPosition.y).toEqual(yPosition);
    expect(worldElement._currentState.position.x).toEqual(xPosition * tileSize);
    expect(worldElement._currentState.position.y).toEqual(yPosition * tileSize);
    expect(worldElement._spriteCanvas).toBe(mockSpriteCanvas);
    expect(worldElement._spriteData).toBe(spriteData);
    expect(worldElement._tileSize).toEqual(tileSize);
    expect(worldElement._spriteLeft).toEqual((xPosition + xStartingPoint) * tileSize);
    expect(worldElement._spriteTop).toEqual((yPosition + yStartingPoint) * tileSize);
    expect(worldElement._spriteWidth).toEqual(widthSpriteDataPosition * tileSize);
    expect(worldElement._spriteHeight).toEqual(heightSpriteDataPosition * tileSize);
    expect(worldElement._spriteRight).toEqual(worldElement._spriteLeft + worldElement._spriteWidth);
  });

  it("does not render rif outside the view-port", function() {
    var canvas2dContext = jasmine.createSpyObj('canvas2dContext', ['drawImage']);
    var mockedDisplayCanvas = jasmine.createSpyObj('canvas', ['getContext']);
    mockedDisplayCanvas.getContext.and.callFake(function(param) {if(param == '2d'){return canvas2dContext}});
    var viewPortX = 10;
    var viewPortY = 20;
    var viewPortWidth = 5;
    var viewPortHeight = 2;
    worldElement.render({x: viewPortX, y: viewPortY, widht: viewPortWidth, height: viewPortHeight}, mockedDisplayCanvas);
    expect(canvas2dContext.drawImage).not.toHaveBeenCalled()
  });

  it("renders correctly", function() {
    var canvas2dContext = jasmine.createSpyObj('canvas2dContext', ['drawImage']);
    var mockedDisplayCanvas = jasmine.createSpyObj('canvas', ['getContext']);
    mockedDisplayCanvas.getContext.and.callFake(function(param) {if(param == '2d'){return canvas2dContext}});
    var viewPortX = 0;
    var viewPortY = 0;
    var viewPortWidth = 100;
    var viewPortHeight = 100;
    worldElement.render({x: viewPortX, y: viewPortY, width: viewPortWidth, height: viewPortHeight}, mockedDisplayCanvas);
    expect(canvas2dContext.drawImage).toHaveBeenCalled()
    expect(canvas2dContext.drawImage.calls.argsFor(0)[0]).toBe(mockSpriteCanvas);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[1]).toEqual(xTopLeftSpriteDataPosition * tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[2]).toEqual(yTopLeftSpriteDataPosition * tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[3]).toEqual(widthSpriteDataPosition * tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[4]).toEqual(heightSpriteDataPosition * tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[5]).toEqual((xPosition + xStartingPoint) * tileSize - viewPortX);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[6]).toEqual((yPosition + yStartingPoint) * tileSize - viewPortY);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[7]).toEqual(widthSpriteDataPosition * tileSize);
    expect(canvas2dContext.drawImage.calls.argsFor(0)[8]).toEqual(heightSpriteDataPosition * tileSize);
  });
});
