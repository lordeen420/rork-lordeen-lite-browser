import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  Shield,
  Settings,
  EyeOff,
  Eye,
  Zap,
  Fingerprint,
  Plus,
  Clock,
  Trash2,
  X,
  Globe,
  ShoppingCart,
  CreditCard,
  MessageCircle,
  Play,
  Music,
  Camera,
  Mail,
  MapPin,
  Briefcase,
  BookOpen,
  Coffee,
  Gamepad2,
  Heart,
  Star,
  Cloud,
  Gift,
  Wallet,
  Compass,
  Copy,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { QUICK_LINKS } from "@/constants/extensions";
import { useBrowser, AppClone } from "@/providers/BrowserProvider";
import QuickLinkGrid from "@/components/QuickLinkGrid";
import AddCloneModal from "@/components/AddCloneModal";
import { getLocationById } from "@/constants/locations";

const ICON_COMPONENTS: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Globe, ShoppingCart, CreditCard, MessageCircle, Play,
  Music, Camera, Mail, Map: MapPin, Briefcase,
  BookOpen, Coffee, Gamepad2, Heart, Star,
  Zap, Cloud, Gift, Wallet, Compass,
};

const CloneItem = React.memo(
  ({
    clone,
    onPress,
    onLongPress,
  }: {
    clone: AppClone;
    onPress: (clone: AppClone) => void;
    onLongPress: (clone: AppClone) => void;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const IconComp = ICON_COMPONENTS[clone.icon] || Globe;

    const handlePressIn = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }).start();
    }, [scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }).start();
    }, [scaleAnim]);

    const loc = clone.mockLocationId ? getLocationById(clone.mockLocationId) : null;

    return (
      <TouchableOpacity
        onPress={() => onPress(clone)}
        onLongPress={() => onLongPress(clone)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        style={styles.cloneWrapper}
        delayLongPress={500}
      >
        <Animated.View
          style={[
            styles.cloneIcon,
            { backgroundColor: clone.color + "20", transform: [{ scale: scaleAnim }] },
          ]}
        >
          <IconComp size={24} color={clone.color} />
          {loc && (
            <View style={styles.cloneLocBadge}>
              <Text style={styles.cloneLocFlag}>{loc.flag}</Text>
            </View>
          )}
        </Animated.View>
        <Text style={styles.cloneName} numberOfLines={1}>
          {clone.name}
        </Text>
        {loc && (
          <Text style={styles.cloneLocText} numberOfLines={1}>
            {loc.city}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

const SearchHistoryItem = React.memo(
  ({
    item,
    onPress,
    onRemove,
  }: {
    item: { id: string; query: string; url: string; timestamp: number; title?: string };
    onPress: (url: string) => void;
    onRemove: (id: string) => void;
  }) => {
    const timeAgo = useMemo(() => {
      const diff = Date.now() - item.timestamp;
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return mins + "m ago";
      const hours = Math.floor(mins / 60);
      if (hours < 24) return hours + "h ago";
      const days = Math.floor(hours / 24);
      return days + "d ago";
    }, [item.timestamp]);

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => onPress(item.url)}
        activeOpacity={0.7}
      >
        <View style={styles.historyIconWrap}>
          <Clock size={12} color={Colors.textMuted} />
        </View>
        <View style={styles.historyTextWrap}>
          <Text style={styles.historyQuery} numberOfLines={1}>
            {item.title || item.query}
          </Text>
          <Text style={styles.historyTime}>{timeAgo}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={styles.historyRemoveBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={12} color={Colors.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
);

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    incognito,
    toggleIncognito,
    activeShieldsCount,
    activeProfile,
    autoRotateFingerprint,
    appClones,
    addAppClone,
    removeAppClone,
    touchAppClone,
    searchHistory,
    clearSearchHistory,
    removeSearchHistoryItem,
    addSearchHistory,
  } = useBrowser();
  const [searchText, setSearchText] = useState<string>("");
  const [showAddClone, setShowAddClone] = useState<boolean>(false);
  const logoScale = useRef(new Animated.Value(1)).current;
  const inputGlow = useRef(new Animated.Value(0)).current;

  const handleSearch = useCallback(() => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
    Keyboard.dismiss();

    const isUrl =
      trimmed.includes(".") && !trimmed.includes(" ") &&
      (trimmed.startsWith("http") || !trimmed.includes(" "));
    const url = isUrl
      ? trimmed.startsWith("http")
        ? trimmed
        : "https://" + trimmed
      : undefined;

    addSearchHistory(trimmed, url || trimmed);

    router.push({
      pathname: "/browser",
      params: url ? { url } : { query: trimmed },
    });
    setSearchText("");
  }, [searchText, router, addSearchHistory]);

  const handleQuickLink = useCallback(
    (url: string) => {
      if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push({ pathname: "/browser", params: { url } });
    },
    [router]
  );

  const handleClonePress = useCallback(
    (clone: AppClone) => {
      if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      touchAppClone(clone.id);
      const browserParams: Record<string, string> = { url: clone.url, cloneName: clone.name };
      if (clone.deviceProfileId != null) {
        browserParams.cloneProfileId = String(clone.deviceProfileId);
      }
      if (clone.mockLocationId) {
        browserParams.cloneLocationId = clone.mockLocationId;
      }
      router.push({ pathname: "/browser", params: browserParams });
    },
    [router, touchAppClone]
  );

  const handleCloneLongPress = useCallback(
    (clone: AppClone) => {
      if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      Alert.alert(
        clone.name,
        clone.url,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              removeAppClone(clone.id);
              if (Platform.OS !== "web") {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }
            },
          },
        ]
      );
    },
    [removeAppClone]
  );

  const handleAddClone = useCallback(
    (data: { name: string; url: string; color: string; icon: string; deviceProfileId?: number | null; mockLocationId?: string | null; packageAndroid?: string; bundleIOS?: string; appCategory?: string }) => {
      addAppClone(data);
      setShowAddClone(false);
    },
    [addAppClone]
  );

  const handleHistoryPress = useCallback(
    (url: string) => {
      if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const isUrl = url.startsWith("http");
      router.push({
        pathname: "/browser",
        params: isUrl ? { url } : { query: url },
      });
    },
    [router]
  );

  const handleClearHistory = useCallback(() => {
    Alert.alert(
      "Clear History",
      "Remove all search history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            void clearSearchHistory();
            if (Platform.OS !== "web") {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
        },
      ]
    );
  }, [clearSearchHistory]);

  const handleIncognitoToggle = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.sequence([
      Animated.timing(logoScale, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }),
    ]).start();
    toggleIncognito();
  }, [toggleIncognito, logoScale]);

  const handleFocus = useCallback(() => {
    Animated.timing(inputGlow, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [inputGlow]);

  const handleBlur = useCallback(() => {
    Animated.timing(inputGlow, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [inputGlow]);

  const glowColor = inputGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.cardBorder, Colors.accent],
  });

  const recentHistory = useMemo(() => searchHistory.slice(0, 8), [searchHistory]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleIncognitoToggle}
            style={[styles.incognitoBtn, incognito && styles.incognitoBtnActive]}
            activeOpacity={0.7}
            testID="incognito-toggle"
          >
            {incognito ? (
              <EyeOff size={18} color={Colors.incognito} />
            ) : (
              <Eye size={18} color={Colors.textMuted} />
            )}
            <Text style={[styles.incognitoText, incognito && styles.incognitoTextActive]}>
              {incognito ? "Incognito" : "Normal"}
            </Text>
          </TouchableOpacity>

          <View style={styles.shieldBadge}>
            <Shield size={14} color={Colors.accent} />
            <Text style={styles.shieldCount}>{activeShieldsCount}</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={styles.settingsBtn}
            activeOpacity={0.7}
            testID="settings-btn"
          >
            <Settings size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <Animated.View
            style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}
          >
            <View style={styles.logoShield}>
              <Shield size={44} color={Colors.accent} />
              <Zap size={18} color={Colors.accent} style={styles.logoZap} />
            </View>
          </Animated.View>

          <Text style={styles.brandName}>LordEEN</Text>
          <Text style={styles.brandSub}>TECH</Text>
          <Text style={styles.tagline}>
            {incognito ? "Ghost Mode Active" : "Private. Fast. Secure."}
          </Text>
        </View>

        <Animated.View style={[styles.searchContainer, { borderColor: glowColor }]}>
          <Search size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search or enter URL..."
            placeholderTextColor={Colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="go"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
            testID="search-input"
            selectionColor={Colors.accent}
          />
        </Animated.View>

        {appClones.length > 0 && (
          <View style={styles.clonesSection}>
            <View style={styles.clonesSectionHeader}>
              <Copy size={14} color={Colors.accent} />
              <Text style={styles.clonesSectionTitle}>App Clones</Text>
              <TouchableOpacity
                onPress={() => setShowAddClone(true)}
                style={styles.addCloneSmallBtn}
                activeOpacity={0.7}
              >
                <Plus size={14} color={Colors.accent} />
              </TouchableOpacity>
            </View>
            <View style={styles.clonesGrid}>
              {appClones.map((clone) => (
                <CloneItem
                  key={clone.id}
                  clone={clone}
                  onPress={handleClonePress}
                  onLongPress={handleCloneLongPress}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.addCloneSection}>
          <TouchableOpacity
            style={styles.addCloneBtn}
            onPress={() => {
              if (Platform.OS !== "web") {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              setShowAddClone(true);
            }}
            activeOpacity={0.7}
            testID="add-clone-btn"
          >
            <View style={styles.addCloneIconWrap}>
              <Plus size={22} color="#000" />
            </View>
            <View style={styles.addCloneInfo}>
              <Text style={styles.addCloneTitle}>Add App Clone</Text>
              <Text style={styles.addCloneDesc}>Clone any app or website</Text>
            </View>
            <Copy size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {recentHistory.length > 0 && !incognito && (
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Clock size={14} color={Colors.textSecondary} />
              <Text style={styles.historySectionTitle}>Recent</Text>
              <TouchableOpacity onPress={handleClearHistory} style={styles.historyClearBtn}>
                <Trash2 size={13} color={Colors.danger} />
                <Text style={styles.historyClearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.historyList}>
              {recentHistory.map((item) => (
                <SearchHistoryItem
                  key={item.id}
                  item={item}
                  onPress={handleHistoryPress}
                  onRemove={removeSearchHistoryItem}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.quickLinksSection}>
          <Text style={styles.quickLinksTitle}>Quick Access</Text>
          <QuickLinkGrid links={QUICK_LINKS} onPress={handleQuickLink} />
        </View>

        <View style={styles.profileStrip}>
          <Fingerprint size={12} color={Colors.accent} />
          <Text style={styles.profileStripText} numberOfLines={1}>
            {activeProfile.name}
          </Text>
          {autoRotateFingerprint && (
            <View style={styles.autoRotateBadge}>
              <Text style={styles.autoRotateBadgeText}>AUTO</Text>
            </View>
          )}
          {appClones.length > 0 && (
            <View style={styles.cloneCountBadge}>
              <Text style={styles.cloneCountText}>{appClones.length} clone{appClones.length !== 1 ? "s" : ""}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>LordEEN Tech Browser v3.0</Text>
        </View>
      </ScrollView>

      <AddCloneModal
        visible={showAddClone}
        onClose={() => setShowAddClone(false)}
        onAdd={handleAddClone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  incognitoBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 6,
  },
  incognitoBtnActive: {
    borderColor: Colors.incognito,
    backgroundColor: "rgba(124, 58, 237, 0.12)",
  },
  incognitoText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textMuted,
  },
  incognitoTextActive: {
    color: Colors.incognito,
  },
  shieldBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginLeft: "auto" as const,
    marginRight: 12,
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  shieldCount: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.accent,
  },
  settingsBtn: {
    padding: 8,
  },
  heroSection: {
    alignItems: "center" as const,
    paddingTop: 28,
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoShield: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1.5,
    borderColor: Colors.accentDim,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  logoZap: {
    position: "absolute" as const,
    bottom: 12,
    right: 14,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
    letterSpacing: 4,
  },
  brandSub: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.accent,
    letterSpacing: 8,
    marginTop: 2,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.inputBg,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    height: "100%" as const,
  },
  clonesSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  clonesSectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 14,
    gap: 6,
  },
  clonesSectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.accent,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    flex: 1,
  },
  addCloneSmallBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.accentGlow,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  clonesGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 4,
  },
  cloneWrapper: {
    width: "23%" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
  },
  cloneIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cloneName: {
    fontSize: 11,
    color: Colors.text,
    textAlign: "center" as const,
    fontWeight: "500" as const,
  },
  cloneLocBadge: {
    position: "absolute" as const,
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  cloneLocFlag: {
    fontSize: 10,
  },
  cloneLocText: {
    fontSize: 9,
    color: "#FF6B6B",
    textAlign: "center" as const,
    marginTop: 1,
  },
  addCloneSection: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  addCloneBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderStyle: "dashed" as const,
  },
  addCloneIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  addCloneInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addCloneTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.accent,
  },
  addCloneDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  historySection: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  historySectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 10,
    gap: 6,
  },
  historySectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    flex: 1,
  },
  historyClearBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  historyClearText: {
    fontSize: 11,
    color: Colors.danger,
    fontWeight: "600" as const,
  },
  historyList: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden" as const,
  },
  historyItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  historyIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  historyTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  historyQuery: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "500" as const,
  },
  historyTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  historyRemoveBtn: {
    padding: 6,
  },
  quickLinksSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  quickLinksTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 14,
  },
  profileStrip: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(0, 229, 204, 0.06)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.12)",
    gap: 6,
  },
  profileStripText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    flex: 1,
  },
  autoRotateBadge: {
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  autoRotateBadgeText: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  cloneCountBadge: {
    backgroundColor: "rgba(30, 144, 255, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cloneCountText: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: "#1E90FF",
  },
  footer: {
    alignItems: "center" as const,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
