describe("camera", function() {
  var camera;
  var scene = jasmine.createSpyObj('scene', ['getPlayableCharacter', 'getEnvironment']);
  var playableCharacter = jasmine.createSpyObj('character', ['_setCamera']);
  var viewPortX = 0;
  var viewPortY = 0;
  var viewPortWidth = 20;
  var viewPortHeight = 20;
  var viewPort = {x: viewPortX, y: viewPortY, width: viewPortWidth, height: viewPortHeight};
  var grid = [[1,2,3,4,5,6],[],[],[],[]];
  var gridTileSize = 20;
  scene.getPlayableCharacter.and.returnValue(playableCharacter);
  scene.getEnvironment.and.returnValue({grid: grid, tileSize: gridTileSize});
  

  beforeEach(function() {
    camera = new Camera(viewPort, scene);
  });

  it("initializes correctly", function() {
    expect(camera._viewPort).toEqual(viewPort);
    expect(camera._scene).toEqual(scene);
    expect(playableCharacter._setCamera).toHaveBeenCalled();
    expect(playableCharacter._setCamera.calls.argsFor(0)[0]).toBe(camera);

  });

  describe("when moved", function(){
    it("track the selected animated-element if scrolling possible", function() {
      // the position is not far enough from the border for the camera to scroll
      var x = 0;
      var y = 0;
      var xOffset = 10;
      var yOffset = 6;
      camera.animatedElementTrackedMove(x, y, xOffset, yOffset);
      expect(camera._viewPort.x).toEqual(viewPortX);
      expect(camera._viewPort.y).toEqual(viewPortY);
    });

    it("track the selected animated-element if no scrolling possible", function() {
      // the position is far enough from the border for the camera to scroll
      var x = 30;
      var y = 30;
      var xOffset = 10;
      var yOffset = 6;
      camera.animatedElementTrackedMove(x, y, xOffset, yOffset);
      expect(camera._viewPort.x).toEqual(viewPortX + xOffset);
      expect(camera._viewPort.y).toEqual(viewPortX + yOffset);
    });
  });
  
});
