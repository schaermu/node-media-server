var fs = require('fs'),
  crypto = require('crypto'),
  path = require('path'),
  exec = require('child_process').exec,
  spawn = require('child_process').spawn;


JobRegistry = {
  _currentJobs: {},
  
  setJob: function(hash, data) {
    this._currentJobs[hash] = data;
  },
  getJob: function(hash) {
    return this._currentJobs[hash];
  },
  removeJob: function(hash) {
    delete this._currentJobs[hash];
  }
};

exports.Ffmpeg = {    
    generateJobhash: function(options) {
      var hashStr = JSON.stringify(options);
      return crypto.createHash('md5').update(hashStr).digest('hex');
    },
    
    getMetadata: function(inputfile, callback) {
      exec('ffmpeg -i ' + inputfile, function(err, stdout, stderr) {
        // parse data from stderr       
        var ret = {
            aspect: /(4|3|16):(3|2|9|10)/.exec(stderr)[0],
            bitrate: /bitrate: ([0-9]+) kb\/s/.exec(stderr)[1],
            duration: /Duration: (([0-9]+):([0-9]{2}):([0-9]{2}).([0-9]+))/.exec(stderr)[1],
            resolution: {
              w: /(([0-9]{2,5})x([0-9]{2,5}))/.exec(stderr)[2],
              h: /(([0-9]{2,5})x([0-9]{2,5}))/.exec(stderr)[3]
            }
        };
        callback(ret);
      });
    },
    
    startConversion: function(options, callback) {
      var hash = this.generateJobhash(options);
      if (JobRegistry.getJob(hash)) {
        // conversion is already running
        callback(JobRegistry.getJob(hash), null);
      } else {
        // start new conversion
        if (!options.targetfile)
          callback({ state: 'NOK' }, new Error('please supply a target file when not using direct mode'));
        else {
          JobRegistry.setJob(hash, { state: 'NEW', hash: hash });
          // start converting the file
          var args = [ '-y', options.targetfile ];
          args = options.ffmpegopts.concat(args);
                      
          var ffmpegProc = spawn('ffmpeg', args);            
          ffmpegProc.on('exit', function(code) {
            JobRegistry.removeJob(hash);
          });
        }
      }
      callback(JobRegistry.getJob(hash), null);
    },
    
    checkConversion: function(jobhash, callback) {
      var job = JobRegistry.getJob(jobhash);
      if (!job)
        callback('NOK');
      else {
        if (job.state == 'NEW') {
          job.state = 'RUNNING';
          JobRegistry.setJob(jobhash, job);
        }
        callback(job.state);
      }
    }
};