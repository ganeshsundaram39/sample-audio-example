import { CountdownTimer } from "@/components/CountdownTimer"
import { ThemedView } from "@/components/ThemedView"
import { StyleSheet } from "react-native"

export default function HomeScreen() {
  return (
    <ThemedView
      style={{
        height: 500,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CountdownTimer />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  reactLogo: {
    height: 180,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
})
