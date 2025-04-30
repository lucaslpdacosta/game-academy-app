import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  Switch,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { useSound } from "../../context/SoundContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

type Props = NativeStackScreenProps<RootStackParamList, "Opcoes">;

const Opcoes: React.FC<Props> = ({ navigation }) => {
  const { sfxEnabled, toggleSound } = useSound();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const pegarDadosUsuario = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("token inexistente");
          return;
        }

        const response = await axios.get(
          "https://8cf2-2804-58f0-8006-d900-9891-65f-b337-1ade.ngrok-free.app/perfil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserId(response.data.userId);
      } catch (error) {
        console.error("erro ao recuperar dados", error);
      }
    };

    pegarDadosUsuario();
  }, []);

  const Logout = async (): Promise<void> => {
    try {
      Alert.alert(
        "Sair da Conta",
        "Deseja sair da sua conta?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Sair",
            onPress: async () => {
              await AsyncStorage.clear();
              navigation.replace("Welcome");
            },
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("erro ao limpar dados do storage:", error);
    }
  };

  const handledeletarConta = (): void => {
    Alert.alert(
      "Deletar Conta",
      "Tem certeza de que deseja excluir sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            if (!userId) {
              console.error("userid não existe");
              return;
            }
            await deletarConta(userId);
            await AsyncStorage.clear();
            navigation.replace("Welcome");
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const mostrarVersao = (): void => {
    Alert.alert("Game Adacemy", "Versão: 1.0", [{ text: "OK" }], {
      cancelable: false,
    });
  };

  const abrirTermos = (): void => {
    const termosDeUso = `
1. ACEITAÇÃO DOS TERMOS
Ao utilizar nosso aplicativo, você concorda com os termos e condições estabelecidos neste documento.

2. COLETA DE DADOS PESSOAIS
Coletamos informações pessoais, como nome, e-mail e telefone, que são fornecidas por você durante o cadastro.

3. USO DE DADOS
Os dados coletados serão usados para criar sua conta, personalizar sua experiência e enviar comunicações relevantes.

4. COMPARTILHAMENTO DE DADOS
Não compartilharemos suas informações pessoais com terceiros sem seu consentimento, exceto quando exigido por lei.

5. SEGURANÇA DOS DADOS
Adotamos medidas de segurança para proteger suas informações, mas não podemos garantir segurança absoluta.

6. ALTERAÇÕES NOS TERMOS
Reservamo-nos o direito de modificar estes termos a qualquer momento.

7. CONTATO
Para dúvidas, entre em contato através do suporte no aplicativo.`;
    Alert.alert(
      "Termos de Uso e Políticas de Privacidade",
      termosDeUso,
      [{ text: "OK" }],
      { cancelable: false }
    );
  };

  const abrirLink = (): void => {
    const url = "https://forms.gle/pNUuGfqzgzYtAbm6A";
    Linking.openURL(url).catch((err) =>
      console.error("Erro ao abrir o link", err)
    );
  };

  const deletarConta = async (userId: string): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("token inexistente");
        return;
      }

      await axios.delete(
        `https://8cf2-2804-58f0-8006-d900-9891-65f-b337-1ade.ngrok-free.app/usuarios/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await AsyncStorage.clear();
      navigation.replace("Welcome");
    } catch (error) {
      console.error("Erro ao excluir conta do usuário:", error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <Text style={styles.titulo}>Opções</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.containerOpcoes}>
          <Text style={styles.grupoOpcoes}>Geral</Text>
          <View style={styles.opcao}>
            <Text style={styles.textoOpcao}>Efeitos Sonoros</Text>
            <Switch
              value={sfxEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: "#B2B2B2", true: "#B2B2B2" }}
              thumbColor={sfxEnabled ? "#882CFF" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.containerOpcoes}>
          <Text style={styles.grupoOpcoes}>Sobre</Text>
          <TouchableOpacity style={styles.opcao} onPress={mostrarVersao}>
            <Text style={styles.textoOpcao}>Versão de Aplicativo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opcao} onPress={abrirTermos}>
            <Text style={styles.textoOpcao}>Termos de Uso</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerOpcoes}>
          <Text style={styles.grupoOpcoes}>Suporte</Text>
          <TouchableOpacity style={styles.opcao} onPress={abrirLink}>
            <Text style={styles.textoOpcao}>Enviar Feedback</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerOpcoes}>
          <Text style={styles.grupoOpcoes}>Conta</Text>
          <TouchableOpacity style={styles.opcao} onPress={Logout}>
            <Text style={styles.textoOpcao}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opcao} onPress={handledeletarConta}>
            <Text style={[styles.textoOpcao, styles.textoDelete]}>
              Deletar Conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginVertical: 20,
    color: "#333333",
  },
  containerOpcoes: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  grupoOpcoes: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
    padding: 12,
    backgroundColor: "#A6A2DB",
  },
  opcao: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
  },
  textoOpcao: {
    fontSize: 16,
    color: "#333333",
  },
  textoDelete: {
    color: "#FF6347",
  },
});

export default Opcoes;
