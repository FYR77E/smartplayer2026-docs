(function () {
  "use strict";

  var packagedSettings = (window.signage_weather_traffic && window.signage_weather_traffic.settings) || {};
  var config = window.SMARTPLAYER_WIDGET_CONFIG || {};
  var liveData = {};
  var fallback = {
    layout: "b",
    city: "Москва",
    tempC: 21,
    feelsC: 19,
    humidity: 58,
    windMs: 3,
    condition: "partly-cloudy",
    trafficScore: 5,
    showSeconds: true,
    timeZone: "Europe/Moscow",
    liveWeather: false,
    liveTraffic: false,
    debugWeather: false,
    detectCityByIp: false,
    serviceCity: "moscow",
    weatherCity: "moscow",
    lat: 55.7558,
    lon: 37.6173,
    apiServiceName: "auto",
    apiKey: "",
    weatherRequestInterval: 1800,
    trafficRequestInterval: 300,
    trafficRegionId: "",
    backgroundColor: "",
    cBackgroundColor: "#15120d",
    cPanelColor: "#17130d",
    accentColor: "",
    fontColor: "",
    fontFamily: "onest",
    headerTitle: "SmartPlayer Pulse",
    headerSubtitle: "Showroom Live",
    logo: "./images/logo.svg",
    showLogo: true,
    contentUrl: ""
  };

  var conditionText = {
    clear: "Ясно",
    "partly-cloudy": "Переменная облачность",
    cloudy: "Облачно",
    overcast: "Пасмурно",
    rain: "Дождь",
    snow: "Снег",
    thunder: "Гроза"
  };

  var SETTINGS_FIRST_KEYS = {
    layout: true,
    city: true,
    serviceCity: true,
    weatherCity: true,
    lat: true,
    lon: true,
    timeZone: true,
    showSeconds: true,
    liveWeather: true,
    liveTraffic: true,
    debugWeather: true,
    apiServiceName: true,
    apiKey: true,
    weatherRequestInterval: true,
    trafficRequestInterval: true,
    trafficRegionId: true,
    backgroundColor: true,
    cBackgroundColor: true,
    cPanelColor: true,
    accentColor: true,
    fontColor: true,
    fontFamily: true,
    headerTitle: true,
    headerSubtitle: true,
    logo: true,
    showLogo: true,
    contentUrl: true
  };

  var LIVE_DATA_KEYS = {
    tempC: true,
    feelsC: true,
    humidity: true,
    windMs: true,
    condition: true,
    trafficScore: true
  };

  function getParams() {
    var params = {};
    var query = window.location.search.replace(/^\?/, "");

    if (!query) {
      return params;
    }

    query.split("&").forEach(function (pair) {
      var parts = pair.split("=");
      var key = decodeURIComponent(parts[0] || "");
      var value = decodeURIComponent((parts[1] || "").replace(/\+/g, " "));

      if (key) {
        params[key] = value;
      }
    });

    return params;
  }

  function value(key) {
    var params = value.params || {};

    if (params[key] !== undefined && params[key] !== "") {
      return params[key];
    }

    if (LIVE_DATA_KEYS[key] && liveData[key] !== undefined && liveData[key] !== "") {
      return liveData[key];
    }

    if (
      SETTINGS_FIRST_KEYS[key] &&
      packagedSettings[key] !== undefined &&
      packagedSettings[key] !== ""
    ) {
      return packagedSettings[key];
    }

    if (config[key] !== undefined && config[key] !== "") {
      return config[key];
    }

    if (packagedSettings[key] !== undefined && packagedSettings[key] !== "") {
      return packagedSettings[key];
    }

    return fallback[key];
  }

  function numberValue(key) {
    var raw = value(key);
    var parsed = Number(raw);

    if (Number.isNaN(parsed)) {
      return Number(fallback[key]);
    }

    return parsed;
  }

  function boolValue(key) {
    var raw = value(key);

    if (raw === false || raw === "false" || raw === "0" || raw === "no") {
      return false;
    }

    return true;
  }

  function setText(selector, text) {
    var nodes = document.querySelectorAll(selector);

    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = text;
    });
  }

  function setById(id, text) {
    var node = document.getElementById(id);

    if (node) {
      node.textContent = text;
    }
  }

  function formatTemp(value) {
    var rounded = Math.round(Number(value));

    return (rounded > 0 ? "+" : "") + rounded + "°";
  }

  function getTrafficMeta(score) {
    if (score <= 3) {
      return {
        label: "Свободно",
        color: "#3de08a",
        glow: "rgba(61,224,138,.46)"
      };
    }

    if (score <= 6) {
      return {
        label: "Средне",
        color: "#f2c14e",
        glow: "rgba(242,193,78,.46)"
      };
    }

    return {
      label: "Затор",
      color: "#f2664e",
      glow: "rgba(242,102,78,.48)"
    };
  }

  function normalizeCondition(condition) {
    var normalized = String(condition || "").toLowerCase();

    if (normalized === "partly cloudy" || normalized === "partly_cloudy") {
      return "partly-cloudy";
    }

    if (normalized === "light-rain" || normalized === "moderate-rain" || normalized === "heavy-rain") {
      return "rain";
    }

    if (normalized === "light-snow" || normalized === "wet-snow") {
      return "snow";
    }

    if (conditionText[normalized]) {
      return normalized;
    }

    return "partly-cloudy";
  }

  function applyLayout() {
    var layout = String(value("layout") || "b").toLowerCase();

    if (layout !== "a" && layout !== "b" && layout !== "c") {
      layout = "b";
    }

    document.body.classList.remove("layout-a", "layout-b", "layout-c", "hide-seconds");
    document.body.classList.add("layout-" + layout);

    if (!boolValue("showSeconds")) {
      document.body.classList.add("hide-seconds");
    }
  }

  function applyTheme() {
    var root = document.documentElement.style;
    var bg = String(value("backgroundColor") || "");
    var cBg = String(value("cBackgroundColor") || "");
    var cPanel = String(value("cPanelColor") || "");
    var accent = String(value("accentColor") || "");
    var fontColor = String(value("fontColor") || "");
    var fontFamily = String(value("fontFamily") || "").toLowerCase();

    // Background: collapse the gradient stops to the chosen solid colour.
    if (bg) {
      root.setProperty("--bg-top", bg);
      root.setProperty("--bg-mid", bg);
      root.setProperty("--bg-deep", bg);
    }

    if (cBg) {
      root.setProperty("--c-bg", cBg);
    }

    if (cPanel) {
      root.setProperty("--c-panel", cPanel);
    }

    if (accent) {
      root.setProperty("--accent", accent);
      root.setProperty("--blue", accent);
    }

    if (fontColor) {
      root.setProperty("--text", fontColor);
    }

    if (fontFamily === "system") {
      root.setProperty("--font-family", 'system-ui, "Segoe UI", Roboto, Arial, sans-serif');
    } else {
      root.setProperty("--font-family", '"Onest", Manrope, "Inter Tight", "Segoe UI", system-ui, sans-serif');
    }

    // Editable header text.
    var title = value("headerTitle");
    var subtitle = value("headerSubtitle");

    if (title !== undefined && title !== "") {
      setById("brandOverline", String(title));
    }

    if (subtitle !== undefined && subtitle !== "") {
      setById("brandName", String(subtitle));
    }

    // Logo: editable image (default = bundled SmartPlayer mark).
    var logo = String(value("logo") || "");
    var logoImg = document.getElementById("logoImg");

    if (logoImg && logo) {
      logoImg.setAttribute("src", logo);
    }

    document.body.classList.toggle("hide-logo", !boolValue("showLogo"));
  }

  function applyData() {
    var city = String(value("city"));
    var tempC = numberValue("tempC");
    var feelsC = numberValue("feelsC");
    var humidity = Math.round(numberValue("humidity"));
    var windMs = numberValue("windMs");
    var condition = normalizeCondition(value("condition"));
    var score = Math.max(0, Math.min(10, Math.round(numberValue("trafficScore"))));
    var traffic = getTrafficMeta(score);
    var conditionLabel = conditionText[condition] || String(value("condition"));

    setById("cityA", city);
    setById("cityB", city);
    setById("heroCity", city + " · локальное время");
    setById("trafficCityA", city);
    setById("trafficCityB", city);
    setById("tempA", formatTemp(tempC));
    setById("tempB", formatTemp(tempC));
    setById("conditionA", conditionLabel);
    setById("conditionB", conditionLabel);
    setById("feelsA", formatTemp(feelsC));
    setById("feelsB", formatTemp(feelsC));
    setById("humidityA", humidity + "%");
    setById("humidityB", humidity + "%");
    setById("windA", windMs + " м/с");
    setById("windB", windMs + " м/с");
    setById("trafficScoreA", String(score));
    setById("trafficScoreB", String(score));
    setById("trafficStatusA", traffic.label);
    setById("trafficStatusB", traffic.label);

    var barWidth = score * 10 + "%";
    var barA = document.getElementById("trafficBarA");
    var barB = document.getElementById("trafficBarB");

    if (barA) {
      barA.style.width = barWidth;
    }

    if (barB) {
      barB.style.width = barWidth;
    }

    // Layout C (КорпТВ Bento) — info column.
    setById("cTimeCity", city);
    setById("cWeatherCity", city);
    setById("cTrafficCity", city);
    setById("cTemp", formatTemp(tempC));
    setById("cCondition", conditionLabel);
    setById("cFeels", formatTemp(feelsC));
    setById("cHumidity", humidity + "%");
    setById("cWind", windMs + " м/с");
    setById("cTrafficScore", String(score));
    setById("cTrafficStatus", traffic.label);
    renderEqualizer(score);

    document.documentElement.style.setProperty("--traffic", traffic.color);
    document.documentElement.style.setProperty("--traffic-glow", traffic.glow);

    setWeatherIcon("weatherIconA", condition);
    setWeatherIcon("weatherIconB", condition);
    setWeatherIcon("cWeatherIcon", condition);
  }

  // Traffic equalizer for layout C: 10 segments, filled up to the score,
  // each coloured by its own zone (green → amber → red).
  function renderEqualizer(score) {
    var eq = document.getElementById("cTrafficEq");
    var i;

    if (!eq) {
      return;
    }

    if (eq.children.length !== 10) {
      eq.innerHTML = "";

      for (i = 0; i < 10; i += 1) {
        eq.appendChild(document.createElement("span"));
      }
    }

    for (i = 0; i < 10; i += 1) {
      var zone = i < 3 ? "free" : (i < 6 ? "mid" : "jam");
      eq.children[i].className = "seg " + zone + (i < score ? " on" : "");
    }
  }

  // Content zone (layout C). Empty contentUrl = transparent window: the actual
  // content is supplied by a player zone/layer behind this overlay. A set
  // contentUrl loads an image or looping muted video straight into the zone.
  function applyContent() {
    var slot = document.getElementById("cContent");
    var url = String(value("contentUrl") || "");

    if (!slot) {
      return;
    }

    slot.innerHTML = "";
    document.body.classList.toggle("has-content", !!url);

    if (!url) {
      return;
    }

    var media;

    if (/\.(mp4|webm|ogg|m4v)(\?|$)/i.test(url)) {
      media = document.createElement("video");
      media.src = url;
      media.autoplay = true;
      media.loop = true;
      media.muted = true;
      media.setAttribute("muted", "");
      media.setAttribute("playsinline", "");
      media.setAttribute("autoplay", "");
      media.setAttribute("loop", "");
    } else {
      media = document.createElement("img");
      media.src = url;
      media.alt = "";
    }

    media.className = "content-media";
    slot.appendChild(media);
  }

  function setWeatherIcon(id, condition) {
    var node = document.getElementById(id);
    var sizeClass = "";

    if (id === "weatherIconB") {
      sizeClass = "small ";
    } else if (id === "cWeatherIcon") {
      sizeClass = "col ";
    }

    if (node) {
      node.className = "weather-icon " + sizeClass + condition;
    }
  }

  function partsForTimeZone(timeZone) {
    var formatter = new Intl.DateTimeFormat("ru-RU", {
      timeZone: timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    var parts = formatter.formatToParts(new Date());
    var result = {};

    parts.forEach(function (part) {
      result[part.type] = part.value;
    });

    return {
      hh: result.hour || "00",
      mm: result.minute || "00",
      ss: result.second || "00"
    };
  }

  function updateClock() {
    var timeZone = String(value("timeZone") || "Europe/Moscow");
    var time = partsForTimeZone(timeZone);
    var now = new Date();
    var dateLong = new Intl.DateTimeFormat("ru-RU", {
      timeZone: timeZone,
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(now);

    setText(".hh", time.hh);
    setText(".mm", time.mm);
    setText(".ss", time.ss);
    setById("dateLong", dateLong);
    setById("dateShortA", dateLong);
    setById("dateShortB", dateLong);
    setById("cDate", dateLong);
    setById("cTimeDate", dateLong);
  }

  function applyRemotePayload(payload) {
    if (!payload || typeof payload !== "object") {
      return;
    }

    var data = payload.settings && typeof payload.settings === "object" ? payload.settings : payload;

    Object.keys(data).forEach(function (key) {
      config[key] = data[key];
      packagedSettings[key] = data[key];
    });

    if (window.signage_weather_traffic) {
      window.signage_weather_traffic.settings = currentSettings();
    }

    applyLayout();
    applyTheme();
    applyContent();
    applyData();
  }

  function mergeData(data) {
    Object.keys(data).forEach(function (key) {
      if (LIVE_DATA_KEYS[key]) {
        liveData[key] = data[key];
      }

      config[key] = data[key];
    });

    applyData();
  }

  function normalizeOpenWeatherCondition(iconCode, main) {
    var icon = String(iconCode || "");
    var group = String(main || "").toLowerCase();

    if (icon.indexOf("01") === 0 || group === "clear") {
      return "clear";
    }

    if (icon.indexOf("02") === 0) {
      return "partly-cloudy";
    }

    if (icon.indexOf("03") === 0 || group === "clouds") {
      return "cloudy";
    }

    if (icon.indexOf("04") === 0) {
      return "overcast";
    }

    if (icon.indexOf("09") === 0 || icon.indexOf("10") === 0 || group === "rain" || group === "drizzle") {
      return "rain";
    }

    if (icon.indexOf("11") === 0 || group === "thunderstorm") {
      return "thunder";
    }

    if (icon.indexOf("13") === 0 || group === "snow") {
      return "snow";
    }

    return "partly-cloudy";
  }

  function normalizeWeatherApiCondition(text) {
    var normalized = String(text || "").toLowerCase();

    if (normalized.indexOf("snow") >= 0 || normalized.indexOf("снег") >= 0) {
      return "snow";
    }

    if (normalized.indexOf("rain") >= 0 || normalized.indexOf("дожд") >= 0) {
      return "rain";
    }

    if (normalized.indexOf("thunder") >= 0 || normalized.indexOf("гроз") >= 0) {
      return "thunder";
    }

    if (normalized.indexOf("clear") >= 0 || normalized.indexOf("ясно") >= 0) {
      return "clear";
    }

    if (normalized.indexOf("overcast") >= 0 || normalized.indexOf("пасмур") >= 0) {
      return "overcast";
    }

    if (normalized.indexOf("cloud") >= 0 || normalized.indexOf("облач") >= 0) {
      return "partly-cloudy";
    }

    return "partly-cloudy";
  }

  function normalizeOpenMeteoCondition(code) {
    var weatherCode = Number(code);

    if (weatherCode === 0) {
      return "clear";
    }

    if (weatherCode === 1 || weatherCode === 2) {
      return "partly-cloudy";
    }

    if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
      return "overcast";
    }

    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      return "rain";
    }

    if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
      return "snow";
    }

    if (weatherCode >= 95 && weatherCode <= 99) {
      return "thunder";
    }

    return "partly-cloudy";
  }

  function weatherStatusTime() {
    try {
      return new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: String(value("timeZone") || "Europe/Moscow")
      }).format(new Date());
    } catch (error) {
      return new Date().toLocaleTimeString("ru-RU");
    }
  }

  function reportWeatherStatus(message) {
    var status = message + " · " + weatherStatusTime();

    setById("weatherDebugA", status);
    setById("weatherDebugB", status);
  }

  function requestJson(url) {
    if (window.fetch) {
      var controller = window.AbortController ? new window.AbortController() : null;

      return new Promise(function (resolve, reject) {
        var done = false;
        var timeout = window.setTimeout(function () {
          if (done) {
            return;
          }

          done = true;

          if (controller) {
            controller.abort();
          }

          reject(new Error("timeout"));
        }, 8000);

        window
          .fetch(url, {
            cache: "no-store",
            signal: controller ? controller.signal : undefined
          })
          .then(function (response) {
            if (!response.ok) {
              throw new Error("HTTP " + response.status);
            }

            return response.json();
          })
          .then(function (data) {
            if (done) {
              return;
            }

            done = true;
            window.clearTimeout(timeout);
            resolve(data);
          })
          .catch(function (error) {
            if (done) {
              return;
            }

            done = true;
            window.clearTimeout(timeout);
            reject(error);
          });
      });
    }

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      var timeoutId = window.setTimeout(function () {
        try {
          xhr.abort();
        } catch (error) {
          // Timeout is the meaningful failure; abort errors are not useful.
        }

        reject(new Error("timeout"));
      }, 8000);

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }

        window.clearTimeout(timeoutId);

        if (xhr.status === 200 || xhr.status === 0) {
          try {
            resolve(JSON.parse(xhr.responseText || "{}"));
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error("HTTP " + xhr.status));
        }
      };

      xhr.onerror = function () {
        window.clearTimeout(timeoutId);
        reject(new Error("XHR error"));
      };

      xhr.open("GET", url, true);
      xhr.send();
    });
  }

  function wttrCity() {
    var city = String(value("weatherCity") || value("serviceCity") || "moscow");

    return city.replace(/\s+/g, "-").toLowerCase();
  }

  function loadWttrWeather(reason) {
    var url = "https://wttr.in/" + encodeURIComponent(wttrCity()) + "?format=j1&lang=ru&_=" + Date.now();

    reportWeatherStatus("Weather: loading wttr.in" + (reason ? " (" + reason + ")" : ""));

    return requestJson(url).then(function (data) {
      var current = data && data.current_condition && data.current_condition[0];
      var desc = current && current.weatherDesc && current.weatherDesc[0] && current.weatherDesc[0].value;

      if (!current) {
        throw new Error("wttr empty response");
      }

      mergeData({
        city: value("city"),
        tempC: current.temp_C,
        feelsC: current.FeelsLikeC,
        humidity: current.humidity,
        windMs: Math.round((Number(current.windspeedKmph || 0) / 3.6) * 10) / 10,
        condition: normalizeWeatherApiCondition(desc)
      });
      reportWeatherStatus("Weather: wttr.in OK " + formatTemp(current.temp_C));
    });
  }

  function weatherQueryCity() {
    return String(value("weatherCity") || value("serviceCity") || "moscow");
  }

  function loadLiveWeather() {
    if (!boolValue("liveWeather")) {
      reportWeatherStatus("Weather: disabled");
      return;
    }

    var service = String(value("apiServiceName") || "auto");
    var city = weatherQueryCity();
    var apiKey = String(value("apiKey") || "");
    var url;

    if (service === "wttr") {
      loadWttrWeather("manual source").catch(function (fallbackError) {
        reportWeatherStatus("Weather wttr failed: " + (fallbackError && fallbackError.message ? fallbackError.message : "request failed"));

        url =
          "https://api.open-meteo.com/v1/forecast?latitude=" +
          encodeURIComponent(numberValue("lat")) +
          "&longitude=" +
          encodeURIComponent(numberValue("lon")) +
          "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m" +
          "&wind_speed_unit=ms&timezone=" +
          encodeURIComponent(String(value("timeZone") || "Europe/Moscow")) +
          "&_=" +
          Date.now();

        reportWeatherStatus("Weather: loading Open-Meteo fallback");

        requestJson(url)
          .then(function (data) {
            if (!data.current) {
              throw new Error("Open-Meteo empty response");
            }

            mergeData({
              city: value("city"),
              tempC: data.current.temperature_2m,
              feelsC: data.current.apparent_temperature,
              humidity: data.current.relative_humidity_2m,
              windMs: Math.round(Number(data.current.wind_speed_10m || 0) * 10) / 10,
              condition: normalizeOpenMeteoCondition(data.current.weather_code)
            });
            reportWeatherStatus("Weather: Open-Meteo fallback OK " + formatTemp(data.current.temperature_2m));
          })
          .catch(function (openMeteoError) {
            reportWeatherStatus("Weather fallback failed: " + (openMeteoError && openMeteoError.message ? openMeteoError.message : "request failed"));
          });
      });
      return;
    }

    if (service === "openMeteo" || service === "auto") {
      url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        encodeURIComponent(numberValue("lat")) +
        "&longitude=" +
        encodeURIComponent(numberValue("lon")) +
        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m" +
        "&wind_speed_unit=ms&timezone=" +
        encodeURIComponent(String(value("timeZone") || "Europe/Moscow")) +
        "&_=" +
        Date.now();
    } else if (service === "weatherApi") {
      if (!apiKey) {
        return;
      }

      url =
        "https://api.weatherapi.com/v1/current.json?key=" +
        encodeURIComponent(apiKey) +
        "&q=" +
        encodeURIComponent(city) +
        "&lang=ru&_=" +
        Date.now();
    } else {
      if (!apiKey) {
        return;
      }

      url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        encodeURIComponent(city.replace(/-/g, " ")) +
        "&lang=ru&units=metric&APPID=" +
        encodeURIComponent(apiKey) +
        "&_=" +
        Date.now();
    }

    reportWeatherStatus("Weather: loading " + service);

    requestJson(url)
      .then(function (data) {
        if ((service === "openMeteo" || service === "auto") && data.current) {
          mergeData({
            city: value("city"),
            tempC: data.current.temperature_2m,
            feelsC: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windMs: Math.round(Number(data.current.wind_speed_10m || 0) * 10) / 10,
            condition: normalizeOpenMeteoCondition(data.current.weather_code)
          });
          reportWeatherStatus("Weather: Open-Meteo OK " + formatTemp(data.current.temperature_2m));
          return;
        }

        if (service === "weatherApi" && data.current) {
          mergeData({
            city: data.location && data.location.name ? data.location.name : value("city"),
            tempC: data.current.temp_c,
            feelsC: data.current.feelslike_c,
            humidity: data.current.humidity,
            windMs: Math.round((Number(data.current.wind_kph || 0) / 3.6) * 10) / 10,
            condition: normalizeWeatherApiCondition(data.current.condition && data.current.condition.text)
          });
          reportWeatherStatus("Weather: WeatherAPI OK " + formatTemp(data.current.temp_c));
          return;
        }

        if (data.main && data.weather && data.weather[0]) {
          mergeData({
            city: data.name || value("city"),
            tempC: data.main.temp,
            feelsC: data.main.feels_like,
            humidity: data.main.humidity,
            windMs: data.wind && data.wind.speed ? data.wind.speed : value("windMs"),
            condition: normalizeOpenWeatherCondition(data.weather[0].icon, data.weather[0].main)
          });
          reportWeatherStatus("Weather: OpenWeatherMap OK " + formatTemp(data.main.temp));
          return;
        }

        throw new Error("Weather response has no known shape");
      })
      .catch(function (error) {
        if (service === "openMeteo" || service === "auto") {
          loadWttrWeather(error && error.message ? error.message : "request failed").catch(function (fallbackError) {
            reportWeatherStatus("Weather fallback failed: " + (fallbackError && fallbackError.message ? fallbackError.message : "request failed"));
          });
          return;
        }

        reportWeatherStatus("Weather failed: " + (error && error.message ? error.message : "request failed"));
      });
  }

  // Yandex traffic «info» endpoint keys regions by geo-region id (verified live,
  // no API key). If a city isn't covered, the lookup just misses and the
  // configured fallback score stays on screen — no broken state.
  var CITY_REGIONS = {
    moscow: 213,
    "saint-petersburg": 2,
    yekaterinburg: 54,
    novosibirsk: 65,
    "nizhny-novgorod": 47,
    kazan: 43,
    krasnodar: 35,
    samara: 51,
    "rostov-on-don": 39,
    ufa: 172,
    chelyabinsk: 56,
    omsk: 66,
    almaty: 162,
    astana: 163,
    minsk: 157
  };

  function trafficRegionId() {
    var explicit = String(value("trafficRegionId") || "");

    if (explicit && explicit !== "0") {
      return explicit;
    }

    var key = String(value("serviceCity") || "moscow").toLowerCase();

    return String(CITY_REGIONS[key] || 213);
  }

  function loadLiveTraffic() {
    if (!boolValue("liveTraffic")) {
      return;
    }

    var regionId = trafficRegionId();

    window
      .fetch("https://api-maps.yandex.ru/services/traffic/v1/info?lang=ru_RU", {
        cache: "no-store"
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Traffic request failed");
        }

        return response.json();
      })
      .then(function (data) {
        var regions = (data && data.regions) || [];
        var i;

        for (i = 0; i < regions.length; i += 1) {
          if (String(regions[i].regionId) === regionId) {
            mergeData({
              trafficScore: Math.max(0, Math.min(10, Math.round(Number(regions[i].level))))
            });
            return;
          }
        }
      })
      .catch(function () {
        // Keep the configured fallback traffic score on screen.
      });
  }

  function loadEndpoint() {
    var endpoint = value("endpoint");

    if (!endpoint || endpoint === fallback.endpoint) {
      return;
    }

    window
      .fetch(endpoint)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Endpoint failed");
        }

        return response.json();
      })
      .then(applyRemotePayload)
      .catch(function () {
        // Keep fallback/config data on screen if network is unavailable.
      });
  }

  function isDebugWeatherMode() {
    var params = value.params || {};

    return params.debug === "true" || params.debugWeather === "true" || boolValue("debugWeather");
  }

  function currentSettings() {
    var settings = {};

    Object.keys(packagedSettings).forEach(function (key) {
      settings[key] = packagedSettings[key];
    });

    Object.keys(config).forEach(function (key) {
      settings[key] = config[key];
    });

    return settings;
  }

  function currentWidgetData() {
    var base = window.signage_weather_traffic || { settings: {} };
    var data = {};

    Object.keys(base).forEach(function (key) {
      data[key] = base[key];
    });

    data.settings = currentSettings();

    return data;
  }

  function applyEditorSettings(settings, refreshLiveData) {
    Object.keys(settings).forEach(function (key) {
      config[key] = settings[key];
      packagedSettings[key] = settings[key];
    });

    if (window.signage_weather_traffic) {
      window.signage_weather_traffic.settings = settings;
    }

    applyLayout();
    applyTheme();
    applyContent();
    applyData();
    document.body.classList.toggle("debug-weather", isDebugWeatherMode());
    updateClock();

    if (refreshLiveData) {
      loadLiveWeather();
      loadLiveTraffic();
    }
  }

  function initWidgetEditor() {
    if (!window.SmartPlayerWidgetEditor) {
      return;
    }

    window.SmartPlayerWidgetEditor.init({
      title: "Настройки виджета",
      applyText: "Применить настройки",
      note: "Превью меняется сразу. В CMS отправляется только финальное состояние после кнопки «Применить настройки».",
      postOnPreview: false,
      getData: currentWidgetData,
      fields: [
        {
          name: "Основные",
          fields: [
            {
              name: "layout",
              label: "Макет",
              type: "select",
              options: [
                { value: "b", label: "B · Часы-герой" },
                { value: "a", label: "A · Триптих" },
                { value: "c", label: "C · КорпТВ Bento" }
              ]
            },
            { name: "city", label: "Город на экране", type: "text" },
            { name: "weatherCity", label: "Город для погоды", type: "text" },
            { name: "lat", label: "Широта", type: "number", step: "0.0001" },
            { name: "lon", label: "Долгота", type: "number", step: "0.0001" },
            { name: "timeZone", label: "Часовой пояс", type: "text" }
          ]
        },
        {
          name: "Внешний вид",
          fields: [
            { name: "accentColor", label: "Акцент", type: "color", defaultValue: "#37e6c8" },
            { name: "fontColor", label: "Цвет текста", type: "color", defaultValue: "#eaf2f2" },
            { name: "cBackgroundColor", label: "Bento фон/скрим", type: "color", defaultValue: "#15120d" },
            { name: "cPanelColor", label: "Bento правая панель", type: "color", defaultValue: "#17130d" },
            { name: "headerTitle", label: "Заголовок", type: "text" },
            { name: "headerSubtitle", label: "Подзаголовок", type: "text" },
            { name: "showLogo", label: "Показывать логотип", type: "checkbox" }
          ]
        },
        {
          name: "Данные",
          fields: [
            {
              name: "apiServiceName",
              label: "Источник погоды",
              type: "select",
              options: [
                { value: "auto", label: "Авто · Open-Meteo → wttr.in" },
                { value: "wttr", label: "wttr.in · без ключа" },
                { value: "openMeteo", label: "Open-Meteo · без ключа" },
                { value: "openWeatherApi", label: "OpenWeatherMap · нужен ключ" },
                { value: "weatherApi", label: "WeatherAPI · нужен ключ" }
              ]
            },
            { name: "showSeconds", label: "Показывать секунды", type: "checkbox" },
            { name: "liveWeather", label: "Live-погода", type: "checkbox" },
            { name: "liveTraffic", label: "Live-пробки", type: "checkbox" },
            { name: "debugWeather", label: "Debug погоды", type: "checkbox" },
            { name: "trafficRegionId", label: "Yandex regionId", type: "text" },
            {
              name: "contentUrl",
              label: "URL контента для зоны C",
              type: "text",
              placeholder: "https://.../image.jpg или https://.../video.mp4"
            }
          ]
        }
      ],
      onPreview: function (settings) {
        applyEditorSettings(settings, false);
      },
      onSave: function (settings) {
        applyEditorSettings(settings, true);
      }
    });
  }

  function listenForCmsSettings() {
    window.addEventListener("message", function (event) {
      var data = event.data;

      if (typeof data !== "string" || data.indexOf("settings__") !== 0) {
        return;
      }

      try {
        data = JSON.parse(data.replace("settings__", ""));
        applyRemotePayload(data);
      } catch (error) {
        reportWeatherStatus("Settings message parse failed");
      }
    });
  }

  function boot() {
    value.params = getParams();
    document.body.classList.toggle("debug-weather", isDebugWeatherMode());
    applyLayout();
    applyTheme();
    applyContent();
    applyData();
    updateClock();
    initWidgetEditor();
    listenForCmsSettings();
    loadEndpoint();
    loadLiveWeather();
    loadLiveTraffic();
    window.setInterval(updateClock, 1000);
    window.setInterval(loadLiveWeather, Math.max(60, numberValue("weatherRequestInterval")) * 1000);
    window.setInterval(loadLiveTraffic, Math.max(60, numberValue("trafficRequestInterval")) * 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
