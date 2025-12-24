// app/_layout.tsx
import { Provider } from "@ant-design/react-native";
import {
  LexendDeca_400Regular,
  LexendDeca_700Bold,
  LexendDeca_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/lexend-deca";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LexendDeca_400Regular,
    LexendDeca_700Bold,
    LexendDeca_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <Provider>
      <StatusBar style="dark" backgroundColor="#fffbf5" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fffbf5" },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </Provider>
  );
}
