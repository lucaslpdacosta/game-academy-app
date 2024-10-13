import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fazerLogin } from '../../api/api';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setsenha] = useState('');
  const [showsenha, setExibirSenha] = useState(false);
  const loginDisponivel = !email || !senha;

  useEffect(() => {
    const checarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          navigation.navigate('Main');
        }
      } catch (error) {
        console.error('erro ao verificar token', error);
      }
    };

    checarToken();
  }, [navigation]);

  const exibirSenha = () => {
    setExibirSenha(!showsenha);
  };

  return (
    <ImageBackground source={require('../../../assets/bg1.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.logo}>Bem-vindo de volta!</Text>
        <Text style={styles.descricao}>Faça seu login para continuar.</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A9A9A9"
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
          />
          <View style={styles.senhaContainer}>
            <TextInput
              style={styles.campoSenha}
              placeholder="Senha"
              placeholderTextColor="#A9A9A9"
              secureTextEntry={!showsenha}
              onChangeText={(text) => setsenha(text)}
              value={senha}
            />
            <TouchableOpacity style={styles.mostrarSenha} onPress={exibirSenha}>
              <Ionicons name={showsenha ? 'eye' : 'eye-off'} size={24} color="#4747D1" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EsqueceuSenha')}>
            <Text style={styles.esqueceuSenha}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botaoLogin, { backgroundColor: loginDisponivel ? '#A9A9A9' : '#4747D1' }]}
            onPress={() => fazerLogin(email, senha, navigation)}
            disabled={loginDisponivel}
          >
            <Text style={styles.textoLogin}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.textoCadastro}>Não tem uma conta?</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  logo: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#4747D1',
    width: '85%',
  },
  descricao: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#4747D1',
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#4747D1',
  },
  campoSenha: {
    flex: 1,
    height: 50,
    paddingLeft: 15,
  },
  mostrarSenha: {
    padding: 10,
  },
  esqueceuSenha: {
    color: '#4747D1',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  botaoLogin: {
    backgroundColor: '#4747D1',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoLogin: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textoCadastro: {
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default Login;