(function () {
  "use strict";

  var fallback = {
    settings: {}
  };

  try {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./settings.json", false);
    xhr.send();

    if (xhr.status === 200 || xhr.status === 0) {
      window.signage_weather_traffic = JSON.parse(xhr.responseText || "{}");
      return;
    }
  } catch (error) {
    // Keep widget bootable if settings.json is unavailable.
  }

  window.signage_weather_traffic = fallback;
})();
