// app/index.tsx
import TermCard from "@/components/TermCard";
import { TERMS } from "@/data/sourceData";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");

  // Logic Search & Sort (dùng lại từ bản web)
  const filteredData = useMemo(() => {
    return TERMS.filter(
      (item) =>
        item.term.toLowerCase().includes(searchText.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchText.toLowerCase())
    ).sort((a, b) => a.term.localeCompare(b.term, "vi"));
  }, [searchText]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Floating Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Từ điển Gen Z 🤟</Text>
          <Text style={styles.subtitle}>Cập nhật ngôn ngữ hệ tư tưởng mới</Text>

          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.input}
              placeholder="Tra từ gì? (vd: Flex, Trap...)"
              placeholderTextColor="#A0AEC0"
              value={searchText}
              onChangeText={setSearchText}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        {/* Content List */}
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              Tìm thấy{" "}
              <Text style={styles.highlightNum}>{filteredData.length}</Text>{" "}
              thuật ngữ uy tín ✨
            </Text>
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => `${item.term}-${index}`}
            renderItem={({ item }) => (
              <TermCard data={item} highlight={searchText} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            // Tối ưu hiệu năng render
            initialNumToRender={5}
            windowSize={5}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🌚</Text>
                <Text style={styles.emptyText}>
                  Hông tìm thấy từ này, quê á! {"\n"}Thử từ khác đi bà.
                </Text>
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf5", // Màu kem nền chủ đạo
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Hiệu ứng kính mờ
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.03)",
    alignItems: "center",
  },
  title: {
    fontFamily: "LexendDeca_800ExtraBold",
    fontSize: 28,
    color: "#8B5CF6", // Gen Z Purple
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "LexendDeca_400Regular",
    fontSize: 14,
    color: "#718096",
    marginBottom: 16,
    marginTop: 4,
  },
  searchBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 50,
    // Shadow cho thanh search
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontFamily: "LexendDeca_400Regular",
    fontSize: 16,
    color: "#2d3748",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsRow: {
    marginVertical: 16,
  },
  statsText: {
    fontFamily: "LexendDeca_400Regular",
    fontSize: 14,
    color: "#718096",
  },
  highlightNum: {
    fontFamily: "LexendDeca_700Bold",
    color: "#8B5CF6",
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    opacity: 0.6,
  },
  emptyText: {
    fontFamily: "LexendDeca_400Regular",
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
  },
});
