(function () {
  var Adder = function (initnum) { this.n = initnum || 0; };
  Adder.prototype.add = function (num) { this.n += num; };
  Adder.prototype.number = function () { return this.n; };
  module.exports.Adder = Adder;
})();
