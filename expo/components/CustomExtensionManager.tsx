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
  Chrome,
  File,
  FolderOpen,
  Shield,
  Globe,
  Layers,
  Info,
  Settings2,
} from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useBrowser, CustomExtension } from "@/providers/BrowserProvider";
import {
  parseZipExtension,
  generateChromeAPIMock,
  buildContentScriptInjector,
  formatFileSize,
  ParsedChromeExtension,
} from "@/utils/chromeExtensionParser";

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
    const isChromeExt = ext.manifestVersion != null && ext.contentScripts && ext.contentScripts.length > 0;
    const sourceLabel =
      ext.sourceType === "zip"
        ? isChromeExt ? "CRX" : "ZIP"
        : ext.sourceType === "url"
        ? "URL"
        : ext.sourceType === "file"
        ? "File"
        : "Manual";

    const versionLabel = ext.version || "";

    return (
      <View style={[cardStyles.card, !ext.enabled && cardStyles.cardDisabled]}>
        <TouchableOpacity
          style={cardStyles.cardHeader}
          onPress={() => onToggleExpand(ext.id)}
          activeOpacity={0.7}
        >
          <View style={[cardStyles.iconWrap, ext.enabled && cardStyles.iconWrapActive]}>
            {isChromeExt ? (
              <Chrome size={16} color={ext.enabled ? "#4285F4" : Colors.textMuted} />
            ) : (
              <FileCode size={16} color={ext.enabled ? Colors.accent : Colors.textMuted} />
            )}
          </View>
          <View style={cardStyles.info}>
            <View style={cardStyles.nameRow}>
              <Text style={[cardStyles.name, ext.enabled && cardStyles.nameActive]} numberOfLines={1}>
                {ext.name}
              </Text>
              {versionLabel ? (
                <Text style={cardStyles.versionText}>{versionLabel}</Text>
              ) : null}
            </View>
            <View style={cardStyles.metaRow}>
              <View style={[cardStyles.sourceBadge, isChromeExt && cardStyles.chromeBadge]}>
                <Text style={[cardStyles.sourceText, isChromeExt && cardStyles.chromeText]}>{sourceLabel}</Text>
              </View>
              {ext.manifestVersion ? (
                <View style={cardStyles.mvBadge}>
                  <Text style={cardStyles.mvText}>MV{ext.manifestVersion}</Text>
                </View>
              ) : null}
              {ext.totalFiles ? (
                <Text style={cardStyles.fileCount}>{ext.totalFiles} files</Text>
              ) : null}
              {ext.totalSize ? (
                <Text style={cardStyles.fileCount}>{formatFileSize(ext.totalSize)}</Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onToggle(ext.id)}
            style={cardStyles.toggleBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {ext.enabled ? (
              <ToggleRight size={24} color={isChromeExt ? "#4285F4" : Colors.accent} />
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

            {ext.contentScripts && ext.contentScripts.length > 0 && (
              <View style={cardStyles.detailSection}>
                <View style={cardStyles.detailHeader}>
                  <Layers size={12} color="#4285F4" />
                  <Text style={cardStyles.detailTitle}>Content Scripts</Text>
                </View>
                {ext.contentScripts.map((cs, idx) => (
                  <View key={idx} style={cardStyles.contentScriptItem}>
                    <Text style={cardStyles.csLabel}>Match: {cs.matches.join(", ")}</Text>
                    <Text style={cardStyles.csLabel}>Run at: {cs.runAt}</Text>
                    {cs.jsFiles.length > 0 && (
                      <View style={cardStyles.csFileRow}>
                        <FileCode size={10} color={Colors.textMuted} />
                        <Text style={cardStyles.csFileText}>
                          {cs.jsFiles.length} JS file{cs.jsFiles.length !== 1 ? "s" : ""}
                          {cs.jsFiles.length <= 3 ? ": " + cs.jsFiles.join(", ") : ""}
                        </Text>
                      </View>
                    )}
                    {cs.cssFiles.length > 0 && (
                      <View style={cardStyles.csFileRow}>
                        <File size={10} color="#E91E63" />
                        <Text style={cardStyles.csFileText}>
                          {cs.cssFiles.length} CSS file{cs.cssFiles.length !== 1 ? "s" : ""}
                          {cs.cssFiles.length <= 3 ? ": " + cs.cssFiles.join(", ") : ""}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {ext.backgroundScript && (
              <View style={cardStyles.detailSection}>
                <View style={cardStyles.detailHeader}>
                  <Settings2 size={12} color="#FF9800" />
                  <Text style={cardStyles.detailTitle}>Background Script</Text>
                  <View style={cardStyles.activeBadge}>
                    <Text style={cardStyles.activeBadgeText}>ACTIVE</Text>
                  </View>
                </View>
              </View>
            )}

            {ext.permissions && ext.permissions.length > 0 && (
              <View style={cardStyles.detailSection}>
                <View style={cardStyles.detailHeader}>
                  <Shield size={12} color="#FF5722" />
                  <Text style={cardStyles.detailTitle}>Permissions</Text>
                </View>
                <View style={cardStyles.permsList}>
                  {ext.permissions.slice(0, 8).map((perm, idx) => (
                    <View key={idx} style={cardStyles.permBadge}>
                      <Text style={cardStyles.permText}>{perm}</Text>
                    </View>
                  ))}
                  {ext.permissions.length > 8 && (
                    <View style={cardStyles.permBadge}>
                      <Text style={cardStyles.permText}>+{ext.permissions.length - 8} more</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {ext.hasPopup && (
              <View style={cardStyles.popupBanner}>
                <Globe size={12} color="#2196F3" />
                <Text style={cardStyles.popupText}>Has popup UI (limited support in WebView)</Text>
              </View>
            )}

            {!isChromeExt && ext.script && (
              <View style={cardStyles.scriptPreview}>
                <Text style={cardStyles.scriptLabel}>Script Preview</Text>
                <Text style={cardStyles.scriptText} numberOfLines={6}>
                  {ext.script.length > 200 ? ext.script.slice(0, 200) + "..." : ext.script}
                </Text>
              </View>
            )}

            <View style={cardStyles.footerRow}>
              <Text style={cardStyles.scriptSize}>
                {ext.script.length.toLocaleString()} chars
                {ext.totalFiles ? " · " + ext.totalFiles + " files" : ""}
                {" · Added "}
                {new Date(ext.createdAt).toLocaleDateString()}
              </Text>
              {ext.fileName && (
                <Text style={cardStyles.fileNameLabel} numberOfLines={1}>
                  {ext.fileName}
                </Text>
              )}
            </View>

            <View style={cardStyles.actionRow}>
              <TouchableOpacity
                style={cardStyles.detailsBtn}
                onPress={() => {
                  const info = [
                    "Name: " + ext.name,
                    ext.version ? "Version: " + ext.version : "",
                    ext.manifestVersion ? "Manifest V" + ext.manifestVersion : "",
                    ext.contentScripts ? "Content Scripts: " + ext.contentScripts.length : "",
                    ext.totalFiles ? "Total Files: " + ext.totalFiles : "",
                    ext.totalSize ? "Size: " + formatFileSize(ext.totalSize) : "",
                    "Script Length: " + ext.script.length.toLocaleString() + " chars",
                    ext.permissions ? "Permissions: " + ext.permissions.join(", ") : "",
                  ].filter(Boolean).join("\n");
                  Alert.alert("Extension Details", info);
                }}
              >
                <Info size={14} color="#4285F4" />
                <Text style={cardStyles.detailsBtnText}>Details</Text>
              </TouchableOpacity>
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
                <Text style={cardStyles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
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
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string>("");
  const [parsedExtension, setParsedExtension] = useState<ParsedChromeExtension | null>(null);

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
    setLoadingStatus("");
    setParsedExtension(null);
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
          "text/css",
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
        fileName.endsWith(".crx") ||
        asset.mimeType === "application/zip" ||
        asset.mimeType === "application/x-zip-compressed";

      if (isZip) {
        if (Platform.OS === "web") {
          Alert.alert("ZIP Support", "ZIP extraction works best on mobile devices. On web, please use .js files directly or paste code manually.");
          setIsLoading(false);
          return;
        }

        try {
          setLoadingStatus("Reading ZIP file...");
          const JSZip = (await import("jszip")).default;
          const zipData = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: "base64" as const,
          });

          setLoadingStatus("Extracting contents...");
          const zip = await JSZip.loadAsync(zipData, { base64: true });

          setLoadingStatus("Parsing extension...");
          const parsed = await parseZipExtension(zip, fileName);

          if (!parsed) {
            Alert.alert("Parse Error", "Could not parse the extension ZIP file.");
            setIsLoading(false);
            return;
          }

          setParsedExtension(parsed);

          const chromeApiMock = generateChromeAPIMock();
          let combinedScript = chromeApiMock + "\n";

          if (parsed.backgroundScript) {
            combinedScript += "\n// === Background Script ===\n";
            combinedScript += "(function() {\n  try {\n" + parsed.backgroundScript + "\n  } catch(e) { console.error('[LordEEN BG]', e); }\n})();\n";
          }

          for (const cs of parsed.contentScripts) {
            combinedScript += buildContentScriptInjector(
              cs.js,
              cs.css,
              cs.runAt,
              parsed.manifest.name
            );
          }

          if (!combinedScript.trim() || combinedScript.trim() === chromeApiMock.trim()) {
            const jsFiles: string[] = [];
            parsed.files.forEach((f) => {
              if (f.type === "js" && f.content) {
                jsFiles.push(f.content);
              }
            });
            if (jsFiles.length > 0) {
              combinedScript += "\n" + jsFiles.join("\n");
            }
          }

          let _combinedCss = "";
          for (const cs of parsed.contentScripts) {
            if (cs.css) _combinedCss += cs.css;
          }

          setExtName(parsed.manifest.name || fileName.replace(/\.(zip|crx)$/i, ""));
          setExtDescription(parsed.manifest.description || "");
          setExtScript(combinedScript.trim());
          setAddMode("zip");

          setLoadingStatus("Extension parsed: " + parsed.totalFiles + " files, " + formatFileSize(parsed.totalSize));
          console.log("[LordEEN] Full Chrome extension parsed:", parsed.manifest.name, "v" + parsed.manifest.version);
        } catch (e) {
          console.log("[LordEEN] ZIP extraction error:", e);
          Alert.alert("ZIP Error", "Failed to extract the ZIP file. Make sure it contains a valid Chrome extension.");
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

          const isCss = fileName.endsWith(".css");

          if (isCss) {
            const cssInjector = `
(function() {
  var style = document.createElement('style');
  style.id = '__lordeen_custom_css_${Date.now()}';
  style.textContent = ${JSON.stringify(content)};
  (document.head || document.documentElement).appendChild(style);
  console.log('[LordEEN] Injected custom CSS');
})();
true;`;
            setExtName(foundName || fileName.replace(/\.css$/i, ""));
            setExtDescription(foundDesc || "Custom CSS stylesheet");
            setExtScript(cssInjector);
          } else {
            setExtName(foundName || fileName.replace(/\.(js|txt|json)$/i, ""));
            setExtDescription(foundDesc);
            setExtScript(content.trim());
          }

          setAddMode("file");
          console.log("[LordEEN] Loaded file:", fileName, content.length, "chars");
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
    setLoadingStatus("Fetching script...");

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

    const extData: Parameters<typeof addCustomExtension>[0] = {
      name: trimmedName,
      description: extDescription.trim(),
      script: trimmedScript,
      sourceType: sourceType as CustomExtension["sourceType"],
      fileName: loadedFileName || undefined,
    };

    if (parsedExtension) {
      extData.manifestVersion = parsedExtension.manifest.manifest_version;
      extData.version = parsedExtension.manifest.version;
      extData.permissions = [
        ...(parsedExtension.manifest.permissions || []),
        ...(parsedExtension.manifest.host_permissions || []),
      ];
      extData.contentScripts = parsedExtension.contentScripts;
      extData.backgroundScript = parsedExtension.backgroundScript || undefined;
      extData.hasPopup = parsedExtension.hasPopup;
      extData.totalFiles = parsedExtension.totalFiles;
      extData.totalSize = parsedExtension.totalSize;
      extData.iconUrl = parsedExtension.iconUrl || undefined;
      extData.author = parsedExtension.manifest.author || undefined;
      extData.homepageUrl = parsedExtension.manifest.homepage_url || undefined;

      let cssCode = "";
      for (const cs of parsedExtension.contentScripts) {
        if (cs.css) cssCode += cs.css;
      }
      if (cssCode) extData.cssCode = cssCode;
    }

    addCustomExtension(extData);
    resetForm();
  }, [extName, extScript, extDescription, addMode, loadedFileName, addCustomExtension, resetForm, parsedExtension]);

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
  const chromeExtCount = customExtensions.filter((e) => e.manifestVersion != null).length;

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
            <Chrome size={20} color="#4285F4" />
            <Text style={styles.panelTitle}>Extensions</Text>
            {customExtensions.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{customExtensions.length}</Text>
              </View>
            )}
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {chromeExtCount > 0 && (
            <View style={styles.headerSubRow}>
              <Text style={styles.headerSubText}>
                {chromeExtCount} Chrome extension{chromeExtCount !== 1 ? "s" : ""}
                {" · "}
                {customExtensions.filter((e) => e.enabled).length} active
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.panelContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {!showForm && (
            <>
              <View style={styles.loadUnpackedRow}>
                <TouchableOpacity
                  style={styles.loadUnpackedBtn}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    void handlePickZipOrFile();
                  }}
                  activeOpacity={0.7}
                >
                  <FolderOpen size={16} color="#4285F4" />
                  <Text style={styles.loadUnpackedText}>Load unpacked</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loadUnpackedBtn}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setAddMode("url");
                  }}
                  activeOpacity={0.7}
                >
                  <Link size={16} color="#4285F4" />
                  <Text style={styles.loadUnpackedText}>From URL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loadUnpackedBtn}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setAddMode("manual");
                  }}
                  activeOpacity={0.7}
                >
                  <Code size={16} color="#4285F4" />
                  <Text style={styles.loadUnpackedText}>Write code</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.supportBanner}>
                <Chrome size={14} color="#4285F4" />
                <Text style={styles.supportText}>
                  Supports Chrome Extensions (MV2/MV3), JS files, CSS, and UserScripts.
                  ZIP/CRX files are fully parsed including manifest.json, content scripts, background scripts, and CSS.
                </Text>
              </View>
            </>
          )}

          {isLoading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#4285F4" />
              <View style={styles.loadingTextWrap}>
                <Text style={styles.loadingText}>Loading extension...</Text>
                {loadingStatus ? (
                  <Text style={styles.loadingStatus}>{loadingStatus}</Text>
                ) : null}
              </View>
            </View>
          )}

          {showForm && !isLoading && (
            <View style={styles.formSection}>
              <View style={styles.formHeaderRow}>
                <Text style={styles.formTitle}>
                  {addMode === "zip"
                    ? parsedExtension ? "Chrome Extension" : "ZIP Extension"
                    : addMode === "file"
                    ? "JS/CSS File"
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
                    selectionColor="#4285F4"
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
                  {parsedExtension && (
                    <View style={styles.parsedInfoCard}>
                      <View style={styles.parsedInfoRow}>
                        <Chrome size={16} color="#4285F4" />
                        <View style={styles.parsedInfoTextWrap}>
                          <Text style={styles.parsedInfoName}>
                            {parsedExtension.manifest.name} v{parsedExtension.manifest.version}
                          </Text>
                          <Text style={styles.parsedInfoMeta}>
                            Manifest V{parsedExtension.manifest.manifest_version}
                            {" · "}{parsedExtension.totalFiles} files
                            {" · "}{formatFileSize(parsedExtension.totalSize)}
                          </Text>
                        </View>
                      </View>
                      {parsedExtension.contentScripts.length > 0 && (
                        <View style={styles.parsedInfoDetail}>
                          <Layers size={12} color={Colors.accent} />
                          <Text style={styles.parsedInfoDetailText}>
                            {parsedExtension.contentScripts.length} content script group{parsedExtension.contentScripts.length !== 1 ? "s" : ""}
                            {parsedExtension.contentScripts.reduce((acc, cs) => acc + cs.jsFiles.length, 0)} JS,{" "}
                            {parsedExtension.contentScripts.reduce((acc, cs) => acc + cs.cssFiles.length, 0)} CSS
                          </Text>
                        </View>
                      )}
                      {parsedExtension.backgroundScript && (
                        <View style={styles.parsedInfoDetail}>
                          <Settings2 size={12} color="#FF9800" />
                          <Text style={styles.parsedInfoDetailText}>Background script included</Text>
                        </View>
                      )}
                      {parsedExtension.hasPopup && (
                        <View style={styles.parsedInfoDetail}>
                          <Globe size={12} color="#2196F3" />
                          <Text style={styles.parsedInfoDetailText}>Has popup UI</Text>
                        </View>
                      )}
                      {parsedExtension.manifest.permissions && parsedExtension.manifest.permissions.length > 0 && (
                        <View style={styles.parsedInfoDetail}>
                          <Shield size={12} color="#FF5722" />
                          <Text style={styles.parsedInfoDetailText}>
                            {parsedExtension.manifest.permissions.length} permission{parsedExtension.manifest.permissions.length !== 1 ? "s" : ""}
                          </Text>
                        </View>
                      )}
                      <View style={styles.parsedSuccessBadge}>
                        <Check size={12} color="#4CAF50" />
                        <Text style={styles.parsedSuccessText}>Extension fully parsed & ready</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Extension Name</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="My Custom Extension"
                      placeholderTextColor={Colors.textMuted}
                      value={extName}
                      onChangeText={setExtName}
                      selectionColor="#4285F4"
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
                      selectionColor="#4285F4"
                    />
                  </View>

                  {loadedFileName && !parsedExtension ? (
                    <View style={styles.fileLoadedBanner}>
                      <Check size={14} color={Colors.accent} />
                      <Text style={styles.fileLoadedText}>
                        Loaded: {loadedFileName} ({extScript.length.toLocaleString()} chars)
                      </Text>
                    </View>
                  ) : null}

                  {!parsedExtension && (
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
                        selectionColor="#4285F4"
                        textAlignVertical="top"
                      />
                    </View>
                  )}

                  <View style={styles.warningBanner}>
                    <AlertTriangle size={14} color={Colors.warning} />
                    <Text style={styles.warningText}>
                      Extensions run with full page access. Chrome API is mocked — some features may not work perfectly.
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
                    <Plus size={18} color={extName.trim() && extScript.trim() ? "#FFF" : Colors.textMuted} />
                    <Text
                      style={[
                        styles.addBtnText,
                        (!extName.trim() || !extScript.trim()) && styles.addBtnTextDisabled,
                      ]}
                    >
                      {parsedExtension ? "Install Extension" : "Add Extension"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {customExtensions.length > 0 && (
            <View style={styles.installedSection}>
              <View style={styles.installedHeader}>
                <Package size={14} color={Colors.textSecondary} />
                <Text style={styles.installedTitle}>
                  All Extensions ({customExtensions.length})
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
              <Chrome size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Extensions Installed</Text>
              <Text style={styles.emptyDesc}>
                Load Chrome extensions from ZIP/CRX files, fetch scripts from URLs, or write custom JavaScript code.
              </Text>
              <View style={styles.emptyFeatures}>
                <View style={styles.emptyFeatureRow}>
                  <Check size={12} color="#4285F4" />
                  <Text style={styles.emptyFeatureText}>Full manifest.json parsing (MV2 & MV3)</Text>
                </View>
                <View style={styles.emptyFeatureRow}>
                  <Check size={12} color="#4285F4" />
                  <Text style={styles.emptyFeatureText}>Content scripts with URL matching</Text>
                </View>
                <View style={styles.emptyFeatureRow}>
                  <Check size={12} color="#4285F4" />
                  <Text style={styles.emptyFeatureText}>CSS injection & background scripts</Text>
                </View>
                <View style={styles.emptyFeatureRow}>
                  <Check size={12} color="#4285F4" />
                  <Text style={styles.emptyFeatureText}>Chrome API mock (storage, tabs, runtime)</Text>
                </View>
              </View>
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
    maxHeight: SCREEN_HEIGHT * 0.88,
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
    paddingBottom: 6,
    width: "100%" as const,
    gap: 10,
  },
  panelTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  countBadge: {
    backgroundColor: "rgba(66, 133, 244, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#4285F4",
  },
  closeBtn: {
    padding: 6,
  },
  headerSubRow: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    width: "100%" as const,
  },
  headerSubText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 30,
  },
  panelContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadUnpackedRow: {
    flexDirection: "row" as const,
    gap: 8,
    marginBottom: 12,
  },
  loadUnpackedBtn: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(66, 133, 244, 0.25)",
  },
  loadUnpackedText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#4285F4",
  },
  supportBanner: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 8,
    backgroundColor: "rgba(66, 133, 244, 0.06)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(66, 133, 244, 0.12)",
  },
  supportText: {
    fontSize: 11,
    color: "rgba(66, 133, 244, 0.8)",
    flex: 1,
    lineHeight: 16,
  },
  loadingWrap: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  loadingTextWrap: {
    flex: 1,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600" as const,
  },
  loadingStatus: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
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
    color: "#4285F4",
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
    backgroundColor: "#4285F4",
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
    color: "#FFF",
  },
  parsedInfoCard: {
    backgroundColor: "rgba(66, 133, 244, 0.06)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(66, 133, 244, 0.2)",
    gap: 10,
  },
  parsedInfoRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  parsedInfoTextWrap: {
    flex: 1,
  },
  parsedInfoName: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#4285F4",
  },
  parsedInfoMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  parsedInfoDetail: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginLeft: 26,
  },
  parsedInfoDetailText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  parsedSuccessBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start" as const,
  },
  parsedSuccessText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#4CAF50",
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
    backgroundColor: "#4285F4",
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
    color: "#FFF",
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
    color: Colors.textSecondary,
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
    paddingVertical: 30,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center" as const,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  emptyFeatures: {
    marginTop: 16,
    gap: 8,
    alignSelf: "stretch" as const,
    paddingHorizontal: 20,
  },
  emptyFeatureRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  emptyFeatureText: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    backgroundColor: "rgba(66, 133, 244, 0.15)",
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
    flex: 1,
  },
  nameActive: {
    color: "#4285F4",
  },
  versionText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  metaRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 3,
  },
  sourceBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  chromeBadge: {
    backgroundColor: "rgba(66, 133, 244, 0.15)",
  },
  sourceText: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: "#7C3AED",
    textTransform: "uppercase" as const,
  },
  chromeText: {
    color: "#4285F4",
  },
  mvBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.15)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  mvText: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: "#FF9800",
  },
  fileCount: {
    fontSize: 10,
    color: Colors.textMuted,
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
  detailSection: {
    marginBottom: 10,
  },
  detailHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 6,
  },
  detailTitle: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    flex: 1,
  },
  activeBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activeBadgeText: {
    fontSize: 8,
    fontWeight: "700" as const,
    color: "#4CAF50",
  },
  contentScriptItem: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  csLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginBottom: 2,
  },
  csFileRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    marginTop: 2,
  },
  csFileText: {
    fontSize: 10,
    color: Colors.textSecondary,
    flex: 1,
  },
  permsList: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 4,
  },
  permBadge: {
    backgroundColor: "rgba(255, 87, 34, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  permText: {
    fontSize: 9,
    color: "#FF5722",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  popupBanner: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    backgroundColor: "rgba(33, 150, 243, 0.08)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.15)",
  },
  popupText: {
    fontSize: 10,
    color: "#2196F3",
    flex: 1,
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
  footerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 10,
  },
  scriptSize: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  fileNameLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    maxWidth: "40%" as const,
  },
  actionRow: {
    flexDirection: "row" as const,
    gap: 8,
  },
  detailsBtn: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(66, 133, 244, 0.2)",
    backgroundColor: "rgba(66, 133, 244, 0.06)",
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#4285F4",
  },
  removeBtn: {
    flex: 1,
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
