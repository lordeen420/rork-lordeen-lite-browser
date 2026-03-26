import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Switch,
  Dimensions,
  Platform,
} from "react-native";
import {
  ShieldOff,
  Moon,
  FileCode,
  ImageOff,
  Fingerprint,
  Cookie,
  Eye,
  Wifi,
  User,
  X,
  Shield,
  ToggleRight,
  Puzzle,
  Package,
  ChevronRight,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { EXTENSIONS, ExtensionItem } from "@/constants/extensions";
import { useBrowser } from "@/providers/BrowserProvider";
import CustomExtensionManager from "@/components/CustomExtensionManager";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  ShieldOff, Moon, FileCode, ImageOff, Fingerprint, Cookie, Eye, Wifi, User,
};

interface ExtensionsPanelProps {
  visible: boolean;
  onClose: () => void;
}

const ExtensionToggle = React.memo(
  ({
    item,
    enabled,
    onToggle,
  }: {
    item: ExtensionItem;
    enabled: boolean;
    onToggle: (id: string) => void;
  }) => {
    const IconComponent = ICON_MAP[item.icon];
    const handleToggle = useCallback(() => {
      onToggle(item.id);
    }, [item.id, onToggle]);

    return (
      <View style={styles.extensionRow}>
        <View style={[styles.extensionIcon, enabled && styles.extensionIconActive]}>
          {IconComponent && (
            <IconComponent
              size={18}
              color={enabled ? Colors.accent : Colors.textSecondary}
            />
          )}
        </View>
        <View style={styles.extensionInfo}>
          <Text style={[styles.extensionName, enabled && styles.extensionNameActive]}>
            {item.name}
          </Text>
          <Text style={styles.extensionDesc}>{item.description}</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ false: Colors.toggleTrackOff, true: Colors.accentDim }}
          thumbColor={enabled ? Colors.accent : "#666"}
          {...(Platform.OS === "web" ? {} : { ios_backgroundColor: Colors.toggleTrackOff })}
        />
      </View>
    );
  }
);

export default function ExtensionsPanel({ visible, onClose }: ExtensionsPanelProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {
    extensions,
    toggleExtension,
    autoRotateFingerprint,
    activeProfile,
    toggleAutoRotate,
    customExtensions,
  } = useBrowser();
  const [showCustomManager, setShowCustomManager] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const tools = EXTENSIONS.filter((e) => e.category === "tool");
  const shields = EXTENSIONS.filter((e) => e.category === "shield");

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>
      <Animated.View
        style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.panelHeader}>
          <View style={styles.dragHandle} />
          <View style={styles.panelTitleRow}>
            <Puzzle size={20} color={Colors.accent} />
            <Text style={styles.panelTitle}>Shields & Tools</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={styles.panelContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.fingerprintBanner}>
            <View style={styles.fpBannerLeft}>
              <Fingerprint size={18} color={Colors.accent} />
              <View style={styles.fpBannerInfo}>
                <Text style={styles.fpBannerTitle}>
                  {autoRotateFingerprint ? "Auto-Rotate" : "Fixed Profile"}
                </Text>
                <Text style={styles.fpBannerSub} numberOfLines={1}>
                  {activeProfile.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== "web") {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                toggleAutoRotate();
              }}
              style={[styles.fpToggleBtn, autoRotateFingerprint && styles.fpToggleBtnActive]}
            >
              <ToggleRight size={14} color={autoRotateFingerprint ? Colors.accent : Colors.textMuted} />
              <Text style={[styles.fpToggleText, autoRotateFingerprint && styles.fpToggleTextActive]}>
                {autoRotateFingerprint ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Puzzle size={16} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Tools</Text>
          </View>
          {tools.map((item) => (
            <ExtensionToggle
              key={item.id}
              item={item}
              enabled={!!extensions[item.id]}
              onToggle={toggleExtension}
            />
          ))}

          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Shield size={16} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Privacy Shields</Text>
          </View>
          {shields.map((item) => (
            <ExtensionToggle
              key={item.id}
              item={item}
              enabled={!!extensions[item.id]}
              onToggle={toggleExtension}
            />
          ))}

          <TouchableOpacity
            style={styles.customExtBtn}
            onPress={() => {
              if (Platform.OS !== "web") {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setShowCustomManager(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.customExtIconWrap}>
              <Package size={20} color="#7C3AED" />
            </View>
            <View style={styles.customExtInfo}>
              <Text style={styles.customExtTitle}>Custom Extensions</Text>
              <Text style={styles.customExtSub}>
                {customExtensions.length > 0
                  ? customExtensions.length + " installed · " + customExtensions.filter((e) => e.enabled).length + " active"
                  : "Add ZIP, JS files, or URLs"}
              </Text>
            </View>
            <ChevronRight size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>

        <CustomExtensionManager
          visible={showCustomManager}
          onClose={() => setShowCustomManager(false)}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  panel: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.78,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden" as const,
  },
  panelHeader: {
    alignItems: "center" as const,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
    marginBottom: 12,
  },
  panelTitleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: "100%" as const,
    gap: 10,
  },
  panelTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  closeBtn: {
    padding: 6,
  },
  panelContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  fingerprintBanner: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: "rgba(0, 229, 204, 0.06)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.15)",
  },
  fpBannerLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
  fpBannerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  fpBannerTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.accent,
  },
  fpBannerSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  fpToggleBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  fpToggleBtnActive: {
    borderColor: Colors.accentDim,
    backgroundColor: Colors.accentGlow,
  },
  fpToggleText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.textMuted,
  },
  fpToggleTextActive: {
    color: Colors.accent,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
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
  },
  extensionRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  extensionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  extensionIconActive: {
    backgroundColor: Colors.accentGlow,
  },
  extensionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  extensionName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  extensionNameActive: {
    color: Colors.accent,
  },
  extensionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  customExtBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "rgba(124, 58, 237, 0.3)",
    borderStyle: "dashed" as const,
    gap: 12,
  },
  customExtIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  customExtInfo: {
    flex: 1,
  },
  customExtTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#7C3AED",
  },
  customExtSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
