export interface ChromeManifest {
  manifest_version: number;
  name: string;
  version: string;
  description?: string;
  permissions?: string[];
  host_permissions?: string[];
  content_scripts?: ChromeContentScript[];
  background?: {
    scripts?: string[];
    service_worker?: string;
    persistent?: boolean;
  };
  browser_action?: {
    default_popup?: string;
    default_icon?: string | Record<string, string>;
    default_title?: string;
  };
  action?: {
    default_popup?: string;
    default_icon?: string | Record<string, string>;
    default_title?: string;
  };
  icons?: Record<string, string>;
  web_accessible_resources?: (string | { resources: string[]; matches: string[] })[];
  content_security_policy?: string | { extension_pages?: string };
  options_page?: string;
  options_ui?: { page?: string };
  homepage_url?: string;
  author?: string;
}

export interface ChromeContentScript {
  matches: string[];
  exclude_matches?: string[];
  js?: string[];
  css?: string[];
  run_at?: "document_start" | "document_end" | "document_idle";
  all_frames?: boolean;
  match_about_blank?: boolean;
}

export interface ParsedExtensionFile {
  path: string;
  content: string;
  type: "js" | "css" | "json" | "html" | "other";
  size: number;
}

export interface ParsedChromeExtension {
  manifest: ChromeManifest;
  contentScripts: {
    matches: string[];
    excludeMatches: string[];
    js: string;
    css: string;
    runAt: string;
    allFrames: boolean;
    jsFiles: string[];
    cssFiles: string[];
  }[];
  backgroundScript: string;
  files: ParsedExtensionFile[];
  totalFiles: number;
  totalSize: number;
  hasPopup: boolean;
  popupHtml: string;
  iconUrl: string;
}

export function matchPatternToRegex(pattern: string): RegExp | null {
  try {
    if (pattern === "<all_urls>") {
      return /^https?:\/\/.*/;
    }

    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\\\*/g, ".*");

    const schemeEnd = escaped.indexOf(":\\/\\/");
    if (schemeEnd === -1) return null;

    let scheme = escaped.substring(0, schemeEnd);
    const rest = escaped.substring(schemeEnd + 6);

    if (scheme === "\\*") {
      scheme = "https?";
    }

    const slashIdx = rest.indexOf("/");
    let host: string;
    let path: string;
    if (slashIdx === -1) {
      host = rest;
      path = ".*";
    } else {
      host = rest.substring(0, slashIdx);
      path = rest.substring(slashIdx);
    }

    if (host === "\\*") {
      host = "[^/]*";
    } else if (host.startsWith("\\.\\*\\.")) {
      host = "([^/]*\\.)?" + host.substring(6);
    } else if (host.startsWith("\\*\\.")) {
      host = "([^/]*\\.)?" + host.substring(4);
    }

    const regexStr = "^" + scheme + "://" + host + path + "$";
    return new RegExp(regexStr, "i");
  } catch (e) {
    console.log("[ExtParser] Failed to parse match pattern:", pattern, e);
    return null;
  }
}

export function urlMatchesPatterns(url: string, patterns: string[]): boolean {
  if (!patterns || patterns.length === 0) return true;
  for (const pattern of patterns) {
    const regex = matchPatternToRegex(pattern);
    if (regex && regex.test(url)) return true;
  }
  return false;
}

export function generateChromeAPIMock(): string {
  return `
(function() {
  if (window.chrome && window.chrome.__lordeen_mocked) return;

  var storage = {};
  try {
    var stored = localStorage.getItem('__lordeen_ext_storage');
    if (stored) storage = JSON.parse(stored);
  } catch(e) {}

  function saveStorage() {
    try { localStorage.setItem('__lordeen_ext_storage', JSON.stringify(storage)); } catch(e) {}
  }

  var listeners = {};
  function createEvent() {
    var cbs = [];
    return {
      addListener: function(cb) { cbs.push(cb); },
      removeListener: function(cb) { cbs = cbs.filter(function(c) { return c !== cb; }); },
      hasListener: function(cb) { return cbs.indexOf(cb) !== -1; },
      _fire: function() { var args = arguments; cbs.forEach(function(cb) { try { cb.apply(null, args); } catch(e) {} }); }
    };
  }

  var mockChrome = {
    __lordeen_mocked: true,
    runtime: {
      id: 'lordeen_ext_' + Math.random().toString(36).slice(2, 10),
      getManifest: function() { return {}; },
      getURL: function(path) { return 'chrome-extension://lordeen/' + path; },
      sendMessage: function(msg, cb) { if (cb) setTimeout(function() { cb({}); }, 0); },
      onMessage: createEvent(),
      onInstalled: createEvent(),
      onStartup: createEvent(),
      lastError: null,
      connect: function() {
        return {
          postMessage: function() {},
          onMessage: createEvent(),
          onDisconnect: createEvent(),
          disconnect: function() {}
        };
      }
    },
    storage: {
      local: {
        get: function(keys, cb) {
          var result = {};
          if (typeof keys === 'string') {
            if (storage[keys] !== undefined) result[keys] = storage[keys];
          } else if (Array.isArray(keys)) {
            keys.forEach(function(k) { if (storage[k] !== undefined) result[k] = storage[k]; });
          } else if (keys === null || keys === undefined) {
            result = Object.assign({}, storage);
          } else {
            Object.keys(keys).forEach(function(k) {
              result[k] = storage[k] !== undefined ? storage[k] : keys[k];
            });
          }
          if (cb) setTimeout(function() { cb(result); }, 0);
          return Promise.resolve(result);
        },
        set: function(items, cb) {
          Object.assign(storage, items);
          saveStorage();
          if (cb) setTimeout(cb, 0);
          return Promise.resolve();
        },
        remove: function(keys, cb) {
          if (typeof keys === 'string') keys = [keys];
          keys.forEach(function(k) { delete storage[k]; });
          saveStorage();
          if (cb) setTimeout(cb, 0);
          return Promise.resolve();
        },
        clear: function(cb) {
          storage = {};
          saveStorage();
          if (cb) setTimeout(cb, 0);
          return Promise.resolve();
        }
      },
      sync: null,
      onChanged: createEvent()
    },
    tabs: {
      query: function(q, cb) { if (cb) setTimeout(function() { cb([{ id: 1, url: window.location.href, active: true }]); }, 0); return Promise.resolve([{ id: 1, url: window.location.href, active: true }]); },
      sendMessage: function(tabId, msg, cb) { if (cb) setTimeout(function() { cb({}); }, 0); },
      create: function(opts) { if (opts && opts.url) window.open(opts.url, '_blank'); },
      update: function(tabId, opts) { if (opts && opts.url) window.location.href = opts.url; },
      onUpdated: createEvent(),
      onActivated: createEvent(),
      onRemoved: createEvent()
    },
    webRequest: {
      onBeforeRequest: createEvent(),
      onBeforeSendHeaders: createEvent(),
      onHeadersReceived: createEvent(),
      onCompleted: createEvent()
    },
    i18n: {
      getMessage: function(key) { return key; },
      getUILanguage: function() { return navigator.language || 'en'; }
    },
    extension: {
      getURL: function(path) { return 'chrome-extension://lordeen/' + path; },
      isAllowedIncognitoAccess: function(cb) { if (cb) cb(true); }
    },
    permissions: {
      contains: function(perms, cb) { if (cb) cb(true); return Promise.resolve(true); },
      request: function(perms, cb) { if (cb) cb(true); return Promise.resolve(true); }
    },
    contextMenus: {
      create: function() {},
      update: function() {},
      remove: function() {},
      removeAll: function(cb) { if (cb) cb(); }
    },
    alarms: {
      create: function() {},
      get: function(name, cb) { if (cb) cb(null); },
      getAll: function(cb) { if (cb) cb([]); },
      clear: function(name, cb) { if (cb) cb(true); },
      clearAll: function(cb) { if (cb) cb(true); },
      onAlarm: createEvent()
    },
    notifications: {
      create: function(id, opts, cb) { if (cb) cb(id || 'notif_' + Date.now()); },
      clear: function(id, cb) { if (cb) cb(true); },
      onClicked: createEvent(),
      onClosed: createEvent()
    },
    browserAction: {
      setIcon: function() {},
      setBadgeText: function() {},
      setBadgeBackgroundColor: function() {},
      setTitle: function() {},
      onClicked: createEvent()
    },
    action: {
      setIcon: function() {},
      setBadgeText: function() {},
      setBadgeBackgroundColor: function() {},
      setTitle: function() {},
      onClicked: createEvent()
    },
    commands: {
      onCommand: createEvent()
    },
    declarativeNetRequest: {
      updateDynamicRules: function(opts, cb) { if (cb) cb(); return Promise.resolve(); },
      getDynamicRules: function(cb) { if (cb) cb([]); return Promise.resolve([]); }
    }
  };

  mockChrome.storage.sync = mockChrome.storage.local;

  if (!window.chrome) window.chrome = {};
  Object.keys(mockChrome).forEach(function(key) {
    window.chrome[key] = mockChrome[key];
  });
  if (!window.browser) window.browser = window.chrome;

  console.log('[LordEEN] Chrome API mock injected');
})();
`;
}

export function buildContentScriptInjector(
  jsCode: string,
  cssCode: string,
  runAt: string,
  extensionName: string
): string {
  const escapedCss = cssCode
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");

  let script = "";

  if (cssCode.trim()) {
    script += `
(function() {
  var style = document.createElement('style');
  style.id = '__lordeen_ext_css_${extensionName.replace(/[^a-zA-Z0-9]/g, "_")}';
  style.textContent = '${escapedCss}';
  (document.head || document.documentElement).appendChild(style);
  console.log('[LordEEN] Injected CSS for: ${extensionName}');
})();
`;
  }

  if (jsCode.trim()) {
    script += `
(function() {
  try {
    ${jsCode}
    console.log('[LordEEN] Executed JS for: ${extensionName}');
  } catch(e) {
    console.error('[LordEEN] Extension error (${extensionName}):', e.message);
  }
})();
`;
  }

  return script;
}

export function getFileType(path: string): "js" | "css" | "json" | "html" | "other" {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  if (ext === "js" || ext === "mjs" || ext === "jsx" || ext === "ts") return "js";
  if (ext === "css") return "css";
  if (ext === "json") return "json";
  if (ext === "html" || ext === "htm") return "html";
  return "other";
}

export async function parseZipExtension(
  zip: any,
  fileName: string
): Promise<ParsedChromeExtension | null> {
  let manifest: ChromeManifest | null = null;
  let manifestPath = "";

  const allPaths: string[] = [];
  zip.forEach((relativePath: string, file: any) => {
    if (!file.dir) {
      allPaths.push(relativePath);
    }
  });

  const manifestCandidates = allPaths.filter(
    (p) => p.endsWith("manifest.json") && !p.includes("node_modules")
  );

  manifestCandidates.sort((a, b) => a.split("/").length - b.split("/").length);

  for (const candidate of manifestCandidates) {
    try {
      const file = zip.file(candidate);
      if (file) {
        const text = await file.async("string");
        const parsed = JSON.parse(text);
        if (parsed.name && (parsed.manifest_version || parsed.version)) {
          manifest = parsed as ChromeManifest;
          manifestPath = candidate.includes("/")
            ? candidate.substring(0, candidate.lastIndexOf("/") + 1)
            : "";
          console.log("[ExtParser] Found manifest at:", candidate, "base:", manifestPath);
          break;
        }
      }
    } catch (e) {
      console.log("[ExtParser] Failed to parse manifest candidate:", candidate, e);
    }
  }

  if (!manifest) {
    console.log("[ExtParser] No valid manifest.json found, falling back to JS-only mode");
    return buildFallbackExtension(zip, fileName, allPaths);
  }

  const resolvePath = (p: string) => manifestPath + p;

  const readFile = async (path: string): Promise<string> => {
    const resolved = resolvePath(path);
    const file = zip.file(resolved);
    if (file) return await file.async("string");
    const direct = zip.file(path);
    if (direct) return await direct.async("string");
    return "";
  };

  const contentScripts: ParsedChromeExtension["contentScripts"] = [];

  if (manifest.content_scripts) {
    for (const cs of manifest.content_scripts) {
      let jsCode = "";
      let cssCode = "";
      const jsFiles: string[] = [];
      const cssFiles: string[] = [];

      if (cs.js) {
        for (const jsPath of cs.js) {
          const code = await readFile(jsPath);
          if (code) {
            jsCode += "\n// === " + jsPath + " ===\n" + code + "\n";
            jsFiles.push(jsPath);
          }
        }
      }

      if (cs.css) {
        for (const cssPath of cs.css) {
          const code = await readFile(cssPath);
          if (code) {
            cssCode += "\n/* === " + cssPath + " === */\n" + code + "\n";
            cssFiles.push(cssPath);
          }
        }
      }

      contentScripts.push({
        matches: cs.matches || ["<all_urls>"],
        excludeMatches: cs.exclude_matches || [],
        js: jsCode,
        css: cssCode,
        runAt: cs.run_at || "document_idle",
        allFrames: cs.all_frames || false,
        jsFiles,
        cssFiles,
      });
    }
  }

  let backgroundScript = "";
  if (manifest.background) {
    if (manifest.background.scripts) {
      for (const bgPath of manifest.background.scripts) {
        const code = await readFile(bgPath);
        if (code) backgroundScript += "\n// === " + bgPath + " ===\n" + code + "\n";
      }
    }
    if (manifest.background.service_worker) {
      const code = await readFile(manifest.background.service_worker);
      if (code) backgroundScript += "\n// === " + manifest.background.service_worker + " ===\n" + code + "\n";
    }
  }

  let hasPopup = false;
  let popupHtml = "";
  const popupPath =
    manifest.browser_action?.default_popup ||
    manifest.action?.default_popup;
  if (popupPath) {
    popupHtml = await readFile(popupPath);
    hasPopup = !!popupHtml;
  }

  const files: ParsedExtensionFile[] = [];
  let totalSize = 0;

  for (const path of allPaths) {
    if (!path.startsWith(manifestPath) && manifestPath) continue;
    const relativePath = manifestPath ? path.substring(manifestPath.length) : path;
    try {
      const file = zip.file(path);
      if (file) {
        const fileType = getFileType(relativePath);
        if (fileType !== "other") {
          const content = await file.async("string");
          files.push({
            path: relativePath,
            content,
            type: fileType,
            size: content.length,
          });
          totalSize += content.length;
        } else {
          const data = await file.async("uint8array");
          files.push({
            path: relativePath,
            content: "",
            type: "other",
            size: data.length,
          });
          totalSize += data.length;
        }
      }
    } catch {
      console.log("[ExtParser] Could not read file:", path);
    }
  }

  let iconUrl = "";
  if (manifest.icons) {
    const sizes = Object.keys(manifest.icons).sort((a, b) => Number(b) - Number(a));
    if (sizes.length > 0) {
      iconUrl = manifest.icons[sizes[0]];
    }
  }

  console.log(
    "[ExtParser] Parsed extension:",
    manifest.name,
    "v" + manifest.version,
    "| Content scripts:", contentScripts.length,
    "| Files:", files.length,
    "| Background:", !!backgroundScript
  );

  return {
    manifest,
    contentScripts,
    backgroundScript,
    files,
    totalFiles: allPaths.length,
    totalSize,
    hasPopup,
    popupHtml,
    iconUrl,
  };
}

async function buildFallbackExtension(
  zip: any,
  fileName: string,
  allPaths: string[]
): Promise<ParsedChromeExtension> {
  let combinedJs = "";
  let combinedCss = "";
  const files: ParsedExtensionFile[] = [];
  let totalSize = 0;
  const jsFiles: string[] = [];
  const cssFiles: string[] = [];

  for (const path of allPaths) {
    const fileType = getFileType(path);
    try {
      const file = zip.file(path);
      if (!file) continue;

      if (fileType === "js") {
        const content = await file.async("string");
        combinedJs += "\n// === " + path + " ===\n" + content + "\n";
        jsFiles.push(path);
        files.push({ path, content, type: "js", size: content.length });
        totalSize += content.length;
      } else if (fileType === "css") {
        const content = await file.async("string");
        combinedCss += "\n/* === " + path + " === */\n" + content + "\n";
        cssFiles.push(path);
        files.push({ path, content, type: "css", size: content.length });
        totalSize += content.length;
      } else if (fileType !== "other") {
        const content = await file.async("string");
        files.push({ path, content, type: fileType, size: content.length });
        totalSize += content.length;
      }
    } catch {
      console.log("[ExtParser] Error reading:", path);
    }
  }

  const extName = fileName.replace(/\.zip$/i, "");

  return {
    manifest: {
      manifest_version: 2,
      name: extName,
      version: "1.0.0",
      description: "Imported from ZIP (no manifest.json found)",
    },
    contentScripts: combinedJs || combinedCss
      ? [
          {
            matches: ["<all_urls>"],
            excludeMatches: [],
            js: combinedJs,
            css: combinedCss,
            runAt: "document_idle",
            allFrames: false,
            jsFiles,
            cssFiles,
          },
        ]
      : [],
    backgroundScript: "",
    files,
    totalFiles: allPaths.length,
    totalSize,
    hasPopup: false,
    popupHtml: "",
    iconUrl: "",
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
