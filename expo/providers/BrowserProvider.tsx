import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { EXTENSIONS, SEARCH_ENGINES, USER_AGENTS } from "@/constants/extensions";
import { DeviceProfile, getRandomProfile, DEVICE_PROFILES } from "@/constants/deviceProfiles";

export interface AppClone {
  id: string;
  name: string;
  url: string;
  color: string;
  icon: string;
  createdAt: number;
  lastVisited?: number;
  deviceProfileId?: number | null;
  mockLocationId?: string | null;
  packageAndroid?: string;
  bundleIOS?: string;
  appCategory?: string;
}

export interface CustomExtension {
  id: string;
  name: string;
  description: string;
  script: string;
  enabled: boolean;
  createdAt: number;
  sourceType: 'zip' | 'file' | 'url' | 'manual';
  fileName?: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  url: string;
  timestamp: number;
  title?: string;
}

export interface BrowserState {
  incognito: boolean;
  searchEngine: string;
  selectedUserAgent: string;
  extensions: Record<string, boolean>;
  autoRotateFingerprint: boolean;
  selectedProfileId: number | null;
}

const STORAGE_KEY = "lordeen_browser_state";
const CLONES_KEY = "lordeen_app_clones";
const SEARCH_HISTORY_KEY = "lordeen_search_history";
const CUSTOM_EXTENSIONS_KEY = "lordeen_custom_extensions";
const MAX_HISTORY = 100;

const getDefaultExtensions = (): Record<string, boolean> => {
  const defaults: Record<string, boolean> = {};
  EXTENSIONS.forEach((ext) => {
    defaults[ext.id] = ext.defaultEnabled;
  });
  return defaults;
};

const CLONE_COLORS = [
  "#FF6B6B", "#FF8E53", "#FFA502", "#2ED573", "#1E90FF",
  "#7C3AED", "#FF6EC7", "#00E5CC", "#FF4757", "#3742FA",
  "#A4B0BE", "#F53B57", "#0ABDE3", "#10AC84", "#EE5A24",
  "#6C5CE7", "#FDA7DF", "#55E6C1", "#D6A2E8", "#F8C291",
];

const CLONE_ICONS = [
  "Globe", "ShoppingCart", "CreditCard", "MessageCircle", "Play",
  "Music", "Camera", "Mail", "Map", "Briefcase",
  "BookOpen", "Coffee", "Gamepad2", "Heart", "Star",
  "Zap", "Cloud", "Gift", "Wallet", "Compass",
];

export { CLONE_COLORS, CLONE_ICONS };

export const [BrowserProvider, useBrowser] = createContextHook(() => {
  const [incognito, setIncognito] = useState<boolean>(false);
  const [searchEngine, setSearchEngine] = useState<string>("google");
  const [selectedUserAgent, setSelectedUserAgent] = useState<string>("default");
  const [extensions, setExtensions] = useState<Record<string, boolean>>(getDefaultExtensions());
  const [appClones, setAppClones] = useState<AppClone[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [autoRotateFingerprint, setAutoRotateFingerprint] = useState<boolean>(true);
  const [activeProfile, setActiveProfile] = useState<DeviceProfile>(getRandomProfile());
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [customExtensions, setCustomExtensions] = useState<CustomExtension[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [stored, storedClones, storedHistory, storedCustomExt] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(CLONES_KEY),
          AsyncStorage.getItem(SEARCH_HISTORY_KEY),
          AsyncStorage.getItem(CUSTOM_EXTENSIONS_KEY),
        ]);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<BrowserState>;
          if (parsed.searchEngine) setSearchEngine(parsed.searchEngine);
          if (parsed.selectedUserAgent) setSelectedUserAgent(parsed.selectedUserAgent);
          if (parsed.extensions) {
            setExtensions((prev) => ({ ...prev, ...parsed.extensions }));
          }
          if (typeof parsed.autoRotateFingerprint === "boolean") {
            setAutoRotateFingerprint(parsed.autoRotateFingerprint);
          }
          if (parsed.selectedProfileId != null) {
            setSelectedProfileId(parsed.selectedProfileId);
            const found = DEVICE_PROFILES.find((p) => p.id === parsed.selectedProfileId);
            if (found) setActiveProfile(found);
          }
        }
        if (storedClones) {
          setAppClones(JSON.parse(storedClones) as AppClone[]);
          console.log("[LordEEN] Loaded app clones:", JSON.parse(storedClones).length);
        }
        if (storedHistory) {
          setSearchHistory(JSON.parse(storedHistory) as SearchHistoryItem[]);
        }
        if (storedCustomExt) {
          setCustomExtensions(JSON.parse(storedCustomExt) as CustomExtension[]);
          console.log("[LordEEN] Loaded custom extensions:", JSON.parse(storedCustomExt).length);
        }
      } catch (e) {
        console.log("Failed to load browser state:", e);
      } finally {
        setIsLoaded(true);
      }
    };
    void load();
  }, []);

  const persist = useCallback(
    async (state: Partial<BrowserState>) => {
      try {
        const current = {
          searchEngine,
          selectedUserAgent,
          extensions,
          autoRotateFingerprint,
          selectedProfileId,
          ...state,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch (e) {
        console.log("Failed to persist browser state:", e);
      }
    },
    [searchEngine, selectedUserAgent, extensions, autoRotateFingerprint, selectedProfileId]
  );

  const persistClones = useCallback(async (clones: AppClone[]) => {
    try {
      await AsyncStorage.setItem(CLONES_KEY, JSON.stringify(clones));
      console.log("[LordEEN] Persisted", clones.length, "app clones");
    } catch (e) {
      console.log("Failed to persist app clones:", e);
    }
  }, []);

  const persistSearchHistory = useCallback(async (history: SearchHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.log("Failed to persist search history:", e);
    }
  }, []);

  const persistCustomExtensions = useCallback(async (exts: CustomExtension[]) => {
    try {
      await AsyncStorage.setItem(CUSTOM_EXTENSIONS_KEY, JSON.stringify(exts));
      console.log("[LordEEN] Persisted", exts.length, "custom extensions");
    } catch (e) {
      console.log("Failed to persist custom extensions:", e);
    }
  }, []);

  const addCustomExtension = useCallback(
    (ext: Omit<CustomExtension, "id" | "createdAt" | "enabled">) => {
      const newExt: CustomExtension = {
        ...ext,
        id: "cext_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
        createdAt: Date.now(),
        enabled: true,
      };
      setCustomExtensions((prev) => {
        const updated = [...prev, newExt];
        void persistCustomExtensions(updated);
        return updated;
      });
      console.log("[LordEEN] Added custom extension:", newExt.name);
      return newExt;
    },
    [persistCustomExtensions]
  );

  const removeCustomExtension = useCallback(
    (id: string) => {
      setCustomExtensions((prev) => {
        const updated = prev.filter((e) => e.id !== id);
        void persistCustomExtensions(updated);
        return updated;
      });
      console.log("[LordEEN] Removed custom extension:", id);
    },
    [persistCustomExtensions]
  );

  const toggleCustomExtension = useCallback(
    (id: string) => {
      setCustomExtensions((prev) => {
        const updated = prev.map((e) =>
          e.id === id ? { ...e, enabled: !e.enabled } : e
        );
        void persistCustomExtensions(updated);
        return updated;
      });
    },
    [persistCustomExtensions]
  );

  const clearAllCustomExtensions = useCallback(async () => {
    setCustomExtensions([]);
    try {
      await AsyncStorage.removeItem(CUSTOM_EXTENSIONS_KEY);
    } catch (e) {
      console.log("Failed to clear custom extensions:", e);
    }
  }, []);

  const addAppClone = useCallback(
    (clone: Omit<AppClone, "id" | "createdAt"> & { mockLocationId?: string | null }) => {
      const newClone: AppClone = {
        ...clone,
        id: "clone_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
        createdAt: Date.now(),
      };
      setAppClones((prev) => {
        const updated = [...prev, newClone];
        void persistClones(updated);
        return updated;
      });
      console.log("[LordEEN] Added app clone:", newClone.name, newClone.url);
      return newClone;
    },
    [persistClones]
  );

  const removeAppClone = useCallback(
    (id: string) => {
      setAppClones((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        void persistClones(updated);
        return updated;
      });
      console.log("[LordEEN] Removed app clone:", id);
    },
    [persistClones]
  );

  const updateAppClone = useCallback(
    (id: string, updates: Partial<AppClone>) => {
      setAppClones((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
        void persistClones(updated);
        return updated;
      });
    },
    [persistClones]
  );

  const touchAppClone = useCallback(
    (id: string) => {
      setAppClones((prev) => {
        const updated = prev.map((c) =>
          c.id === id ? { ...c, lastVisited: Date.now() } : c
        );
        void persistClones(updated);
        return updated;
      });
    },
    [persistClones]
  );

  const addSearchHistory = useCallback(
    (query: string, url: string, title?: string) => {
      if (incognito) return;
      setSearchHistory((prev) => {
        const filtered = prev.filter((h) => h.query !== query && h.url !== url);
        const newItem: SearchHistoryItem = {
          id: "sh_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
          query,
          url,
          timestamp: Date.now(),
          title,
        };
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
        void persistSearchHistory(updated);
        return updated;
      });
    },
    [incognito, persistSearchHistory]
  );

  const clearSearchHistory = useCallback(async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (e) {
      console.log("Failed to clear search history:", e);
    }
  }, []);

  const removeSearchHistoryItem = useCallback(
    (id: string) => {
      setSearchHistory((prev) => {
        const updated = prev.filter((h) => h.id !== id);
        void persistSearchHistory(updated);
        return updated;
      });
    },
    [persistSearchHistory]
  );

  const toggleIncognito = useCallback(() => {
    setIncognito((prev) => !prev);
  }, []);

  const toggleExtension = useCallback(
    (id: string) => {
      setExtensions((prev) => {
        const updated = { ...prev, [id]: !prev[id] };
        void persist({ extensions: updated });
        return updated;
      });
    },
    [persist]
  );

  const updateSearchEngine = useCallback(
    (engine: string) => {
      setSearchEngine(engine);
      void persist({ searchEngine: engine });
    },
    [persist]
  );

  const updateUserAgent = useCallback(
    (agent: string) => {
      setSelectedUserAgent(agent);
      void persist({ selectedUserAgent: agent });
    },
    [persist]
  );

  const getSearchUrl = useCallback(
    (query: string): string => {
      const base = SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.google;
      return base + encodeURIComponent(query);
    },
    [searchEngine]
  );

  const getUserAgent = useCallback((): string => {
    if (autoRotateFingerprint || selectedProfileId != null) {
      return activeProfile.userAgent;
    }
    return USER_AGENTS[selectedUserAgent] || "";
  }, [selectedUserAgent, autoRotateFingerprint, activeProfile, selectedProfileId]);

  const rotateFingerprint = useCallback(() => {
    const newProfile = getRandomProfile();
    setActiveProfile(newProfile);
    console.log("[LordEEN] Rotated to profile:", newProfile.name);
    return newProfile;
  }, []);

  const selectProfile = useCallback(
    (profileId: number | null) => {
      setSelectedProfileId(profileId);
      if (profileId != null) {
        const found = DEVICE_PROFILES.find((p) => p.id === profileId);
        if (found) {
          setActiveProfile(found);
          setAutoRotateFingerprint(false);
        }
      } else {
        setAutoRotateFingerprint(true);
        setActiveProfile(getRandomProfile());
      }
      void persist({ selectedProfileId: profileId, autoRotateFingerprint: profileId == null });
    },
    [persist]
  );

  const toggleAutoRotate = useCallback(() => {
    setAutoRotateFingerprint((prev) => {
      const next = !prev;
      if (next) {
        setSelectedProfileId(null);
        setActiveProfile(getRandomProfile());
      }
      void persist({ autoRotateFingerprint: next, selectedProfileId: next ? null : selectedProfileId });
      return next;
    });
  }, [persist, selectedProfileId]);

  const activeShieldsCount = useMemo(() => {
    return EXTENSIONS.filter(
      (ext) => ext.category === "shield" && extensions[ext.id]
    ).length;
  }, [extensions]);

  const activeToolsCount = useMemo(() => {
    return EXTENSIONS.filter(
      (ext) => ext.category === "tool" && extensions[ext.id]
    ).length;
  }, [extensions]);

  const clearBrowsingData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY, SEARCH_HISTORY_KEY]);
      setExtensions(getDefaultExtensions());
      setSearchEngine("google");
      setSelectedUserAgent("default");
      setAutoRotateFingerprint(true);
      setSelectedProfileId(null);
      setActiveProfile(getRandomProfile());
      setSearchHistory([]);
      console.log("Browsing data cleared (clones preserved)");
    } catch (e) {
      console.log("Failed to clear browsing data:", e);
    }
  }, []);

  const clearAllClones = useCallback(async () => {
    setAppClones([]);
    try {
      await AsyncStorage.removeItem(CLONES_KEY);
    } catch (e) {
      console.log("Failed to clear clones:", e);
    }
  }, []);

  return useMemo(() => ({
    incognito,
    searchEngine,
    selectedUserAgent,
    extensions,
    appClones,
    isLoaded,
    autoRotateFingerprint,
    activeProfile,
    selectedProfileId,
    searchHistory,
    customExtensions,
    toggleIncognito,
    toggleExtension,
    updateSearchEngine,
    updateUserAgent,
    getSearchUrl,
    getUserAgent,
    rotateFingerprint,
    selectProfile,
    toggleAutoRotate,
    activeShieldsCount,
    activeToolsCount,
    clearBrowsingData,
    addSearchHistory,
    clearSearchHistory,
    removeSearchHistoryItem,
    addAppClone,
    removeAppClone,
    updateAppClone,
    touchAppClone,
    clearAllClones,
    addCustomExtension,
    removeCustomExtension,
    toggleCustomExtension,
    clearAllCustomExtensions,
  }), [
    incognito,
    searchEngine,
    selectedUserAgent,
    extensions,
    appClones,
    isLoaded,
    autoRotateFingerprint,
    activeProfile,
    selectedProfileId,
    searchHistory,
    customExtensions,
    toggleIncognito,
    toggleExtension,
    updateSearchEngine,
    updateUserAgent,
    getSearchUrl,
    getUserAgent,
    rotateFingerprint,
    selectProfile,
    toggleAutoRotate,
    activeShieldsCount,
    activeToolsCount,
    clearBrowsingData,
    addSearchHistory,
    clearSearchHistory,
    removeSearchHistoryItem,
    addAppClone,
    removeAppClone,
    updateAppClone,
    touchAppClone,
    clearAllClones,
    addCustomExtension,
    removeCustomExtension,
    toggleCustomExtension,
    clearAllCustomExtensions,
  ]);
});
