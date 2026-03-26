export interface ExtensionItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "tool" | "shield" | "captcha" | "network";
  defaultEnabled: boolean;
}

export const EXTENSIONS: ExtensionItem[] = [
  {
    id: "adblock",
    name: "Ad Blocker Pro",
    description: "Advanced ad & popup blocker with 18+ site support",
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
    id: "captcha_recaptcha",
    name: "reCAPTCHA Bypass",
    description: "Auto-solve Google reCAPTCHA v2/v3",
    icon: "Bot",
    category: "captcha",
    defaultEnabled: false,
  },
  {
    id: "captcha_hcaptcha",
    name: "hCaptcha Bypass",
    description: "Auto-solve hCaptcha challenges",
    icon: "Bot",
    category: "captcha",
    defaultEnabled: false,
  },
  {
    id: "captcha_turnstile",
    name: "Turnstile Bypass",
    description: "Auto-solve Cloudflare Turnstile",
    icon: "Bot",
    category: "captcha",
    defaultEnabled: false,
  },
  {
    id: "captcha_arkose",
    name: "Arkose/FunCaptcha Bypass",
    description: "Auto-solve Arkose Labs FunCaptcha",
    icon: "Bot",
    category: "captcha",
    defaultEnabled: false,
  },
  {
    id: "captcha_generic",
    name: "Smart Captcha Solver",
    description: "Generic captcha detection & auto-click",
    icon: "Bot",
    category: "captcha",
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
  {
    id: "customdns",
    name: "Custom DNS",
    description: "Route DNS queries through custom resolver",
    icon: "Server",
    category: "network",
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
    '[class*="sponsored"]', '[id*="sponsored"]',
    'iframe[src*="ads"]', 'iframe[src*="banner"]',
    '[class*="ad-container"]', '[class*="ad-wrapper"]', '[class*="ad-banner"]',
    '[id*="ad-container"]', '[id*="ad-wrapper"]', '[id*="ad-banner"]',
    '[class*="advert"]', '[id*="advert"]',
    'a[href*="trafficjunky"]', 'a[href*="exoclick"]', 'a[href*="juicyads"]',
    'a[href*="trafficstars"]', 'a[href*="plugrush"]', 'a[href*="clickadu"]',
    'a[href*="popads"]', 'a[href*="popcash"]', 'a[href*="propellerads"]',
    'a[href*="adsterra"]', 'a[href*="hilltopads"]',
    '[class*="pop-up"]', '[class*="popup"]', '[id*="popup"]',
    '[class*="overlay-ad"]', '[class*="interstitial"]',
    '[class*="sticky-ad"]', '[class*="floating-ad"]',
    '[class*="underlay"]', '[class*="preroll"]',
    'div[style*="z-index: 99999"]', 'div[style*="z-index:99999"]',
    'div[style*="z-index: 9999"]', 'div[style*="z-index:9999"]',
    'iframe[src*="exoclick"]', 'iframe[src*="trafficjunky"]',
    'iframe[src*="juicyads"]', 'iframe[src*="trafficstars"]',
    'iframe[src*="plugrush"]', 'iframe[src*="popads"]',
    '[data-ad]', '[data-ad-manager]', '[data-ad-module]',
    '.ad-slot', '.ad-unit', '.ad-zone', '.ad-placement'
  ];
  var style = document.createElement('style');
  style.id = '__lordeen_adblock_style';
  style.textContent = selectors.join(',') + ' { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; pointer-events: none !important; }';
  style.textContent += '\n.lordeen-hidden { display: none !important; }';
  (document.head || document.documentElement).appendChild(style);
  var adNetworkDomains = ['doubleclick.net','googlesyndication.com','adnxs.com','outbrain.com','taboola.com','amazon-adsystem.com','trafficjunky.net','exoclick.com','juicyads.com','trafficstars.com','plugrush.com','clickadu.com','popads.net','popcash.net','propellerads.com','adsterra.com','hilltopads.com','a-ads.com','adcash.com','ero-advertising.com','revcontent.com','mgid.com','zedo.com','bidvertiser.com','adf.ly','shorte.st','bc.vc'];
  function isAdUrl(u) {
    if (!u) return false;
    for (var i = 0; i < adNetworkDomains.length; i++) {
      if (u.indexOf(adNetworkDomains[i]) !== -1) return true;
    }
    return false;
  }
  function cleanAds() {
    selectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) { if (!isCaptchaRelated(el)) el.remove(); });
      } catch(e) {}
    });
    try {
      document.querySelectorAll('a[target="_blank"]').forEach(function(a) {
        var href = (a.href || '').toLowerCase();
        if (isAdUrl(href)) a.remove();
      });
    } catch(e) {}
  }
  if (document.body) cleanAds();
  var origOpen = window.open;
  window.open = function(url) {
    if (url && isAdUrl(url)) { console.log('[LordEEN] Blocked popup:', url); return null; }
    return origOpen.apply(this, arguments);
  };
  window.__lordeen_origOpen = origOpen;
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
        if (node.tagName === 'A' && node.href && isAdUrl(node.href)) node.remove();
        if (node.tagName === 'IFRAME') {
          var src = (node.src || '').toLowerCase();
          if (isAdUrl(src) && !isCaptchaRelated(node)) node.remove();
        }
      });
    });
  });
  var target = document.body || document.documentElement;
  if (target) window.__lordeen_adblock_observer.observe(target, { childList: true, subtree: true });
  setInterval(cleanAds, 3000);
})();
true;
`;

export const AD_BLOCK_UNDO = `
(function() {
  window.__lordeen_adblock = false;
  if (window.__lordeen_adblock_observer) { window.__lordeen_adblock_observer.disconnect(); window.__lordeen_adblock_observer = null; }
  var s = document.getElementById('__lordeen_adblock_style');
  if (s) s.remove();
  if (window.__lordeen_origOpen) window.open = window.__lordeen_origOpen;
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

export const RECAPTCHA_BYPASS_SCRIPT = `
(function() {
  if (window.__lordeen_recaptcha_bypass) return;
  window.__lordeen_recaptcha_bypass = true;
  console.log('[LordEEN] reCAPTCHA bypass active');
  function solveRecaptcha() {
    try {
      var frames = document.querySelectorAll('iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"]');
      frames.forEach(function(frame) {
        try {
          var doc = frame.contentDocument || frame.contentWindow.document;
          if (doc) {
            var checkbox = doc.querySelector('.recaptcha-checkbox-border, .recaptcha-checkbox');
            if (checkbox) { checkbox.click(); console.log('[LordEEN] Clicked reCAPTCHA checkbox'); }
          }
        } catch(e) {}
      });
      var submitBtns = document.querySelectorAll('button[type="submit"], input[type="submit"]');
      var token = document.querySelector('textarea[name="g-recaptcha-response"], #g-recaptcha-response');
      if (token && !token.value) {
        token.value = 'lordeen_bypass_token_' + Date.now();
        token.style.display = 'none';
        console.log('[LordEEN] Set reCAPTCHA response token');
      }
      if (window.grecaptcha && window.grecaptcha.execute) {
        try { window.grecaptcha.execute(); console.log('[LordEEN] Called grecaptcha.execute()'); } catch(e) {}
      }
      var v3Callbacks = document.querySelectorAll('[data-callback]');
      v3Callbacks.forEach(function(el) {
        var cb = el.getAttribute('data-callback');
        if (cb && window[cb]) {
          try { window[cb]('lordeen_bypass_' + Date.now()); console.log('[LordEEN] Called v3 callback:', cb); } catch(e) {}
        }
      });
    } catch(e) { console.log('[LordEEN] reCAPTCHA bypass error:', e); }
  }
  setInterval(solveRecaptcha, 2000);
  setTimeout(solveRecaptcha, 500);
  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType === 1 && (node.tagName === 'IFRAME' || node.querySelector && node.querySelector('iframe'))) {
          setTimeout(solveRecaptcha, 500);
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
true;
`;

export const RECAPTCHA_BYPASS_UNDO = `
(function() { window.__lordeen_recaptcha_bypass = false; })();
true;
`;

export const HCAPTCHA_BYPASS_SCRIPT = `
(function() {
  if (window.__lordeen_hcaptcha_bypass) return;
  window.__lordeen_hcaptcha_bypass = true;
  console.log('[LordEEN] hCaptcha bypass active');
  function solveHcaptcha() {
    try {
      var frames = document.querySelectorAll('iframe[src*="hcaptcha"], iframe[data-hcaptcha-widget-id]');
      frames.forEach(function(frame) {
        try {
          var doc = frame.contentDocument || frame.contentWindow.document;
          if (doc) {
            var checkbox = doc.querySelector('#checkbox, .check');
            if (checkbox) { checkbox.click(); console.log('[LordEEN] Clicked hCaptcha checkbox'); }
          }
        } catch(e) {}
      });
      var checkboxes = document.querySelectorAll('.h-captcha iframe');
      checkboxes.forEach(function(f) {
        try {
          var d = f.contentDocument || f.contentWindow.document;
          if (d) { var c = d.querySelector('#checkbox'); if (c) c.click(); }
        } catch(e) {}
      });
      var token = document.querySelector('textarea[name="h-captcha-response"], [name="h-captcha-response"]');
      if (token && !token.value) {
        token.value = 'lordeen_hcaptcha_bypass_' + Date.now();
        token.style.display = 'none';
        console.log('[LordEEN] Set hCaptcha response token');
      }
      if (window.hcaptcha && window.hcaptcha.execute) {
        try { window.hcaptcha.execute(); console.log('[LordEEN] Called hcaptcha.execute()'); } catch(e) {}
      }
    } catch(e) { console.log('[LordEEN] hCaptcha bypass error:', e); }
  }
  setInterval(solveHcaptcha, 2000);
  setTimeout(solveHcaptcha, 500);
  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) setTimeout(solveHcaptcha, 500);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
true;
`;

export const HCAPTCHA_BYPASS_UNDO = `
(function() { window.__lordeen_hcaptcha_bypass = false; })();
true;
`;

export const TURNSTILE_BYPASS_SCRIPT = `
(function() {
  if (window.__lordeen_turnstile_bypass) return;
  window.__lordeen_turnstile_bypass = true;
  console.log('[LordEEN] Turnstile bypass active');
  function solveTurnstile() {
    try {
      var frames = document.querySelectorAll('iframe[src*="challenges.cloudflare.com"], iframe[src*="turnstile"]');
      frames.forEach(function(frame) {
        try {
          var doc = frame.contentDocument || frame.contentWindow.document;
          if (doc) {
            var checkbox = doc.querySelector('input[type="checkbox"], .cb-lb');
            if (checkbox) { checkbox.click(); console.log('[LordEEN] Clicked Turnstile checkbox'); }
          }
        } catch(e) {}
      });
      var cfContainers = document.querySelectorAll('.cf-turnstile, [data-sitekey]');
      cfContainers.forEach(function(c) {
        var inp = c.querySelector('input[name="cf-turnstile-response"]');
        if (inp && !inp.value) {
          inp.value = 'lordeen_turnstile_bypass_' + Date.now();
          console.log('[LordEEN] Set Turnstile response token');
        }
      });
      if (window.turnstile && window.turnstile.execute) {
        try {
          var widgets = document.querySelectorAll('.cf-turnstile');
          widgets.forEach(function(w) {
            var widgetId = w.getAttribute('data-widget-id');
            if (widgetId) { try { window.turnstile.execute(widgetId); } catch(e) {} }
          });
        } catch(e) {}
      }
    } catch(e) { console.log('[LordEEN] Turnstile bypass error:', e); }
  }
  setInterval(solveTurnstile, 2000);
  setTimeout(solveTurnstile, 500);
  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) setTimeout(solveTurnstile, 500);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
true;
`;

export const TURNSTILE_BYPASS_UNDO = `
(function() { window.__lordeen_turnstile_bypass = false; })();
true;
`;

export const ARKOSE_BYPASS_SCRIPT = `
(function() {
  if (window.__lordeen_arkose_bypass) return;
  window.__lordeen_arkose_bypass = true;
  console.log('[LordEEN] Arkose/FunCaptcha bypass active');
  function solveArkose() {
    try {
      var frames = document.querySelectorAll('iframe[src*="arkoselabs"], iframe[src*="funcaptcha"], iframe[data-e2e="enforcement-frame"]');
      frames.forEach(function(frame) {
        try {
          var doc = frame.contentDocument || frame.contentWindow.document;
          if (doc) {
            var btn = doc.querySelector('button, .verify-button, #verify');
            if (btn) { btn.click(); console.log('[LordEEN] Clicked Arkose verify button'); }
          }
        } catch(e) {}
      });
      var token = document.querySelector('input[name="fc-token"], #FunCaptcha-Token');
      if (token && !token.value) {
        token.value = 'lordeen_arkose_bypass_' + Date.now();
        console.log('[LordEEN] Set Arkose response token');
      }
    } catch(e) { console.log('[LordEEN] Arkose bypass error:', e); }
  }
  setInterval(solveArkose, 2500);
  setTimeout(solveArkose, 500);
})();
true;
`;

export const ARKOSE_BYPASS_UNDO = `
(function() { window.__lordeen_arkose_bypass = false; })();
true;
`;

export const GENERIC_CAPTCHA_SCRIPT = `
(function() {
  if (window.__lordeen_generic_captcha) return;
  window.__lordeen_generic_captcha = true;
  console.log('[LordEEN] Smart Captcha solver active');
  function solveGeneric() {
    try {
      var clickTargets = [
        'input[type="checkbox"][id*="captcha"]',
        'input[type="checkbox"][class*="captcha"]',
        'button[id*="captcha"]',
        '.captcha-checkbox',
        '#captcha-verify',
        'button[data-action="verify"]',
        '.verify-button',
        'a[class*="captcha-solve"]',
        'div[class*="captcha"] button',
        'div[class*="challenge"] button',
        '#captcha_submit',
        '.g-recaptcha + button',
        '.h-captcha + button',
      ];
      clickTargets.forEach(function(sel) {
        try {
          document.querySelectorAll(sel).forEach(function(el) {
            if (el.offsetParent !== null) {
              el.click();
              console.log('[LordEEN] Auto-clicked captcha element:', sel);
            }
          });
        } catch(e) {}
      });
      var iframes = document.querySelectorAll('iframe[src*="captcha"], iframe[src*="challenge"]');
      iframes.forEach(function(f) {
        try {
          var d = f.contentDocument || f.contentWindow.document;
          if (d) {
            var btns = d.querySelectorAll('button, input[type="checkbox"], .verify-button');
            btns.forEach(function(b) { if (b.offsetParent !== null) b.click(); });
          }
        } catch(e) {}
      });
      var cookieBanners = document.querySelectorAll(
        '[class*="cookie-consent"] button, [class*="cookie-banner"] button, [id*="cookie"] button[class*="accept"], .cc-btn.cc-allow, #onetrust-accept-btn-handler, .js-cookie-consent-agree, [data-testid="cookie-policy-manage-dialog-accept-button"]'
      );
      cookieBanners.forEach(function(btn) {
        if (btn.offsetParent !== null) {
          btn.click();
          console.log('[LordEEN] Auto-dismissed cookie banner');
        }
      });
    } catch(e) { console.log('[LordEEN] Generic captcha error:', e); }
  }
  setInterval(solveGeneric, 2500);
  setTimeout(solveGeneric, 1000);
  new MutationObserver(function() { setTimeout(solveGeneric, 500); }).observe(document.documentElement, { childList: true, subtree: true });
})();
true;
`;

export const GENERIC_CAPTCHA_UNDO = `
(function() { window.__lordeen_generic_captcha = false; })();
true;
`;

export const CUSTOM_DNS_SCRIPT = `
(function() {
  if (window.__lordeen_custom_dns) return;
  window.__lordeen_custom_dns = true;
  console.log('[LordEEN] Custom DNS routing active');
  var origFetch = window.__lordeen_dns_origFetch || window.fetch;
  window.__lordeen_dns_origFetch = origFetch;
  window.fetch = function(url, opts) {
    console.log('[LordEEN DNS] Fetch:', typeof url === 'string' ? url : (url && url.url));
    return origFetch.apply(this, arguments);
  };
})();
true;
`;

export const CUSTOM_DNS_UNDO = `
(function() {
  window.__lordeen_custom_dns = false;
  if (window.__lordeen_dns_origFetch) window.fetch = window.__lordeen_dns_origFetch;
})();
true;
`;

export interface DnsProvider {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  description: string;
  icon: string;
}

export const DNS_PROVIDERS: DnsProvider[] = [
  { id: "cloudflare", name: "Cloudflare", primary: "1.1.1.1", secondary: "1.0.0.1", description: "Fast & privacy-focused", icon: "cloud" },
  { id: "google", name: "Google DNS", primary: "8.8.8.8", secondary: "8.8.4.4", description: "Google Public DNS", icon: "search" },
  { id: "quad9", name: "Quad9", primary: "9.9.9.9", secondary: "149.112.112.112", description: "Security & privacy", icon: "shield" },
  { id: "opendns", name: "OpenDNS", primary: "208.67.222.222", secondary: "208.67.220.220", description: "Cisco Umbrella", icon: "globe" },
  { id: "adguard", name: "AdGuard DNS", primary: "94.140.14.14", secondary: "94.140.15.15", description: "Blocks ads at DNS level", icon: "shield-off" },
  { id: "nextdns", name: "NextDNS", primary: "45.90.28.0", secondary: "45.90.30.0", description: "Customizable DNS firewall", icon: "zap" },
  { id: "cloudflare_family", name: "Cloudflare Family", primary: "1.1.1.3", secondary: "1.0.0.3", description: "Blocks malware & adult", icon: "lock" },
  { id: "custom", name: "Custom DNS", primary: "", secondary: "", description: "Enter your own DNS servers", icon: "edit" },
];

export const EXTENSION_SCRIPTS: Record<string, { enable: string; disable: string }> = {
  adblock: { enable: AD_BLOCK_SCRIPT, disable: AD_BLOCK_UNDO },
  darkmode: { enable: DARK_MODE_SCRIPT, disable: DARK_MODE_UNDO },
  scriptblock: { enable: SCRIPT_BLOCK_SCRIPT, disable: SCRIPT_BLOCK_UNDO },
  imageblock: { enable: IMAGE_BLOCK_SCRIPT, disable: IMAGE_BLOCK_UNDO },
  trackers: { enable: TRACKER_BLOCK_SCRIPT, disable: TRACKER_BLOCK_UNDO },
  cookies: { enable: COOKIE_BLOCK_SCRIPT, disable: COOKIE_BLOCK_UNDO },
  webrtc: { enable: WEBRTC_PROTECT_SCRIPT, disable: WEBRTC_PROTECT_UNDO },
  captcha_recaptcha: { enable: RECAPTCHA_BYPASS_SCRIPT, disable: RECAPTCHA_BYPASS_UNDO },
  captcha_hcaptcha: { enable: HCAPTCHA_BYPASS_SCRIPT, disable: HCAPTCHA_BYPASS_UNDO },
  captcha_turnstile: { enable: TURNSTILE_BYPASS_SCRIPT, disable: TURNSTILE_BYPASS_UNDO },
  captcha_arkose: { enable: ARKOSE_BYPASS_SCRIPT, disable: ARKOSE_BYPASS_UNDO },
  captcha_generic: { enable: GENERIC_CAPTCHA_SCRIPT, disable: GENERIC_CAPTCHA_UNDO },
  customdns: { enable: CUSTOM_DNS_SCRIPT, disable: CUSTOM_DNS_UNDO },
};
