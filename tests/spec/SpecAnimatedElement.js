describe("animatedElement", function() {
  var animatedElement;
  var mockSpriteCanvas = {};
    
  beforeEach(function() {
    var id = 'characterId';
    var animationData = [
      [{x:0,y:0},{x:1,y:0},{x:2,y:0}],
      [{x:0,y:2},{x:1,y:2},{x:2,y:2}],
      [{x:0,y:3},{x:1,y:3},{x:2,y:3}],
      [{x:0,y:1},{x:1,y:1},{x:2,y:1}]
    ];
    var spriteWidth = 10;
    var spriteHeight = 10;
    animatedElement = new AnimatedElement(id, mockSpriteCanvas, animationData, spriteWidth, spriteHeight);
  });

  it("should initialize correctly", function() {
    expect(animatedElement._currentState.position.x).toEqual(0);
    expect(animatedElement._currentState.position.y).toEqual(0);
  });

  describe("when element is animated", function() {

    beforeEach(function() {
      animatedElement._currentState.position.x = 0;
      animatedElement._currentState.position.y = 0;
    });

    it("to the right, should have its positions incremented", function() {
      animatedElement._currentState.moving = true;
      animatedElement._currentState.direction = 1;
      animatedElement._currentState.velocity = 3;
      animatedElement.animate();
      expect(animatedElement._currentState.position.x).toEqual(3);
      expect(animatedElement._currentState.position.y).toEqual(0);
    });

    it("should render on the display canvas", function() {
      //var mockDisplayCanvas = new CanvasMock();
      animatedElement._currentState.direction = 1;
      animatedElement._currentState.frame = 2;
      var canvas2dContext = jasmine.createSpyObj('canvas2dContext', ['drawImage']);
      var mockedCanvas = jasmine.createSpyObj('canvas', ['getContext']);
      mockedCanvas.getContext.and.callFake(function(param) {if(param == '2d'){return canvas2dContext}});
      var spriteCoordinate = animatedElement._animationData[animatedElement._currentState.direction][animatedElement._currentState.frame];
      var viewPort = {x:10, y:10};
      animatedElement.render(viewPort, mockedCanvas);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[0]).toBe(mockSpriteCanvas);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[1]).toBe(spriteCoordinate.x*animatedElement._spriteWidth);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[2]).toEqual(spriteCoordinate.y*animatedElement._spriteHeight);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[3]).toEqual(animatedElement._spriteWidth);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[4]).toEqual(animatedElement._spriteHeight);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[5]).toEqual(animatedElement._currentState.position.x-viewPort.x);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[6]).toEqual(animatedElement._currentState.position.y-viewPort.y - animatedElement._spriteHeight);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[7]).toEqual(animatedElement._spriteWidth);
      expect(canvas2dContext.drawImage.calls.argsFor(0)[8]).toEqual(animatedElement._spriteHeight);
    });

  });
});
