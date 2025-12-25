// app/index.tsx
import TermCard from "@/components/TermCard";
// REMOVED: import { TERMS } from "@/data/sourceData";
import { GenZTerm } from "@/types"; // Ensure you import the type definition
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, // Added for loading state
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
  const [terms, setTerms] = useState<GenZTerm[]>([]); // State to hold API data
  const [isLoading, setIsLoading] = useState(true); // State for loading status

  // Fetch data from API on mount
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://genz-db.netlify.app/api/dictionary"
        );
        const data = await response.json();
        setTerms(data);
      } catch (error) {
        console.error("Error fetching dictionary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  // Logic Search & Sort (updated to use 'terms' state instead of static TERMS)
  const filteredData = useMemo(() => {
    return terms
      .filter(
        (item) =>
          item.term.toLowerCase().includes(searchText.toLowerCase()) ||
          item.definition.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => a.term.localeCompare(b.term, "vi"));
  }, [searchText, terms]); // Added 'terms' to dependency array

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
          {isLoading ? (
            // Loading State
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
          ) : (
            // Data Loaded State
            <>
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
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf5",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.03)",
    alignItems: "center",
  },
  title: {
    fontFamily: "LexendDeca_800ExtraBold",
    fontSize: 28,
    color: "#8B5CF6",
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
  // New styles for loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: "LexendDeca_400Regular",
    color: "#718096",
    fontSize: 14,
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
