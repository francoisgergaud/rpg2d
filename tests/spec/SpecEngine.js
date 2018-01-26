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

  var renderEnvironment = jasmine.createSpy('render');
  var environmentSprite = jasmine.createSpyObj('environmentSprite', ['render']);
  environmentSprite._currentState = { position : {x:0, y:2}};
  var playableCharacter = jasmine.createSpyObj('playableCharacter', ['animate', 'render']);
  playableCharacter._currentState = { position : {x:0, y:0}};
  var animatedElement = jasmine.createSpyObj('animatedElement', ['animate', 'render']);
  animatedElement._currentState = { position : {x:0, y:1}};
  var camera = jasmine.createSpyObj('camera', ['getViewPort']);
  var scrollingBuffer = jasmine.createSpyObj('scrollingBuffer', ['render']);

  beforeEach(function() {
    jasmine.RequestAnimationFrame.install();
    jasmine.clock().install();
    var sceneFactory = jasmine.createSpyObj('sceneFactory', ['loadFromServer', 'loadFromJson']);
      var promiseSceneFactory = new Promise(function(resolve, reject) {
        resolve(
          {
            _environment : {id : 'environment', render: renderEnvironment, sprites: [environmentSprite]},
            _playableCharacter : playableCharacter,
            _animatedElements : [animatedElement]
          });
      });
      sceneFactory.loadFromServer.and.returnValue(promiseSceneFactory);
      var cameraFactory = jasmine.createSpyObj('cameraFactory', ['createCamera']);
      cameraFactory.createCamera.and.returnValue(camera);
      var scrollingBufferFactory = jasmine.createSpyObj('scrollingBufferFactory', ['createScrollingBuffer']);
      scrollingBufferFactory.createScrollingBuffer.and.returnValue(scrollingBuffer);
      engine = new Engine(mockedDisplayCanvas, environmentCanvas, characterCanvas, animationInterval, online, gridWidth, gridHeight, gridBlockSize, 
        sceneFactory, cameraFactory, scrollingBufferFactory);
      spyOn(engine, 'mainLoop').and.callThrough();
      //by returning the promise, we ensure it has been fulfilled before to test the engine's state
      return promiseSceneFactory;
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    jasmine.RequestAnimationFrame.uninstall();
  });

  it("should initialize correctly", function() {
    expect(engine.animationTimer).toBeDefined();
  });

  describe('running engine', function() {

    it("should trigger the main-loop on interval expired", function() {  
      expect(engine.mainLoop).not.toHaveBeenCalled();
      expect(playableCharacter.animate).not.toHaveBeenCalled();
      //after time has expired
      jasmine.clock().tick(animationInterval);
      expect(engine.mainLoop).toHaveBeenCalled();
      expect(playableCharacter.animate).toHaveBeenCalled();
      expect(animatedElement.animate).toHaveBeenCalled();
      jasmine.RequestAnimationFrame.tick();
      expect(scrollingBuffer.render).toHaveBeenCalled();
      expect(playableCharacter.render).toHaveBeenCalled();
      expect(animatedElement.render).toHaveBeenCalled();
      expect(environmentSprite.render).toHaveBeenCalled();
    });
  });
});