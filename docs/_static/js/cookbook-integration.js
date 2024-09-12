(function() {
  // Cookbook Onboard (AI Assistant). API key is public so it's fine to just hardcode it here.
  var COOKBOOK_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmE4MzQyZTg2NDM1ZGEyMGE1NDc5ODciLCJpYXQiOjE3MjIyOTk0MzgsImV4cCI6MjAzNzg3NTQzOH0.v-569WVNKHsQX2uDPyHJCOjXz811_iSlyitaKgqmg2U";

  document.addEventListener('DOMContentLoaded', function() {
    var element = document.getElementById('__cookbook');
    if (!element) {
      element = document.createElement('div');
      element.id = '__cookbook';
      element.dataset.apiKey = COOKBOOK_API_KEY;
      document.body.appendChild(element);
    }

    var script = document.getElementById('__cookbook-script');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@cookbookdev/docsbot/dist/standalone/index.cjs.js';
      script.id = '__cookbook-script';
      script.defer = true;
      document.body.appendChild(script);
    }
  });
})();
