describe("engine", function() {
  var canvas2dContext = jasmine.createSpyObj('canvas2dContext', ['drawImage']);
  var mockedDisplayCanvas = jasmine.createSpyObj('canvas', ['getContext']);
  mockedDisplayCanvas.getContext.and.callFake(function(param) {if(param == '2d'){return canvas2dContext}});
  var environmentCanvas = {};
  var characterCanvas = {};
  var animationInterval = 10;
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
  var engineInitializationSuccessCallback = jasmine.createSpy('fakeSuccessCallback');
  var connectionMessagesOutput={innerHTML:''};

  beforeEach(function() {
    jasmine.RequestAnimationFrame.install();
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    jasmine.RequestAnimationFrame.uninstall();
    engineInitializationSuccessCallback.calls.reset();
  });

  describe("when scene-factory promise resolves",function(){

    beforeEach(function(done) {
      var sceneFactory = jasmine.createSpyObj('sceneFactory', ['loadFromServer', 'loadFromJson']);
      var promiseSceneFactory = new Promise(function(resolve, reject) {
        resolve(
          {
            _environment : {id : 'environment', render: renderEnvironment, sprites: [environmentSprite]},
            _playableCharacter : playableCharacter,
            _animatedElements : [animatedElement]
          });
          done();
      });
      sceneFactory.loadFromServer.and.returnValue(promiseSceneFactory);
      var cameraFactory = jasmine.createSpyObj('cameraFactory', ['createCamera']);
      cameraFactory.createCamera.and.returnValue(camera);
      var scrollingBufferFactory = jasmine.createSpyObj('scrollingBufferFactory', ['createScrollingBuffer']);
      scrollingBufferFactory.createScrollingBuffer.and.returnValue(scrollingBuffer);
      var factories={
        sceneFactory: sceneFactory,
        cameraFactory: cameraFactory,
        scrollingBufferFactory: scrollingBufferFactory,
      };
      var sceneConfiguration={
        gridWidth: gridWidth,
        gridHeight: gridHeight,
        animationPeriod: animationInterval,
        gridBlockSize: gridBlockSize
      };
      var resources={
        charactersCanvas: characterCanvas,
        environmentCanvas: environmentCanvas
      };
      var hci={
        canvas: mockedDisplayCanvas,
        connectionMessagesOutput: connectionMessagesOutput,
        engineInitializationSuccessCallback: engineInitializationSuccessCallback
      };
      engine = new Engine(factories, sceneConfiguration, resources, hci);
      spyOn(engine, 'mainLoop').and.callThrough();
      //by returning the promise, we ensure it has been fulfilled before to test the engine's state
      return promiseSceneFactory;
    });

    it("should initialize correctly", function() {
      expect(engine.animationTimer).toBeDefined();
      expect(engineInitializationSuccessCallback).toHaveBeenCalled();
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

  describe("when scene-factory promise reject",function(){

    beforeEach(function(done) {
      var sceneFactory = jasmine.createSpyObj('sceneFactory', ['loadFromServer', 'loadFromJson']);
      var promiseSceneFactory = new Promise(function(resolve, reject) {
          reject("error while initializing");
      });
      sceneFactory.loadFromServer.and.returnValue(promiseSceneFactory);
      var cameraFactory = jasmine.createSpyObj('cameraFactory', ['createCamera']);
      cameraFactory.createCamera.and.returnValue(camera);
      var scrollingBufferFactory = jasmine.createSpyObj('scrollingBufferFactory', ['createScrollingBuffer']);
      scrollingBufferFactory.createScrollingBuffer.and.returnValue(scrollingBuffer);
      var factories={
        sceneFactory: sceneFactory,
        cameraFactory: cameraFactory,
        scrollingBufferFactory: scrollingBufferFactory,
      };
      var sceneConfiguration={
        gridWidth: gridWidth,
        gridHeight: gridHeight,
        animationPeriod: animationInterval,
        gridBlockSize: gridBlockSize
      };
      var resources={
        charactersCanvas: characterCanvas,
        environmentCanvas: environmentCanvas
      };
      var hci={
        canvas: mockedDisplayCanvas,
        connectionMessagesOutput: connectionMessagesOutput,
        engineInitializationSuccessCallback: engineInitializationSuccessCallback
      };
      engine = new Engine(factories, sceneConfiguration, resources, hci);
      spyOn(engine, 'mainLoop').and.callThrough();
      done();
    });

    it("should display an message when failing to initialize", function() {
      expect(engineInitializationSuccessCallback).not.toHaveBeenCalled();
      expect(connectionMessagesOutput.innerHTML).toBe("error while initializing");
    });
  });
  
});