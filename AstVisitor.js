function AstVisitor(root) {
  this.root = root;
}

AstVisitor.prototype = {
  _array: function(arr, func) {
    for(var i = 0; i < arr.length; i++) {
      this._node(arr[i], func);
    }
  },
  _map: function(map, func) {
    var keys = Object.keys(map);
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      func(key, map[key]);
      this._node(map[key], func);
    }
  },
  _node: function(node, func) {
    if(node instanceof Array) {
      this._array(node, func);
    } else if (node && typeof node === 'object') {
      this._map(node, func);
    }
  },
  visit: function(func) {
    this._node(this.root, func);
  }
};

module.exports = AstVisitor;
