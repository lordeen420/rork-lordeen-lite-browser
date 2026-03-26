import React, { useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import {
  Search,
  Play,
  Github,
  MessageCircle,
  Twitter,
  BookOpen,
  Shield,
  Code,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { QuickLink } from "@/constants/extensions";

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Search,
  Play,
  Github,
  MessageCircle,
  Twitter,
  BookOpen,
  Shield,
  Code,
};

const QuickLinkItem = React.memo(
  ({ link, onPress }: { link: QuickLink; onPress: (url: string) => void }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

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

    const handlePress = useCallback(() => {
      onPress(link.url);
    }, [link.url, onPress]);

    const IconComponent = ICON_MAP[link.icon];

    return (
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        style={styles.linkWrapper}
      >
        <Animated.View
          style={[styles.linkIcon, { transform: [{ scale: scaleAnim }] }]}
        >
          {IconComponent && <IconComponent size={20} color={link.color} />}
        </Animated.View>
        <Text style={styles.linkName} numberOfLines={1}>
          {link.name}
        </Text>
      </TouchableOpacity>
    );
  }
);

interface QuickLinkGridProps {
  links: QuickLink[];
  onPress: (url: string) => void;
}

export default function QuickLinkGrid({ links, onPress }: QuickLinkGridProps) {
  return (
    <View style={styles.grid}>
      {links.map((link) => (
        <QuickLinkItem key={link.id} link={link} onPress={onPress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  linkWrapper: {
    width: "23%",
    alignItems: "center",
    paddingVertical: 10,
  },
  linkIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  linkName: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
