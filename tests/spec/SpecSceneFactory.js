describe("online-scene factory", function() {
  var scene = null;
  var serverBaseURL = 'fakeUrl';
  var environmentCanvas = {};
  var characterCanvas = {};
  var httpRequest = null;
  //for easiness of test, the character and the animated-element returned in the fake-scene share the same data
  var characterId = 0;
  var characterAnimationData = 'fakeCharacterAnimationData';
  var characterAnimationData2 = 'fakeCharacterAnimationData2';
  var charactersSpritesMapping = [characterAnimationData,characterAnimationData2];
  var characterSpriteWidth = 10;
  var characterSpriteHeight = 10;
  //environment data
  var backgroundTileData = {id: 'fakeBackgroundTileData'};
  var tileSize = 16;
  var backgroundSpriteData = [];
  //mock the animated-elements
  //var animatedElementFactory = jasmine.createSpyObj('animatedElementFactory',['createAnimatedElement']);
  var animatedElementFactory = new AnimatedElementFactory();
  var animatedElementId = "fakeAnimatedElementId";
  //mock the playable-character
  var characterFactory = jasmine.createSpyObj('characterFactory',['createCharacter']);
  var playableCharacter = 'fakePlayableCharacter';
  characterFactory.createCharacter.and.returnValue(playableCharacter);
  //mock the environment
  var environmentFactory = jasmine.createSpyObj('environmentFactory',['createEnvironment']);
  var map = 'fakeMap';
  var worldElements = 'fakeWorldElements';
  var fakeEnvironment = {map : map, worldElements, worldElements};
  environmentFactory.createEnvironment.and.returnValue(fakeEnvironment);
  // the STOMP -client factory
  var stompClientFactory = jasmine.createSpyObj('stompClientFactory',['createStompClient']);
  
  //var stompClient = jasmine.createSpyObj('stompClient',['connect', 'subscribe', 'send']);
  var stompClient = new function(){

    this.reset = function(){
      this.connectCallbacks = [];
      this.subscribeCallbacks = [];
      this.sendCallbacksArguments = [];
    };
    this.connect = function(headers, successCallback, failCallback){
      this.connectCallbacks.push(successCallback);
    };
    this.subscribe = function(path, successCallback, failCallback){
      this.subscribeCallbacks.push(successCallback);
    };
    this.send = function(path, headers, data){
      this.sendCallbacksArguments.push({path: path, data: data, headers: headers});
    };

    this.reset();
  };


  stompClientFactory.createStompClient.and.returnValue(stompClient);
  var sceneFactory = new SceneFactory();
  var playerId = "fakePlayerId";
  var animatedElements = {};
  var animatedElementCurrentState = 'fakeCurrentState';
  animatedElements[animatedElementId] = {id : animatedElementId, currentState: animatedElementCurrentState, characterId: characterId};
  var sceneFromServer = {
    worldElements : worldElements,
    map : map,
    playerId : playerId,
    animatedElements : animatedElements
  };
  var resources = {
    environmentCanvas: environmentCanvas,
    backgroundTilesData: backgroundTileData,
    tileSize: tileSize,
    backgroundSpritesData: backgroundSpriteData,
    charactersCanvas: characterCanvas,
    characterSpritesMapping: charactersSpritesMapping,
    characterSpriteWidth: characterSpriteWidth,
    characterSpriteHeight: characterSpriteHeight
  };
  var sceneConfiguration = {
    characterId: characterId
  };
  var factories = {
    animatedElementFactory: animatedElementFactory,
    environmentFactory: environmentFactory,
    characterFactory: characterFactory,
    stompClientFactory: stompClientFactory
  };
  var hci = {
    messagesOutput : {innerHTML:''}
  };

  beforeEach(function(done) {
    spyOn(animatedElementFactory, 'createAnimatedElement');
    animatedElementFactory.createAnimatedElement.and.returnValue({_id : animatedElementId});
    stompClient.reset();
    var sceneCreationPromise = sceneFactory.loadFromServer(serverBaseURL, resources, sceneConfiguration, factories, hci);
    sceneCreationPromise.then(
      function(sceneResult){
        scene = sceneResult;
        done();
      },
      function(error){
        log.console(error);
        done();
      }
    );
    expect(stompClientFactory.createStompClient).toHaveBeenCalled();
    expect(stompClient.connectCallbacks.length).toBe(1);
    var connectCallback = stompClient.connectCallbacks[0];
    connectCallback();
    expect(stompClient.subscribeCallbacks.length).toBe(1);
    var subscribeCallback = stompClient.subscribeCallbacks[0];
    subscribeCallback({body:JSON.stringify(sceneFromServer)});
        
  });

  it("should create online-scene's environment correctly", function() {
    expect(environmentFactory.createEnvironment).toHaveBeenCalled();
    expect(environmentFactory.createEnvironment.calls.argsFor(0)[0]).toBe(environmentCanvas);
    expect(environmentFactory.createEnvironment.calls.argsFor(0)[1]).toBe(backgroundTileData);
    expect(environmentFactory.createEnvironment.calls.argsFor(0)[2]).toEqual(tileSize);
    expect(environmentFactory.createEnvironment.calls.argsFor(0)[3]).toBe(backgroundSpriteData);
    expect(environmentFactory.createEnvironment.calls.argsFor(0)[4]).toBe(worldElements);
    expect(environmentFactory.createEnvironment.calls.argsFor(0)[5]).toBe(map);
    expect(scene._environment).toBe(fakeEnvironment);
  });

  it("should create online-scene's animated-elements correctly", function() {
    expect(animatedElementFactory.createAnimatedElement).toHaveBeenCalled();
    expect(animatedElementFactory.createAnimatedElement.calls.argsFor(0)[0]).toBe(animatedElementId);
    expect(animatedElementFactory.createAnimatedElement.calls.argsFor(0)[1]).toBe(characterCanvas);
    expect(animatedElementFactory.createAnimatedElement.calls.argsFor(0)[2]).toBe(characterAnimationData);
    expect(animatedElementFactory.createAnimatedElement.calls.argsFor(0)[3]).toEqual(characterSpriteWidth);
    expect(animatedElementFactory.createAnimatedElement.calls.argsFor(0)[4]).toEqual(characterSpriteHeight);
    expect(scene._animatedElements[animatedElementId]._id).toEqual(animatedElementId);
    expect(scene._animatedElements[animatedElementId]._currentState).toEqual(animatedElementCurrentState);
  });

  it("should create online-scene's character correctly", function() {
    expect(characterFactory.createCharacter).toHaveBeenCalled();
    expect(characterFactory.createCharacter.calls.argsFor(0)[0]).toBe(playerId);
    expect(characterFactory.createCharacter.calls.argsFor(0)[1]).toBe(characterCanvas);
    expect(characterFactory.createCharacter.calls.argsFor(0)[2]).toBe(characterAnimationData);
    expect(characterFactory.createCharacter.calls.argsFor(0)[3]).toEqual(characterSpriteWidth);
    expect(characterFactory.createCharacter.calls.argsFor(0)[4]).toEqual(characterSpriteHeight);
    expect(characterFactory.createCharacter.calls.argsFor(0)[5]).toEqual(jasmine.any(OnlineScene));
    expect(scene._playableCharacter).toBe(playableCharacter);
  });

  it("should create online-scene's STOMP client", function() {
    expect(stompClient.sendCallbacksArguments.length).toBe(1);
    expect(stompClient.sendCallbacksArguments[0].path).toBe("/app/registerPlayer");
  });

  describe("when subscribing to server", function(){

    //TODO: pass the STOMP and SockJS function as a dependency (DI) to test the STMP-client factory
    var stompClient = jasmine.createSpyObj('stompClient',['subscribe']);
    
    beforeEach(function(){
      scene.subscribe(stompClient);
    });

    it("should register 2 callbacks", function() {
      expect(stompClient.subscribe).toHaveBeenCalledTimes(3);
    });

    describe("when receiving an event", function(){

      beforeEach(function() {
        animatedElementFactory.createAnimatedElement.and.callThrough();
        // have to implement own mock for callback with "bind" as Jasmine seems to reset the object after the callback execution
        //TODO: check why and how JAsmine is reseting the binded object on a callback (using internal closure when invoking callback?)
        stompClient.subscribe = function(topicName, callback){
          this.callbacks == null ? this.callbacks = []:true;
          this.callbacks.push(callback);
        }
        scene.subscribe(stompClient);
      });

      it("should register the new-player in the scene and move it", function(){
        var notParsedJsonData = {'body' : '{"id" : "player2", "characterId" : 1, "currentState" : "fakeCurrentState"}'};
        stompClient.callbacks[0](notParsedJsonData);
        expect(scene._animatedElements['player2']._animationData).toBe(characterAnimationData2);
        notParsedJsonData = {'body' : '{"id" : "player2", "currentState" : "fakeState"}'};
        stompClient.callbacks[1](notParsedJsonData);
        expect(scene._animatedElements['player2']._currentState).toEqual('fakeState');
        expect(scene._hci.messagesOutput.innerHTML.length).toBeGreaterThan(0);
      });
    });
  });
});