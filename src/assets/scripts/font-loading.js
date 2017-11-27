// small pub/sub script
// via: https://davidwalsh.name/pubsub-javascript
window.pubSub = (function() {
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function(topic, listener) {
      // Create the topic's object if not yet created
      if (!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    },
    publish: function(topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!hOP.call(topics, topic)) return;

      for (var i = 0, len = topics[topic].length; i < len; i++) {
        topics[topic][i](info !== undefined ? info : {});
      }
    }
  };
})();


(function() {
  var lang = document.documentElement.lang;

  // only load custom font for latin-based languages
  if (lang && lang !== 'ko' && lang !== 'ja') {

    // If fonts have been previously loaded during the current session
    // set the `wf-active` class immediately to prevent FOUT on subsequent page loads.
    // This assumes that the fonts will load quickly from cache.
    if (sessionStorage['fonts-loaded']) document.documentElement.classList.add('wf-active');

    WebFontConfig = {

      // Add an entry into session storage once fonts have loaded.
      active: function() {
        sessionStorage['fonts-loaded'] = true;
        window.pubSub.publish('fontsLoaded');
      },

      // load Google's Open Sans family
      google: {
        families: [
          'Open+Sans:300,400,700,400italic:latin',
          'Roboto+Slab:300,400,700'
        ]
      },

      // set timeout to 2 seconds
      timeout: 2000
    };

    // Load the google web font api asynchronously.
    var wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  }
})();
