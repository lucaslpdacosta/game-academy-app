import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Switch, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useSound } from '../../context/SoundContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Opcoes = ({ navigation }) => {
  const { sfxEnabled, toggleSound } = useSound();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const pegarDadosUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('token inexistente');
          return;
        }

        const response = await axios.get('http://localhost:3000/perfil', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserId(response.data.userId);
      } catch (error) {
        console.error('erro ao recuperar dados', error);
      }
    };

    pegarDadosUsuario();
  }, []);

  const Logout = async () => {
    try {
  
      Alert.alert(
        'Sair da Conta',
        'Deseja sair da sua conta?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            onPress: async () => {
              await AsyncStorage.clear();
              navigation.replace('Welcome');
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('erro ao limpar dados do storage:', error);
    }
  };

  const handledeletarConta = () => {
    Alert.alert(
      'Deletar Conta',
      'Tem certeza de que deseja excluir sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            if (!userId) {
              console.error('userid não existe');
              return;
            }
            deletarConta(userId);
            await AsyncStorage.clear();
            navigation.replace('Welcome');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const mostrarVersao = () => {
    Alert.alert('Game Adacemy', 'Versão: 1.0', [{ text: 'OK' }], { cancelable: false });
  };

  const abrirTermos = () => {
    //Alert.alert('Teste', 'OK', [{ text: 'OK' }], { cancelable: false });
  };

  const deletarConta = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('token inexistente');
        return;
      }

      await axios.delete(`http://localhost:3000/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.clear();
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Erro ao excluir conta do usuário:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.containerOpcoes}>
        <Text style={styles.grupoOpcoes}>Geral</Text>
        <View style={styles.opcao}>
          <Text style={styles.textoOpcao}>Efeitos Sonoros</Text>
          <Switch value={sfxEnabled} onValueChange={toggleSound} trackColor={{ false: "#B2B2B2", true: "#B2B2B2" }} thumbColor={sfxEnabled ? "#882CFF" : "#f4f3f4"}/>
        </View>
      </View>

      <View style={styles.containerOpcoes}>
        <Text style={styles.grupoOpcoes}>Sobre</Text>
        <TouchableOpacity style={styles.opcao} onPress={mostrarVersao}>
          <Text style={styles.textoOpcao}>Versão de Aplicativo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.opcao} onPress={abrirTermos}>
          <Text style={styles.textoOpcao}>Termos of Uso</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerOpcoes}>
        <Text style={styles.grupoOpcoes}>Suporte</Text>
        <TouchableOpacity style={styles.opcao} onPress={mostrarVersao}>
          <Text style={styles.textoOpcao}>Enviar Feedback</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerOpcoes}>
        <Text style={styles.grupoOpcoes}>Conta</Text>
        <TouchableOpacity style={styles.opcao} onPress={Logout}>
          <Text style={styles.textoOpcao}>Alterar dados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.opcao} onPress={Logout}>
          <Text style={styles.textoOpcao}>Sair</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.opcao} onPress={handledeletarConta}>
          <Text style={[styles.textoOpcao, styles.textoDelete]}>Deletar Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    color: '#333333',
  },
  containerOpcoes: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  grupoOpcoes: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    padding: 12,
    backgroundColor: '#A6A2DB',
  },
  opcao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
  },
  textoOpcao: {
    fontSize: 16,
    color: '#333333',
  },
  textoDelete: {
    color: '#FF6347',
  },
});

export default Opcoes;