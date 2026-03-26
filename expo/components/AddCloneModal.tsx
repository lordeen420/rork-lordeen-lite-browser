import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Modal,
} from "react-native";
import {
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
  Zap,
  Cloud,
  Gift,
  Wallet,
  Compass,
  Check,
  Search,
  Smartphone,
  ChevronRight,
  Shield,
  Shuffle,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { CLONE_COLORS, CLONE_ICONS } from "@/providers/BrowserProvider";
import { NATIVE_APPS, NativeApp, APP_CATEGORIES, searchApps } from "@/constants/nativeApps";
import { DEVICE_PROFILES, DeviceProfile } from "@/constants/deviceProfiles";
import { MOCK_LOCATIONS, MockLocation, searchLocations, getLocationById, LOCATION_COUNTRIES } from "@/constants/locations";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const ICON_COMPONENTS: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Globe, ShoppingCart, CreditCard, MessageCircle, Play,
  Music, Camera, Mail, Map: MapPin, Briefcase,
  BookOpen, Coffee, Gamepad2, Heart, Star,
  Zap, Cloud, Gift, Wallet, Compass, Shield,
};

interface AddCloneModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    url: string;
    color: string;
    icon: string;
    deviceProfileId?: number | null;
    mockLocationId?: string | null;
    packageAndroid?: string;
    bundleIOS?: string;
    appCategory?: string;
  }) => void;
}

type ModalStep = "pick_app" | "customize" | "pick_phone";

const AppListItem = React.memo(({ app, onPress }: { app: NativeApp; onPress: (app: NativeApp) => void }) => {
  const Ic = ICON_COMPONENTS[app.icon] || Globe;
  return (
    <TouchableOpacity
      style={appStyles.appRow}
      onPress={() => onPress(app)}
      activeOpacity={0.7}
    >
      <View style={[appStyles.appIconWrap, { backgroundColor: app.color + "18" }]}>
        <Ic size={20} color={app.color} />
      </View>
      <View style={appStyles.appInfo}>
        <Text style={appStyles.appName} numberOfLines={1}>{app.name}</Text>
        <Text style={appStyles.appMeta} numberOfLines={1}>{app.category} · {app.url.replace("https://", "").replace("http://", "").split("/")[0]}</Text>
      </View>
      <ChevronRight size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
});

const LocationListItem = React.memo(({ location, isSelected, onPress }: { location: MockLocation; isSelected: boolean; onPress: (l: MockLocation) => void }) => {
  return (
    <TouchableOpacity
      style={[locationStyles.locRow, isSelected && locationStyles.locRowActive]}
      onPress={() => onPress(location)}
      activeOpacity={0.7}
    >
      <View style={[locationStyles.locFlag, isSelected && locationStyles.locFlagActive]}>
        <Text style={locationStyles.locFlagText}>{location.flag}</Text>
      </View>
      <View style={locationStyles.locInfo}>
        <Text style={[locationStyles.locName, isSelected && locationStyles.locNameActive]} numberOfLines={1}>
          {location.city}, {location.country}
        </Text>
        <Text style={locationStyles.locMeta} numberOfLines={1}>
          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)} · {location.timezone}
        </Text>
      </View>
      {isSelected && <Check size={14} color="#FF6B6B" />}
    </TouchableOpacity>
  );
});

const PhoneListItem = React.memo(({ profile, isSelected, onPress }: { profile: DeviceProfile; isSelected: boolean; onPress: (p: DeviceProfile) => void }) => {
  const isIOS = profile.name.includes("iPhone") || profile.name.includes("iPad");
  return (
    <TouchableOpacity
      style={[phoneStyles.phoneRow, isSelected && phoneStyles.phoneRowActive]}
      onPress={() => onPress(profile)}
      activeOpacity={0.7}
    >
      <View style={[phoneStyles.phoneIcon, isSelected && phoneStyles.phoneIconActive]}>
        <Smartphone size={14} color={isSelected ? Colors.accent : Colors.textSecondary} />
      </View>
      <View style={phoneStyles.phoneInfo}>
        <Text style={[phoneStyles.phoneName, isSelected && phoneStyles.phoneNameActive]} numberOfLines={1}>
          {profile.name}
        </Text>
        <Text style={phoneStyles.phoneMeta} numberOfLines={1}>
          {isIOS ? "iOS" : "Android"} · {profile.screenWidth}x{profile.screenHeight} · {profile.language}
        </Text>
      </View>
      {isSelected && <Check size={14} color={Colors.accent} />}
    </TouchableOpacity>
  );
});

export default function AddCloneModal({ visible, onClose, onAdd }: AddCloneModalProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [step, setStep] = useState<ModalStep>("pick_app");
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(CLONE_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<string>(CLONE_ICONS[0]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<NativeApp | null>(null);
  const [appSearch, setAppSearch] = useState<string>("");
  const [phoneSearch, setPhoneSearch] = useState<string>("");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showPhonePicker, setShowPhonePicker] = useState<boolean>(false);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);

  React.useEffect(() => {
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

  const resetState = useCallback(() => {
    setStep("pick_app");
    setName("");
    setUrl("");
    setSelectedColor(CLONE_COLORS[0]);
    setSelectedIcon(CLONE_ICONS[0]);
    setSelectedProfileId(null);
    setSelectedLocationId(null);
    setSelectedApp(null);
    setAppSearch("");
    setPhoneSearch("");
    setLocationSearch("");
    setSelectedCategory("All");
    setShowPhonePicker(false);
    setShowLocationPicker(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handlePickApp = useCallback((app: NativeApp) => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedApp(app);
    setName(app.name);
    setUrl(app.url);
    setSelectedColor(app.color);
    setSelectedIcon(app.icon);
    setStep("customize");
  }, []);

  const handleCustomEntry = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedApp(null);
    setStep("customize");
  }, []);

  const handleAdd = useCallback(() => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName || !trimmedUrl) return;

    const finalUrl = trimmedUrl.startsWith("http") ? trimmedUrl : "https://" + trimmedUrl;

    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onAdd({
      name: trimmedName,
      url: finalUrl,
      color: selectedColor,
      icon: selectedIcon,
      deviceProfileId: selectedProfileId,
      mockLocationId: selectedLocationId ?? undefined,
      packageAndroid: selectedApp?.packageAndroid,
      bundleIOS: selectedApp?.bundleIOS,
      appCategory: selectedApp?.category,
    });

    resetState();
  }, [name, url, selectedColor, selectedIcon, selectedProfileId, selectedLocationId, selectedApp, onAdd, resetState]);

  const handleSelectPhone = useCallback((profile: DeviceProfile) => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedProfileId(profile.id);
    setShowPhonePicker(false);
  }, []);

  const handleRandomPhone = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const idx = Math.floor(Math.random() * DEVICE_PROFILES.length);
    setSelectedProfileId(DEVICE_PROFILES[idx].id);
    setShowPhonePicker(false);
  }, []);

  const filteredApps = useMemo(() => {
    let apps = appSearch ? searchApps(appSearch) : NATIVE_APPS;
    if (selectedCategory !== "All") {
      apps = apps.filter((a) => a.category === selectedCategory);
    }
    return apps;
  }, [appSearch, selectedCategory]);

  const filteredPhones = useMemo(() => {
    if (!phoneSearch.trim()) return DEVICE_PROFILES;
    const q = phoneSearch.toLowerCase().trim();
    return DEVICE_PROFILES.filter((p) => p.name.toLowerCase().includes(q));
  }, [phoneSearch]);

  const filteredLocations = useMemo(() => {
    return searchLocations(locationSearch);
  }, [locationSearch]);

  const selectedProfile = useMemo(() => {
    if (selectedProfileId == null) return null;
    return DEVICE_PROFILES.find((p) => p.id === selectedProfileId) ?? null;
  }, [selectedProfileId]);

  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) return null;
    return getLocationById(selectedLocationId);
  }, [selectedLocationId]);

  const handleSelectLocation = useCallback((loc: MockLocation) => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedLocationId(loc.id);
    setShowLocationPicker(false);
  }, []);

  const handleRandomLocation = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const idx = Math.floor(Math.random() * MOCK_LOCATIONS.length);
    setSelectedLocationId(MOCK_LOCATIONS[idx].id);
    setShowLocationPicker(false);
  }, []);

  const IconPreview = ICON_COMPONENTS[selectedIcon] || Globe;
  const canSubmit = name.trim().length > 0 && url.trim().length > 0;

  const renderPhoneItem = useCallback(
    ({ item }: { item: DeviceProfile }) => (
      <PhoneListItem
        profile={item}
        isSelected={selectedProfileId === item.id}
        onPress={handleSelectPhone}
      />
    ),
    [selectedProfileId, handleSelectPhone]
  );

  const phoneKeyExtractor = useCallback((item: DeviceProfile) => String(item.id), []);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
      </Animated.View>
      <Animated.View
        style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.panelHeader}>
            <View style={styles.dragHandle} />
            <View style={styles.panelTitleRow}>
              <Text style={styles.panelTitle}>
                {step === "pick_app" ? "Pick App to Clone" : "Customize Clone"}
              </Text>
              {step === "customize" && (
                <TouchableOpacity
                  onPress={() => setStep("pick_app")}
                  style={styles.backStepBtn}
                >
                  <Text style={styles.backStepText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <X size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {step === "pick_app" ? (
            <View style={styles.panelContent}>
              <View style={appStyles.searchWrap}>
                <Search size={16} color={Colors.textMuted} />
                <TextInput
                  style={appStyles.searchInput}
                  placeholder="Search 100+ apps..."
                  placeholderTextColor={Colors.textMuted}
                  value={appSearch}
                  onChangeText={setAppSearch}
                  autoCapitalize="none"
                  selectionColor={Colors.accent}
                />
                {appSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setAppSearch("")}>
                    <X size={14} color={Colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={appStyles.categoryRow}
                style={appStyles.categoryScroll}
              >
                {["All", ...APP_CATEGORIES].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[appStyles.categoryChip, selectedCategory === cat && appStyles.categoryChipActive]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[appStyles.categoryText, selectedCategory === cat && appStyles.categoryTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={appStyles.customEntryBtn}
                onPress={handleCustomEntry}
                activeOpacity={0.7}
              >
                <View style={appStyles.customIconWrap}>
                  <Globe size={18} color={Colors.accent} />
                </View>
                <View style={appStyles.customInfo}>
                  <Text style={appStyles.customTitle}>Custom URL</Text>
                  <Text style={appStyles.customSub}>Enter any website manually</Text>
                </View>
                <ChevronRight size={16} color={Colors.textMuted} />
              </TouchableOpacity>

              <FlatList
                data={filteredApps}
                renderItem={({ item }) => <AppListItem app={item} onPress={handlePickApp} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                style={appStyles.appList}
                contentContainerStyle={appStyles.appListContent}
                initialNumToRender={15}
                maxToRenderPerBatch={10}
                windowSize={8}
                ListEmptyComponent={
                  <View style={appStyles.emptyState}>
                    <Text style={appStyles.emptyText}>No apps found</Text>
                  </View>
                }
              />
            </View>
          ) : (
            <ScrollView
              style={styles.panelContentScroll}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.previewCard}>
                <View style={[styles.previewIcon, { backgroundColor: selectedColor + "22" }]}>
                  <IconPreview size={32} color={selectedColor} />
                </View>
                <Text style={styles.previewName} numberOfLines={1}>
                  {name || "App Name"}
                </Text>
                <Text style={styles.previewUrl} numberOfLines={1}>
                  {url || "https://example.com"}
                </Text>
                {selectedProfile && (
                  <View style={styles.previewPhone}>
                    <Smartphone size={10} color={Colors.accent} />
                    <Text style={styles.previewPhoneText}>{selectedProfile.name}</Text>
                  </View>
                )}
                {selectedLocation && (
                  <View style={styles.previewLocation}>
                    <MapPin size={10} color="#FF6B6B" />
                    <Text style={styles.previewLocationText}>{selectedLocation.flag} {selectedLocation.city}, {selectedLocation.country}</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>App Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Instagram, Stripe, WhatsApp"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  selectionColor={Colors.accent}
                  testID="clone-name-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>URL</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. instagram.com or https://..."
                  placeholderTextColor={Colors.textMuted}
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  selectionColor={Colors.accent}
                  testID="clone-url-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Run as Phone (Device Spoof)</Text>
                <TouchableOpacity
                  style={styles.phoneSelector}
                  onPress={() => setShowPhonePicker(true)}
                  activeOpacity={0.7}
                >
                  <Smartphone size={18} color={selectedProfile ? Colors.accent : Colors.textMuted} />
                  <View style={styles.phoneSelectorInfo}>
                    <Text style={[styles.phoneSelectorName, selectedProfile && styles.phoneSelectorNameActive]}>
                      {selectedProfile ? selectedProfile.name : "Select a phone model (500+)"}
                    </Text>
                    {selectedProfile && (
                      <Text style={styles.phoneSelectorMeta}>
                        {selectedProfile.screenWidth}x{selectedProfile.screenHeight} · {selectedProfile.language}
                      </Text>
                    )}
                  </View>
                  <ChevronRight size={16} color={Colors.textMuted} />
                </TouchableOpacity>
                <View style={styles.phoneQuickActions}>
                  <TouchableOpacity style={styles.phoneQuickBtn} onPress={handleRandomPhone}>
                    <Shuffle size={12} color={Colors.textMuted} />
                    <Text style={styles.phoneQuickText}>Random</Text>
                  </TouchableOpacity>
                  {selectedProfileId != null && (
                    <TouchableOpacity
                      style={styles.phoneQuickBtn}
                      onPress={() => setSelectedProfileId(null)}
                    >
                      <X size={12} color={Colors.danger} />
                      <Text style={[styles.phoneQuickText, { color: Colors.danger }]}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mock Location (GPS Spoof)</Text>
                <TouchableOpacity
                  style={styles.phoneSelector}
                  onPress={() => setShowLocationPicker(true)}
                  activeOpacity={0.7}
                >
                  <MapPin size={18} color={selectedLocation ? "#FF6B6B" : Colors.textMuted} />
                  <View style={styles.phoneSelectorInfo}>
                    <Text style={[styles.phoneSelectorName, selectedLocation && styles.phoneSelectorNameActive]}>
                      {selectedLocation ? selectedLocation.flag + " " + selectedLocation.city + ", " + selectedLocation.country : "Select a country / city"}
                    </Text>
                    {selectedLocation && (
                      <Text style={styles.phoneSelectorMeta}>
                        {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)} · {selectedLocation.timezone}
                      </Text>
                    )}
                  </View>
                  <ChevronRight size={16} color={Colors.textMuted} />
                </TouchableOpacity>
                <View style={styles.phoneQuickActions}>
                  <TouchableOpacity style={styles.phoneQuickBtn} onPress={handleRandomLocation}>
                    <Shuffle size={12} color={Colors.textMuted} />
                    <Text style={styles.phoneQuickText}>Random</Text>
                  </TouchableOpacity>
                  {selectedLocationId != null && (
                    <TouchableOpacity
                      style={styles.phoneQuickBtn}
                      onPress={() => setSelectedLocationId(null)}
                    >
                      <X size={12} color={Colors.danger} />
                      <Text style={[styles.phoneQuickText, { color: Colors.danger }]}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Icon</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.iconRow}
                >
                  {CLONE_ICONS.map((iconName) => {
                    const Ic = ICON_COMPONENTS[iconName] || Globe;
                    const isSelected = selectedIcon === iconName;
                    return (
                      <TouchableOpacity
                        key={iconName}
                        style={[styles.iconOption, isSelected && styles.iconOptionSelected]}
                        onPress={() => {
                          setSelectedIcon(iconName);
                          if (Platform.OS !== "web") {
                            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Ic size={20} color={isSelected ? selectedColor : Colors.textMuted} />
                        {isSelected && (
                          <View style={[styles.iconCheck, { backgroundColor: selectedColor }]}>
                            <Check size={8} color="#000" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Color</Text>
                <View style={styles.colorGrid}>
                  {CLONE_COLORS.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          isSelected && styles.colorOptionSelected,
                        ]}
                        onPress={() => {
                          setSelectedColor(color);
                          if (Platform.OS !== "web") {
                            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        {isSelected && <Check size={14} color="#000" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.addBtn, !canSubmit && styles.addBtnDisabled]}
                onPress={handleAdd}
                disabled={!canSubmit}
                activeOpacity={0.7}
                testID="clone-add-btn"
              >
                <Text style={[styles.addBtnText, !canSubmit && styles.addBtnTextDisabled]}>
                  Create Clone
                </Text>
              </TouchableOpacity>

              <View style={{ height: 30 }} />
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </Animated.View>

      <Modal
        visible={showLocationPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <View style={locationStyles.container}>
          <View style={locationStyles.header}>
            <View style={locationStyles.headerTitleRow}>
              <MapPin size={20} color="#FF6B6B" />
              <Text style={locationStyles.headerTitle}>Mock Location</Text>
            </View>
            <Text style={locationStyles.headerSub}>{MOCK_LOCATIONS.length} locations across {LOCATION_COUNTRIES.length} countries</Text>
            <TouchableOpacity
              onPress={() => setShowLocationPicker(false)}
              style={locationStyles.headerCloseBtn}
            >
              <X size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={locationStyles.searchWrap}>
            <Search size={16} color={Colors.textMuted} />
            <TextInput
              style={locationStyles.searchInput}
              placeholder="Search country or city..."
              placeholderTextColor={Colors.textMuted}
              value={locationSearch}
              onChangeText={setLocationSearch}
              autoCapitalize="none"
              selectionColor={Colors.accent}
            />
            {locationSearch.length > 0 && (
              <TouchableOpacity onPress={() => setLocationSearch("")}>
                <X size={14} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={locationStyles.randomBtn} onPress={handleRandomLocation}>
            <Shuffle size={16} color="#FF6B6B" />
            <Text style={locationStyles.randomBtnText}>Random Location</Text>
          </TouchableOpacity>

          <FlatList
            data={filteredLocations}
            renderItem={({ item }) => (
              <LocationListItem
                location={item}
                isSelected={selectedLocationId === item.id}
                onPress={handleSelectLocation}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={locationStyles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
            maxToRenderPerBatch={15}
            windowSize={10}
          />
        </View>
      </Modal>

      <Modal
        visible={showPhonePicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPhonePicker(false)}
      >
        <View style={phoneStyles.container}>
          <View style={phoneStyles.header}>
            <View style={phoneStyles.headerTitleRow}>
              <Smartphone size={20} color={Colors.accent} />
              <Text style={phoneStyles.headerTitle}>Select Phone</Text>
            </View>
            <Text style={phoneStyles.headerSub}>500+ phone models to spoof</Text>
            <TouchableOpacity
              onPress={() => setShowPhonePicker(false)}
              style={phoneStyles.headerCloseBtn}
            >
              <X size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={phoneStyles.searchWrap}>
            <Search size={16} color={Colors.textMuted} />
            <TextInput
              style={phoneStyles.searchInput}
              placeholder="Search phones... (Samsung, iPhone, Pixel...)"
              placeholderTextColor={Colors.textMuted}
              value={phoneSearch}
              onChangeText={setPhoneSearch}
              autoCapitalize="none"
              selectionColor={Colors.accent}
            />
            {phoneSearch.length > 0 && (
              <TouchableOpacity onPress={() => setPhoneSearch("")}>
                <X size={14} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={phoneStyles.randomBtn} onPress={handleRandomPhone}>
            <Shuffle size={16} color={Colors.accent} />
            <Text style={phoneStyles.randomBtnText}>Pick Random Phone</Text>
          </TouchableOpacity>

          <FlatList
            data={filteredPhones}
            renderItem={renderPhoneItem}
            keyExtractor={phoneKeyExtractor}
            contentContainerStyle={phoneStyles.list}
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  panel: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.88,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden" as const,
  },
  keyboardView: {
    flex: 1,
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
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: "100%" as const,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    flex: 1,
  },
  backStepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  backStepText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  closeBtn: {
    padding: 6,
  },
  panelContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    minHeight: 0,
  },
  panelContentScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  previewCard: {
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  previewIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 12,
  },
  previewName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  previewUrl: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  previewPhone: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    marginTop: 8,
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  previewPhoneText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: Colors.accent,
  },
  previewLocation: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    marginTop: 6,
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  previewLocationText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: "#FF6B6B",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  phoneSelector: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  phoneSelectorInfo: {
    flex: 1,
  },
  phoneSelectorName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.textMuted,
  },
  phoneSelectorNameActive: {
    color: Colors.text,
  },
  phoneSelectorMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  phoneQuickActions: {
    flexDirection: "row" as const,
    gap: 8,
    marginTop: 8,
  },
  phoneQuickBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  phoneQuickText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.textMuted,
  },
  iconRow: {
    gap: 8,
    paddingVertical: 4,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  iconOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: "rgba(0, 229, 204, 0.08)",
  },
  iconCheck: {
    position: "absolute" as const,
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  colorGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: Colors.text,
  },
  addBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center" as const,
    marginTop: 8,
  },
  addBtnDisabled: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#000",
  },
  addBtnTextDisabled: {
    color: Colors.textMuted,
  },
});

const appStyles = StyleSheet.create({
  searchWrap: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    height: "100%" as const,
  },
  categoryScroll: {
    maxHeight: 40,
    marginTop: 10,
    marginBottom: 8,
  },
  categoryRow: {
    gap: 6,
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  categoryChipActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accentDim,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textMuted,
  },
  categoryTextActive: {
    color: Colors.accent,
  },
  customEntryBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderStyle: "dashed" as const,
    gap: 12,
  },
  customIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentGlow,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  customInfo: {
    flex: 1,
  },
  customTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.accent,
  },
  customSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  appList: {
    flex: 1,
    minHeight: 0,
  },
  appListContent: {
    paddingBottom: 40,
  },
  appRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  appIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  appMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  emptyState: {
    alignItems: "center" as const,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});

const locationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginLeft: 30,
  },
  headerCloseBtn: {
    position: "absolute" as const,
    right: 20,
    top: 56,
    padding: 6,
  },
  searchWrap: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    height: "100%" as const,
  },
  randomBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.2)",
  },
  randomBtnText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FF6B6B",
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  locRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  locRowActive: {
    borderColor: "rgba(255, 107, 107, 0.4)",
    backgroundColor: "rgba(255, 107, 107, 0.08)",
  },
  locFlag: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  locFlagActive: {
    backgroundColor: "rgba(255, 107, 107, 0.15)",
  },
  locFlagText: {
    fontSize: 18,
  },
  locInfo: {
    flex: 1,
  },
  locName: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  locNameActive: {
    color: "#FF6B6B",
  },
  locMeta: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});

const phoneStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginLeft: 30,
  },
  headerCloseBtn: {
    position: "absolute" as const,
    right: 20,
    top: 56,
    padding: 6,
  },
  searchWrap: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    height: "100%" as const,
  },
  randomBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.2)",
  },
  randomBtnText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.accent,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  phoneRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  phoneRowActive: {
    borderColor: Colors.accentDim,
    backgroundColor: Colors.accentGlow,
  },
  phoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  phoneIconActive: {
    backgroundColor: "rgba(0, 229, 204, 0.2)",
  },
  phoneInfo: {
    flex: 1,
  },
  phoneName: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  phoneNameActive: {
    color: Colors.accent,
  },
  phoneMeta: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
