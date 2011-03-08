exports.format = 'flv';

exports.options = {
  bitrate: '512k',
  width: '320',
  height: '240'
};

exports.buildOptions = function(inputfile, metadata) {
  return ['-i', inputfile,
          '-sameq',
          '-ab', '128k',
          '-ar', '44100',
          '-b', exports.options.bitrate,
          '-r', '25',
          '-s', exports.options.width + 'x' + exports.options.height,
          '-f', 'flv'];
};