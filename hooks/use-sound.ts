import { Audio } from "expo-av";
import { useEffect, useState } from "react";

const correctSound = require("@/assets/audios/sound/files/correct.mp3");
const wrongSound = require("@/assets/audios/sound/files/wrong.mp3");

export function useSound() {
  const [correctAudio, setCorrectAudio] = useState<Audio.Sound | null>(null);
  const [wrongAudio, setWrongAudio] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  const loadSounds = async () => {
    try {
      const { sound: correct } = await Audio.Sound.createAsync(correctSound);
      const { sound: wrong } = await Audio.Sound.createAsync(wrongSound);
      setCorrectAudio(correct);
      setWrongAudio(wrong);
    } catch (error) {
      console.error("Error loading sounds:", error);
    }
  };

  const unloadSounds = async () => {
    if (correctAudio) await correctAudio.unloadAsync();
    if (wrongAudio) await wrongAudio.unloadAsync();
  };

  const playCorrect = async () => {
    try {
      if (correctAudio) {
        await correctAudio.replayAsync();
      }
    } catch (error) {
      console.error("Error playing correct sound:", error);
    }
  };

  const playWrong = async () => {
    try {
      if (wrongAudio) {
        await wrongAudio.replayAsync();
      }
    } catch (error) {
      console.error("Error playing wrong sound:", error);
    }
  };

  return {
    playCorrect,
    playWrong,
  };
}

