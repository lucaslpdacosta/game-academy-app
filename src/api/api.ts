import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { RootStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const API_URL =
  "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (
  email: string,
  senha: string,
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">
) => {
  try {
    const response = await api.post("/login", { email, senha });
    const { token, refreshToken } = response.data;

    if (!token || !refreshToken) {
      Alert.alert("Erro", "Credenciais inválidas.");
      return;
    }

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    try {
      const profileResponse = await api.get("/perfil");
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(profileResponse.data)
      );
      navigation.navigate("Main");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter os dados do perfil.");
    }
  } catch (error) {
    Alert.alert("Erro", "Credenciais inválidas.");
  }
};

export const register = async (
  nome: string,
  email: string,
  senha: string,
  dataNascimento: string,
  genero: string,
  funcao: string
) => {
  try {
    await api.post("/usuarios", {
      nome,
      email,
      senha,
      dataNascimento,
      genero,
      funcao,
    });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro durante o cadastro."
      );
    }
    return false;
  }
};

export const checkToken = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await api.get("/perfil");
    await AsyncStorage.setItem("userData", JSON.stringify(response.data));
    return true;
  } catch (error) {
    return false;
  }
};

export const fazerLogin = async (
  email: string,
  senha: string,
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">
) => {
  try {
    const response = await api.post("/login", { email, senha });
    const { token, refreshToken } = response.data;

    if (!token || !refreshToken) {
      Alert.alert("Erro", "Credenciais inválidas.");
      return;
    }

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    try {
      const profileResponse = await api.get("/perfil");
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(profileResponse.data)
      );
      navigation.navigate("Main");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter os dados do perfil.");
    }
  } catch (error) {
    Alert.alert("Erro", "Credenciais inválidas.");
  }
};

export const pegarPerfil = async () => {
  try {
    const response = await api.get("/perfil");
    return response.data;
  } catch (error) {
    console.error("Erro detalhado ao obter perfil:", error);
    Alert.alert("Erro", "Não foi possível obter os dados do perfil.");
    return null;
  }
};

export const pegarModulos = async () => {
  try {
    const response = await api.get("/modulos");
    if (!response.data || !Array.isArray(response.data)) {
      Alert.alert("Erro", "Formato de dados inválido");
      return null;
    }
    return response.data;
  } catch (error) {
    Alert.alert("Erro", "Não foi possível obter os módulos.");
    return null;
  }
};

export const pegarValorConteudos = async (moduloId: string) => {
  try {
    const response = await api.get(`/conteudos/modulo/${moduloId}`);
    return response.data.length || 0;
  } catch (error) {
    Alert.alert("Erro", "Não foi possível obter o número de conteúdos.");
    return 0;
  }
};

export const getPontuacoesUsuario = async (userId: string) => {
  try {
    const response = await api.get(`/pontuacoes/usuario/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter pontuações:", error);
    return [];
  }
};

export const updateAvatar = async (avatarId: string) => {
  try {
    await api.put("/perfil/avatar", { avatarId });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar avatar:", error);
    return false;
  }
};

export const updateCapa = async (capaId: string) => {
  try {
    await api.put("/perfil/capa", { capaId });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar capa:", error);
    return false;
  }
};

export const criarNovoModulo = async (titulo: string, meta: number) => {
  try {
    await api.post("/modulos", { titulo, meta });
    return true;
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    return false;
  }
};

export const deletarModulo = async (moduloId: string) => {
  try {
    await api.delete(`/modulos/${moduloId}`);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro ao deletar o módulo."
      );
    }
    return false;
  }
};

export const redefinirSenha = async (email: string, novaSenha: string) => {
  try {
    await api.put("/usuarios/senha", { email, novaSenha });
    return true;
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    throw error;
  }
};

export default api;
