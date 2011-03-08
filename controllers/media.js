var fs = require('fs'),
  conv = require('../lib/converter').Converter,
  mime = require('../lib/mime');

app.get('/convert/*', function(req, res) {
  // get filepath
  var fpath = app.set('mediaroot') + req.params[0];
  
  // build lookup path for raw file
  var splPath = fpath.split('/');
  var fname = splPath.pop();
  var folder = splPath.join('/');

  // check if the file is at its location
  try {
    var stat = fs.statSync(fpath);
    var extn = fname.substring(fname.lastIndexOf('.') + 1);
    // send file
    console.log('streaming cached file ' + fpath);
    res.sendfile(fpath);
  } catch(error) {
    fs.readdirSync(folder).forEach(function(file) {
      if (file.substring(0, file.length - 3) == 'ORG_' + fname.substring(0, fname.length - 3)) {
        var source = folder + '/' + file;
        source = source.replace(/ /, '\\ ');
        fpath = fpath.replace(/ /, '\\ ');
        // found source file, start conversion
        /*
        conv.convert(fpath, source, function(job, err) {
          if (res.state != 'NOK') {
            // job started, write status
            res.send(job);
          } else {
            // job failed, write error
            res.send(err);
          }
        });
        */        
      } else {
        res.send({ state: 'NOK', msg: 'Could not find original media file to convert from' });
      }
    });
  }
});

app.get('/status/:jobhash', function(req, res, next) {
  conv.check(req.params.jobhash, function(state) {
    res.send(state);
  });
});