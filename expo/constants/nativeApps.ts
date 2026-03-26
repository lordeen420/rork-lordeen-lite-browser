export interface NativeApp {
  id: string;
  name: string;
  category: string;
  url: string;
  icon: string;
  color: string;
  packageAndroid?: string;
  bundleIOS?: string;
}

export const APP_CATEGORIES = [
  "Social",
  "Messaging",
  "Shopping",
  "Finance",
  "Streaming",
  "Productivity",
  "Food",
  "Travel",
  "Gaming",
  "News",
  "Health",
  "Crypto",
  "Dating",
  "Music",
  "Photo",
  "Utilities",
] as const;

export const NATIVE_APPS: NativeApp[] = [
  { id: "instagram", name: "Instagram", category: "Social", url: "https://www.instagram.com", icon: "Camera", color: "#E1306C", packageAndroid: "com.instagram.android", bundleIOS: "com.burbn.instagram" },
  { id: "facebook", name: "Facebook", category: "Social", url: "https://m.facebook.com", icon: "Globe", color: "#1877F2", packageAndroid: "com.facebook.katana", bundleIOS: "com.facebook.Facebook" },
  { id: "twitter", name: "X (Twitter)", category: "Social", url: "https://x.com", icon: "MessageCircle", color: "#1DA1F2", packageAndroid: "com.twitter.android", bundleIOS: "com.atebits.Tweetie2" },
  { id: "tiktok", name: "TikTok", category: "Social", url: "https://www.tiktok.com", icon: "Play", color: "#010101", packageAndroid: "com.zhiliaoapp.musically", bundleIOS: "com.zhiliaoapp.musically" },
  { id: "snapchat", name: "Snapchat", category: "Social", url: "https://web.snapchat.com", icon: "Camera", color: "#FFFC00", packageAndroid: "com.snapchat.android", bundleIOS: "com.toyopagroup.picaboo" },
  { id: "reddit", name: "Reddit", category: "Social", url: "https://www.reddit.com", icon: "MessageCircle", color: "#FF4500", packageAndroid: "com.reddit.frontpage", bundleIOS: "com.reddit.Reddit" },
  { id: "pinterest", name: "Pinterest", category: "Social", url: "https://www.pinterest.com", icon: "Heart", color: "#E60023", packageAndroid: "com.pinterest", bundleIOS: "com.pinterest" },
  { id: "linkedin", name: "LinkedIn", category: "Social", url: "https://www.linkedin.com", icon: "Briefcase", color: "#0A66C2", packageAndroid: "com.linkedin.android", bundleIOS: "com.linkedin.LinkedIn" },
  { id: "threads", name: "Threads", category: "Social", url: "https://www.threads.net", icon: "MessageCircle", color: "#000000", packageAndroid: "com.instagram.barcelona", bundleIOS: "com.burbn.barcelona" },
  { id: "tumblr", name: "Tumblr", category: "Social", url: "https://www.tumblr.com", icon: "BookOpen", color: "#36465D", packageAndroid: "com.tumblr", bundleIOS: "com.tumblr.tumblr" },

  { id: "whatsapp", name: "WhatsApp", category: "Messaging", url: "https://web.whatsapp.com", icon: "MessageCircle", color: "#25D366", packageAndroid: "com.whatsapp", bundleIOS: "net.whatsapp.WhatsApp" },
  { id: "telegram", name: "Telegram", category: "Messaging", url: "https://web.telegram.org", icon: "MessageCircle", color: "#0088CC", packageAndroid: "org.telegram.messenger", bundleIOS: "ph.telegra.Telegraph" },
  { id: "messenger", name: "Messenger", category: "Messaging", url: "https://www.messenger.com", icon: "MessageCircle", color: "#006AFF", packageAndroid: "com.facebook.orca", bundleIOS: "com.facebook.Messenger" },
  { id: "signal", name: "Signal", category: "Messaging", url: "https://signal.org", icon: "MessageCircle", color: "#3A76F0", packageAndroid: "org.thoughtcrime.securesms", bundleIOS: "org.whispersystems.signal" },
  { id: "discord", name: "Discord", category: "Messaging", url: "https://discord.com/app", icon: "MessageCircle", color: "#5865F2", packageAndroid: "com.discord", bundleIOS: "com.hammerandchisel.discord" },
  { id: "viber", name: "Viber", category: "Messaging", url: "https://www.viber.com", icon: "MessageCircle", color: "#7360F2", packageAndroid: "com.viber.voip", bundleIOS: "com.viber" },
  { id: "wechat", name: "WeChat", category: "Messaging", url: "https://web.wechat.com", icon: "MessageCircle", color: "#09B83E", packageAndroid: "com.tencent.mm", bundleIOS: "com.tencent.xin" },
  { id: "line", name: "LINE", category: "Messaging", url: "https://line.me", icon: "MessageCircle", color: "#00B900", packageAndroid: "jp.naver.line.android", bundleIOS: "jp.naver.line" },
  { id: "skype", name: "Skype", category: "Messaging", url: "https://web.skype.com", icon: "MessageCircle", color: "#00AFF0", packageAndroid: "com.skype.raider", bundleIOS: "com.skype.skype" },
  { id: "slack", name: "Slack", category: "Messaging", url: "https://app.slack.com", icon: "MessageCircle", color: "#4A154B", packageAndroid: "com.Slack", bundleIOS: "com.tinyspeck.chatlyio" },

  { id: "amazon", name: "Amazon", category: "Shopping", url: "https://www.amazon.com", icon: "ShoppingCart", color: "#FF9900", packageAndroid: "com.amazon.mShop.android.shopping", bundleIOS: "com.amazon.Amazon" },
  { id: "ebay", name: "eBay", category: "Shopping", url: "https://www.ebay.com", icon: "ShoppingCart", color: "#E53238", packageAndroid: "com.ebay.mobile", bundleIOS: "com.ebay.iphone" },
  { id: "aliexpress", name: "AliExpress", category: "Shopping", url: "https://www.aliexpress.com", icon: "ShoppingCart", color: "#E43225", packageAndroid: "com.alibaba.aliexpresshd", bundleIOS: "com.alibaba.iAliexpress" },
  { id: "shopee", name: "Shopee", category: "Shopping", url: "https://shopee.com", icon: "ShoppingCart", color: "#EE4D2D", packageAndroid: "com.shopee.id", bundleIOS: "com.shopee.ShopeeSG" },
  { id: "walmart", name: "Walmart", category: "Shopping", url: "https://www.walmart.com", icon: "ShoppingCart", color: "#0071DC", packageAndroid: "com.walmart.android", bundleIOS: "com.walmart.electronics" },
  { id: "wish", name: "Wish", category: "Shopping", url: "https://www.wish.com", icon: "Gift", color: "#2FB7EC", packageAndroid: "com.contextlogic.wish", bundleIOS: "com.contextlogic.Wish" },
  { id: "shein", name: "SHEIN", category: "Shopping", url: "https://m.shein.com", icon: "ShoppingCart", color: "#000000", packageAndroid: "com.zzkko", bundleIOS: "com.zzkko" },
  { id: "etsy", name: "Etsy", category: "Shopping", url: "https://www.etsy.com", icon: "Gift", color: "#F1641E", packageAndroid: "com.etsy.android", bundleIOS: "com.etsy.EtsyInc" },
  { id: "temu", name: "Temu", category: "Shopping", url: "https://www.temu.com", icon: "ShoppingCart", color: "#F86D31", packageAndroid: "com.einnovation.temu", bundleIOS: "com.einnovation.temu" },
  { id: "flipkart", name: "Flipkart", category: "Shopping", url: "https://www.flipkart.com", icon: "ShoppingCart", color: "#2874F0", packageAndroid: "com.flipkart.android", bundleIOS: "com.flipkart.flipkart" },

  { id: "stripe", name: "Stripe", category: "Finance", url: "https://dashboard.stripe.com", icon: "CreditCard", color: "#635BFF", packageAndroid: "com.stripe.android.dashboard", bundleIOS: "com.stripe.ios.dashboard" },
  { id: "paypal", name: "PayPal", category: "Finance", url: "https://www.paypal.com", icon: "Wallet", color: "#003087", packageAndroid: "com.paypal.android.p2pmobile", bundleIOS: "com.yourcompany.PPClient" },
  { id: "cashapp", name: "Cash App", category: "Finance", url: "https://cash.app", icon: "Wallet", color: "#00D632", packageAndroid: "com.squareup.cash", bundleIOS: "com.squareup.cash" },
  { id: "venmo", name: "Venmo", category: "Finance", url: "https://venmo.com", icon: "Wallet", color: "#3D95CE", packageAndroid: "com.venmo", bundleIOS: "com.venmo.Venmo" },
  { id: "robinhood", name: "Robinhood", category: "Finance", url: "https://robinhood.com", icon: "Zap", color: "#00C805", packageAndroid: "com.robinhood.android", bundleIOS: "com.robinhood.release.Robinhood" },
  { id: "revolut", name: "Revolut", category: "Finance", url: "https://app.revolut.com", icon: "CreditCard", color: "#0075EB", packageAndroid: "com.revolut.revolut", bundleIOS: "com.revolut.revolutiphone" },
  { id: "wise", name: "Wise", category: "Finance", url: "https://wise.com", icon: "Globe", color: "#9FE870", packageAndroid: "com.transferwise.android", bundleIOS: "com.transferwise.TransferWise" },
  { id: "chime", name: "Chime", category: "Finance", url: "https://www.chime.com", icon: "CreditCard", color: "#1EC677", packageAndroid: "com.onedebit.chime", bundleIOS: "com.onedebit.Chime" },
  { id: "zelle", name: "Zelle", category: "Finance", url: "https://www.zellepay.com", icon: "Wallet", color: "#6D1ED4", packageAndroid: "com.zellepay.zelle", bundleIOS: "com.earlywarning.zelle" },
  { id: "gpay", name: "Google Pay", category: "Finance", url: "https://pay.google.com", icon: "Wallet", color: "#4285F4", packageAndroid: "com.google.android.apps.nbu.paisa.user", bundleIOS: "com.google.Tez" },

  { id: "youtube", name: "YouTube", category: "Streaming", url: "https://m.youtube.com", icon: "Play", color: "#FF0000", packageAndroid: "com.google.android.youtube", bundleIOS: "com.google.ios.youtube" },
  { id: "netflix", name: "Netflix", category: "Streaming", url: "https://www.netflix.com", icon: "Play", color: "#E50914", packageAndroid: "com.netflix.mediaclient", bundleIOS: "com.netflix.Netflix" },
  { id: "twitch", name: "Twitch", category: "Streaming", url: "https://www.twitch.tv", icon: "Play", color: "#9146FF", packageAndroid: "tv.twitch.android.app", bundleIOS: "tv.twitch" },
  { id: "primevideo", name: "Prime Video", category: "Streaming", url: "https://www.primevideo.com", icon: "Play", color: "#00A8E1", packageAndroid: "com.amazon.avod.thirdpartyclient", bundleIOS: "com.amazon.aiv.AIVApp" },
  { id: "disneyplus", name: "Disney+", category: "Streaming", url: "https://www.disneyplus.com", icon: "Star", color: "#113CCF", packageAndroid: "com.disney.disneyplus", bundleIOS: "com.disney.disneyplus" },
  { id: "hbomax", name: "Max (HBO)", category: "Streaming", url: "https://play.max.com", icon: "Play", color: "#002BE7", packageAndroid: "com.wbd.stream", bundleIOS: "com.wbd.stream" },
  { id: "hulu", name: "Hulu", category: "Streaming", url: "https://www.hulu.com", icon: "Play", color: "#1CE783", packageAndroid: "com.hulu.plus", bundleIOS: "com.hulu.plus" },
  { id: "peacock", name: "Peacock", category: "Streaming", url: "https://www.peacocktv.com", icon: "Play", color: "#000000", packageAndroid: "com.peacocktv.peacockandroid", bundleIOS: "com.nbcu.nbc" },
  { id: "crunchyroll", name: "Crunchyroll", category: "Streaming", url: "https://www.crunchyroll.com", icon: "Play", color: "#F47521", packageAndroid: "com.crunchyroll.crunchyroid", bundleIOS: "com.crunchyroll.iphone" },
  { id: "spotify_stream", name: "Spotify", category: "Streaming", url: "https://open.spotify.com", icon: "Music", color: "#1DB954", packageAndroid: "com.spotify.music", bundleIOS: "com.spotify.client" },

  { id: "gmail", name: "Gmail", category: "Productivity", url: "https://mail.google.com", icon: "Mail", color: "#EA4335", packageAndroid: "com.google.android.gm", bundleIOS: "com.google.Gmail" },
  { id: "outlook", name: "Outlook", category: "Productivity", url: "https://outlook.live.com", icon: "Mail", color: "#0078D4", packageAndroid: "com.microsoft.office.outlook", bundleIOS: "com.microsoft.Office.Outlook" },
  { id: "gdrive", name: "Google Drive", category: "Productivity", url: "https://drive.google.com", icon: "Cloud", color: "#4285F4", packageAndroid: "com.google.android.apps.docs", bundleIOS: "com.google.Drive" },
  { id: "dropbox", name: "Dropbox", category: "Productivity", url: "https://www.dropbox.com", icon: "Cloud", color: "#0061FF", packageAndroid: "com.dropbox.android", bundleIOS: "com.getdropbox.Dropbox" },
  { id: "notion", name: "Notion", category: "Productivity", url: "https://www.notion.so", icon: "BookOpen", color: "#000000", packageAndroid: "notion.id", bundleIOS: "notion.id" },
  { id: "trello", name: "Trello", category: "Productivity", url: "https://trello.com", icon: "BookOpen", color: "#0052CC", packageAndroid: "com.trello", bundleIOS: "com.fogcreek.trello" },
  { id: "gdocs", name: "Google Docs", category: "Productivity", url: "https://docs.google.com", icon: "BookOpen", color: "#4285F4", packageAndroid: "com.google.android.apps.docs.editors.docs", bundleIOS: "com.google.Docs" },
  { id: "zoom", name: "Zoom", category: "Productivity", url: "https://zoom.us", icon: "Globe", color: "#2D8CFF", packageAndroid: "us.zoom.videomeetings", bundleIOS: "us.zoom.videomeetings" },
  { id: "teams", name: "Microsoft Teams", category: "Productivity", url: "https://teams.microsoft.com", icon: "Globe", color: "#6264A7", packageAndroid: "com.microsoft.teams", bundleIOS: "com.microsoft.skype.teams" },
  { id: "github", name: "GitHub", category: "Productivity", url: "https://github.com", icon: "Globe", color: "#333333", packageAndroid: "com.github.android", bundleIOS: "com.github.stormcrow" },

  { id: "ubereats", name: "Uber Eats", category: "Food", url: "https://www.ubereats.com", icon: "Coffee", color: "#06C167", packageAndroid: "com.ubercab.eats", bundleIOS: "com.ubercab.UberEats" },
  { id: "doordash", name: "DoorDash", category: "Food", url: "https://www.doordash.com", icon: "Coffee", color: "#FF3008", packageAndroid: "com.dd.doordash", bundleIOS: "com.doordash.enterprise.DoorDash" },
  { id: "grubhub", name: "Grubhub", category: "Food", url: "https://www.grubhub.com", icon: "Coffee", color: "#F63440", packageAndroid: "com.grubhub.android", bundleIOS: "com.grubhub.GrubHub" },
  { id: "instacart", name: "Instacart", category: "Food", url: "https://www.instacart.com", icon: "ShoppingCart", color: "#43B02A", packageAndroid: "com.instacart.client", bundleIOS: "com.instacart.client" },
  { id: "mcdonalds", name: "McDonald's", category: "Food", url: "https://www.mcdonalds.com", icon: "Coffee", color: "#FFC72C", packageAndroid: "com.mcdonalds.app", bundleIOS: "com.mcdonalds.gma" },
  { id: "starbucks", name: "Starbucks", category: "Food", url: "https://www.starbucks.com", icon: "Coffee", color: "#00704A", packageAndroid: "com.starbucks.mobilecard", bundleIOS: "com.starbucks.mystarbucks" },

  { id: "uber", name: "Uber", category: "Travel", url: "https://m.uber.com", icon: "Compass", color: "#000000", packageAndroid: "com.ubercab", bundleIOS: "com.ubercab.UberClient" },
  { id: "lyft", name: "Lyft", category: "Travel", url: "https://www.lyft.com", icon: "Compass", color: "#FF00BF", packageAndroid: "me.lyft.android", bundleIOS: "com.zimride.instant" },
  { id: "airbnb", name: "Airbnb", category: "Travel", url: "https://www.airbnb.com", icon: "Compass", color: "#FF5A5F", packageAndroid: "com.airbnb.android", bundleIOS: "com.airbnb.app" },
  { id: "booking", name: "Booking.com", category: "Travel", url: "https://www.booking.com", icon: "Compass", color: "#003580", packageAndroid: "com.booking", bundleIOS: "com.booking.BookingApp" },
  { id: "gmaps", name: "Google Maps", category: "Travel", url: "https://maps.google.com", icon: "Compass", color: "#4285F4", packageAndroid: "com.google.android.apps.maps", bundleIOS: "com.google.Maps" },
  { id: "expedia", name: "Expedia", category: "Travel", url: "https://www.expedia.com", icon: "Compass", color: "#FFCC00", packageAndroid: "com.expedia.bookings", bundleIOS: "com.expedia.Expedia" },

  { id: "coinbase", name: "Coinbase", category: "Crypto", url: "https://www.coinbase.com", icon: "Wallet", color: "#0052FF", packageAndroid: "com.coinbase.android", bundleIOS: "com.coinbase.Coinbase" },
  { id: "binance", name: "Binance", category: "Crypto", url: "https://www.binance.com", icon: "Zap", color: "#F0B90B", packageAndroid: "com.binance.dev", bundleIOS: "com.czzhao.binance" },
  { id: "crypto_com", name: "Crypto.com", category: "Crypto", url: "https://crypto.com", icon: "Wallet", color: "#103F68", packageAndroid: "co.mona.android", bundleIOS: "co.mona.ios" },
  { id: "metamask", name: "MetaMask", category: "Crypto", url: "https://metamask.io", icon: "Wallet", color: "#F6851B", packageAndroid: "io.metamask", bundleIOS: "io.metamask" },
  { id: "phantom", name: "Phantom", category: "Crypto", url: "https://phantom.app", icon: "Wallet", color: "#AB9FF2", packageAndroid: "app.phantom", bundleIOS: "app.phantom" },
  { id: "trustwallet", name: "Trust Wallet", category: "Crypto", url: "https://trustwallet.com", icon: "Wallet", color: "#0500FF", packageAndroid: "com.wallet.crypto.trustapp", bundleIOS: "com.sixdays.trust" },

  { id: "tinder", name: "Tinder", category: "Dating", url: "https://tinder.com", icon: "Heart", color: "#FE3C72", packageAndroid: "com.tinder", bundleIOS: "com.cardify.tinder" },
  { id: "bumble", name: "Bumble", category: "Dating", url: "https://bumble.com", icon: "Heart", color: "#FAC31D", packageAndroid: "com.bumble.app", bundleIOS: "com.mosaic.bumble" },
  { id: "hinge", name: "Hinge", category: "Dating", url: "https://hinge.co", icon: "Heart", color: "#000000", packageAndroid: "co.hinge.app", bundleIOS: "co.hinge.app" },
  { id: "badoo", name: "Badoo", category: "Dating", url: "https://badoo.com", icon: "Heart", color: "#783BF9", packageAndroid: "com.badoo.mobile", bundleIOS: "com.badoo.Badoo" },

  { id: "spotify", name: "Spotify", category: "Music", url: "https://open.spotify.com", icon: "Music", color: "#1DB954", packageAndroid: "com.spotify.music", bundleIOS: "com.spotify.client" },
  { id: "applemusic", name: "Apple Music", category: "Music", url: "https://music.apple.com", icon: "Music", color: "#FA243C", packageAndroid: "com.apple.android.music", bundleIOS: "com.apple.Music" },
  { id: "soundcloud", name: "SoundCloud", category: "Music", url: "https://soundcloud.com", icon: "Music", color: "#FF5500", packageAndroid: "com.soundcloud.android", bundleIOS: "com.soundcloud.TouchApp" },
  { id: "deezer", name: "Deezer", category: "Music", url: "https://www.deezer.com", icon: "Music", color: "#A238FF", packageAndroid: "deezer.android.app", bundleIOS: "com.deezer.Deezer" },
  { id: "ytmusic", name: "YouTube Music", category: "Music", url: "https://music.youtube.com", icon: "Music", color: "#FF0000", packageAndroid: "com.google.android.apps.youtube.music", bundleIOS: "com.google.ios.youtubemusic" },

  { id: "roblox", name: "Roblox", category: "Gaming", url: "https://www.roblox.com", icon: "Gamepad2", color: "#E2231A", packageAndroid: "com.roblox.client", bundleIOS: "com.roblox.robloxmobile" },
  { id: "among_us", name: "Among Us", category: "Gaming", url: "https://www.innersloth.com/games/among-us", icon: "Gamepad2", color: "#C51111", packageAndroid: "com.innersloth.spacemafia", bundleIOS: "com.innersloth.amongus" },
  { id: "clash_royale", name: "Clash Royale", category: "Gaming", url: "https://clashroyale.com", icon: "Gamepad2", color: "#0070DD", packageAndroid: "com.supercell.clashroyale", bundleIOS: "com.supercell.scroll" },
  { id: "pubg", name: "PUBG Mobile", category: "Gaming", url: "https://www.pubgmobile.com", icon: "Gamepad2", color: "#F2A900", packageAndroid: "com.tencent.ig", bundleIOS: "com.tencent.ig" },
  { id: "freefire", name: "Free Fire", category: "Gaming", url: "https://ff.garena.com", icon: "Gamepad2", color: "#FF6C2C", packageAndroid: "com.dts.freefireth", bundleIOS: "com.dts.freefireth" },
  { id: "candycrush", name: "Candy Crush", category: "Gaming", url: "https://www.king.com/game/candycrush", icon: "Gamepad2", color: "#FF6F00", packageAndroid: "com.king.candycrushsaga", bundleIOS: "com.midasplayer.apps.candycrushsaga" },
  { id: "coc", name: "Clash of Clans", category: "Gaming", url: "https://supercell.com/en/games/clashofclans", icon: "Gamepad2", color: "#7CB342", packageAndroid: "com.supercell.clashofclans", bundleIOS: "com.supercell.magic" },
  { id: "genshin", name: "Genshin Impact", category: "Gaming", url: "https://genshin.hoyoverse.com", icon: "Gamepad2", color: "#4A90D9", packageAndroid: "com.miHoYo.GenshinImpact", bundleIOS: "com.miHoYo.GenshinImpact" },

  { id: "cnn", name: "CNN", category: "News", url: "https://www.cnn.com", icon: "BookOpen", color: "#CC0000", packageAndroid: "com.cnn.mobile.android.phone", bundleIOS: "com.cnn.iphone" },
  { id: "bbc", name: "BBC News", category: "News", url: "https://www.bbc.com/news", icon: "BookOpen", color: "#BB1919", packageAndroid: "bbc.mobile.news.ww", bundleIOS: "uk.co.bbc.news" },
  { id: "nytimes", name: "NY Times", category: "News", url: "https://www.nytimes.com", icon: "BookOpen", color: "#000000", packageAndroid: "com.nytimes.android", bundleIOS: "com.nytimes.NYTimes" },
  { id: "aljazeera", name: "Al Jazeera", category: "News", url: "https://www.aljazeera.com", icon: "BookOpen", color: "#D2A94B", packageAndroid: "net.aljazeera.english", bundleIOS: "com.aljazeera.mobile" },

  { id: "myfitnesspal", name: "MyFitnessPal", category: "Health", url: "https://www.myfitnesspal.com", icon: "Heart", color: "#0070D1", packageAndroid: "com.myfitnesspal.android", bundleIOS: "com.myfitnesspal.mfp" },
  { id: "fitbit", name: "Fitbit", category: "Health", url: "https://www.fitbit.com", icon: "Heart", color: "#00B0B9", packageAndroid: "com.fitbit.FitbitMobile", bundleIOS: "com.fitbit.FitbitMobile" },
  { id: "headspace", name: "Headspace", category: "Health", url: "https://www.headspace.com", icon: "Heart", color: "#F47D31", packageAndroid: "com.getsomeheadspace.android", bundleIOS: "com.getsomeheadspace.headspace" },
  { id: "calm", name: "Calm", category: "Health", url: "https://www.calm.com", icon: "Heart", color: "#5398DD", packageAndroid: "com.calm.android", bundleIOS: "com.calm.CalmRadio" },

  { id: "vsco", name: "VSCO", category: "Photo", url: "https://vsco.co", icon: "Camera", color: "#000000", packageAndroid: "com.vsco.cam", bundleIOS: "com.vsco.vsco" },
  { id: "snapseed", name: "Snapseed", category: "Photo", url: "https://snapseed.online", icon: "Camera", color: "#111111", packageAndroid: "com.niksoftware.snapseed", bundleIOS: "com.google.snapseed" },
  { id: "lightroom", name: "Lightroom", category: "Photo", url: "https://lightroom.adobe.com", icon: "Camera", color: "#31A8FF", packageAndroid: "com.adobe.lrmobile", bundleIOS: "com.adobe.lrmobile" },

  { id: "vpn_nord", name: "NordVPN", category: "Utilities", url: "https://nordvpn.com", icon: "Shield", color: "#4687FF", packageAndroid: "com.nordvpn.android", bundleIOS: "com.nordvpn.iosapp" },
  { id: "vpn_express", name: "ExpressVPN", category: "Utilities", url: "https://www.expressvpn.com", icon: "Shield", color: "#DA3940", packageAndroid: "com.expressvpn.vpn", bundleIOS: "com.expressvpn.ExpressVPN" },
  { id: "chrome", name: "Chrome", category: "Utilities", url: "https://www.google.com", icon: "Globe", color: "#4285F4", packageAndroid: "com.android.chrome", bundleIOS: "com.google.chrome.ios" },
  { id: "firefox", name: "Firefox", category: "Utilities", url: "https://www.mozilla.org", icon: "Globe", color: "#FF7139", packageAndroid: "org.mozilla.firefox", bundleIOS: "org.mozilla.ios.Firefox" },
  { id: "brave", name: "Brave", category: "Utilities", url: "https://brave.com", icon: "Shield", color: "#FB542B", packageAndroid: "com.brave.browser", bundleIOS: "com.brave.ios.browser" },
  { id: "opera", name: "Opera", category: "Utilities", url: "https://www.opera.com", icon: "Globe", color: "#FF1B2D", packageAndroid: "com.opera.browser", bundleIOS: "com.opera.operaTouch" },
];

export function getAppsByCategory(category: string): NativeApp[] {
  return NATIVE_APPS.filter((app) => app.category === category);
}

export function searchApps(query: string): NativeApp[] {
  const q = query.toLowerCase().trim();
  if (!q) return NATIVE_APPS;
  return NATIVE_APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q) ||
      app.id.includes(q)
  );
}
