var fs = require('fs');

function FileTransform(fileName) {
  this.fileName = fileName;
  this.transforms = {};
}

FileTransform.prototype = {
  insert: function(line, col, str) {
    this.transform('insert', line, col, str);
  },
  remove: function(line, col) {
    this.transform('remove', line, col);
  },
  transform: function(type, line, col, str) {
    if(this.transforms[line] === undefined) {
      this.transforms[line] = [];
    }
    this.transforms[line].push({type: type, line: line, col: col, str: str});
  },
  processLineChunk: function(str, t, off) {
    var index = off + t.col;
    if(t.type === 'insert') {
      return str.substring(0, index + 1) + t.str + str.substring(index + 1);
    } else if(t.type === 'remove') {
      return str.substring(0, index + 1) + str.substring(index + 2);
    }
  },
  applyLineTransforms: function(str, ts, off) {
    for(var i = 0; i < ts.length; i++) {
      var t = ts[i];
      str = this.processLineChunk(str, t, off);
      for(var x = i + 1; x < ts.length; x++) {
        var tx = ts[x];
        if(tx.col > t.col) {
          if(t.type === 'remove') {
            tx.col -= 1;
          } else if (t.type === 'insert') {
            tx.col += t.str.length;
          }
        }
      }
    }
    return str;
  },
  perform: function() {
    var rs = fs.createReadStream(this.fileName);
    var ws = fs.createWriteStream(this.fileName + '.tmp');
    rs.on('readable', function(chunk) {
      var lc = 0;
      var offset = 0;
      var chunk;
      while(null !== (chunk = rs.read())) {
        var str = chunk.toString('utf8');
        for(var i = 0; i !== -1; i = str.indexOf('\n', i)) {
          lc++
          if(this.transforms[lc] instanceof Array) {
            str = this.applyLineTransforms(str, this.transforms[lc], i);
          }
          i++;
        }
        ws.write(str);
        offset += str.length;
      }
      ws.end();
    }.bind(this));
    ws.on('finish', function() {
      fs.renameSync(this.fileName + '.tmp', this.fileName);
      this.transforms = {};
    }.bind(this));
  }
};

module.exports = FileTransform;
