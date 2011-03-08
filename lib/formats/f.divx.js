exports.format = 'divx';

exports.options = {
  bitrate: '512k'
};

exports.buildOptions = function(inputfile, metadata) {
  return ['-i', inputfile,
          '-vtag', 'DIVX',
          '-vcodec', 'mpeg4',
          '-ab', '128k',
          '-ar', '44100',
          '-ac', '2',
          '-acodec', 'libmp3lame',
          '-b', exports.options.bitrate,
          '-r', '25',
          '-s', metadata.resolution.w + 'x' + metadata.resolution.h,
          '-f', 'avi'];
};