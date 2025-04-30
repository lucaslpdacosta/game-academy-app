import React, { createContext, useContext, useState, useEffect } from "react";
import { Audio, AVPlaybackStatus, Sound } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

interface SoundContextType {
  sfxEnabled: boolean;
  toggleSfx: () => void;
  playSound: (soundFile: any) => Promise<void>;
  stopAllSounds: () => Promise<void>;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [sounds, setSounds] = useState<Sound[]>([]);

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        Alert.alert("Erro", "Não foi possível inicializar o áudio.");
      }
    };

    const loadSoundSettings = async () => {
      try {
        const savedSfxEnabled = await AsyncStorage.getItem("sfxEnabled");
        if (savedSfxEnabled !== null) {
          setSfxEnabled(JSON.parse(savedSfxEnabled));
        }
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível carregar as configurações de som."
        );
      }
    };

    initializeAudio();
    loadSoundSettings();

    return () => {
      sounds.forEach((sound) => {
        sound.unloadAsync();
      });
    };
  }, []);

  const toggleSfx = async () => {
    const newValue = !sfxEnabled;
    setSfxEnabled(newValue);
    try {
      await AsyncStorage.setItem("sfxEnabled", JSON.stringify(newValue));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as configurações de som.");
    }
  };

  const playSound = async (soundFile: any) => {
    if (!sfxEnabled) return;

    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSounds((prevSounds) => [...prevSounds, sound]);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setSounds((prevSounds) => prevSounds.filter((s) => s !== sound));
        }
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível reproduzir o som.");
    }
  };

  const stopAllSounds = async () => {
    try {
      await Promise.all(sounds.map((sound) => sound.stopAsync()));
      await Promise.all(sounds.map((sound) => sound.unloadAsync()));
      setSounds([]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível parar os sons.");
    }
  };

  return (
    <SoundContext.Provider
      value={{ sfxEnabled, toggleSfx, playSound, stopAllSounds }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
