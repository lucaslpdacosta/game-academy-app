import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { redefinirSenha } from '../../api/api';

const AlterarSenha = ({ route }) => {
  const navigation = useNavigation();
  const { email } = route.params;
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleRedefinirSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      await redefinirSenha(email, novaSenha);
      navigation.navigate('Login');
    } catch (error) {
      alert('Erro ao redefinir senha');
      console.error('Erro:', error);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/bg2.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Altere a sua senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe sua nova senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={styles.botaoConfirmar}
          onPress={handleRedefinirSenha}
        >
          <Text style={styles.textoBotao}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  botaoConfirmar: {
    backgroundColor: '#4747D1',
    width: '50%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotao: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AlterarSenha;