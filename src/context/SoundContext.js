import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
  const [sfxEnabled, setSfxEnabled] = useState(true);

  useEffect(() => {
    const loadSoundSetting = async () => {
      try {
        const soundEnabled = await AsyncStorage.getItem('soundEnabled');
        if (soundEnabled !== null) {
          setSfxEnabled(JSON.parse(soundEnabled));
        }
      } catch (error) {
        console.error('Erro ao carregar configuração de som:', error);
      }
    };

    loadSoundSetting();
  }, []);

  const toggleSound = async () => {
    try {
      const newSoundEnabled = !sfxEnabled;
      setSfxEnabled(newSoundEnabled);
      await AsyncStorage.setItem('soundEnabled', JSON.stringify(newSoundEnabled));
    } catch (error) {
      console.error('Erro ao salvar configuração de som:', error);
    }
  };

  return (
    <SoundContext.Provider value={{ sfxEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};
