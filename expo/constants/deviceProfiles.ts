export interface DeviceProfile {
  id: number;
  name: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  platform: string;
  vendor: string;
  language: string;
  timezone: string;
  webglVendor: string;
  webglRenderer: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  colorDepth: number;
}

const LANGUAGES = [
  "en-US", "en-GB", "fr-FR", "de-DE", "es-ES", "pt-BR", "it-IT", "nl-NL",
  "ja-JP", "ko-KR", "zh-CN", "ru-RU", "ar-SA", "hi-IN", "pl-PL", "tr-TR",
  "sv-SE", "da-DK", "fi-FI", "nb-NO", "cs-CZ", "ro-RO", "hu-HU", "el-GR",
  "th-TH", "vi-VN", "id-ID", "ms-MY", "uk-UA", "bg-BG", "hr-HR", "sk-SK",
  "sl-SI", "sr-RS", "lt-LT", "lv-LV", "et-EE", "he-IL", "fa-IR", "bn-BD",
];

const TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Rome",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Asia/Dubai",
  "Australia/Sydney", "Pacific/Auckland", "America/Sao_Paulo", "Africa/Cairo",
  "America/Toronto", "Europe/Madrid", "Europe/Amsterdam", "Asia/Singapore",
  "Asia/Seoul", "Asia/Bangkok", "Asia/Jakarta", "Asia/Manila",
  "Europe/Moscow", "Europe/Istanbul", "Europe/Warsaw", "Europe/Bucharest",
  "America/Mexico_City", "America/Buenos_Aires", "America/Lima", "America/Bogota",
  "Africa/Lagos", "Africa/Johannesburg", "Asia/Karachi", "Asia/Dhaka",
  "Asia/Ho_Chi_Minh", "Europe/Prague", "Europe/Vienna", "Europe/Stockholm",
];

const WEBGL_VENDORS = [
  "Google Inc. (NVIDIA)", "Google Inc. (AMD)", "Google Inc. (Intel)",
  "Apple", "Google Inc. (Qualcomm)", "ARM", "Google Inc. (Mali)",
  "Google Inc. (PowerVR)", "Google Inc. (Adreno)",
];

const WEBGL_RENDERERS = [
  "ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (NVIDIA GeForce GTX 1660 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (AMD Radeon RX 580 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)",
  "Apple GPU",
  "Mali-G78",
  "Adreno (TM) 660",
  "Adreno (TM) 730",
  "Apple M1",
  "Apple M2",
  "Mali-G710",
  "PowerVR SGX544",
  "Adreno (TM) 740",
  "Mali-G715",
  "Adreno (TM) 750",
  "Apple M3",
  "Mali-G720",
  "Adreno (TM) 650",
  "Mali-G77",
  "Adreno (TM) 620",
];

const RESOLUTIONS: [number, number][] = [
  [412, 915], [393, 873], [360, 800], [414, 896], [390, 844],
  [375, 812], [428, 926], [360, 780], [384, 854], [412, 892],
  [320, 568], [375, 667], [414, 736], [393, 851], [360, 740],
  [480, 854], [540, 960], [411, 731], [360, 640], [412, 869],
  [430, 932], [402, 874], [385, 856], [360, 820], [412, 883],
  [375, 844], [414, 926], [393, 786], [320, 640], [428, 884],
  [390, 812], [360, 760], [412, 846], [384, 800], [540, 1200],
  [440, 956], [410, 905], [395, 860], [420, 940], [405, 880],
  [380, 830], [365, 790], [435, 950], [400, 870], [415, 910],
];

const PHONE_NAMES = [
  "Samsung Galaxy S24", "Samsung Galaxy S24+", "Samsung Galaxy S24 Ultra",
  "Samsung Galaxy S23", "Samsung Galaxy S23+", "Samsung Galaxy S23 Ultra",
  "Samsung Galaxy S22", "Samsung Galaxy S22+", "Samsung Galaxy S22 Ultra",
  "Samsung Galaxy S21", "Samsung Galaxy S21+", "Samsung Galaxy S21 Ultra",
  "Samsung Galaxy S20", "Samsung Galaxy S20+", "Samsung Galaxy S20 Ultra",
  "Samsung Galaxy S20 FE", "Samsung Galaxy S25", "Samsung Galaxy S25+",
  "Samsung Galaxy S25 Ultra", "Samsung Galaxy Note 20", "Samsung Galaxy Note 20 Ultra",
  "Samsung Galaxy Note 10+", "Samsung Galaxy Note 10", "Samsung Galaxy Note 9",
  "Samsung Galaxy A55", "Samsung Galaxy A54", "Samsung Galaxy A53",
  "Samsung Galaxy A52", "Samsung Galaxy A52s", "Samsung Galaxy A51",
  "Samsung Galaxy A34", "Samsung Galaxy A33", "Samsung Galaxy A32",
  "Samsung Galaxy A25", "Samsung Galaxy A24", "Samsung Galaxy A23",
  "Samsung Galaxy A15", "Samsung Galaxy A14", "Samsung Galaxy A13",
  "Samsung Galaxy A05", "Samsung Galaxy A04", "Samsung Galaxy A03",
  "Samsung Galaxy M55", "Samsung Galaxy M54", "Samsung Galaxy M53",
  "Samsung Galaxy M34", "Samsung Galaxy M33", "Samsung Galaxy M14",
  "Samsung Galaxy F55", "Samsung Galaxy F54", "Samsung Galaxy F34",
  "Samsung Galaxy Z Fold6", "Samsung Galaxy Z Fold5", "Samsung Galaxy Z Fold4",
  "Samsung Galaxy Z Fold3", "Samsung Galaxy Z Flip6", "Samsung Galaxy Z Flip5",
  "Samsung Galaxy Z Flip4", "Samsung Galaxy Z Flip3",
  "Samsung Galaxy A73", "Samsung Galaxy A72",
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
  "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
  "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
  "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 Mini",
  "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 Mini",
  "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
  "iPhone SE 3rd Gen", "iPhone SE 2nd Gen",
  "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
  "iPhone 8 Plus", "iPhone 8",
  "Google Pixel 9 Pro XL", "Google Pixel 9 Pro", "Google Pixel 9",
  "Google Pixel 9 Pro Fold", "Google Pixel 8 Pro", "Google Pixel 8",
  "Google Pixel 8a", "Google Pixel 7 Pro", "Google Pixel 7",
  "Google Pixel 7a", "Google Pixel 6 Pro", "Google Pixel 6",
  "Google Pixel 6a", "Google Pixel 5a", "Google Pixel 5",
  "Google Pixel 4a", "Google Pixel 4 XL", "Google Pixel 4",
  "Google Pixel Fold",
  "OnePlus 13", "OnePlus 12", "OnePlus 12R",
  "OnePlus 11", "OnePlus 11R", "OnePlus 10 Pro", "OnePlus 10T",
  "OnePlus 9 Pro", "OnePlus 9", "OnePlus 9R",
  "OnePlus 8 Pro", "OnePlus 8T", "OnePlus 8",
  "OnePlus Nord 4", "OnePlus Nord 3", "OnePlus Nord CE 4",
  "OnePlus Nord CE 4 Lite", "OnePlus Nord CE 3", "OnePlus Nord CE 3 Lite",
  "OnePlus Nord 2T", "OnePlus Nord N30", "OnePlus Nord N20",
  "OnePlus Open",
  "Xiaomi 15 Pro", "Xiaomi 15", "Xiaomi 14 Ultra",
  "Xiaomi 14 Pro", "Xiaomi 14", "Xiaomi 13 Ultra",
  "Xiaomi 13 Pro", "Xiaomi 13", "Xiaomi 13T Pro", "Xiaomi 13T",
  "Xiaomi 12T Pro", "Xiaomi 12T", "Xiaomi 12 Pro", "Xiaomi 12",
  "Xiaomi 11T Pro", "Xiaomi 11T", "Xiaomi Mi 11", "Xiaomi Mi 11 Ultra",
  "Xiaomi Redmi Note 14 Pro+", "Xiaomi Redmi Note 14 Pro", "Xiaomi Redmi Note 14",
  "Xiaomi Redmi Note 13 Pro+", "Xiaomi Redmi Note 13 Pro", "Xiaomi Redmi Note 13",
  "Xiaomi Redmi Note 12 Pro+", "Xiaomi Redmi Note 12 Pro", "Xiaomi Redmi Note 12",
  "Xiaomi Redmi Note 11 Pro+", "Xiaomi Redmi Note 11 Pro", "Xiaomi Redmi Note 11",
  "Xiaomi Redmi 13C", "Xiaomi Redmi 13", "Xiaomi Redmi 12",
  "POCO F6 Pro", "POCO F6", "POCO F5 Pro", "POCO F5",
  "POCO X7 Pro", "POCO X6 Pro", "POCO X5 Pro",
  "POCO M6 Pro", "POCO M5", "POCO C65", "POCO C55",
  "Oppo Find X7 Ultra", "Oppo Find X7", "Oppo Find X6 Pro",
  "Oppo Find X5 Pro", "Oppo Find X3 Pro",
  "Oppo Find N3", "Oppo Find N2 Flip",
  "Oppo Reno 12 Pro", "Oppo Reno 12", "Oppo Reno 11 Pro", "Oppo Reno 11",
  "Oppo Reno 10 Pro+", "Oppo Reno 10 Pro", "Oppo Reno 10",
  "Oppo Reno 9 Pro", "Oppo Reno 8 Pro",
  "Oppo A98", "Oppo A78", "Oppo A58", "Oppo A38",
  "Oppo A18", "Oppo K11", "Oppo K10",
  "Vivo X200 Pro", "Vivo X200", "Vivo X100 Pro", "Vivo X100",
  "Vivo X90 Pro", "Vivo X80 Pro",
  "Vivo V30 Pro", "Vivo V30", "Vivo V29 Pro", "Vivo V29",
  "Vivo V27 Pro", "Vivo V27",
  "Vivo Y100", "Vivo Y56", "Vivo Y36", "Vivo Y27",
  "Vivo T2x", "Vivo T2 Pro",
  "Vivo iQOO 13", "Vivo iQOO 12", "Vivo iQOO 12 Pro",
  "Vivo iQOO Neo 9 Pro", "Vivo iQOO Neo 9", "Vivo iQOO Neo 8",
  "Vivo iQOO Z9 Turbo", "Vivo iQOO Z9",
  "Huawei Pura 70 Ultra", "Huawei Pura 70 Pro", "Huawei Pura 70",
  "Huawei P60 Pro", "Huawei P60", "Huawei P50 Pro",
  "Huawei Mate 60 Pro", "Huawei Mate 60", "Huawei Mate 50 Pro",
  "Huawei Mate X5", "Huawei Mate X3",
  "Huawei Nova 12 Ultra", "Huawei Nova 12", "Huawei Nova 11",
  "Honor 200 Pro", "Honor 200", "Honor 90 Pro", "Honor 90",
  "Honor Magic 6 Pro", "Honor Magic 5 Pro", "Honor Magic 5 Lite",
  "Honor Magic V2", "Honor Magic V3",
  "Honor X9b", "Honor X8a", "Honor X7b", "Honor 70",
  "Motorola Edge 50 Ultra", "Motorola Edge 50 Pro", "Motorola Edge 50 Fusion",
  "Motorola Edge 40 Pro", "Motorola Edge 40", "Motorola Edge 30 Ultra",
  "Motorola Razr 50 Ultra", "Motorola Razr 50", "Motorola Razr 40 Ultra", "Motorola Razr 40",
  "Motorola G84", "Motorola G54", "Motorola G34", "Motorola G24",
  "Motorola ThinkPhone", "Motorola Moto G Power 2024",
  "Sony Xperia 1 VI", "Sony Xperia 1 V", "Sony Xperia 5 VI", "Sony Xperia 5 V",
  "Sony Xperia 10 VI", "Sony Xperia 10 V",
  "Nothing Phone 2a Plus", "Nothing Phone 2a", "Nothing Phone 2", "Nothing Phone 1",
  "Nothing CMF Phone 1",
  "Realme GT 6T", "Realme GT 6", "Realme GT 5 Pro", "Realme GT 5",
  "Realme GT Neo 6", "Realme GT Neo 5",
  "Realme 12 Pro+", "Realme 12 Pro", "Realme 12",
  "Realme 11 Pro+", "Realme 11 Pro",
  "Realme C67", "Realme C55", "Realme Narzo 70 Pro", "Realme Narzo 60 Pro",
  "Asus ROG Phone 8 Pro", "Asus ROG Phone 8", "Asus ROG Phone 7 Ultimate",
  "Asus ROG Phone 7", "Asus Zenfone 11 Ultra", "Asus Zenfone 10",
  "Nokia G42", "Nokia G60", "Nokia X30", "Nokia C32", "Nokia XR21",
  "Tecno Phantom X2 Pro", "Tecno Phantom V Fold", "Tecno Phantom V Flip",
  "Tecno Spark 20 Pro+", "Tecno Camon 30 Pro", "Tecno Camon 20 Pro",
  "Tecno Pova 6 Pro", "Tecno Pop 8",
  "Infinix GT 20 Pro", "Infinix Note 40 Pro", "Infinix Hot 40 Pro",
  "Infinix Zero 40", "Infinix Zero 30", "Infinix Note 30",
  "Infinix Smart 8",
  "ZTE Nubia Z60 Ultra", "ZTE Nubia Z60S Pro", "ZTE Blade V50",
  "ZTE Axon 60 Ultra", "ZTE Axon 50 Ultra",
  "Nubia Red Magic 9S Pro", "Nubia Red Magic 9 Pro",
  "Lenovo Legion Y90", "Lenovo Legion Phone Duel 3", "Lenovo K14 Plus",
  "TCL 50 XL", "TCL 40 NxtPaper", "TCL 30 SE",
  "Lava Blaze Pro 5G", "Lava Agni 2", "Lava Blaze 2",
  "Micromax IN 2C", "Micromax IN Note 2",
  "Cubot P80", "Cubot KingKong Star", "Cubot Note 50",
  "Umidigi G5 Mecha", "Umidigi A15", "Umidigi F3 Pro",
  "Oukitel WP30 Pro", "Oukitel C35", "Oukitel WP28",
  "Blackview BV9300 Pro", "Blackview A200 Pro", "Blackview BL8800",
  "Doogee S110", "Doogee N50 Pro", "Doogee V30 Pro",
  "Ulefone Armor 23 Ultra", "Ulefone Power Armor 19T", "Ulefone Armor 22",
  "Cat S75", "Cat S62 Pro", "Cat S53",
  "AGM H6", "AGM Glory G1S", "AGM H5 Pro",
  "Wiko T50", "Wiko Power U30", "Wiko T10",
  "Alcatel 3X", "Alcatel 1SE", "Alcatel 1V",
  "Black Shark 6 Pro", "Black Shark 5 Pro", "Black Shark 5",
  "Meizu 21 Pro", "Meizu 21 Note", "Meizu 20 Pro",
  "Fairphone 5", "Fairphone 4",
  "Redmi K70 Pro", "Redmi K70E", "Redmi K70",
  "Redmi K60 Ultra", "Redmi K60 Pro", "Redmi K60",
  "Redmi Note 13 Pro+",
  "iQOO 12 Pro", "iQOO Z9 Turbo", "iQOO Neo 9S",
  "Sharp Aquos R8", "Sharp Aquos Sense 8",
  "Kyocera Torque G06",
  "HTC U23 Pro", "HTC U23",
  "Google Pixel Tablet",
  "iPad Pro 12.9", "iPad Pro 11", "iPad Air 5", "iPad Mini 6",
];

const ANDROID_VERSIONS = ["11", "12", "13", "14", "15"];
const IOS_VERSIONS = ["16_6", "17_0", "17_1", "17_2", "17_3", "17_4", "18_0", "18_1", "18_2"];
const CHROME_VERSIONS = ["118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131"];
const SAFARI_VERSIONS = ["17.0", "17.1", "17.2", "17.3", "17.4", "17.5", "18.0", "18.1"];

function generateUserAgent(index: number): string {
  const phoneName = PHONE_NAMES[index % PHONE_NAMES.length];
  const isIOS = phoneName.includes("iPhone") || phoneName.includes("iPad");
  if (isIOS) {
    const iosVer = IOS_VERSIONS[index % IOS_VERSIONS.length];
    const safariVer = SAFARI_VERSIONS[index % SAFARI_VERSIONS.length];
    if (phoneName.includes("iPad")) {
      return "Mozilla/5.0 (iPad; CPU OS " + iosVer + " like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/" + safariVer + " Mobile/15E148 Safari/604.1";
    }
    return "Mozilla/5.0 (iPhone; CPU iPhone OS " + iosVer + " like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/" + safariVer + " Mobile/15E148 Safari/604.1";
  }
  const androidVer = ANDROID_VERSIONS[index % ANDROID_VERSIONS.length];
  const chromeVer = CHROME_VERSIONS[index % CHROME_VERSIONS.length];
  const buildNum = 6000 + (index * 37) % 1000;
  return "Mozilla/5.0 (Linux; Android " + androidVer + "; " + phoneName + " Build/TP1A." + buildNum + ") AppleWebKit/537.36 (KHTML, like Gecko) Chrome/" + chromeVer + ".0.0.0 Mobile Safari/537.36";
}

function generateProfile(index: number): DeviceProfile {
  const name = PHONE_NAMES[index % PHONE_NAMES.length];
  const isIOS = name.includes("iPhone") || name.includes("iPad");
  const res = RESOLUTIONS[index % RESOLUTIONS.length];
  const langIdx = index % LANGUAGES.length;
  const tzIdx = index % TIMEZONES.length;
  const glVendorIdx = isIOS ? 3 : index % 6;
  const glRendererIdx = isIOS
    ? 8 + (index % 6)
    : index % 8;

  return {
    id: index + 1,
    name: name + " #" + (index + 1),
    userAgent: generateUserAgent(index),
    screenWidth: res[0],
    screenHeight: res[1],
    platform: isIOS ? (name.includes("iPad") ? "iPad" : "iPhone") : "Linux armv8l",
    vendor: isIOS ? "Apple Computer, Inc." : "Google Inc.",
    language: LANGUAGES[langIdx],
    timezone: TIMEZONES[tzIdx],
    webglVendor: WEBGL_VENDORS[glVendorIdx],
    webglRenderer: WEBGL_RENDERERS[glRendererIdx],
    hardwareConcurrency: [4, 6, 8, 8, 8, 12, 12, 16][index % 8],
    deviceMemory: [2, 3, 4, 4, 6, 8, 8, 12, 16][index % 9],
    colorDepth: 24,
  };
}

export const DEVICE_PROFILES: DeviceProfile[] = Array.from(
  { length: 500 },
  (_, i) => generateProfile(i)
);

export function getRandomProfile(): DeviceProfile {
  const idx = Math.floor(Math.random() * DEVICE_PROFILES.length);
  return DEVICE_PROFILES[idx];
}

export function getFingerprintSpoofScript(profile: DeviceProfile): string {
  const safeName = profile.name.replace(/'/g, "").replace(/`/g, "");
  return `
(function() {
  if (window.__lordeen_fingerprint) return;
  window.__lordeen_fingerprint = true;
  try {
    var isCaptchaPage = false;
    try {
      var scripts = document.querySelectorAll('script[src]');
      for (var s = 0; s < scripts.length; s++) {
        var ssrc = (scripts[s].src || '').toLowerCase();
        if (ssrc.indexOf('recaptcha') !== -1 || ssrc.indexOf('hcaptcha') !== -1 || ssrc.indexOf('turnstile') !== -1 || ssrc.indexOf('captcha') !== -1) {
          isCaptchaPage = true;
          break;
        }
      }
      var iframes = document.querySelectorAll('iframe');
      for (var f = 0; f < iframes.length; f++) {
        var fsrc = (iframes[f].src || '').toLowerCase();
        if (fsrc.indexOf('recaptcha') !== -1 || fsrc.indexOf('hcaptcha') !== -1 || fsrc.indexOf('turnstile') !== -1 || fsrc.indexOf('captcha') !== -1) {
          isCaptchaPage = true;
          break;
        }
      }
    } catch(e) {}

    Object.defineProperty(navigator, 'platform', { get: function() { return '${profile.platform}'; }, configurable: true });
    Object.defineProperty(navigator, 'vendor', { get: function() { return '${profile.vendor}'; }, configurable: true });
    Object.defineProperty(navigator, 'language', { get: function() { return '${profile.language}'; }, configurable: true });
    Object.defineProperty(navigator, 'languages', { get: function() { return Object.freeze(['${profile.language}', 'en']); }, configurable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: function() { return ${profile.hardwareConcurrency}; }, configurable: true });
    if ('deviceMemory' in navigator) {
      Object.defineProperty(navigator, 'deviceMemory', { get: function() { return ${profile.deviceMemory}; }, configurable: true });
    }
    Object.defineProperty(screen, 'colorDepth', { get: function() { return ${profile.colorDepth}; }, configurable: true });

    if (!isCaptchaPage) {
      Object.defineProperty(navigator, 'webdriver', { get: function() { return false; }, configurable: true });
      if (window.chrome === undefined) {
        window.chrome = { runtime: {}, loadTimes: function() { return {}; }, csi: function() { return {}; } };
      }
      Object.defineProperty(navigator, 'plugins', { get: function() {
        return [{ name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' }, { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' }, { name: 'Native Client', filename: 'internal-nacl-plugin' }];
      }, configurable: true });
    }

    console.log('[LordEEN] Fingerprint applied: ${safeName}');
  } catch(e) {
    console.log('[LordEEN] Spoof partial:', e.message);
  }
})();
true;
`;
}
