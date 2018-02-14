describe("character", function() {
  var mockSpriteCanvas = {};
  var character = null;
  var characterId = "fakeId";
  var animationData = {};
  var spriteWidth = 10;
  var spriteHeight = 10;
  var scene = {};
  var $window = {};
  $window = jasmine.createSpyObj("$window", ['addEventListener'])
  character = new Character(characterId, true, mockSpriteCanvas, animationData, spriteWidth, spriteHeight, scene, $window);
  
  beforeEach(function() {
  });

  it("initializes correctly", function() {
    expect(character._online).toEqual(true);
    expect(character._scene).toEqual(scene);
    expect(character._preAnimateListeners.length).toEqual(1);
    expect($window.addEventListener).toHaveBeenCalledTimes(2);
  });

  it("should move when a directional key is pressed", function(){
    expect($window.addEventListener.calls.argsFor(0)[0]).toEqual('keydown');
    var callback = $window.addEventListener.calls.argsFor(0)[1];
    callback({keyCode: 39});
    expect(character._currentState.direction).toEqual(1);
    expect(character._currentState.moving).toEqual(true);
  });
});