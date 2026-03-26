import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  X,
  Plus,
  FileCode,
  Upload,
  Link,
  Code,
  Trash2,
  Check,
  AlertTriangle,
  Package,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
} from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useBrowser, CustomExtension } from "@/providers/BrowserProvider";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface CustomExtensionManagerProps {
  visible: boolean;
  onClose: () => void;
}

type AddMode = "none" | "zip" | "file" | "url" | "manual";

const ExtensionCard = React.memo(
  ({
    ext,
    onToggle,
    onRemove,
    expanded,
    onToggleExpand,
  }: {
    ext: CustomExtension;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
    expanded: boolean;
    onToggleExpand: (id: string) => void;
  }) => {
    const sourceLabel =
      ext.sourceType === "zip"
        ? "ZIP"
        : ext.sourceType === "url"
        ? "URL"
        : ext.sourceType === "file"
        ? "File"
        : "Manual";

    const scriptPreview = ext.script.length > 200 ? ext.script.slice(0, 200) + "..." : ext.script;

    return (
      <View style={[cardStyles.card, !ext.enabled && cardStyles.cardDisabled]}>
        <TouchableOpacity
          style={cardStyles.cardHeader}
          onPress={() => onToggleExpand(ext.id)}
          activeOpacity={0.7}
        >
          <View style={[cardStyles.iconWrap, ext.enabled && cardStyles.iconWrapActive]}>
            <FileCode size={16} color={ext.enabled ? Colors.accent : Colors.textMuted} />
          </View>
          <View style={cardStyles.info}>
            <Text style={[cardStyles.name, ext.enabled && cardStyles.nameActive]} numberOfLines={1}>
              {ext.name}
            </Text>
            <View style={cardStyles.metaRow}>
              <View style={cardStyles.sourceBadge}>
                <Text style={cardStyles.sourceText}>{sourceLabel}</Text>
              </View>
              {ext.fileName && (
                <Text style={cardStyles.fileName} numberOfLines={1}>
                  {ext.fileName}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onToggle(ext.id)}
            style={cardStyles.toggleBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {ext.enabled ? (
              <ToggleRight size={24} color={Colors.accent} />
            ) : (
              <ToggleLeft size={24} color={Colors.textMuted} />
            )}
          </TouchableOpacity>
          {expanded ? (
            <ChevronUp size={14} color={Colors.textMuted} />
          ) : (
            <ChevronDown size={14} color={Colors.textMuted} />
          )}
        </TouchableOpacity>
        {expanded && (
          <View style={cardStyles.expandedContent}>
            {ext.description ? (
              <Text style={cardStyles.description}>{ext.description}</Text>
            ) : null}
            <View style={cardStyles.scriptPreview}>
              <Text style={cardStyles.scriptLabel}>Script Preview</Text>
              <Text style={cardStyles.scriptText} numberOfLines={6}>
                {scriptPreview}
              </Text>
            </View>
            <Text style={cardStyles.scriptSize}>
              {ext.script.length.toLocaleString()} chars · Added{" "}
              {new Date(ext.createdAt).toLocaleDateString()}
            </Text>
            <TouchableOpacity
              style={cardStyles.removeBtn}
              onPress={() => {
                Alert.alert(
                  "Remove Extension",
                  'Delete "' + ext.name + '"? This cannot be undone.',
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => onRemove(ext.id),
                    },
                  ]
                );
              }}
            >
              <Trash2 size={14} color={Colors.danger} />
              <Text style={cardStyles.removeBtnText}>Remove Extension</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);

export default function CustomExtensionManager({
  visible,
  onClose,
}: CustomExtensionManagerProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {
    customExtensions,
    addCustomExtension,
    removeCustomExtension,
    toggleCustomExtension,
    clearAllCustomExtensions,
  } = useBrowser();

  const [addMode, setAddMode] = useState<AddMode>("none");
  const [extName, setExtName] = useState<string>("");
  const [extDescription, setExtDescription] = useState<string>("");
  const [extScript, setExtScript] = useState<string>("");
  const [extUrl, setExtUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string>("");

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

  const resetForm = useCallback(() => {
    setAddMode("none");
    setExtName("");
    setExtDescription("");
    setExtScript("");
    setExtUrl("");
    setLoadedFileName("");
    setIsLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handlePickZipOrFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/zip",
          "application/x-zip-compressed",
          "application/javascript",
          "text/javascript",
          "text/plain",
          "application/json",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("[LordEEN] File pick canceled");
        return;
      }

      const asset = result.assets[0];
      const fileName = asset.name || "unknown";
      setLoadedFileName(fileName);
      setIsLoading(true);

      console.log("[LordEEN] Picked file:", fileName, "uri:", asset.uri, "mimeType:", asset.mimeType);

      const isZip =
        fileName.endsWith(".zip") ||
        asset.mimeType === "application/zip" ||
        asset.mimeType === "application/x-zip-compressed";

      if (isZip) {
        if (Platform.OS === "web") {
          Alert.alert("ZIP Support", "ZIP extraction works best on mobile devices. On web, please use .js files directly or paste code manually.");
          setIsLoading(false);
          return;
        }

        try {
          const JSZip = (await import("jszip")).default;
          const zipData = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: "base64" as const,
          });
          const zip = await JSZip.loadAsync(zipData, { base64: true });
          let combinedScript = "";
          let foundName = "";
          let foundDesc = "";
          const jsFiles: string[] = [];

          const manifestFile = zip.file("manifest.json") || zip.file("package.json");
          if (manifestFile) {
            try {
              const manifestText = await manifestFile.async("string");
              const manifest = JSON.parse(manifestText);
              foundName = manifest.name || manifest.title || "";
              foundDesc = manifest.description || "";
              console.log("[LordEEN] Found manifest:", foundName);
            } catch (e) {
              console.log("[LordEEN] Failed to parse manifest:", e);
            }
          }

          zip.forEach((relativePath, file) => {
            if (
              !file.dir &&
              (relativePath.endsWith(".js") || relativePath.endsWith(".user.js"))
            ) {
              jsFiles.push(relativePath);
            }
          });

          console.log("[LordEEN] Found JS files in zip:", jsFiles);

          for (const jsPath of jsFiles) {
            const jsFile = zip.file(jsPath);
            if (jsFile) {
              const content = await jsFile.async("string");
              combinedScript += "\n// === " + jsPath + " ===\n" + content + "\n";

              if (!foundName) {
                const nameMatch = content.match(/@name\s+(.+)/);
                if (nameMatch) foundName = nameMatch[1].trim();
              }
              if (!foundDesc) {
                const descMatch = content.match(/@description\s+(.+)/);
                if (descMatch) foundDesc = descMatch[1].trim();
              }
            }
          }

          if (!combinedScript.trim()) {
            Alert.alert("No Scripts Found", "The ZIP file does not contain any .js files.");
            setIsLoading(false);
            return;
          }

          setExtName(foundName || fileName.replace(/\.zip$/i, ""));
          setExtDescription(foundDesc);
          setExtScript(combinedScript.trim());
          setAddMode("zip");
          console.log("[LordEEN] Extracted", jsFiles.length, "JS files from ZIP");
        } catch (e) {
          console.log("[LordEEN] ZIP extraction error:", e);
          Alert.alert("ZIP Error", "Failed to extract the ZIP file. Make sure it contains valid JavaScript files.");
        }
      } else {
        try {
          const content = await FileSystem.readAsStringAsync(asset.uri);

          if (!content.trim()) {
            Alert.alert("Empty File", "The selected file is empty.");
            setIsLoading(false);
            return;
          }

          let foundName = "";
          let foundDesc = "";
          const nameMatch = content.match(/@name\s+(.+)/);
          if (nameMatch) foundName = nameMatch[1].trim();
          const descMatch = content.match(/@description\s+(.+)/);
          if (descMatch) foundDesc = descMatch[1].trim();

          setExtName(foundName || fileName.replace(/\.(js|txt|json)$/i, ""));
          setExtDescription(foundDesc);
          setExtScript(content.trim());
          setAddMode("file");
          console.log("[LordEEN] Loaded JS file:", fileName, content.length, "chars");
        } catch (e) {
          console.log("[LordEEN] File read error:", e);
          Alert.alert("Read Error", "Failed to read the file contents.");
        }
      }

      setIsLoading(false);
    } catch (e) {
      console.log("[LordEEN] Document picker error:", e);
      setIsLoading(false);
    }
  }, []);

  const handleFetchUrl = useCallback(async () => {
    const trimmedUrl = extUrl.trim();
    if (!trimmedUrl) return;

    const finalUrl = trimmedUrl.startsWith("http") ? trimmedUrl : "https://" + trimmedUrl;
    setIsLoading(true);

    try {
      const response = await fetch(finalUrl);
      if (!response.ok) {
        Alert.alert("Fetch Failed", "Could not download the script. Status: " + response.status);
        setIsLoading(false);
        return;
      }
      const text = await response.text();

      if (!text.trim()) {
        Alert.alert("Empty Response", "The URL returned empty content.");
        setIsLoading(false);
        return;
      }

      let foundName = "";
      let foundDesc = "";
      const nameMatch = text.match(/@name\s+(.+)/);
      if (nameMatch) foundName = nameMatch[1].trim();
      const descMatch = text.match(/@description\s+(.+)/);
      if (descMatch) foundDesc = descMatch[1].trim();

      const urlFileName = finalUrl.split("/").pop()?.split("?")[0] || "script";
      setExtName(foundName || urlFileName.replace(/\.(js|user\.js)$/i, ""));
      setExtDescription(foundDesc);
      setExtScript(text.trim());
      setLoadedFileName(urlFileName);
      console.log("[LordEEN] Fetched script from URL:", finalUrl, text.length, "chars");
    } catch (e) {
      console.log("[LordEEN] URL fetch error:", e);
      Alert.alert("Fetch Error", "Failed to download the script. Check the URL and try again.");
    }

    setIsLoading(false);
  }, [extUrl]);

  const handleAddExtension = useCallback(() => {
    const trimmedName = extName.trim();
    const trimmedScript = extScript.trim();
    if (!trimmedName || !trimmedScript) {
      Alert.alert("Missing Info", "Please provide a name and script code.");
      return;
    }

    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const sourceType = addMode === "none" || addMode === "manual" ? "manual" : addMode;
    addCustomExtension({
      name: trimmedName,
      description: extDescription.trim(),
      script: trimmedScript,
      sourceType: sourceType as CustomExtension["sourceType"],
      fileName: loadedFileName || undefined,
    });

    resetForm();
  }, [extName, extScript, extDescription, addMode, loadedFileName, addCustomExtension, resetForm]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      "Clear All Extensions",
      "Remove all " + customExtensions.length + " custom extensions?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            void clearAllCustomExtensions();
            if (Platform.OS !== "web") {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
        },
      ]
    );
  }, [customExtensions.length, clearAllCustomExtensions]);

  if (!visible) return null;

  const showForm = addMode !== "none";

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>
      <Animated.View
        style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.panelHeader}>
          <View style={styles.dragHandle} />
          <View style={styles.panelTitleRow}>
            <Package size={20} color={Colors.accent} />
            <Text style={styles.panelTitle}>Custom Extensions</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.panelContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {!showForm && (
            <View style={styles.addMethodRow}>
              <TouchableOpacity
                style={styles.addMethodBtn}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  void handlePickZipOrFile();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.addMethodIcon, { backgroundColor: "rgba(0, 229, 204, 0.12)" }]}>
                  <Upload size={20} color={Colors.accent} />
                </View>
                <Text style={styles.addMethodLabel}>ZIP / JS File</Text>
                <Text style={styles.addMethodSub}>Upload extension</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addMethodBtn}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setAddMode("url");
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.addMethodIcon, { backgroundColor: "rgba(30, 144, 255, 0.12)" }]}>
                  <Link size={20} color="#1E90FF" />
                </View>
                <Text style={styles.addMethodLabel}>From URL</Text>
                <Text style={styles.addMethodSub}>Fetch script</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addMethodBtn}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setAddMode("manual");
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.addMethodIcon, { backgroundColor: "rgba(124, 58, 237, 0.12)" }]}>
                  <Code size={20} color="#7C3AED" />
                </View>
                <Text style={styles.addMethodLabel}>Write Code</Text>
                <Text style={styles.addMethodSub}>Paste JS</Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingText}>Loading extension...</Text>
            </View>
          )}

          {showForm && !isLoading && (
            <View style={styles.formSection}>
              <View style={styles.formHeaderRow}>
                <Text style={styles.formTitle}>
                  {addMode === "zip"
                    ? "ZIP Extension"
                    : addMode === "file"
                    ? "JS File Extension"
                    : addMode === "url"
                    ? "URL Extension"
                    : "Manual Extension"}
                </Text>
                <TouchableOpacity onPress={resetForm} style={styles.formCancelBtn}>
                  <X size={14} color={Colors.textMuted} />
                  <Text style={styles.formCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              {addMode === "url" && !extScript && (
                <View style={styles.urlInputRow}>
                  <TextInput
                    style={styles.urlInput}
                    placeholder="https://example.com/script.user.js"
                    placeholderTextColor={Colors.textMuted}
                    value={extUrl}
                    onChangeText={setExtUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    selectionColor={Colors.accent}
                  />
                  <TouchableOpacity
                    style={[styles.fetchBtn, !extUrl.trim() && styles.fetchBtnDisabled]}
                    onPress={handleFetchUrl}
                    disabled={!extUrl.trim()}
                  >
                    <Text style={styles.fetchBtnText}>Fetch</Text>
                  </TouchableOpacity>
                </View>
              )}

              {(addMode === "manual" || extScript) && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Extension Name</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="My Custom Extension"
                      placeholderTextColor={Colors.textMuted}
                      value={extName}
                      onChangeText={setExtName}
                      selectionColor={Colors.accent}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description (optional)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="What does this extension do?"
                      placeholderTextColor={Colors.textMuted}
                      value={extDescription}
                      onChangeText={setExtDescription}
                      selectionColor={Colors.accent}
                    />
                  </View>

                  {loadedFileName ? (
                    <View style={styles.fileLoadedBanner}>
                      <Check size={14} color={Colors.accent} />
                      <Text style={styles.fileLoadedText}>
                        Loaded: {loadedFileName} ({extScript.length.toLocaleString()} chars)
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      JavaScript Code{" "}
                      {extScript ? "(" + extScript.length.toLocaleString() + " chars)" : ""}
                    </Text>
                    <TextInput
                      style={[styles.textInput, styles.codeInput]}
                      placeholder={"(function() {\n  // Your code here\n  console.log('Hello from extension!');\n})();"}
                      placeholderTextColor={Colors.textMuted}
                      value={extScript}
                      onChangeText={setExtScript}
                      multiline
                      autoCapitalize="none"
                      autoCorrect={false}
                      selectionColor={Colors.accent}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.warningBanner}>
                    <AlertTriangle size={14} color={Colors.warning} />
                    <Text style={styles.warningText}>
                      Custom scripts run with full page access. Only add extensions you trust.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.addBtn,
                      (!extName.trim() || !extScript.trim()) && styles.addBtnDisabled,
                    ]}
                    onPress={handleAddExtension}
                    disabled={!extName.trim() || !extScript.trim()}
                    activeOpacity={0.7}
                  >
                    <Plus size={18} color={extName.trim() && extScript.trim() ? "#000" : Colors.textMuted} />
                    <Text
                      style={[
                        styles.addBtnText,
                        (!extName.trim() || !extScript.trim()) && styles.addBtnTextDisabled,
                      ]}
                    >
                      Add Extension
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {customExtensions.length > 0 && (
            <View style={styles.installedSection}>
              <View style={styles.installedHeader}>
                <FileCode size={14} color={Colors.accent} />
                <Text style={styles.installedTitle}>
                  Installed ({customExtensions.length})
                </Text>
                {customExtensions.length > 1 && (
                  <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
                    <Trash2 size={12} color={Colors.danger} />
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>
              {customExtensions.map((ext) => (
                <ExtensionCard
                  key={ext.id}
                  ext={ext}
                  onToggle={toggleCustomExtension}
                  onRemove={removeCustomExtension}
                  expanded={expandedId === ext.id}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </View>
          )}

          {customExtensions.length === 0 && !showForm && (
            <View style={styles.emptyState}>
              <Package size={40} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Custom Extensions</Text>
              <Text style={styles.emptyDesc}>
                Add your own JavaScript extensions from ZIP files, URLs, or paste code directly.
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
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
    maxHeight: SCREEN_HEIGHT * 0.85,
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
    paddingTop: 16,
  },
  addMethodRow: {
    flexDirection: "row" as const,
    gap: 10,
    marginBottom: 20,
  },
  addMethodBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 8,
  },
  addMethodIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  addMethodLabel: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.text,
    textAlign: "center" as const,
  },
  addMethodSub: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: "center" as const,
  },
  loadingWrap: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 10,
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  formSection: {
    marginBottom: 20,
  },
  formHeaderRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.accent,
  },
  formCancelBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  formCancelText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.textMuted,
  },
  urlInputRow: {
    flexDirection: "row" as const,
    gap: 8,
    marginBottom: 16,
  },
  urlInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  fetchBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: "center" as const,
  },
  fetchBtnDisabled: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  fetchBtnText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#000",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  codeInput: {
    minHeight: 120,
    maxHeight: 200,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    lineHeight: 18,
  },
  fileLoadedBanner: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    backgroundColor: "rgba(0, 229, 204, 0.08)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 204, 0.2)",
  },
  fileLoadedText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: "500" as const,
    flex: 1,
  },
  warningBanner: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    backgroundColor: "rgba(255, 165, 2, 0.08)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 2, 0.2)",
  },
  warningText: {
    fontSize: 11,
    color: Colors.warning,
    flex: 1,
    lineHeight: 16,
  },
  addBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  addBtnDisabled: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#000",
  },
  addBtnTextDisabled: {
    color: Colors.textMuted,
  },
  installedSection: {
    marginTop: 8,
  },
  installedHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  installedTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.accent,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    flex: 1,
  },
  clearAllBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearAllText: {
    fontSize: 11,
    color: Colors.danger,
    fontWeight: "600" as const,
  },
  emptyState: {
    alignItems: "center" as const,
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center" as const,
    lineHeight: 18,
    paddingHorizontal: 30,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 8,
    overflow: "hidden" as const,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 12,
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  iconWrapActive: {
    backgroundColor: Colors.accentGlow,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  nameActive: {
    color: Colors.accent,
  },
  metaRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 2,
  },
  sourceBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  sourceText: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: "#7C3AED",
    textTransform: "uppercase" as const,
  },
  fileName: {
    fontSize: 10,
    color: Colors.textMuted,
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  toggleBtn: {
    padding: 4,
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 10,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 16,
  },
  scriptPreview: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  scriptLabel: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: Colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  scriptText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 14,
  },
  scriptSize: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  removeBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 71, 87, 0.2)",
    backgroundColor: "rgba(255, 71, 87, 0.06)",
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.danger,
  },
});
