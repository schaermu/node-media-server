/*
 * Bootstrapper to load available formats
 */

var fs = require('fs');

// inspired by grasshopper bootstrapper
require('fs').readdirSync(__dirname).forEach(function(file) {
  if(file == 'index.js')
    return;

  var mod = require('./' + file.substring(0, file.length - 3));
  if (mod.format) {
    console.log('formats: loaded ' + mod.format);
    exports[mod.format] = mod;
  }
});