import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shield,
  Home,
  Lock,
  X,
  ChevronLeft,
  Fingerprint,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useBrowser } from "@/providers/BrowserProvider";
import ExtensionsPanel from "@/components/ExtensionsPanel";
import { EXTENSION_SCRIPTS } from "@/constants/extensions";
import { getFingerprintSpoofScript, DEVICE_PROFILES } from "@/constants/deviceProfiles";
import { getLocationById, getGeolocationSpoofScript, MockLocation } from "@/constants/locations";

let WebView: React.ComponentType<any> | null = null;
try {
  WebView = require("react-native-webview").default;
} catch {
  console.log("WebView not available");
}

export default function BrowserScreen() {
  const params = useLocalSearchParams<{ url?: string; query?: string; cloneName?: string; cloneProfileId?: string; cloneLocationId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    incognito,
    extensions,
    getSearchUrl,
    getUserAgent,
    activeShieldsCount,
    autoRotateFingerprint,
    activeProfile,
    rotateFingerprint,
    addSearchHistory,
    customExtensions,
  } = useBrowser();

  const initialUrl = params.url || (params.query ? getSearchUrl(params.query) : "https://www.google.com");
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [displayUrl, setDisplayUrl] = useState<string>(initialUrl);
  const [urlInput, setUrlInput] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showExtensions, setShowExtensions] = useState<boolean>(false);
  const [isSecure, setIsSecure] = useState<boolean>(false);
  const [profileLabel, setProfileLabel] = useState<string>("");

  const webViewRef = useRef<any>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const toolbarSlide = useRef(new Animated.Value(0)).current;
  const profileFlash = useRef(new Animated.Value(0)).current;
  const prevExtensionsRef = useRef<Record<string, boolean>>({});
  const pageLoadedRef = useRef<boolean>(false);
  const currentUrlRef = useRef<string>(initialUrl);

  const cloneProfileId = params.cloneProfileId ? Number(params.cloneProfileId) : null;
  const cloneProfile = useMemo(() => {
    if (cloneProfileId == null) return null;
    return DEVICE_PROFILES.find((p) => p.id === cloneProfileId) ?? null;
  }, [cloneProfileId]);

  const cloneLocation = useMemo<MockLocation | null>(() => {
    if (!params.cloneLocationId) return null;
    return getLocationById(params.cloneLocationId);
  }, [params.cloneLocationId]);

  const effectiveProfile = cloneProfile || activeProfile;
  const userAgent = cloneProfile ? cloneProfile.userAgent : getUserAgent();

  useEffect(() => {
    currentUrlRef.current = currentUrl;
  }, [currentUrl]);

  useEffect(() => {
    if (isLoading) {
      Animated.timing(progressAnim, {
        toValue: 0.85,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          progressAnim.setValue(0);
        }, 300);
      });
    }
  }, [isLoading, progressAnim]);

  const flashProfileBanner = useCallback(() => {
    profileFlash.setValue(1);
    Animated.timing(profileFlash, {
      toValue: 0,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  }, [profileFlash]);

  const injectScript = useCallback((script: string) => {
    if (webViewRef.current && pageLoadedRef.current) {
      console.log("[LordEEN] Injecting script");
      webViewRef.current.injectJavaScript(script);
    }
  }, []);

  const [locationLabel, setLocationLabel] = useState<string>("");
  const locationFlash = useRef(new Animated.Value(0)).current;

  const flashLocationBanner = useCallback(() => {
    locationFlash.setValue(1);
    Animated.timing(locationFlash, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [locationFlash]);

  useEffect(() => {
    setProfileLabel(effectiveProfile.name);
    if (cloneProfile) {
      flashProfileBanner();
      console.log("[LordEEN] Clone using device profile:", cloneProfile.name);
    }
  }, [effectiveProfile.name, cloneProfile, flashProfileBanner]);

  useEffect(() => {
    if (cloneLocation) {
      setLocationLabel(cloneLocation.flag + " " + cloneLocation.city + ", " + cloneLocation.country);
      flashLocationBanner();
      console.log("[LordEEN] Clone using mock location:", cloneLocation.city, cloneLocation.country);
    }
  }, [cloneLocation, flashLocationBanner]);

  const getBuiltInScripts = useCallback((): string => {
    const scripts: string[] = [];
    if (extensions.fingerprint || cloneProfile) {
      scripts.push(getFingerprintSpoofScript(effectiveProfile));
    }
    if (cloneLocation) {
      scripts.push(getGeolocationSpoofScript(cloneLocation));
      console.log("[LordEEN] GPS spoof injected:", cloneLocation.city, cloneLocation.country);
    }
    Object.keys(EXTENSION_SCRIPTS).forEach((key) => {
      if (extensions[key]) {
        scripts.push(EXTENSION_SCRIPTS[key].enable);
      }
    });
    customExtensions.forEach((ext) => {
      if (ext.enabled && ext.script) {
        scripts.push("// Custom Extension: " + ext.name + "\n" + ext.script);
        console.log("[LordEEN] Custom ext injected:", ext.name);
      }
    });
    return scripts.join("\n");
  }, [extensions, effectiveProfile, cloneProfile, cloneLocation, customExtensions]);

  const injectedJavaScriptBefore = useMemo(() => {
    const builtIn = getBuiltInScripts();
    return builtIn || "true;";
  }, [getBuiltInScripts]);

  useEffect(() => {
    if (!pageLoadedRef.current) return;
    customExtensions.forEach((ext) => {
      if (ext.enabled && ext.script) {
        console.log("[LordEEN] Re-injecting custom ext:", ext.name);
        injectScript(ext.script);
      }
    });
  }, [customExtensions, injectScript]);

  const injectedJavaScript = useMemo(() => {
    return `
(function() {
  var lastUrl = window.location.href;
  var checkUrl = function() {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'spa_navigation', url: lastUrl }));
    }
  };
  var origPush = history.pushState;
  var origReplace = history.replaceState;
  history.pushState = function() { origPush.apply(this, arguments); setTimeout(checkUrl, 0); };
  history.replaceState = function() { origReplace.apply(this, arguments); setTimeout(checkUrl, 0); };
  window.addEventListener('popstate', function() { setTimeout(checkUrl, 0); });
  window.addEventListener('hashchange', function() { setTimeout(checkUrl, 0); });
  setInterval(checkUrl, 1500);

  window.addEventListener('load', function() {
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'page_load', url: window.location.href, title: document.title }));
  });
})();
true;
`;
  }, []);

  useEffect(() => {
    if (!pageLoadedRef.current) return;
    const prev = prevExtensionsRef.current;
    const current = extensions;

    Object.keys(EXTENSION_SCRIPTS).forEach((key) => {
      const wasOn = !!prev[key];
      const isOn = !!current[key];
      if (wasOn !== isOn) {
        const script = isOn
          ? EXTENSION_SCRIPTS[key].enable
          : EXTENSION_SCRIPTS[key].disable;
        console.log("[LordEEN] Real-time " + (isOn ? "enable" : "disable") + ": " + key);
        injectScript(script);
      }
    });

    if (!!prev.fingerprint !== !!current.fingerprint && current.fingerprint) {
      injectScript(getFingerprintSpoofScript(effectiveProfile));
    }

    prevExtensionsRef.current = { ...current };
  }, [extensions, injectScript, effectiveProfile]);

  const handleNavigationChange = useCallback((navState: any) => {
    const url = navState.url || "";
    setCurrentUrl(url);
    setDisplayUrl(url);
    setCanGoBack(!!navState.canGoBack);
    setCanGoForward(!!navState.canGoForward);
    setIsLoading(!!navState.loading);
    setIsSecure(url.startsWith("https://"));
    console.log("[LordEEN] Navigation:", url);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
    pageLoadedRef.current = true;
    prevExtensionsRef.current = { ...extensions };
    console.log("[LordEEN] Page loaded:", currentUrlRef.current);
  }, [extensions]);

  const handleGoBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  }, [canGoBack]);

  const handleGoForward = useCallback(() => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  }, [canGoForward]);

  const handleRefresh = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (autoRotateFingerprint) {
      const newProfile = rotateFingerprint();
      setProfileLabel(newProfile.name);
      flashProfileBanner();
    }
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, [autoRotateFingerprint, rotateFingerprint, flashProfileBanner]);

  const handleUrlSubmit = useCallback(() => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setIsEditing(false);
      return;
    }
    Keyboard.dismiss();
    const isUrl = trimmed.includes(".") && !trimmed.includes(" ");
    const newUrl = isUrl
      ? trimmed.startsWith("http")
        ? trimmed
        : "https://" + trimmed
      : getSearchUrl(trimmed);

    addSearchHistory(trimmed, newUrl);

    if (autoRotateFingerprint) {
      const newProfile = rotateFingerprint();
      setProfileLabel(newProfile.name);
      flashProfileBanner();
    }

    setCurrentUrl(newUrl);
    setDisplayUrl(newUrl);
    setIsEditing(false);
  }, [urlInput, getSearchUrl, autoRotateFingerprint, rotateFingerprint, flashProfileBanner, addSearchHistory]);

  const handleUrlFocus = useCallback(() => {
    setIsEditing(true);
    setUrlInput(currentUrl);
  }, [currentUrl]);

  const handleUrlBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleHome = useCallback(() => {
    router.back();
  }, [router]);

  const formatDisplayUrl = (url: string): string => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const WebViewComponent = WebView;
  const cloneName = params.cloneName;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={[styles.profileBanner, { opacity: profileFlash }]}
        pointerEvents="none"
      >
        <Fingerprint size={12} color={Colors.accent} />
        <Text style={styles.profileBannerText}>{profileLabel}</Text>
      </Animated.View>

      {cloneLocation && (
        <Animated.View
          style={[styles.locationBanner, { opacity: locationFlash }]}
          pointerEvents="none"
        >
          <Text style={styles.locationBannerText}>{locationLabel}</Text>
        </Animated.View>
      )}

      <View style={styles.urlBar}>
        <TouchableOpacity
          onPress={handleHome}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.urlContainer, incognito && styles.urlContainerIncognito]}
          onPress={handleUrlFocus}
          activeOpacity={0.8}
        >
          {isEditing ? (
            <TextInput
              style={styles.urlInput}
              value={urlInput}
              onChangeText={setUrlInput}
              onSubmitEditing={handleUrlSubmit}
              onBlur={handleUrlBlur}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              selectTextOnFocus
              selectionColor={Colors.accent}
              placeholderTextColor={Colors.textMuted}
              placeholder="Search or enter URL..."
            />
          ) : (
            <View style={styles.urlDisplay}>
              {isSecure ? (
                <Lock size={13} color={Colors.accent} style={styles.lockIcon} />
              ) : null}
              <Text style={styles.urlText} numberOfLines={1}>
                {cloneName ? cloneName + " · " : ""}{formatDisplayUrl(displayUrl)}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {isLoading ? (
          <TouchableOpacity
            onPress={() => webViewRef.current?.stopLoading()}
            style={styles.refreshBtn}
          >
            <X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
            <RotateCw size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
      )}

      <View style={styles.webviewContainer}>
        {Platform.OS === "web" ? (
          <View style={styles.webFallback}>
            <View style={styles.webFallbackContent}>
              <Shield size={48} color={Colors.accent} />
              <Text style={styles.webFallbackTitle}>LordEEN Tech Browser</Text>
              <Text style={styles.webFallbackText}>
                The browser view works best on mobile devices.
              </Text>
              <Text style={styles.webFallbackUrl}>
                Navigating to: {formatDisplayUrl(currentUrl)}
              </Text>
              <TouchableOpacity
                style={styles.webFallbackBtn}
                onPress={() => {
                  if (typeof window !== "undefined") {
                    window.open(currentUrl, "_blank");
                  }
                }}
              >
                <Text style={styles.webFallbackBtnText}>Open in New Tab</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : WebViewComponent ? (
          <WebViewComponent
            ref={webViewRef}
            source={{ uri: currentUrl }}
            style={styles.webview}
            onNavigationStateChange={handleNavigationChange}
            onLoadEnd={handleLoadEnd}
            onLoadStart={() => {
              setIsLoading(true);
              pageLoadedRef.current = false;
            }}
            injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBefore}
            injectedJavaScript={injectedJavaScript}
            userAgent={userAgent || undefined}
            incognito={incognito}
            javaScriptEnabled={!extensions.scriptblock}
            thirdPartyCookiesEnabled={true}
            allowsBackForwardNavigationGestures
            startInLoadingState
            cacheEnabled={!incognito}
            sharedCookiesEnabled={true}
            originWhitelist={["*"]}
            mixedContentMode="compatibility"
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            domStorageEnabled
            javaScriptCanOpenWindowsAutomatically
            injectedJavaScriptForMainFrameOnly={true}
            injectedJavaScriptBeforeContentLoadedForMainFrameOnly={true}
            onMessage={(event: any) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log("[LordEEN] WebView message:", data);
                if (data.type === "spa_navigation" && data.url) {
                  setCurrentUrl(data.url);
                  setDisplayUrl(data.url);
                  setIsSecure(data.url.startsWith("https://"));
                  currentUrlRef.current = data.url;
                }
                if (data.type === "page_load" && data.title) {
                  addSearchHistory(data.title, data.url, data.title);
                }
              } catch {
                console.log("[LordEEN] WebView raw msg:", event.nativeEvent.data);
              }
            }}
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={Colors.accent} />
              </View>
            )}
          />
        ) : (
          <View style={styles.webFallback}>
            <Text style={styles.webFallbackText}>WebView not available</Text>
          </View>
        )}
      </View>

      <Animated.View
        style={[
          styles.toolbar,
          {
            paddingBottom: Math.max(insets.bottom, 8),
            transform: [{ translateY: toolbarSlide }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          style={[styles.toolbarBtn, !canGoBack && styles.toolbarBtnDisabled]}
          disabled={!canGoBack}
        >
          <ArrowLeft size={22} color={canGoBack ? Colors.text : Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoForward}
          style={[styles.toolbarBtn, !canGoForward && styles.toolbarBtnDisabled]}
          disabled={!canGoForward}
        >
          <ArrowRight size={22} color={canGoForward ? Colors.text : Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleHome}
          style={styles.toolbarBtn}
          activeOpacity={0.7}
        >
          <Home size={22} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (Platform.OS !== "web") {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowExtensions(true);
          }}
          style={styles.toolbarBtn}
          activeOpacity={0.7}
        >
          <View style={styles.toolbarIconBadge}>
            <Shield size={22} color={Colors.accent} />
            {activeShieldsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeShieldsCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ExtensionsPanel
        visible={showExtensions}
        onClose={() => setShowExtensions(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileBanner: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "rgba(0, 229, 204, 0.12)",
    paddingVertical: 4,
    gap: 6,
  },
  profileBannerText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.accent,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  locationBanner: {
    position: "absolute" as const,
    top: 22,
    left: 0,
    right: 0,
    zIndex: 99,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    paddingVertical: 4,
    gap: 6,
  },
  locationBannerText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#FF6B6B",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  urlBar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  backBtn: {
    padding: 8,
  },
  urlContainer: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 40,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  urlContainerIncognito: {
    borderColor: Colors.incognito,
    backgroundColor: "rgba(124, 58, 237, 0.08)",
  },
  urlInput: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    height: "100%" as const,
  },
  urlDisplay: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  lockIcon: {
    marginRight: 6,
  },
  urlText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    flex: 1,
  },
  refreshBtn: {
    padding: 8,
  },
  progressBar: {
    height: 2,
    backgroundColor: Colors.card,
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.accent,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webFallback: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 32,
  },
  webFallbackContent: {
    alignItems: "center" as const,
    gap: 12,
  },
  webFallbackTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  webFallbackText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center" as const,
  },
  webFallbackUrl: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginTop: 8,
  },
  webFallbackBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  webFallbackBtnText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  toolbar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-around" as const,
    backgroundColor: Colors.toolbarBg,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 8,
  },
  toolbarBtn: {
    padding: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  toolbarBtnDisabled: {
    opacity: 0.4,
  },
  toolbarIconBadge: {
    position: "relative" as const,
  },
  badge: {
    position: "absolute" as const,
    top: -6,
    right: -8,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800" as const,
    color: Colors.background,
  },
});
