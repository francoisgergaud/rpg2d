describe("engine", function() {
  var canvas2dContext = jasmine.createSpyObj('canvas2dContext', ['drawImage']);
  var mockedDisplayCanvas = jasmine.createSpyObj('canvas', ['getContext']);
  mockedDisplayCanvas.getContext.and.callFake(function(param) {if(param == '2d'){return canvas2dContext}});
  var environmentCanvas = {};
  var characterCanvas = {};
  var animationInterval = 10;
  var online = true;
  var gridWidth = 10;
  var gridHeight = 10;
  var gridBlockSize = 5;
  var engine = null;

  beforeEach(function() {
    jasmine.clock().install();
    var sceneFactory = jasmine.createSpyObj('sceneFactory', ['loadFromServer', 'loadFromJson']);
      var sceneEnvironment = jasmine.createSpy('sceneEnvironment');
      var promiseSceneFactory = new Promise(function(resolve, reject) {
        resolve(
          {
            _environment : {id : 'environment'},
            _playableCharacter : {id : 'playableCharacter'},
            _animatedElements : [{id : 'animatedElement1'}],
            getEnvironment : sceneEnvironment
          });
      });
      sceneFactory.loadFromServer.and.returnValue(promiseSceneFactory);
      var cameraFactory = jasmine.createSpyObj('cameraFactory', ['createCamera']);
      cameraFactory.createCamera.and.returnValue({
            _viewport : 'c\' est bien mon lapin'
          });
      var scrollingBufferFactory = jasmine.createSpyObj('scrollingBufferFactory', ['createScrollingBuffer']);
      scrollingBufferFactory.createScrollingBuffer.and.returnValue({
          _bufferCanvas : 'c\' est bien mon petit lapin'
        });

      engine = new Engine(mockedDisplayCanvas, environmentCanvas, characterCanvas, animationInterval, online, gridWidth, gridHeight, gridBlockSize, 
        sceneFactory, cameraFactory, scrollingBufferFactory);
      spyOn(engine, 'mainLoop');
      //by returning the promise, we ensure it has been fulfilled before to test the engine's state
      return promiseSceneFactory;
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it("should initialize correctly", function() {

    //expect(sceneEnvironment).toHaveBeenCalled();
    expect(engine.animationTimer).toBeDefined();
    // spyOn(engine, 'mainLoop');
    expect(engine.mainLoop).not.toHaveBeenCalled();
    //after time has expired
    jasmine.clock().tick(animationInterval);
    expect(engine.mainLoop).toHaveBeenCalled();
  });
});