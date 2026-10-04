// Embedded API console.
// Renders a read-only request line and a collapsible response panel into any
// element carrying data-api-console. Does nothing on pages without one.
//
//   <div data-api-console data-method="GET" data-endpoint="https://..."></div>

const API_CONSOLE_SELECTOR = "[data-api-console]";
const API_CONSOLE_TIMEOUT_MS = 10000;
const API_CONSOLE_COPIED_MS = 1500;

let apiConsoleCounter = 0;

function apiConsoleFormatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} kB`;
}

function apiConsoleEscape(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Token-colours a JSON string that we serialised ourselves, after escaping.
function apiConsoleHighlight(json) {
  return apiConsoleEscape(json).replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let type = "number";
      if (/^"/.test(match)) {
        type = /:$/.test(match) ? "key" : "string";
      } else if (/true|false/.test(match)) {
        type = "boolean";
      } else if (/null/.test(match)) {
        type = "null";
      }
      return `<span class="api-console-token" data-token="${type}">${match}</span>`;
    }
  );
}

// Renders each line of the payload as its own block element. Stacking the
// lines structurally keeps the response vertical no matter how the
// surrounding stylesheet treats whitespace inside <pre>.
function apiConsoleRenderBody(code, text) {
  code.textContent = "";
  text.split("\n").forEach((line) => {
    const row = document.createElement("div");
    row.className = "api-console-row";
    if (line === "") {
      row.innerHTML = "&nbsp;";
    } else {
      row.innerHTML = apiConsoleHighlight(line);
    }
    code.appendChild(row);
  });
}

function apiConsoleSetState(root, state) {
  root.dataset.state = state;
}

function apiConsoleSetNote(root, message) {
  const note = root.querySelector(".api-console-note");
  note.textContent = message || "";
  note.hidden = !message;
}

function apiConsoleShowResponse(root, { status, statusText, ms, body, ok }) {
  const response = root.querySelector(".api-console-response");
  const badge = root.querySelector(".api-console-badge");
  const meta = root.querySelector(".api-console-meta");
  const code = root.querySelector(".api-console-response .api-console-code");

  badge.textContent = statusText ? `${status} ${statusText}` : String(status);
  const expected = root.dataset.expect && Number(root.dataset.expect) === status;
  badge.dataset.ok = expected ? "expected" : ok ? "true" : "false";
  meta.textContent = `${Math.round(ms)} ms · ${apiConsoleFormatBytes(
    new Blob([body]).size
  )}`;
  apiConsoleRenderBody(code, body);
  code.dataset.raw = body;

  response.hidden = false;
  apiConsoleExpand(root, true);
}

function apiConsoleExpand(root, expand) {
  const toggle = root.querySelector(".api-console-toggle");
  const body = root.querySelector(".api-console-response .api-console-body");
  toggle.setAttribute("aria-expanded", String(expand));
  body.hidden = !expand;
}

async function apiConsoleSend(root) {
  const endpoint = root.dataset.endpoint;
  const method = (root.dataset.method || "GET").toUpperCase();
  const send = root.querySelector(".api-console-send");
  const response = root.querySelector(".api-console-response");

  send.disabled = true;
  send.setAttribute("aria-busy", "true");
  send.textContent = "Sending";
  apiConsoleSetState(root, "loading");
  apiConsoleSetNote(root, "");
  response.hidden = true;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_CONSOLE_TIMEOUT_MS);
  const started = performance.now();

  try {
    const requestBody = root.dataset.body;
    const res = await fetch(endpoint, {
      method,
      headers: requestBody
        ? { Accept: "application/json", "Content-Type": "application/json" }
        : { Accept: "application/json" },
      body: requestBody || undefined,
      signal: controller.signal,
    });
    const text = await res.text();
    let body = text;
    try {
      body = JSON.stringify(JSON.parse(text), null, 2);
    } catch (_) {
      // Not JSON. Show it as it came back.
    }
    apiConsoleShowResponse(root, {
      status: res.status,
      statusText: res.statusText,
      ms: performance.now() - started,
      body,
      ok: res.ok,
    });
    apiConsoleSetState(root, res.ok ? "success" : "error");
  } catch (error) {
    apiConsoleSetState(root, "error");
    apiConsoleSetNote(
      root,
      error.name === "AbortError"
        ? "The request timed out after 10 seconds. Run the command above instead."
        : "The request could not be made from this page. Your browser may have blocked it. Run the command above instead."
    );
  } finally {
    clearTimeout(timer);
    send.disabled = false;
    send.removeAttribute("aria-busy");
    send.textContent = "Send again";
  }
}

async function apiConsoleCopy(root, button) {
  const code = root.querySelector(".api-console-response .api-console-code");
  try {
    await navigator.clipboard.writeText(code.dataset.raw || code.textContent);
    const previous = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = previous;
    }, API_CONSOLE_COPIED_MS);
  } catch (_) {
    button.textContent = "Press Ctrl+C";
  }
}

function buildApiConsole(root) {
  const endpoint = root.dataset.endpoint;
  if (!endpoint) return;
  // Building twice would wipe a console that has already answered, so only
  // ever do it once per element.
  if (root.dataset.ready === "true") return;
  root.dataset.ready = "true";

  const method = (root.dataset.method || "GET").toUpperCase();
  const bodyId = `api-console-body-${++apiConsoleCounter}`;

  root.classList.add("api-console");
  root.dataset.state = "idle";
  root.setAttribute("role", "region");
  root.setAttribute("aria-label", `${method} ${endpoint}`);

  root.innerHTML = `
    <div class="api-console-request">
      <span class="api-console-method">${apiConsoleEscape(method)}</span>
      <code class="api-console-url">${apiConsoleEscape(endpoint)}</code>
      <button type="button" class="api-console-send">Send</button>
    </div>
    <div class="api-console-request-body" hidden>
      <p class="api-console-label">Request body</p>
      <pre class="api-console-body"><code class="api-console-code"></code></pre>
    </div>
    <p class="api-console-note" hidden></p>
    <section class="api-console-response" hidden>
      <div class="api-console-response-header">
        <button type="button" class="api-console-toggle" aria-expanded="true"
                aria-controls="${bodyId}">
          <span class="api-console-chevron" aria-hidden="true"></span>
          Response
        </button>
        <span class="api-console-badge"></span>
        <span class="api-console-meta"></span>
        <button type="button" class="api-console-copy">Copy</button>
      </div>
      <pre class="api-console-body" id="${bodyId}"><code class="api-console-code"></code></pre>
    </section>
  `;

  if (root.dataset.body) {
    const requestPanel = root.querySelector(".api-console-request-body");
    const requestCode = requestPanel.querySelector("code");
    let pretty = root.dataset.body;
    try {
      pretty = JSON.stringify(JSON.parse(root.dataset.body), null, 2);
    } catch (_) {
      // Leave it as authored.
    }
    apiConsoleRenderBody(requestCode, pretty);
    requestPanel.hidden = false;
  }

  root.querySelector(".api-console-send")
    .addEventListener("click", () => apiConsoleSend(root));
  root.querySelector(".api-console-toggle").addEventListener("click", (event) => {
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    apiConsoleExpand(root, !expanded);
  });
  root.querySelector(".api-console-copy")
    .addEventListener("click", (event) => apiConsoleCopy(root, event.currentTarget));
}

function setupApiConsoles() {
  document.querySelectorAll(API_CONSOLE_SELECTOR).forEach(buildApiConsole);
}

document.addEventListener("DOMContentLoaded", setupApiConsoles);
