var fs = require('fs');
var esprima = require('esprima');

var AstVisitor = require('./AstVisitor');
var FileTransform = require('./FileTransform');

var file = process.argv[2];
var line = Number(process.argv[3]);

function findFocus(nodes, v) {
  var i;
  for(i = 0; i < nodes.length; i++) {
    if(nodes[i].loc.start.line > v) {
      return Math.max(i - 1, 0);
    }
  }
  return i - 1;
}

function main() {
  var contents = fs.readFileSync(file);
  var ast = esprima.parse(contents, {loc: true})
  var visitor = new AstVisitor(ast);
  var transform = new FileTransform(file);

  var its = [];
  visitor.visit(function(key, val) {
    if(key === 'callee' && (val.name === 'it' || val.name === 'iit')) {
      its.push(val);
    }
  });

  var focus = findFocus(its, line);
  for(var i = 0; i < its.length; i++) {
    var val = its[i];
    if(i === focus && val.name === 'it') {
      transform.insert(val.loc.start.line, val.loc.start.column, 'i');
    } else if(i !== focus && val.name === 'iit') {
      transform.remove(val.loc.start.line, val.loc.start.column);
    }
  }
  transform.perform();
}

main(file, line);
