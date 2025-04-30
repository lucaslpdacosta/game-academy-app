import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import axios from "axios";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

interface Conteudo {
  id: string;
  tipo: string;
  texto: string;
  linkVideo: string;
  ModuloId: string;
}

interface PerfilResponse {
  userData: {
    funcao: string;
  };
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ConteudoDetalhe">;
  route: RouteProp<RootStackParamList, "ConteudoDetalhe">;
};

const ConteudoDetalhe: React.FC<Props> = ({ navigation, route }) => {
  const [conteudo, setConteudo] = useState<Conteudo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [funcaoUsuario, setFuncaoUsuario] = useState<string>("");

  useEffect(() => {
    const pegarFuncaoUsuario = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token inexistente");
          return;
        }

        const response = await axios.get<PerfilResponse>(
          "http://localhost:3000/perfil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFuncaoUsuario(response.data.userData.funcao);
      } catch (error) {
        console.error("Erro ao pegar função do usuário:", error);
      }
    };

    pegarFuncaoUsuario();
  }, []);

  useEffect(() => {
    const carregarConteudo = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token inexistente");
          return;
        }

        const response = await axios.get<Conteudo>(
          `http://localhost:3000/conteudos/${route.params.conteudoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setConteudo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar conteúdo:", error);
        setLoading(false);
      }
    };

    carregarConteudo();
  }, []);

  if (loading || !conteudo) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size={50} color="#0000ff" />
      </View>
    );
  }

  const handleContinuePress = (): void => {
    Alert.alert(
      "Continuar",
      "Você quer continuar para as perguntas?",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () =>
            navigation.navigate("Teste", {
              ModuloId: conteudo.ModuloId,
              conteudoId: conteudo.id,
            }),
        },
      ],
      { cancelable: false }
    );
  };

  const handleNewTestPress = (): void => {
    navigation.navigate("NovoTeste", {
      moduloId: conteudo.ModuloId,
      conteudoId: conteudo.id,
    });
  };

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const videoWidth = screenWidth;
  const videoHeight = (9 / 16) * videoWidth;

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.titulo}>{conteudo.tipo}</Text>

      <View style={[styles.videoContainer, { width: videoWidth }]}>
        <WebView
          source={{ uri: conteudo.linkVideo }}
          style={[styles.video, { height: videoHeight }]}
          allowsFullscreenVideo={true}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.containerDesc}>
          <Text style={styles.descricao}>{conteudo.texto}</Text>
        </View>
      </ScrollView>

      <View style={styles.botaoContainer}>
        <TouchableOpacity
          style={styles.botaoContinuar}
          onPress={handleContinuePress}
        >
          <Text style={styles.textoBotao}>Continuar</Text>
        </TouchableOpacity>
      </View>

      {funcaoUsuario === "admin" && (
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={handleNewTestPress}
        >
          <MaterialIcons name="add" size={40} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 60,
    paddingBottom: 20,
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    maxHeight: 200,
    marginBottom: 20,
  },
  containerDesc: {
    paddingLeft: 25,
    borderLeftWidth: 5,
    borderColor: "#4747D1",
    marginBottom: 20,
  },
  descricao: {
    fontSize: 16,
    textAlign: "left",
  },
  video: {
    flex: 1,
  },
  botaoContinuar: {
    backgroundColor: "#4747D1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "85%",
    alignItems: "center",
    marginBottom: 10,
  },
  botaoVoltar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  botaoContainer: {
    marginTop: 20,
  },
  textoBotao: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    justifyContent: "center",
  },
  botaoAdicionar: {
    position: "absolute",
    bottom: 28,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4747D1",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ConteudoDetalhe;
