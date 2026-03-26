export interface MockLocation {
  id: string;
  country: string;
  city: string;
  flag: string;
  latitude: number;
  longitude: number;
  timezone: string;
  accuracy: number;
}

export const MOCK_LOCATIONS: MockLocation[] = [
  { id: "us_ny", country: "United States", city: "New York", flag: "🇺🇸", latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York", accuracy: 20 },
  { id: "us_la", country: "United States", city: "Los Angeles", flag: "🇺🇸", latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles", accuracy: 25 },
  { id: "us_ch", country: "United States", city: "Chicago", flag: "🇺🇸", latitude: 41.8781, longitude: -87.6298, timezone: "America/Chicago", accuracy: 18 },
  { id: "us_sf", country: "United States", city: "San Francisco", flag: "🇺🇸", latitude: 37.7749, longitude: -122.4194, timezone: "America/Los_Angeles", accuracy: 22 },
  { id: "us_mi", country: "United States", city: "Miami", flag: "🇺🇸", latitude: 25.7617, longitude: -80.1918, timezone: "America/New_York", accuracy: 20 },
  { id: "us_da", country: "United States", city: "Dallas", flag: "🇺🇸", latitude: 32.7767, longitude: -96.7970, timezone: "America/Chicago", accuracy: 24 },
  { id: "us_se", country: "United States", city: "Seattle", flag: "🇺🇸", latitude: 47.6062, longitude: -122.3321, timezone: "America/Los_Angeles", accuracy: 19 },
  { id: "us_dc", country: "United States", city: "Washington D.C.", flag: "🇺🇸", latitude: 38.9072, longitude: -77.0369, timezone: "America/New_York", accuracy: 21 },
  { id: "uk_lo", country: "United Kingdom", city: "London", flag: "🇬🇧", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London", accuracy: 15 },
  { id: "uk_ma", country: "United Kingdom", city: "Manchester", flag: "🇬🇧", latitude: 53.4808, longitude: -2.2426, timezone: "Europe/London", accuracy: 20 },
  { id: "uk_bi", country: "United Kingdom", city: "Birmingham", flag: "🇬🇧", latitude: 52.4862, longitude: -1.8904, timezone: "Europe/London", accuracy: 22 },
  { id: "ca_to", country: "Canada", city: "Toronto", flag: "🇨🇦", latitude: 43.6532, longitude: -79.3832, timezone: "America/Toronto", accuracy: 20 },
  { id: "ca_va", country: "Canada", city: "Vancouver", flag: "🇨🇦", latitude: 49.2827, longitude: -123.1207, timezone: "America/Vancouver", accuracy: 18 },
  { id: "ca_mo", country: "Canada", city: "Montreal", flag: "🇨🇦", latitude: 45.5017, longitude: -73.5673, timezone: "America/Toronto", accuracy: 22 },
  { id: "de_be", country: "Germany", city: "Berlin", flag: "🇩🇪", latitude: 52.5200, longitude: 13.4050, timezone: "Europe/Berlin", accuracy: 18 },
  { id: "de_mu", country: "Germany", city: "Munich", flag: "🇩🇪", latitude: 48.1351, longitude: 11.5820, timezone: "Europe/Berlin", accuracy: 20 },
  { id: "de_fr", country: "Germany", city: "Frankfurt", flag: "🇩🇪", latitude: 50.1109, longitude: 8.6821, timezone: "Europe/Berlin", accuracy: 16 },
  { id: "fr_pa", country: "France", city: "Paris", flag: "🇫🇷", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris", accuracy: 15 },
  { id: "fr_ly", country: "France", city: "Lyon", flag: "🇫🇷", latitude: 45.7640, longitude: 4.8357, timezone: "Europe/Paris", accuracy: 22 },
  { id: "fr_ma", country: "France", city: "Marseille", flag: "🇫🇷", latitude: 43.2965, longitude: 5.3698, timezone: "Europe/Paris", accuracy: 20 },
  { id: "jp_to", country: "Japan", city: "Tokyo", flag: "🇯🇵", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo", accuracy: 12 },
  { id: "jp_os", country: "Japan", city: "Osaka", flag: "🇯🇵", latitude: 34.6937, longitude: 135.5023, timezone: "Asia/Tokyo", accuracy: 18 },
  { id: "kr_se", country: "South Korea", city: "Seoul", flag: "🇰🇷", latitude: 37.5665, longitude: 126.9780, timezone: "Asia/Seoul", accuracy: 15 },
  { id: "kr_bu", country: "South Korea", city: "Busan", flag: "🇰🇷", latitude: 35.1796, longitude: 129.0756, timezone: "Asia/Seoul", accuracy: 20 },
  { id: "cn_sh", country: "China", city: "Shanghai", flag: "🇨🇳", latitude: 31.2304, longitude: 121.4737, timezone: "Asia/Shanghai", accuracy: 20 },
  { id: "cn_be", country: "China", city: "Beijing", flag: "🇨🇳", latitude: 39.9042, longitude: 116.4074, timezone: "Asia/Shanghai", accuracy: 22 },
  { id: "cn_sz", country: "China", city: "Shenzhen", flag: "🇨🇳", latitude: 22.5431, longitude: 114.0579, timezone: "Asia/Shanghai", accuracy: 18 },
  { id: "in_mu", country: "India", city: "Mumbai", flag: "🇮🇳", latitude: 19.0760, longitude: 72.8777, timezone: "Asia/Kolkata", accuracy: 25 },
  { id: "in_de", country: "India", city: "Delhi", flag: "🇮🇳", latitude: 28.7041, longitude: 77.1025, timezone: "Asia/Kolkata", accuracy: 22 },
  { id: "in_ba", country: "India", city: "Bangalore", flag: "🇮🇳", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", accuracy: 20 },
  { id: "au_sy", country: "Australia", city: "Sydney", flag: "🇦🇺", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney", accuracy: 18 },
  { id: "au_me", country: "Australia", city: "Melbourne", flag: "🇦🇺", latitude: -37.8136, longitude: 144.9631, timezone: "Australia/Melbourne", accuracy: 20 },
  { id: "br_sp", country: "Brazil", city: "São Paulo", flag: "🇧🇷", latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo", accuracy: 25 },
  { id: "br_rj", country: "Brazil", city: "Rio de Janeiro", flag: "🇧🇷", latitude: -22.9068, longitude: -43.1729, timezone: "America/Sao_Paulo", accuracy: 22 },
  { id: "mx_mc", country: "Mexico", city: "Mexico City", flag: "🇲🇽", latitude: 19.4326, longitude: -99.1332, timezone: "America/Mexico_City", accuracy: 20 },
  { id: "mx_gd", country: "Mexico", city: "Guadalajara", flag: "🇲🇽", latitude: 20.6597, longitude: -103.3496, timezone: "America/Mexico_City", accuracy: 24 },
  { id: "ar_ba", country: "Argentina", city: "Buenos Aires", flag: "🇦🇷", latitude: -34.6037, longitude: -58.3816, timezone: "America/Argentina/Buenos_Aires", accuracy: 20 },
  { id: "co_bo", country: "Colombia", city: "Bogotá", flag: "🇨🇴", latitude: 4.7110, longitude: -74.0721, timezone: "America/Bogota", accuracy: 22 },
  { id: "it_ro", country: "Italy", city: "Rome", flag: "🇮🇹", latitude: 41.9028, longitude: 12.4964, timezone: "Europe/Rome", accuracy: 16 },
  { id: "it_mi", country: "Italy", city: "Milan", flag: "🇮🇹", latitude: 45.4642, longitude: 9.1900, timezone: "Europe/Rome", accuracy: 18 },
  { id: "es_ma", country: "Spain", city: "Madrid", flag: "🇪🇸", latitude: 40.4168, longitude: -3.7038, timezone: "Europe/Madrid", accuracy: 18 },
  { id: "es_ba", country: "Spain", city: "Barcelona", flag: "🇪🇸", latitude: 41.3874, longitude: 2.1686, timezone: "Europe/Madrid", accuracy: 16 },
  { id: "nl_am", country: "Netherlands", city: "Amsterdam", flag: "🇳🇱", latitude: 52.3676, longitude: 4.9041, timezone: "Europe/Amsterdam", accuracy: 14 },
  { id: "pt_li", country: "Portugal", city: "Lisbon", flag: "🇵🇹", latitude: 38.7223, longitude: -9.1393, timezone: "Europe/Lisbon", accuracy: 18 },
  { id: "se_st", country: "Sweden", city: "Stockholm", flag: "🇸🇪", latitude: 59.3293, longitude: 18.0686, timezone: "Europe/Stockholm", accuracy: 16 },
  { id: "no_os", country: "Norway", city: "Oslo", flag: "🇳🇴", latitude: 59.9139, longitude: 10.7522, timezone: "Europe/Oslo", accuracy: 18 },
  { id: "dk_co", country: "Denmark", city: "Copenhagen", flag: "🇩🇰", latitude: 55.6761, longitude: 12.5683, timezone: "Europe/Copenhagen", accuracy: 16 },
  { id: "fi_he", country: "Finland", city: "Helsinki", flag: "🇫🇮", latitude: 60.1699, longitude: 24.9384, timezone: "Europe/Helsinki", accuracy: 18 },
  { id: "pl_wa", country: "Poland", city: "Warsaw", flag: "🇵🇱", latitude: 52.2297, longitude: 21.0122, timezone: "Europe/Warsaw", accuracy: 20 },
  { id: "cz_pr", country: "Czech Republic", city: "Prague", flag: "🇨🇿", latitude: 50.0755, longitude: 14.4378, timezone: "Europe/Prague", accuracy: 16 },
  { id: "at_vi", country: "Austria", city: "Vienna", flag: "🇦🇹", latitude: 48.2082, longitude: 16.3738, timezone: "Europe/Vienna", accuracy: 16 },
  { id: "ch_zu", country: "Switzerland", city: "Zurich", flag: "🇨🇭", latitude: 47.3769, longitude: 8.5417, timezone: "Europe/Zurich", accuracy: 14 },
  { id: "be_br", country: "Belgium", city: "Brussels", flag: "🇧🇪", latitude: 50.8503, longitude: 4.3517, timezone: "Europe/Brussels", accuracy: 16 },
  { id: "ie_du", country: "Ireland", city: "Dublin", flag: "🇮🇪", latitude: 53.3498, longitude: -6.2603, timezone: "Europe/Dublin", accuracy: 18 },
  { id: "ru_mo", country: "Russia", city: "Moscow", flag: "🇷🇺", latitude: 55.7558, longitude: 37.6173, timezone: "Europe/Moscow", accuracy: 22 },
  { id: "ru_sp", country: "Russia", city: "St. Petersburg", flag: "🇷🇺", latitude: 59.9343, longitude: 30.3351, timezone: "Europe/Moscow", accuracy: 24 },
  { id: "tr_is", country: "Turkey", city: "Istanbul", flag: "🇹🇷", latitude: 41.0082, longitude: 28.9784, timezone: "Europe/Istanbul", accuracy: 20 },
  { id: "ae_du", country: "UAE", city: "Dubai", flag: "🇦🇪", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai", accuracy: 15 },
  { id: "ae_ad", country: "UAE", city: "Abu Dhabi", flag: "🇦🇪", latitude: 24.4539, longitude: 54.3773, timezone: "Asia/Dubai", accuracy: 18 },
  { id: "sa_ri", country: "Saudi Arabia", city: "Riyadh", flag: "🇸🇦", latitude: 24.7136, longitude: 46.6753, timezone: "Asia/Riyadh", accuracy: 22 },
  { id: "sa_je", country: "Saudi Arabia", city: "Jeddah", flag: "🇸🇦", latitude: 21.4858, longitude: 39.1925, timezone: "Asia/Riyadh", accuracy: 24 },
  { id: "eg_ca", country: "Egypt", city: "Cairo", flag: "🇪🇬", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo", accuracy: 25 },
  { id: "za_jo", country: "South Africa", city: "Johannesburg", flag: "🇿🇦", latitude: -26.2041, longitude: 28.0473, timezone: "Africa/Johannesburg", accuracy: 22 },
  { id: "za_ct", country: "South Africa", city: "Cape Town", flag: "🇿🇦", latitude: -33.9249, longitude: 18.4241, timezone: "Africa/Johannesburg", accuracy: 20 },
  { id: "ng_la", country: "Nigeria", city: "Lagos", flag: "🇳🇬", latitude: 6.5244, longitude: 3.3792, timezone: "Africa/Lagos", accuracy: 30 },
  { id: "ke_na", country: "Kenya", city: "Nairobi", flag: "🇰🇪", latitude: -1.2921, longitude: 36.8219, timezone: "Africa/Nairobi", accuracy: 28 },
  { id: "sg_sg", country: "Singapore", city: "Singapore", flag: "🇸🇬", latitude: 1.3521, longitude: 103.8198, timezone: "Asia/Singapore", accuracy: 12 },
  { id: "my_kl", country: "Malaysia", city: "Kuala Lumpur", flag: "🇲🇾", latitude: 3.1390, longitude: 101.6869, timezone: "Asia/Kuala_Lumpur", accuracy: 20 },
  { id: "th_bk", country: "Thailand", city: "Bangkok", flag: "🇹🇭", latitude: 13.7563, longitude: 100.5018, timezone: "Asia/Bangkok", accuracy: 22 },
  { id: "id_jk", country: "Indonesia", city: "Jakarta", flag: "🇮🇩", latitude: -6.2088, longitude: 106.8456, timezone: "Asia/Jakarta", accuracy: 25 },
  { id: "ph_mn", country: "Philippines", city: "Manila", flag: "🇵🇭", latitude: 14.5995, longitude: 120.9842, timezone: "Asia/Manila", accuracy: 24 },
  { id: "vn_hc", country: "Vietnam", city: "Ho Chi Minh", flag: "🇻🇳", latitude: 10.8231, longitude: 106.6297, timezone: "Asia/Ho_Chi_Minh", accuracy: 22 },
  { id: "tw_ta", country: "Taiwan", city: "Taipei", flag: "🇹🇼", latitude: 25.0330, longitude: 121.5654, timezone: "Asia/Taipei", accuracy: 16 },
  { id: "hk_hk", country: "Hong Kong", city: "Hong Kong", flag: "🇭🇰", latitude: 22.3193, longitude: 114.1694, timezone: "Asia/Hong_Kong", accuracy: 14 },
  { id: "nz_au", country: "New Zealand", city: "Auckland", flag: "🇳🇿", latitude: -36.8485, longitude: 174.7633, timezone: "Pacific/Auckland", accuracy: 18 },
  { id: "cl_sa", country: "Chile", city: "Santiago", flag: "🇨🇱", latitude: -33.4489, longitude: -70.6693, timezone: "America/Santiago", accuracy: 22 },
  { id: "pe_li", country: "Peru", city: "Lima", flag: "🇵🇪", latitude: -12.0464, longitude: -77.0428, timezone: "America/Lima", accuracy: 24 },
  { id: "il_ta", country: "Israel", city: "Tel Aviv", flag: "🇮🇱", latitude: 32.0853, longitude: 34.7818, timezone: "Asia/Jerusalem", accuracy: 16 },
  { id: "gr_at", country: "Greece", city: "Athens", flag: "🇬🇷", latitude: 37.9838, longitude: 23.7275, timezone: "Europe/Athens", accuracy: 20 },
  { id: "ro_bu", country: "Romania", city: "Bucharest", flag: "🇷🇴", latitude: 44.4268, longitude: 26.1025, timezone: "Europe/Bucharest", accuracy: 22 },
  { id: "hu_bu", country: "Hungary", city: "Budapest", flag: "🇭🇺", latitude: 47.4979, longitude: 19.0402, timezone: "Europe/Budapest", accuracy: 18 },
  { id: "ua_ki", country: "Ukraine", city: "Kyiv", flag: "🇺🇦", latitude: 50.4501, longitude: 30.5234, timezone: "Europe/Kyiv", accuracy: 24 },
  { id: "pk_ka", country: "Pakistan", city: "Karachi", flag: "🇵🇰", latitude: 24.8607, longitude: 67.0011, timezone: "Asia/Karachi", accuracy: 28 },
  { id: "pk_la", country: "Pakistan", city: "Lahore", flag: "🇵🇰", latitude: 31.5204, longitude: 74.3587, timezone: "Asia/Karachi", accuracy: 26 },
  { id: "bd_dh", country: "Bangladesh", city: "Dhaka", flag: "🇧🇩", latitude: 23.8103, longitude: 90.4125, timezone: "Asia/Dhaka", accuracy: 30 },
  { id: "lk_co", country: "Sri Lanka", city: "Colombo", flag: "🇱🇰", latitude: 6.9271, longitude: 79.8612, timezone: "Asia/Colombo", accuracy: 24 },
  { id: "np_kt", country: "Nepal", city: "Kathmandu", flag: "🇳🇵", latitude: 27.7172, longitude: 85.3240, timezone: "Asia/Kathmandu", accuracy: 28 },
  { id: "ma_ca", country: "Morocco", city: "Casablanca", flag: "🇲🇦", latitude: 33.5731, longitude: -7.5898, timezone: "Africa/Casablanca", accuracy: 24 },
  { id: "gh_ac", country: "Ghana", city: "Accra", flag: "🇬🇭", latitude: 5.6037, longitude: -0.1870, timezone: "Africa/Accra", accuracy: 30 },
  { id: "et_ad", country: "Ethiopia", city: "Addis Ababa", flag: "🇪🇹", latitude: 9.0250, longitude: 38.7469, timezone: "Africa/Addis_Ababa", accuracy: 32 },
  { id: "iq_ba", country: "Iraq", city: "Baghdad", flag: "🇮🇶", latitude: 33.3152, longitude: 44.3661, timezone: "Asia/Baghdad", accuracy: 28 },
  { id: "ir_te", country: "Iran", city: "Tehran", flag: "🇮🇷", latitude: 35.6892, longitude: 51.3890, timezone: "Asia/Tehran", accuracy: 26 },
  { id: "kw_kc", country: "Kuwait", city: "Kuwait City", flag: "🇰🇼", latitude: 29.3759, longitude: 47.9774, timezone: "Asia/Kuwait", accuracy: 18 },
  { id: "qa_do", country: "Qatar", city: "Doha", flag: "🇶🇦", latitude: 25.2854, longitude: 51.5310, timezone: "Asia/Qatar", accuracy: 16 },
  { id: "om_mu", country: "Oman", city: "Muscat", flag: "🇴🇲", latitude: 23.5880, longitude: 58.3829, timezone: "Asia/Muscat", accuracy: 20 },
  { id: "bh_mn", country: "Bahrain", city: "Manama", flag: "🇧🇭", latitude: 26.2285, longitude: 50.5860, timezone: "Asia/Bahrain", accuracy: 14 },
  { id: "jo_am", country: "Jordan", city: "Amman", flag: "🇯🇴", latitude: 31.9454, longitude: 35.9284, timezone: "Asia/Amman", accuracy: 22 },
  { id: "lb_be", country: "Lebanon", city: "Beirut", flag: "🇱🇧", latitude: 33.8938, longitude: 35.5018, timezone: "Asia/Beirut", accuracy: 20 },
];

export const LOCATION_COUNTRIES = Array.from(
  new Set(MOCK_LOCATIONS.map((l) => l.country))
);

export function searchLocations(query: string): MockLocation[] {
  const q = query.toLowerCase().trim();
  if (!q) return MOCK_LOCATIONS;
  return MOCK_LOCATIONS.filter(
    (l) =>
      l.country.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.flag.includes(q)
  );
}

export function getLocationById(id: string): MockLocation | null {
  return MOCK_LOCATIONS.find((l) => l.id === id) ?? null;
}

export function getRandomLocation(): MockLocation {
  return MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)];
}

export function getGeolocationSpoofScript(location: MockLocation): string {
  const jitter = () => (Math.random() - 0.5) * 0.002;
  const lat = location.latitude + jitter();
  const lng = location.longitude + jitter();
  return `
(function() {
  try {
    var mockLat = ${lat};
    var mockLng = ${lng};
    var mockAccuracy = ${location.accuracy};
    var mockTimezone = '${location.timezone}';

    var fakePosition = {
      coords: {
        latitude: mockLat,
        longitude: mockLng,
        accuracy: mockAccuracy,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    if (navigator.geolocation) {
      var origGetCurrent = navigator.geolocation.getCurrentPosition;
      var origWatch = navigator.geolocation.watchPosition;

      navigator.geolocation.getCurrentPosition = function(success, error, options) {
        if (typeof success === 'function') {
          setTimeout(function() {
            fakePosition.timestamp = Date.now();
            success(fakePosition);
          }, 50 + Math.random() * 200);
        }
      };

      navigator.geolocation.watchPosition = function(success, error, options) {
        var watchId = Math.floor(Math.random() * 10000);
        if (typeof success === 'function') {
          var interval = setInterval(function() {
            fakePosition.timestamp = Date.now();
            fakePosition.coords.latitude = mockLat + (Math.random() - 0.5) * 0.0001;
            fakePosition.coords.longitude = mockLng + (Math.random() - 0.5) * 0.0001;
            success(fakePosition);
          }, 3000);
          navigator.geolocation['_watchIntervals'] = navigator.geolocation['_watchIntervals'] || {};
          navigator.geolocation['_watchIntervals'][watchId] = interval;
        }
        return watchId;
      };

      var origClear = navigator.geolocation.clearWatch;
      navigator.geolocation.clearWatch = function(id) {
        if (navigator.geolocation['_watchIntervals'] && navigator.geolocation['_watchIntervals'][id]) {
          clearInterval(navigator.geolocation['_watchIntervals'][id]);
          delete navigator.geolocation['_watchIntervals'][id];
        }
      };
    }

    try {
      Object.defineProperty(Intl, 'DateTimeFormat', {
        value: new Proxy(Intl.DateTimeFormat, {
          construct: function(target, args) {
            if (!args[1] || !args[1].timeZone) {
              args[1] = args[1] || {};
              args[1].timeZone = mockTimezone;
            }
            return new target(args[0], args[1]);
          }
        })
      });
    } catch(e) {}

    console.log('[LordEEN] GPS spoofed to: ' + mockLat.toFixed(4) + ', ' + mockLng.toFixed(4) + ' (' + mockTimezone + ')');
  } catch(e) {
    console.log('[LordEEN] Geolocation spoof error:', e);
  }
})();
`;
}
