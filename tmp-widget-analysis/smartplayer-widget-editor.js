(function () {
  "use strict";

  function params() {
    var result = {};
    var query = window.location.search.replace(/^\?/, "");

    if (!query) {
      return result;
    }

    query.split("&").forEach(function (pair) {
      var parts = pair.split("=");
      var key = decodeURIComponent(parts[0] || "");
      var value = decodeURIComponent((parts[1] || "").replace(/\+/g, " "));

      if (key) {
        result[key] = value;
      }
    });

    return result;
  }

  function isEditorMode() {
    var queryParams = params();
    var search = window.location.search || "";

    return (
      search.indexOf("editWidget") !== -1 ||
      queryParams.edit === "true" ||
      queryParams.editor === "true" ||
      queryParams.settings === "true"
    );
  }

  function createElement(tag, className, text) {
    var element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function valueFor(settings, field) {
    var value = settings[field.name];

    if (value === undefined || value === null || value === "") {
      return field.defaultValue !== undefined ? field.defaultValue : "";
    }

    return value;
  }

  function normalizeFieldValue(input, field) {
    if (field.type === "checkbox") {
      return input.checked;
    }

    if (field.type === "number") {
      return Number(input.value);
    }

    return input.value;
  }

  function buildField(field, settings, onPreview) {
    var label = createElement("label", field.type === "checkbox" ? "editor-check" : "");
    var control;

    if (field.type === "select") {
      control = document.createElement("select");
      (field.options || []).forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        control.appendChild(optionElement);
      });
    } else {
      control = document.createElement("input");
      control.type = field.type === "checkbox" ? "checkbox" : field.type || "text";

      if (field.step) {
        control.step = field.step;
      }
    }

    control.setAttribute("data-editor-field", field.name);

    if (control.type === "checkbox") {
      control.checked = Boolean(valueFor(settings, field));
      label.appendChild(control);
      label.appendChild(document.createTextNode(field.label));
    } else {
      label.appendChild(document.createTextNode(field.label));
      control.value = valueFor(settings, field);
      label.appendChild(control);
    }

    control.addEventListener(
      control.tagName === "SELECT" || control.type === "checkbox" || control.type === "color" ? "change" : "input",
      function () {
        onPreview();
      }
    );

    return label;
  }

  function readSettings(panel, baseSettings, fields) {
    var settings = {};

    Object.keys(baseSettings || {}).forEach(function (key) {
      settings[key] = baseSettings[key];
    });

    fields.forEach(function (section) {
      section.fields.forEach(function (field) {
        var input = panel.querySelector('[data-editor-field="' + field.name + '"]');

        if (input) {
          settings[field.name] = normalizeFieldValue(input, field);
        }
      });
    });

    return settings;
  }

  function makePayload(data, settings) {
    var payload = {};

    Object.keys(data || {}).forEach(function (key) {
      payload[key] = data[key];
    });

    payload.settings = settings;

    return payload;
  }

  function postToCms(payload) {
    if (window.parent && window.parent !== window) {
      var serialized = JSON.stringify(payload);

      window.parent.postMessage(serialized, "*");
      window.parent.postMessage("settings__" + serialized, "*");
    }
  }

  function init(options) {
    if (!isEditorMode()) {
      return null;
    }

    var fields = options.fields || [];
    var data = options.getData ? options.getData() : {};
    var settings = data.settings || {};
    var root = document.querySelector(options.mount || ".screen") || document.body;
    var toggle = createElement("button", "editor-toggle", "⚙");
    var panel = createElement("aside", "editor-panel");
    var head = createElement("div", "editor-head");
    var title = createElement("strong", "", options.title || "Настройки виджета");
    var close = createElement("button", "", "×");
    var apply = createElement("button", "editor-apply", options.applyText || "Применить настройки");
    var note = createElement("p", "editor-note", options.note || "Настройки применяются в превью и отправляются в CMS через postMessage.");

    toggle.type = "button";
    toggle.setAttribute("aria-label", "Открыть настройки");
    close.type = "button";
    close.setAttribute("aria-label", "Закрыть");
    apply.type = "button";
    panel.setAttribute("aria-label", options.title || "Настройки виджета");

    head.appendChild(title);
    head.appendChild(close);
    panel.appendChild(head);

    fields.forEach(function (section) {
      if (section.name) {
        panel.appendChild(createElement("h2", "editor-section-title", section.name));
      }

      section.fields.forEach(function (field) {
        panel.appendChild(
          buildField(field, settings, function () {
            var nextSettings = readSettings(panel, settings, fields);
            var payload = makePayload(options.getData ? options.getData() : data, nextSettings);

            settings = nextSettings;

            if (options.onPreview) {
              options.onPreview(nextSettings, payload);
            }

            if (options.postOnPreview !== false) {
              postToCms(payload);
            }
          })
        );
      });
    });

    panel.appendChild(apply);
    panel.appendChild(note);
    root.appendChild(toggle);
    root.appendChild(panel);
    document.body.classList.add("editor-mode");

    toggle.onclick = function () {
      document.body.classList.add("editor-open");
    };

    close.onclick = function () {
      document.body.classList.remove("editor-open");
    };

    apply.onclick = function () {
      var nextSettings = readSettings(panel, settings, fields);
      var payload = makePayload(options.getData ? options.getData() : data, nextSettings);

      settings = nextSettings;

      if (options.onSave) {
        options.onSave(nextSettings, payload);
      }

      postToCms(payload);
    };

    return {
      panel: panel,
      toggle: toggle,
      save: function () {
        apply.click();
      }
    };
  }

  window.SmartPlayerWidgetEditor = {
    init: init,
    isEditorMode: isEditorMode
  };
})();
