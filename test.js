describe("Some Tests", function() {
  it("example one", function(done) {

    function innerBlock() {
      done();
    }

    innerBlock();

    expect(true).toEqual(true);
  });

  it("example two", function() {
    var random = Math.random();

    expect(true).toEqual(true);
  });

  it("example three", function() {
    var random = Math.random();

    expect(true).toEqual(true);
  });

  it("example four", function() {
    var random = Math.random();

    expect(true).toEqual(true);
  });
});
