// polyfill scripts needed for all browsers
require('./polyfills');

// scripts that self-init and just need to be required
require('lazysizes');
require('./vendor/modernizr');

//require bootstrap

require('bootstrap-sass');


// load ls.respimg polyfill if srcset attribute isn't supported (IE10/11)
if (!Modernizr.srcset) {
  Util.loadScript('/assets/scripts/vendor/ls.respimg.js');
}

