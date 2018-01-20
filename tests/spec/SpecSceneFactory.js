describe("sceneFactory", function() {
  var scene = null;
  var serverBaseURL = 'fakeUrl';
  var environmentCanvas = {};
  var characterCanvas = {};
  var sceneCreationPromise = null;
  var httpRequest = null;
  //for easiness of test, the character and the animated-element returned in the fake-scene share the same data
  var characterId = 0;
  var characterAnimationData = 'fakeCharacterAnimationData';
  var charactersSpritesMapping = [characterAnimationData];
  var characterSpriteWidth = 10;
  var characterSpriteHeight = 10;
  //environment data
  var backgroundTileData = {id: 'fakeBackgroundTileData'};
  var tileSize = 16;
  var backgroundSpriteData = [];
  //mock the animated-elements
  var animatedElementFactory = jasmine.createSpyObj('animatedElementFactory',['createAnimatedElement']);
  var animatedElementId = "fakeAnimatedElementId";
  animatedElementFactory.createAnimatedElement.and.returnValue({_id : animatedElementId});
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
    
  beforeEach(function() {
    jasmine.Ajax.install();
    sceneCreationPromise = sceneFactory.loadFromServer(serverBaseURL, environmentCanvas, characterCanvas, characterId, backgroundTileData, tileSize, 
    backgroundSpriteData, charactersSpritesMapping, characterSpriteWidth, characterSpriteHeight,
    animatedElementFactory, characterFactory, environmentFactory, stompClientFactory);
    httpRequest = jasmine.Ajax.requests.mostRecent();
    
    httpRequest.respondWith({
      status : 200,
      responseText : JSON.stringify(sceneFromServer)
    });
    return sceneCreationPromise.then(
      function(sceneResult){
        scene = sceneResult;
      }
    );
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
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
    expect(characterFactory.createCharacter.calls.argsFor(0)[1]).toBe(true);
    expect(characterFactory.createCharacter.calls.argsFor(0)[2]).toBe(characterCanvas);
    expect(characterFactory.createCharacter.calls.argsFor(0)[3]).toBe(characterAnimationData);
    expect(characterFactory.createCharacter.calls.argsFor(0)[4]).toEqual(characterSpriteWidth);
    expect(characterFactory.createCharacter.calls.argsFor(0)[5]).toEqual(characterSpriteHeight);
    expect(characterFactory.createCharacter.calls.argsFor(0)[6]).toEqual(jasmine.any(OnlineScene));
    expect(scene._playableCharacter).toBe(playableCharacter);
  });
  it("should create online-scene's STOMP client", function() {
    expect(stompClientFactory.createStompClient).toHaveBeenCalled();
    expect(stompClientFactory.createStompClient.calls.argsFor(0)[0]).toBe(serverBaseURL);
    expect(stompClientFactory.createStompClient.calls.argsFor(0)[1]).toEqual(jasmine.any(OnlineScene));
    expect(stompClientFactory.createStompClient.calls.argsFor(0)[2]).toBe(sceneFactory);
  });
});
