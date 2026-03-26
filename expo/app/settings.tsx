import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  FlatList,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  X,
  Search,
  Shield,
  Trash2,
  Info,
  ChevronRight,
  Check,
  User,
  Fingerprint,
  Smartphone,
  RotateCw,
  Shuffle,
  Copy,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useBrowser } from "@/providers/BrowserProvider";
import { DEVICE_PROFILES, DeviceProfile } from "@/constants/deviceProfiles";

const ENGINES = [
  { id: "google", name: "Google", icon: "🔍" },
  { id: "duckduckgo", name: "DuckDuckGo", icon: "🦆" },
  { id: "bing", name: "Bing", icon: "🅱️" },
];

const UA_OPTIONS = [
  { id: "default", name: "Default" },
  { id: "chrome", name: "Chrome (Windows)" },
  { id: "safari", name: "Safari (Mac)" },
  { id: "firefox", name: "Firefox (Windows)" },
  { id: "edge", name: "Edge (Windows)" },
];

const ProfileItem = React.memo(
  ({
    profile,
    isSelected,
    onSelect,
  }: {
    profile: DeviceProfile;
    isSelected: boolean;
    onSelect: (id: number) => void;
  }) => {
    const isIOS = profile.name.includes("iPhone");
    return (
      <TouchableOpacity
        style={[styles.profileRow, isSelected && styles.profileRowActive]}
        onPress={() => onSelect(profile.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.profileIcon, isSelected && styles.profileIconActive]}>
          <Smartphone
            size={16}
            color={isSelected ? Colors.accent : Colors.textSecondary}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text
            style={[styles.profileName, isSelected && styles.profileNameActive]}
            numberOfLines={1}
          >
            {profile.name}
          </Text>
          <Text style={styles.profileMeta} numberOfLines={1}>
            {isIOS ? "iOS" : "Android"} · {profile.screenWidth}x{profile.screenHeight} · {profile.language}
          </Text>
        </View>
        {isSelected && <Check size={16} color={Colors.accent} />}
      </TouchableOpacity>
    );
  }
);

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    searchEngine,
    selectedUserAgent,
    updateSearchEngine,
    updateUserAgent,
    clearBrowsingData,
    autoRotateFingerprint,
    activeProfile,
    selectedProfileId,
    selectProfile,
    toggleAutoRotate,
    rotateFingerprint,
    appClones,
    clearAllClones,
  } = useBrowser();

  const [showProfilePicker, setShowProfilePicker] = useState<boolean>(false);

  const handleClearData = useCallback(() => {
    Alert.alert(
      "Clear Browsing Data",
      "This will reset all settings and clear stored data. App clones will be preserved. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            void clearBrowsingData();
          },
        },
      ]
    );
  }, [clearBrowsingData]);

  const handleClearClones = useCallback(() => {
    Alert.alert(
      "Delete All Clones",
      "This will remove all " + appClones.length + " app clones. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            void clearAllClones();
          },
        },
      ]
    );
  }, [clearAllClones, appClones.length]);

  const handleSelectEngine = useCallback(
    (id: string) => {
      if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      updateSearchEngine(id);
    },
    [updateSearchEngine]
  );

  const handleSelectUA = useCallback(
    (id: string) => {
      if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      updateUserAgent(id);
    },
    [updateUserAgent]
  );

  const handleSelectProfile = useCallback(
    (profileId: number) => {
      if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      selectProfile(profileId);
      setShowProfilePicker(false);
    },
    [selectProfile]
  );

  const handleRandomProfile = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    selectProfile(null);
    rotateFingerprint();
  }, [selectProfile, rotateFingerprint]);

  const renderProfileItem = useCallback(
    ({ item }: { item: DeviceProfile }) => (
      <ProfileItem
        profile={item}
        isSelected={selectedProfileId === item.id}
        onSelect={handleSelectProfile}
      />
    ),
    [selectedProfileId, handleSelectProfile]
  );

  const keyExtractor = useCallback((item: DeviceProfile) => String(item.id), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
          testID="close-settings"
        >
          <X size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 20 }}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Fingerprint size={16} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Fingerprint Profiles</Text>
            <Text style={styles.sectionBadge}>500 builds</Text>
          </View>

          <View style={styles.fpCard}>
            <View style={styles.fpCardTop}>
              <View style={styles.fpActiveRow}>
                <Smartphone size={16} color={Colors.accent} />
                <Text style={styles.fpActiveLabel} numberOfLines={1}>
                  {activeProfile.name}
                </Text>
              </View>
              <Text style={styles.fpActiveMeta}>
                {activeProfile.screenWidth}x{activeProfile.screenHeight} · {activeProfile.language} · {activeProfile.timezone.split("/")[1]}
              </Text>
            </View>
            <View style={styles.fpCardActions}>
              <TouchableOpacity
                style={[styles.fpActionBtn, autoRotateFingerprint && styles.fpActionBtnActive]}
                onPress={toggleAutoRotate}
              >
                <Shuffle size={14} color={autoRotateFingerprint ? Colors.accent : Colors.textMuted} />
                <Text style={[styles.fpActionText, autoRotateFingerprint && styles.fpActionTextActive]}>
                  Auto-Rotate
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fpActionBtn}
                onPress={handleRandomProfile}
              >
                <RotateCw size={14} color={Colors.textMuted} />
                <Text style={styles.fpActionText}>Random</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fpActionBtn}
                onPress={() => setShowProfilePicker(true)}
              >
                <Smartphone size={14} color={Colors.textMuted} />
                <Text style={styles.fpActionText}>Pick</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Search size={16} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Search Engine</Text>
          </View>
          {ENGINES.map((engine) => (
            <TouchableOpacity
              key={engine.id}
              style={[
                styles.optionRow,
                searchEngine === engine.id && styles.optionRowActive,
              ]}
              onPress={() => handleSelectEngine(engine.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{engine.icon}</Text>
              <Text
                style={[
                  styles.optionName,
                  searchEngine === engine.id && styles.optionNameActive,
                ]}
              >
                {engine.name}
              </Text>
              {searchEngine === engine.id && (
                <Check size={18} color={Colors.accent} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={16} color={Colors.accent} />
            <Text style={styles.sectionTitle}>User Agent</Text>
          </View>
          {UA_OPTIONS.map((ua) => (
            <TouchableOpacity
              key={ua.id}
              style={[
                styles.optionRow,
                selectedUserAgent === ua.id && styles.optionRowActive,
              ]}
              onPress={() => handleSelectUA(ua.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionName,
                  selectedUserAgent === ua.id && styles.optionNameActive,
                ]}
              >
                {ua.name}
              </Text>
              {selectedUserAgent === ua.id && (
                <Check size={18} color={Colors.accent} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={16} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
          </View>
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={handleClearData}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color={Colors.danger} />
            <Text style={styles.dangerText}>Clear All Browsing Data</Text>
            <ChevronRight size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          {appClones.length > 0 && (
            <TouchableOpacity
              style={[styles.dangerRow, { marginTop: 8 }]}
              onPress={handleClearClones}
              activeOpacity={0.7}
            >
              <Copy size={18} color={Colors.danger} />
              <Text style={styles.dangerText}>Delete All App Clones ({appClones.length})</Text>
              <ChevronRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={16} color={Colors.accent} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.aboutLogo}>
              <Shield size={28} color={Colors.accent} />
            </View>
            <Text style={styles.aboutName}>LordEEN Tech Browser</Text>
            <Text style={styles.aboutVersion}>Version 3.0.0</Text>
            <Text style={styles.aboutDesc}>
              Anti-detect browser with 500 device fingerprint profiles, app cloning, auto-rotating builds, and advanced privacy shields.
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>500</Text>
                <Text style={styles.statLabel}>Profiles</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{appClones.length}</Text>
                <Text style={styles.statLabel}>Clones</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>9</Text>
                <Text style={styles.statLabel}>Shields</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showProfilePicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProfilePicker(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Smartphone size={20} color={Colors.accent} />
              <Text style={styles.modalTitle}>Device Profiles</Text>
            </View>
            <Text style={styles.modalSub}>500 unique phone fingerprints</Text>
            <TouchableOpacity
              onPress={() => setShowProfilePicker(false)}
              style={styles.modalCloseBtn}
            >
              <X size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={DEVICE_PROFILES}
            renderItem={renderProfileItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={[
              styles.modalList,
              { paddingBottom: Math.max(insets.bottom, 20) + 20 },
            ]}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
            maxToRenderPerBatch={15}
            windowSize={10}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.accent,
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
    flex: 1,
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.warning,
    backgroundColor: "rgba(255, 165, 2, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden" as const,
  },
  fpCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden" as const,
  },
  fpCardTop: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  fpActiveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fpActiveLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
    flex: 1,
  },
  fpActiveMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  fpCardActions: {
    flexDirection: "row",
    padding: 4,
  },
  fpActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  fpActionBtnActive: {
    backgroundColor: Colors.accentGlow,
  },
  fpActionText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.textMuted,
  },
  fpActionTextActive: {
    color: Colors.accent,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  optionRowActive: {
    borderColor: Colors.accentDim,
    backgroundColor: Colors.accentGlow,
  },
  optionEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  optionName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.text,
  },
  optionNameActive: {
    color: Colors.accent,
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 71, 87, 0.2)",
    gap: 12,
  },
  dangerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.danger,
  },
  aboutCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  aboutLogo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  aboutName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  aboutVersion: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  aboutDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.cardBorder,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginLeft: 30,
  },
  modalCloseBtn: {
    position: "absolute",
    right: 20,
    top: 16,
    padding: 6,
  },
  modalList: {
    padding: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  profileRowActive: {
    borderColor: Colors.accentDim,
    backgroundColor: Colors.accentGlow,
  },
  profileIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileIconActive: {
    backgroundColor: "rgba(0, 229, 204, 0.2)",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  profileNameActive: {
    color: Colors.accent,
  },
  profileMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
