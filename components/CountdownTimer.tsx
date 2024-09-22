import { Pressable, Text, View } from "react-native"
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"
import { ThemedText } from "./ThemedText"
import Ionicons from "@expo/vector-icons/Ionicons"
import moment from "moment"
import { useRef, useState } from "react"
import { StyleSheet } from "react-native"
import { Picker } from "@react-native-picker/picker"
import useSoundPlayer from "@/hooks/useSoundPlayer"
const musicOptions = [
  { label: "No Music", value: "no-music" },
  { label: "3SRB 12346", value: "123456" },
]
export const CountdownTimer = () => {
  const [playing, startPlaying] = useState(false)
  const [duration, setDuration] = useState(1200)
  const [init, setInit] = useState(true)
  const pickerRef = useRef<Picker<any> | null>()
  const [selectedMusic, setSelectedMusic] = useState("no-music")
  console.log({ playing })
  useSoundPlayer(playing, selectedMusic)

  const currentMinute = useRef(20)
  const updateMinute = (type = "inc") => {
    if (type === "inc") {
      currentMinute.current += 1
    } else {
      currentMinute.current -= 1
    }
    const totalSeconds = currentMinute.current * 60
    setDuration(totalSeconds)
    reinit()
  }
  const reinit = () => {
    setInit(false)
    setTimeout(() => {
      setInit(true)
    })
  }
  const onCountdown = (play: boolean) => {
    startPlaying(play)
  }
  const onStop = () => {
    setDuration(duration)
    startPlaying(false)
    reinit()
  }

  const onPlay = () => {
    onCountdown(true)
  }

  const hitSlop = { top: 10, bottom: 10, left: 5, right: 5 }

  const onMusic = () => {
    if (pickerRef.current) {
      pickerRef.current.focus()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        {init && (
          <CountdownCircleTimer
            isPlaying={playing}
            duration={duration}
            colors={["#3498db", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[7, 5, 2, 0]}
            size={140}
            isSmoothColorTransition
            strokeWidth={7}
            onComplete={() => {
              startPlaying(false)
              setDuration(duration)
              reinit()

              return { shouldRepeat: false }
            }}
          >
            {({ remainingTime }) => {
              let time = remainingTime < 0 ? 0 : remainingTime
              const durat = moment.duration(time, "seconds")
              const formattedMinutes = String(durat.minutes()).padStart(2, "0")
              const formattedSeconds = String(durat.seconds()).padStart(2, "0")
              return (
                <>
                  <ThemedText
                    type="subtitle"
                    style={{ position: "relative", top: -10 }}
                  >
                    {`${formattedMinutes}:${formattedSeconds}`}
                  </ThemedText>
                  <View style={{ flexDirection: "row" }}>
                    <Pressable
                      hitSlop={hitSlop}
                      onPress={() =>
                        currentMinute.current > 1 &&
                        !playing &&
                        updateMinute("dec")
                      }
                    >
                      <Ionicons
                        name={
                          currentMinute.current > 1 && !playing
                            ? "remove-circle"
                            : "remove-circle-outline"
                        }
                        size={40}
                        color="#3498db"
                      />
                    </Pressable>
                    <Pressable
                      hitSlop={hitSlop}
                      style={{ marginLeft: 8 }}
                      onPress={() =>
                        currentMinute.current < 59 &&
                        !playing &&
                        updateMinute("inc")
                      }
                    >
                      <Ionicons
                        name={
                          currentMinute.current < 59 && !playing
                            ? "add-circle"
                            : "add-circle-outline"
                        }
                        size={40}
                        color="#3498db"
                      />
                    </Pressable>
                  </View>
                </>
              )
            }}
          </CountdownCircleTimer>
        )}
      </View>

      <View style={styles.controlButtonsContainer}>
        {!playing && (
          <Pressable
            onPress={onPlay}
            style={styles.controlButton}
            hitSlop={hitSlop}
          >
            <Ionicons name="play-circle-sharp" size={50} color="#f0f0f0" />
          </Pressable>
        )}
        {playing && (
          <Pressable
            onPress={() => onCountdown(false)}
            style={styles.controlButton}
            hitSlop={hitSlop}
          >
            <Ionicons name="pause-circle-sharp" size={50} color="#f0f0f0" />
          </Pressable>
        )}

        <Pressable
          onPress={onStop}
          style={styles.controlButton}
          hitSlop={hitSlop}
        >
          <Ionicons name="stop-circle-sharp" size={50} color="#f0f0f0" />
        </Pressable>

        <Pressable
          onPress={onMusic}
          style={styles.controlButton}
          hitSlop={hitSlop}
        >
          <Ionicons name="musical-notes-sharp" size={50} color="#f0f0f0" />
        </Pressable>

        <Picker
          ref={(r) => (pickerRef.current = r)}
          selectedValue={selectedMusic}
          onValueChange={(itemValue, itemIndex) => setSelectedMusic(itemValue)}
        >
          {musicOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              style={{
                ...styles.defaultItem,
                ...(selectedMusic === option.value ? styles.selectedItem : {}),
              }}
            />
          ))}
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerContainer: {
    height: 140,
    width: 140,
    marginRight: 15,
  },
  controlButtonsContainer: {
    flexDirection: "row",
  },
  controlButton: {
    marginRight: 5,
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
  },
  defaultItem: {
    fontSize: 20,
    color: "black",
  },
  selectedItem: {
    color: "#3498db",
  },
})
