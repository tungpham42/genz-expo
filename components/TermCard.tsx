// components/TermCard.tsx
import { GenZTerm } from "@/types";
import { Toast } from "@ant-design/react-native";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  data: GenZTerm;
  highlight?: string;
}

// Logic màu pastel cho tags
const getTagColor = (tag: string) => {
  const colors = [
    "#eb2f96",
    "#f5222d",
    "#fa541c",
    "#fa8c16",
    "#faad14",
    "#a0d911",
    "#52c41a",
    "#13c2c2",
    "#1890ff",
    "#2f54eb",
    "#722ed1",
  ];
  const index = tag.length % colors.length;
  return colors[index];
};

const TermCard: React.FC<Props> = ({ data, highlight = "" }) => {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(`${data.term}: ${data.definition}`);
    Toast.info({
      content: "Đã copy vào clipboard nè! ✨",
      duration: 1,
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Ê biết từ "${data.term}" là gì hông? Nghĩa là: ${data.definition} đó. \nVí dụ: "${data.example}"`,
        title: `Gen Z Dictionary: ${data.term}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Logic Highlight Text cho React Native (Thay thế thẻ span bằng Text lồng nhau)
  const renderHighlightedText = (
    text: string,
    highlightText: string,
    baseStyle: any,
    highlightStyle: any
  ) => {
    if (!highlightText.trim()) return <Text style={baseStyle}>{text}</Text>;

    const escapeRegExp = (string: string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapeRegExp(highlightText)})`, "gi");
    const parts = text.split(regex);

    return (
      <Text style={baseStyle}>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <Text key={index} style={highlightStyle}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <View style={styles.card}>
      {/* Giả lập thanh gradient trên đầu card */}
      <View style={styles.gradientBorder} />

      <View style={styles.cardBody}>
        {/* Header: Term & Actions */}
        <View style={styles.header}>
          <View style={{ flex: 1, marginRight: 10 }}>
            {renderHighlightedText(
              data.term,
              highlight,
              styles.termTitle,
              styles.highlight
            )}

            <View style={styles.tagContainer}>
              {data.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagBadge,
                    { backgroundColor: getTagColor(tag) + "15" },
                  ]}
                >
                  <Text style={[styles.tagText, { color: getTagColor(tag) }]}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={handleCopy} style={styles.iconBtn}>
              <Text style={styles.iconText}>📋</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
              <Text style={styles.iconText}>🔗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Definition */}
        <View style={styles.defContainer}>
          {renderHighlightedText(
            data.definition,
            highlight,
            styles.defText,
            styles.highlight
          )}
        </View>

        {/* Example Box */}
        <View style={styles.exampleBox}>
          <Text style={styles.exampleLabel}>VÍ DỤ MINH HỌA:</Text>
          {renderHighlightedText(
            `"${data.example}"`,
            highlight,
            styles.exampleText,
            styles.highlight
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 20,
    // Shadow giả lập box-shadow của web
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    overflow: "hidden",
  },
  gradientBorder: {
    height: 6,
    width: "100%",
    backgroundColor: "#FF9A9E", // Fallback cho gradient
  },
  cardBody: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  termTitle: {
    fontFamily: "LexendDeca_800ExtraBold",
    fontSize: 24,
    color: "#2d3748",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "LexendDeca_700Bold",
  },
  actionRow: {
    flexDirection: "row",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDF2F7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  iconText: {
    fontSize: 16,
  },
  defContainer: {
    marginBottom: 20,
  },
  defText: {
    fontFamily: "LexendDeca_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#4A5568",
  },
  exampleBox: {
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
  },
  exampleLabel: {
    fontFamily: "LexendDeca_700Bold",
    fontSize: 10,
    color: "#A0AEC0",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  exampleText: {
    fontFamily: "LexendDeca_400Regular",
    fontSize: 15,
    color: "#553C9A",
    fontStyle: "italic",
  },
  highlight: {
    backgroundColor: "#fffb8f",
    color: "#000",
  },
});

export default TermCard;
