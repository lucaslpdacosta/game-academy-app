import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const baseURL = 'http://localhost:3000';

export const fazerLogin = async (email, senha, navigation) => {
  try {
    const response = await axios.post(`${baseURL}/login`, {
      email,
      senha,
    });

    const { token, refreshToken } = response.data;

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    navigation.navigate('Main');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      Alert.alert(
        'Erro no Login',
        'Credenciais inválidas. Tente novamente',
        [{ text: 'OK' }]
      );
    } else {
      console.error('erro:', error.message);
    }
  }
};

export const cadastrar = async (dadosCadastro, navigation) => {
  const { nome, email, senha, dataNascimento, genero, localizacao } = dadosCadastro;
  
  try {
    const response = await axios.post(`${baseURL}/cadastro`, {
      nome,
      email,
      senha,
      dataNascimento,
      genero,
      localizacao,
    });

    const token = response.data.token;

    navigation.navigate('Login');
  } catch (error) {
    console.error('Erro durante o cadastro:', error.message);
  }
};

export const redefinirSenha = async (email, novaSenha) => {
  try {
    const response = await axios.put(`${baseURL}/redefinir-senha`, { email, novaSenha });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const pegarPerfil = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token inexistente');
      return;
    }

    const response = await axios.get(`${baseURL}/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.userData;
  } catch (error) {
    throw error;
  }
};

export const pegarModulos = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token inexistente');
      return;
    }

    const response = await axios.get(`${baseURL}/modulos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const pegarValorConteudos = async (moduloId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token inexistente');
      return;
    }

    const response = await axios.get(`${baseURL}/conteudos/modulo/${moduloId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.length;
  } catch (error) {
    console.error('Erro ao carregar número de conteúdos:', error);
    return 0;
  }
};

export const deletarModulo = async (moduloId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token inexistente');
      return;
    }

    await axios.delete(`${baseURL}/modulo/${moduloId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

//

export const getPontuacoesUsuario = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token inexistente');
      return null;
    }
    
    const response = await axios.get(`${baseURL}/pontuacoes/usuario/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao obter pontuações do usuário:', error.message);
    return null;
  }
};

export const updateAvatar = async (avatarId) => {
  try {
    const token = await AsyncStorage.getItem('token');
  
    if (!token) {
      console.error('Token inexistente');
      return;
    }
  
    await axios.put(
      `${baseURL}/update-avatar`,
      { avatarAtualId: avatarId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error.message);
  }
};

export const updateCapa = async (capaId) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.error('Token inexistente');
      return;
    }

    await axios.put(
      `${baseURL}/update-capa`,
      { capaAtualId: capaId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Erro ao atualizar capa:', error.message);
  }
};

export const criarNovoModulo = async (titulo, meta) => {
  try {
    await axios.post(`${baseURL}/modulos`, { 
      titulo,
      meta
    });
    return true;
  } catch (error) {
    console.error('Erro ao criar novo módulo:', error);
    return false;
  }
};

export default {
  fazerLogin,
  cadastrar,
  redefinirSenha,
  pegarPerfil,
  pegarModulos,
  pegarValorConteudos,
  deletarModulo,
  getPontuacoesUsuario,
  updateAvatar,
  updateCapa,
  criarNovoModulo,
};