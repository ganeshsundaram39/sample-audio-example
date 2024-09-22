import { useEffect, useState } from "react"
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av"

const useSoundPlayer = (
  playing: boolean,
  selectedMusic: string = "no-music"
) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null)

  const getAudioSource = () => {
    switch (selectedMusic) {
      case "123456":
        return require("../assets/audio/3SRB_12356_Music_20Mins.mp3")
      default:
        return null
    }
  }

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      try {
        // Allow audio playback in the background
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
          shouldDuckAndroid: false,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        })
        // Unload the previous sound if it's loaded
        if (sound) {
          const status = await sound.getStatusAsync()
          if (status.isLoaded) {
            console.log("Stopping and unloading previous sound")
            await sound.stopAsync()
            await sound.unloadAsync()
          }
        }

        const audioSource = getAudioSource()
        if (audioSource && playing && selectedMusic !== "no-music") {
          console.log("Loading new audio")
          const { sound: newSound } = await Audio.Sound.createAsync(
            audioSource,
            { shouldPlay: true }
          )
          newSound.setOnPlaybackStatusUpdate((status) => {
            if ("didJustFinish" in status && status.didJustFinish) {
              newSound.unloadAsync()
            }
          })
          setSound(newSound)

          console.log("Playing new audio")
          await newSound.playAsync()

          // Set audio to loop
          await newSound.setIsLoopingAsync(true)
        }
      } catch (error) {
        console.error("Error playing audio:", error)
      }
    }

    loadAndPlayAudio()

    // Cleanup: Unload the sound when the component unmounts or track changes
    return () => {
      if (sound) {
        sound.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            console.log("Unloading audio")
            sound.stopAsync()
            sound.unloadAsync()
          }
        })
      }
    }
  }, [playing, selectedMusic])

  return null
}

export default useSoundPlayer
