export interface ExtensionItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "tool" | "shield";
  defaultEnabled: boolean;
}

export const EXTENSIONS: ExtensionItem[] = [
  {
    id: "adblock",
    name: "Ad Blocker",
    description: "Block ads and pop-ups",
    icon: "ShieldOff",
    category: "tool",
    defaultEnabled: true,
  },
  {
    id: "darkmode",
    name: "Dark Mode",
    description: "Force dark CSS on sites",
    icon: "Moon",
    category: "tool",
    defaultEnabled: false,
  },
  {
    id: "scriptblock",
    name: "Script Blocker",
    description: "Block JavaScript execution",
    icon: "FileCode",
    category: "tool",
    defaultEnabled: false,
  },
  {
    id: "imageblock",
    name: "Image Blocker",
    description: "Load pages faster",
    icon: "ImageOff",
    category: "tool",
    defaultEnabled: false,
  },
  {
    id: "fingerprint",
    name: "Fingerprint Shield",
    description: "Spoof browser fingerprint",
    icon: "Fingerprint",
    category: "shield",
    defaultEnabled: true,
  },
  {
    id: "cookies",
    name: "Cookie Blocker",
    description: "Block third-party cookies",
    icon: "Cookie",
    category: "shield",
    defaultEnabled: true,
  },
  {
    id: "trackers",
    name: "Tracker Blocker",
    description: "Block known trackers",
    icon: "Eye",
    category: "shield",
    defaultEnabled: true,
  },
  {
    id: "webrtc",
    name: "WebRTC Protection",
    description: "Prevent IP leaks via WebRTC",
    icon: "Wifi",
    category: "shield",
    defaultEnabled: false,
  },
  {
    id: "useragent",
    name: "User Agent Spoofer",
    description: "Mask your browser identity",
    icon: "User",
    category: "shield",
    defaultEnabled: false,
  },
];

export const USER_AGENTS: Record<string, string> = {
  default: "",
  chrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  safari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  firefox:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  edge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
};

export const SEARCH_ENGINES: Record<string, string> = {
  google: "https://www.google.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  bing: "https://www.bing.com/search?q=",
};

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export const QUICK_LINKS: QuickLink[] = [
  { id: "google", name: "Google", url: "https://www.google.com", icon: "Search", color: "#4285F4" },
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com", icon: "Play", color: "#FF0000" },
  { id: "github", name: "GitHub", url: "https://github.com", icon: "Github", color: "#FFFFFF" },
  { id: "reddit", name: "Reddit", url: "https://www.reddit.com", icon: "MessageCircle", color: "#FF4500" },
  { id: "twitter", name: "X", url: "https://x.com", icon: "Twitter", color: "#1DA1F2" },
  { id: "wiki", name: "Wikipedia", url: "https://www.wikipedia.org", icon: "BookOpen", color: "#CCCCCC" },
  { id: "ddg", name: "DuckDuckGo", url: "https://duckduckgo.com", icon: "Shield", color: "#DE5833" },
  { id: "stackoverflow", name: "Stack OF", url: "https://stackoverflow.com", icon: "Code", color: "#F48024" },
];

export const AD_BLOCK_SCRIPT = `
(function() {
  if (window.__lordeen_adblock) return;
  window.__lordeen_adblock = true;
  var captchaKeywords = ['recaptcha','hcaptcha','captcha','turnstile','challenge','arkose','funcaptcha','g-recaptcha','cf-turnstile','h-captcha'];
  function isCaptchaRelated(el) {
    try {
      if (!el || !el.getAttribute) return false;
      var id = (el.id || '').toLowerCase();
      var cls = (el.className && typeof el.className === 'string') ? el.className.toLowerCase() : '';
      var src = '';
      if (el.tagName === 'IFRAME' || el.tagName === 'SCRIPT') { src = (el.src || el.getAttribute('src') || '').toLowerCase(); }
      var dataSitekey = el.getAttribute('data-sitekey') || '';
      if (dataSitekey) return true;
      for (var i = 0; i < captchaKeywords.length; i++) {
        var kw = captchaKeywords[i];
        if (id.indexOf(kw) !== -1 || cls.indexOf(kw) !== -1 || src.indexOf(kw) !== -1) return true;
      }
      var parent = el.parentElement;
      for (var p = 0; p < 3 && parent; p++) {
        var pid = (parent.id || '').toLowerCase();
        var pcls = (parent.className && typeof parent.className === 'string') ? parent.className.toLowerCase() : '';
        for (var k = 0; k < captchaKeywords.length; k++) {
          if (pid.indexOf(captchaKeywords[k]) !== -1 || pcls.indexOf(captchaKeywords[k]) !== -1) return true;
        }
        parent = parent.parentElement;
      }
    } catch(e) {}
    return false;
  }
  var selectors = [
    'iframe[src*="doubleclick"]', 'iframe[src*="googlesyndication"]',
    '.adsbygoogle', 'ins.adsbygoogle',
    '[data-google-query-id]', '[data-ad-slot]',
    '[id^="google_ads"]', '[id^="div-gpt-ad"]',
    '[class*="sponsored"]', '[id*="sponsored"]'
  ];
  var style = document.createElement('style');
  style.id = '__lordeen_adblock_style';
  style.textContent = selectors.join(',') + ' { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; }';
  (document.head || document.documentElement).appendChild(style);
  function cleanAds() {
    selectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) { if (!isCaptchaRelated(el)) el.remove(); });
      } catch(e) {}
    });
  }
  if (document.body) cleanAds();
  window.__lordeen_adblock_observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        if (isCaptchaRelated(node)) return;
        selectors.forEach(function(sel) {
          try {
            if (node.matches && node.matches(sel)) node.remove();
            if (node.querySelectorAll) node.querySelectorAll(sel).forEach(function(el) { if (!isCaptchaRelated(el)) el.remove(); });
          } catch(e) {}
        });
      });
    });
  });
  var target = document.body || document.documentElement;
  if (target) window.__lordeen_adblock_observer.observe(target, { childList: true, subtree: true });
})();
true;
`;

export const AD_BLOCK_UNDO = `
(function() {
  window.__lordeen_adblock = false;
  if (window.__lordeen_adblock_observer) { window.__lordeen_adblock_observer.disconnect(); window.__lordeen_adblock_observer = null; }
  var s = document.getElementById('__lordeen_adblock_style');
  if (s) s.remove();
})();
true;
`;

export const DARK_MODE_SCRIPT = `
(function() {
  if (document.getElementById('__lordeen_darkmode')) return;
  var style = document.createElement('style');
  style.id = '__lordeen_darkmode';
  style.textContent = 'html, body, div, section, article, main, aside, nav, header, footer, form, table, tr, td, th, li, ul, ol, p, span, h1, h2, h3, h4, h5, h6, input, textarea, select, button { background-color: #1a1a1a !important; color: #e0e0e0 !important; border-color: #333 !important; } img { filter: brightness(0.85) contrast(1.1); } a, a * { color: #00E5CC !important; } input, textarea, select { background-color: #222 !important; color: #e0e0e0 !important; }';
  document.head.appendChild(style);
})();
true;
`;

export const DARK_MODE_UNDO = `
(function() {
  var s = document.getElementById('__lordeen_darkmode');
  if (s) s.remove();
})();
true;
`;

export const SCRIPT_BLOCK_SCRIPT = `
(function() {
  if (window.__lordeen_scriptblock) return;
  window.__lordeen_scriptblock = true;
  document.querySelectorAll('script:not([type="application/ld+json"])').forEach(function(s) { s.remove(); });
  window.__lordeen_scriptblock_observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.tagName === 'SCRIPT') node.remove();
      });
    });
  });
  window.__lordeen_scriptblock_observer.observe(document.documentElement, { childList: true, subtree: true });
})();
true;
`;

export const SCRIPT_BLOCK_UNDO = `
(function() {
  window.__lordeen_scriptblock = false;
  if (window.__lordeen_scriptblock_observer) { window.__lordeen_scriptblock_observer.disconnect(); window.__lordeen_scriptblock_observer = null; }
})();
true;
`;

export const IMAGE_BLOCK_SCRIPT = `
(function() {
  if (document.getElementById('__lordeen_imgblock')) return;
  var style = document.createElement('style');
  style.id = '__lordeen_imgblock';
  style.textContent = 'img, picture, video, svg, [style*="background-image"] { display: none !important; visibility: hidden !important; } * { background-image: none !important; }';
  document.head.appendChild(style);
  document.querySelectorAll('img, picture, video, svg').forEach(function(el) { el.style.display = 'none'; });
})();
true;
`;

export const IMAGE_BLOCK_UNDO = `
(function() {
  var s = document.getElementById('__lordeen_imgblock');
  if (s) s.remove();
  document.querySelectorAll('img, picture, video, svg').forEach(function(el) { el.style.display = ''; });
})();
true;
`;

export const TRACKER_BLOCK_SCRIPT = `
(function() {
  if (window.__lordeen_trackerblock) return;
  window.__lordeen_trackerblock = true;
  var trackerDomains = ['google-analytics.com','googletagmanager.com','facebook.net','connect.facebook.net','hotjar.com','mixpanel.com','segment.io','amplitude.com','heapanalytics.com','fullstory.com','mouseflow.com','crazyegg.com','optimizely.com','newrelic.com','appsflyer.com','adjust.com','branch.io','moengage.com','clevertap.com','onesignal.com'];
  var safeList = ['recaptcha','gstatic.com/recaptcha','hcaptcha.com','challenges.cloudflare.com','turnstile','arkoselabs.com','funcaptcha.com','captcha','google.com/recaptcha','www.google.com/recaptcha','www.gstatic.com'];
  function isSafe(u) {
    if (!u) return false;
    for (var c = 0; c < safeList.length; c++) {
      if (u.indexOf(safeList[c]) !== -1) return true;
    }
    return false;
  }
  function isTracker(u) {
    if (!u || isSafe(u)) return false;
    for (var i = 0; i < trackerDomains.length; i++) {
      if (u.indexOf(trackerDomains[i]) !== -1) return true;
    }
    return false;
  }
  var origFetch = window.fetch;
  window.fetch = function(url) {
    var u = typeof url === 'string' ? url : (url && url.url ? url.url : '');
    if (isTracker(u)) { return Promise.resolve(new Response('', { status: 200 })); }
    return origFetch.apply(this, arguments);
  };
  window.__lordeen_origFetch = origFetch;
  var origXHR = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (isTracker(url)) { this.__lordeen_blocked = true; return; }
    return origXHR.apply(this, arguments);
  };
  window.__lordeen_origXHR = origXHR;
  var origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    if (this.__lordeen_blocked) return;
    return origSend.apply(this, arguments);
  };
  window.__lordeen_origSend = origSend;
  document.querySelectorAll('script[src]').forEach(function(s) {
    if (isTracker(s.src)) s.remove();
  });
})();
true;
`;

export const TRACKER_BLOCK_UNDO = `
(function() {
  window.__lordeen_trackerblock = false;
  if (window.__lordeen_origFetch) window.fetch = window.__lordeen_origFetch;
  if (window.__lordeen_origXHR) XMLHttpRequest.prototype.open = window.__lordeen_origXHR;
  if (window.__lordeen_origSend) XMLHttpRequest.prototype.send = window.__lordeen_origSend;
})();
true;
`;

export const WEBRTC_PROTECT_SCRIPT = `
(function() {
  if (window.__lordeen_webrtc) return;
  window.__lordeen_webrtc = true;
  var origRTC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  if (origRTC) {
    window.__lordeen_origRTC = origRTC;
    var FakeRTC = function() { return { close: function(){}, createDataChannel: function(){ return {}; }, createOffer: function(){ return Promise.resolve({}); }, setLocalDescription: function(){ return Promise.resolve(); }, addEventListener: function(){}, removeEventListener: function(){} }; };
    window.RTCPeerConnection = FakeRTC;
    if (window.webkitRTCPeerConnection) window.webkitRTCPeerConnection = FakeRTC;
    if (window.mozRTCPeerConnection) window.mozRTCPeerConnection = FakeRTC;
  }
})();
true;
`;

export const WEBRTC_PROTECT_UNDO = `
(function() {
  window.__lordeen_webrtc = false;
  if (window.__lordeen_origRTC) {
    window.RTCPeerConnection = window.__lordeen_origRTC;
    if (window.webkitRTCPeerConnection) window.webkitRTCPeerConnection = window.__lordeen_origRTC;
    if (window.mozRTCPeerConnection) window.mozRTCPeerConnection = window.__lordeen_origRTC;
  }
})();
true;
`;

export const COOKIE_BLOCK_SCRIPT = `
(function() {
  if (window.__lordeen_cookieblock) return;
  window.__lordeen_cookieblock = true;
  var safeList = ['recaptcha','gstatic.com','hcaptcha.com','challenges.cloudflare.com','turnstile','arkoselabs','funcaptcha','captcha','google.com/recaptcha'];
  function isSafeCookie(name) {
    if (!name) return false;
    var n = name.toLowerCase();
    for (var i = 0; i < safeList.length; i++) {
      if (n.indexOf(safeList[i]) !== -1) return true;
    }
    return false;
  }
  var origDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
  if (origDescriptor && origDescriptor.set) {
    window.__lordeen_origCookieSetter = origDescriptor.set;
    window.__lordeen_origCookieGetter = origDescriptor.get;
    Object.defineProperty(document, 'cookie', {
      get: function() { return window.__lordeen_origCookieGetter.call(this); },
      set: function(val) {
        var parts = val.split(';');
        var cookieName = (parts[0] || '').split('=')[0].trim();
        var domain = '';
        for (var i = 1; i < parts.length; i++) {
          var p = parts[i].trim().toLowerCase();
          if (p.indexOf('domain=') === 0) { domain = p.substring(7); break; }
        }
        var host = window.location.hostname || '';
        if (domain && domain !== host && domain !== '.' + host && host.indexOf(domain.replace(/^[.]/, '')) === -1) {
          if (!isSafeCookie(domain)) {
            console.log('[LordEEN] Blocked 3rd party cookie:', cookieName, 'domain:', domain);
            return;
          }
        }
        return window.__lordeen_origCookieSetter.call(this, val);
      },
      configurable: true
    });
  }
})();
true;
`;

export const COOKIE_BLOCK_UNDO = `
(function() {
  window.__lordeen_cookieblock = false;
  if (window.__lordeen_origCookieSetter && window.__lordeen_origCookieGetter) {
    Object.defineProperty(document, 'cookie', {
      get: window.__lordeen_origCookieGetter,
      set: window.__lordeen_origCookieSetter,
      configurable: true
    });
  }
})();
true;
`;

export const EXTENSION_SCRIPTS: Record<string, { enable: string; disable: string }> = {
  adblock: { enable: AD_BLOCK_SCRIPT, disable: AD_BLOCK_UNDO },
  darkmode: { enable: DARK_MODE_SCRIPT, disable: DARK_MODE_UNDO },
  scriptblock: { enable: SCRIPT_BLOCK_SCRIPT, disable: SCRIPT_BLOCK_UNDO },
  imageblock: { enable: IMAGE_BLOCK_SCRIPT, disable: IMAGE_BLOCK_UNDO },
  trackers: { enable: TRACKER_BLOCK_SCRIPT, disable: TRACKER_BLOCK_UNDO },
  cookies: { enable: COOKIE_BLOCK_SCRIPT, disable: COOKIE_BLOCK_UNDO },
  webrtc: { enable: WEBRTC_PROTECT_SCRIPT, disable: WEBRTC_PROTECT_UNDO },
};
