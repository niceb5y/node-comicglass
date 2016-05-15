var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/*', function(req, res, next) {
  const path = decodeURIComponent(req.path);
  const dir = fs.readdirSync(__dirname + '/../public' + path);
  
  function mapFile(filename) {
    const file = fs.statSync(__dirname + '/../public' + path + filename);
    if (file.isDirectory()) {
      return {
        isDirectory: true,
        title: filename,
        path: encodeURIComponent(path + filename).replace("%2F", "/"),
        date: file.mtime.getTime()
      }
    } else {
      return {
        isDirectory: false,
        title: filename,
        path: encodeURIComponent(path + filename).replace("%2F", "/"),
        size: file.size,
        date: file.mtime.getTime()
      }
    }
  }
  
  function matchExt(file) {
    if (file.isDirectory) return true;
    const supportedExt = [".gif", ".png", ".jpg", ".jpeg", ".tif", ".tiff", ".zip", ".rar", ".cbz", ".cbr", ".bmp", ".pdf", ".cgt"];
    for (var i = 0; i < supportedExt.length; ++i) {
      if (file.title.endsWith(supportedExt[i])) {
        return true;
      }
    }
    return false;
  }
  
  res.render('index', {
    path: "." + path,
    files: dir.map(mapFile).filter(matchExt)
  });
});

module.exports = router;
