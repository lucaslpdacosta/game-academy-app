import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Audio from "expo-av";
import { useSound } from "../../context/SoundContext";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

interface Pergunta {
  id: number;
  ConteudoId: number;
  ModuloId: number;
  titulo: string;
  perguntas: string[];
  respostas: string;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Teste">;
  route: RouteProp<RootStackParamList, "Teste">;
};

const Teste: React.FC<Props> = ({ navigation, route }) => {
  const { ModuloId, conteudoId } = route.params;
  const { sfxEnabled, playSound } = useSound();
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string>("");
  const [pontuacao, setPontuacao] = useState<number>(0);
  const [sound, setSound] = useState<Audio.Sound>();
  const [erros, setErros] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const carregarPerguntas = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/testes/${ModuloId}/${conteudoId}`
        );
        if (!Array.isArray(response.data)) {
          Alert.alert("Erro", "Formato de dados inválido do servidor.");
          return;
        }

        const shuffledQuestions = response.data.sort(() => Math.random() - 0.5);
        const questionsWithShuffledAnswers = shuffledQuestions.map(
          (question) => ({
            ...question,
            perguntas: [...question.perguntas].sort(() => Math.random() - 0.5),
          })
        );

        setPerguntas(questionsWithShuffledAnswers);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as perguntas.");
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerguntas();
  }, [ModuloId, conteudoId]);

  const sfxErro = async (): Promise<void> => {
    if (!sfxEnabled) return;
    await playSound(require("../../sfx/fail.mp3"));
  };

  const checarResposta = async (): Promise<void> => {
    const perguntaAtual = perguntas[currentQuestionIndex];

    if (respostaSelecionada === perguntaAtual.respostas) {
      if (currentQuestionIndex + 1 < perguntas.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setRespostaSelecionada("");
      } else {
        await adicionarPontuacao();
        navigation.navigate("Win");
      }
    } else {
      setErros(erros + 1);
      await sfxErro();
      Alert.alert(
        "Resposta Incorreta",
        `A resposta correta é: ${perguntaAtual.respostas}`,
        [{ text: "Continuar" }]
      );
      if (erros + 1 === 3) {
        navigation.navigate("Fail");
      } else {
        if (currentQuestionIndex + 1 < perguntas.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setRespostaSelecionada("");
        }
      }
    }
  };

  const vidas = (): JSX.Element[] => {
    const iconeVida: JSX.Element[] = [];
    for (let i = 0; i < erros; i++) {
      iconeVida.push(
        <MaterialIcons key={i} name="favorite-border" size={30} color="red" />
      );
    }
    for (let i = erros; i < 3; i++) {
      iconeVida.push(
        <MaterialIcons key={i} name="favorite" size={30} color="red" />
      );
    }
    return iconeVida;
  };

  const alertVoltar = (): void => {
    Alert.alert(
      "Confirmar",
      "Deseja desistir?",
      [
        { text: "Sim", onPress: () => navigation.goBack() },
        { text: "Não", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const adicionarPontuacao = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const perfilResponse = await axios.get(
        "http://localhost:3000/perfil",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const UsuarioId = perfilResponse.data.userId;

      const conteudoResponse = await axios.get(
        `http://localhost:3000/conteudos/modulo/${ModuloId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const conteudo = conteudoResponse.data.find(
        (item: any) => item.id === conteudoId
      );
      const pontos = conteudo.pontos;

      await axios.post(
        `http://localhost:3000/pontuacoes/${UsuarioId}/${ModuloId}/${conteudoId}`,
        {
          valor: pontos,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigation.navigate("Win");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a pontuação.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4747D1" />
      </View>
    );
  }

  if (!perguntas.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.tituloPergunta}>Nenhuma pergunta disponível</Text>
      </View>
    );
  }

  const perguntaAtual = perguntas[currentQuestionIndex];
  if (!perguntaAtual || !perguntaAtual.perguntas) {
    return (
      <View style={styles.container}>
        <Text style={styles.tituloPergunta}>Erro ao carregar a pergunta</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <TouchableOpacity style={styles.botaoVoltar} onPress={alertVoltar}>
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
      <View style={styles.containerPergunta}>
        <Text style={styles.tituloPergunta}>
          Pergunta {currentQuestionIndex + 1}
        </Text>
        <Text style={styles.pergunta}>{perguntaAtual.titulo}</Text>
      </View>
      <View style={styles.containerAlternativas}>
        <Text style={styles.alternativas}>Escolha uma das opções:</Text>
        {perguntaAtual.perguntas.map((alternativa: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.botaoRadio}
            onPress={() => setRespostaSelecionada(alternativa)}
          >
            <MaterialIcons
              name={
                respostaSelecionada === alternativa
                  ? "radio-button-checked"
                  : "radio-button-unchecked"
              }
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.textoAlternativa}>{alternativa}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.botaoResponder,
          !respostaSelecionada && styles.botaoDesativado,
        ]}
        onPress={checarResposta}
        disabled={!respostaSelecionada}
      >
        <Text style={styles.textoResponder}>Responder</Text>
      </TouchableOpacity>
      <View style={styles.erros}>
        <View style={styles.containerVidas}>{vidas()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  tituloPergunta: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    color: "white",
  },
  pergunta: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "left",
    color: "white",
  },
  containerPergunta: {
    width: "90%",
    backgroundColor: "#4747D1",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  botaoVoltar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  botaoResponder: {
    backgroundColor: "#4747D1",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
  },
  botaoDesativado: {
    backgroundColor: "#A9A9A9",
  },
  textoResponder: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  erros: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  containerVidas: {
    flexDirection: "row",
  },
  containerAlternativas: {
    width: "90%",
    marginBottom: 20,
  },
  alternativas: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  botaoRadio: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4747D1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  textoAlternativa: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap",
  },
});

export default Teste;
