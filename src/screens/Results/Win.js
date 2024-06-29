import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Share, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import { useSound } from '../../context/SoundContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Win = ({ navigation }) => {
  const { sfxEnabled } = useSound();

  useEffect(() => {
    const playAudio = async () => {
      if (!sfxEnabled) return;

      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(require('../../../src/sfx/win.wav'));
        await soundObject.playAsync();
      } catch (error) {
        console.error('Erro ao reproduzir o áudio:', error);
      }
    };
    playAudio();
  }, [sfxEnabled]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleButtonPress = () => {
    navigation.navigate('Main');
  };

  const handleSharePress = async () => {
    try {
      const shareOptions = {
        title: 'Título',
        message: 'Acabei de ganhar algumas estrelas no Game/Academy! Baixe o app e teste você também! <link aqui>',
        subject: 'subject',
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.shareIconContainer}>
        <TouchableOpacity onPress={handleSharePress}>
          <Icon name="share" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../../assets/congratulations.png')}
        style={styles.image}
      />
      <Text style={styles.text}>Você ganhou algumas estrelas pela vitória. Aproveite!</Text>
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>OK!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  shareIconContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  image: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    bottom: 120,
  },
  button: {
    backgroundColor: '#4747D1',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Win;
