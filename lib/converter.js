var formats = require('./formats'),
  processor = require('./ffmpeg').Ffmpeg;

function Converter() {};

Converter.prototype.convert = function(requestedfile, originalfile, callback) {
  // determine file type from request path
  var type = requestedfile.split('.')[1];
  if (formats[type]) {
    // get meta data for file
    processor.getMetadata(originalfile, function(data) {
      // format and metadata found, build options and start conversion
      var options = formats[type].buildOptions(originalfile, data);
      // start conversion to file
      processor.startConversion({ targetfile: requestedfile, ffmpegopts: options }, function (job, err) {
        if (job.state == 'NOK')
          callback(null, err);
        callback(job, null);
      });
    });
  }
};

Converter.prototype.getinfo = function(originalfile, callback) {
  
};

Converter.prototype.check = function(hash, callback) {
  processor.checkConversion(hash, function(state, err) {
    callback(state, err);
  });
};

exports.Converter = new Converter();