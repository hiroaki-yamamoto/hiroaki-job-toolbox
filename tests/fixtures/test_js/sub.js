(function () {
  var Subtractor = function (initval) { this.val = initval || 0; };
  Subtractor.prototype.sub = function (val) { this.val -= val; };
  Subtractor.prototype.number = function () { return this.val; };
  try {
    module.exports.Subtractor = Subtractor;
  } catch(ignored) {
    window.Subtractor = Subtractor;
  }
})();
