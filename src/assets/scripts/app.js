// polyfill scripts needed for all browsers
require('./polyfills');

// scripts that self-init and just need to be required
require('lazysizes');
require('./vendor/modernizr');

// third-party scripts included globally
var EQ = require('css-element-queries/src/ElementQueries');
var SmoothScroll = require('smooth-scroll');
var whatInput = require('what-input');

//require bootstrap

require('bootstrap-sass');

// requires specific to this file
// var Util = require('./utilities');

if (
  // cut the mustard
  'querySelector' in document &&
  'addEventListener' in window
) {

  // Grab all the modules used on the page
  // var modules = document.querySelectorAll('[data-module]');

  // Loop over all the modules and, if a constructor exists,
  // start a new instance and pass the element in as a param
  // for (var m = 0, len = modules.length; m < len; m++) {

  //   // get list of modules to init, can be a comma-separated list
  //   var moduleList = modules[m].getAttribute('data-module').split(',');

  //   // also get list of features to add
  //   var features = modules[m].getAttribute('data-features');
  //   var featureList = (features) ? features.split(',') : [];

  //   // loop over all modules to init
  //   for (var i = 0, lengthModules = moduleList.length; i < lengthModules; i++) {
  //     try {
  //       var Module = require('./modules/' + moduleList[i]);
  //       new Module(
  //         modules[m], // pass in the object as a param
  //         featureList // pass in feature list as array
  //       );
  //     }
  //     catch (error) {
  //       console.warn(error);
  //     }
  //   }
  // }

  // start up smooth scroll
  new SmoothScroll('[data-scroll]');

  // start up css element queries
  EQ.listen();

}

// load ls.respimg polyfill if srcset attribute isn't supported (IE10/11)
if (!Modernizr.srcset) {
  Util.loadScript('/assets/scripts/vendor/ls.respimg.js');
}

