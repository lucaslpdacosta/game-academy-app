import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import { useSound } from '../../context/SoundContext'; // Importe o hook useSound do contexto de som

const Fail = ({ navigation }) => {
  const { sfxEnabled } = useSound(); // Use o hook useSound para acessar o estado dos efeitos sonoros

  useEffect(() => {
    const playAudio = async () => {
      if (!sfxEnabled) return; // Verifique se os efeitos sonoros estão habilitados

      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(require('../../../src/sfx/gameover.mp3'));
        await soundObject.playAsync();
      } catch (error) {
        console.error('Erro ao reproduzir o áudio:', error);
      }
    };
    playAudio();

  }, [sfxEnabled]); // Adicione sfxEnabled como uma dependência para que o efeito seja reexecutado quando os efeitos sonoros mudarem

  useEffect(() => {
    // Bloquear a transição para a tela anterior quando o botão de voltar é pressionado
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleButtonPress = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/fail.jpeg')}
        style={styles.image}
      />
      <Text style={styles.text}>Oops... não foi desta vez. Mas você pode tentar novamente!</Text>
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Continuar</Text>
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
  image: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    bottom: 70,
    width: '80%'
  },
  button: {
    backgroundColor: '#4747D1',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Fail;
