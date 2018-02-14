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
  
  
  beforeEach(function() {
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it("initializes correctly", function() {
    character = new Character(characterId, true, mockSpriteCanvas, animationData, spriteWidth, spriteHeight, scene, $window);
    expect(character._online).toEqual(true);
    expect(character._scene).toEqual(scene);
    expect(character._preAnimateListeners.length).toEqual(1);
    expect($window.addEventListener).toHaveBeenCalledTimes(2);
  });

  describe("respond to events", function(){

    it("should move when a directional key is pressed", function(){
      expect($window.addEventListener.calls.argsFor(0)[0]).toEqual('keydown');
      var callback = $window.addEventListener.calls.argsFor(0)[1];
      callback({keyCode: 39});
      expect(character._currentState.direction).toEqual(1);
      expect(character._currentState.moving).toEqual(true);
      var httpRequest = jasmine.Ajax.requests.mostRecent();
      httpRequest.respondWith({
        status : 200
      });
      expect(httpRequest.url).toBe('http://localhost:8080/movePlayer');
      expect(httpRequest.method).toBe('POST');
      expect(httpRequest.data().id).toEqual(characterId);
      expect(httpRequest.data().currentState.direction).toEqual(1);
      expect(httpRequest.data().currentState.moving).toEqual(true);
      expect(httpRequest.data().currentState.position.x).toEqual(0);
      expect(httpRequest.data().currentState.position.y).toEqual(0);
      expect(httpRequest.data().currentState.frame).toEqual(0);
      expect(httpRequest.data().currentState.velocity).toEqual(5);
    });

    it("should stop when key is released", function(){
      expect($window.addEventListener.calls.argsFor(1)[0]).toEqual('keyup');
      var callback = $window.addEventListener.calls.argsFor(1)[1];
      callback({keyCode: 39});
      expect(character._currentState.moving).toEqual(false);
      var httpRequest = jasmine.Ajax.requests.mostRecent();
      httpRequest.respondWith({
        status : 200
      });
      expect(httpRequest.url).toBe('http://localhost:8080/movePlayer');
      expect(httpRequest.method).toBe('POST');
      expect(httpRequest.data().id).toEqual(characterId);
      expect(httpRequest.data().currentState.direction).toEqual(1);
      expect(httpRequest.data().currentState.moving).toEqual(false);
      expect(httpRequest.data().currentState.position.x).toEqual(0);
      expect(httpRequest.data().currentState.position.y).toEqual(0);
      expect(httpRequest.data().currentState.frame).toEqual(0);
      expect(httpRequest.data().currentState.velocity).toEqual(5);
    });
  });
});