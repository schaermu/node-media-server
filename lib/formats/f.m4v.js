/*
 * Format definition for mp4 export
 */
exports.format = 'm4v';

exports.options = {
  bitrate: '512k',
  width: '320',
  height: '240'
};

exports.buildOptions = function(inputfile, metadata) {
  return ['-i "' + inputfile + '"',
          '-f mp4',
          '-acodec libfaac',
          '-ab 128k',
          '-ac 2',
          '-vcodec libx264',
          '-b ' + exports.options.bitrate,
          '-flags',
          '+loop',
          '-cmp',
          '+chroma',
          '-partitions',
          '+parti4x4+partp8x8+partb8x8',
          '-flags2',
          '+mixed_refs',
          '-me umh',
          '-subq 5',
          '-trellis 1',
          '-refs 5',
          '-coder 0',
          '-me_range 16',
          '-g 250',
          '-keyint_min 25',
          '-sc_threshold 40',
          '-i_qfactor 0.71',
          '-maxrate ' + exports.options.bitrate,
          '-bufsize 2M',
          '-rc_eq \'blurCplx^(1-qComp)\'',
          '-qcomp 0.6',
          '-qmin 10',
          '-qmax 51',
          '-qdiff 4',
          '-level 13',
          '-s ' + exports.options.width + 'x' + exports.options.height,
          '-y'];
};