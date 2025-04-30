import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

interface Conteudo {
  id: string;
  tipo: string;
  numTestes: number;
  pontos: number;
  pontuacao: number;
}

interface PerfilResponse {
  userData: {
    funcao: string;
  };
  userId: string;
}

interface ConteudoResponse {
  id: string;
  tipo: string;
  pontos: number;
}

interface PontuacaoResponse {
  ConteudoId: string;
  valor: number;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Conteudo">;
  route: RouteProp<RootStackParamList, "Conteudo">;
};

const Conteudo: React.FC<Props> = ({ navigation, route }) => {
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [carregarConteudo, setCarregarConteudo] = useState<boolean>(true);
  const [funcaoUsuario, setFuncaoUsuario] = useState<string>("");
  const [meta, setMeta] = useState<number>(0);

  useEffect(() => {
    const pegarFuncaoUsuario = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("token inexistente");
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
        console.error("erro ao recuparar dado de funcao", error);
      }
    };

    pegarFuncaoUsuario();
  }, []);

  useEffect(() => {
    const carregarConteudos = async (): Promise<void> => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          console.error("token inexistente");
          return;
        }

        const infoUsuario = await axios.get<PerfilResponse>(
          "http://localhost:3000/perfil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const usuarioId = infoUsuario.data.userId;

        const [dadosConteudo, dadosPontuacao] = await Promise.all([
          axios.get<ConteudoResponse[]>(
            `http://localhost:3000/conteudos/modulo/${route.params.moduloId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get<PontuacaoResponse[]>(
            `http://localhost:3000/pontuacoes/modulo/${route.params.moduloId}/usuario/${usuarioId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        const pegarCont = dadosConteudo.data;
        const pegarPontuacao = dadosPontuacao.data;

        const conteudoTeste = await Promise.all(
          pegarCont.map(async (conteudo) => {
            try {
              const testesResponse = await axios.get(
                `http://localhost:3000/testes/${route.params.moduloId}/${conteudo.id}`
              );
              const numTestes = testesResponse.data.length;
              return { ...conteudo, numTestes };
            } catch (error) {
              console.error(
                `Erro ao carregar testes para o conteúdo ${conteudo.id}:`,
                error
              );
              return { ...conteudo, numTestes: 0 };
            }
          })
        );

        const pontuacaoConteudos: Conteudo[] = conteudoTeste.map((conteudo) => {
          const pontuacao = pegarPontuacao.find(
            (p) => p.ConteudoId === conteudo.id
          );
          return {
            ...conteudo,
            pontuacao: pontuacao ? pontuacao.valor : 0,
          };
        });

        setConteudos(pontuacaoConteudos);
        setCarregarConteudo(false);
      } catch (error) {
        console.error("erro ao recuperar conteudos:", error);
      }
    };

    carregarConteudos();
  }, []);

  useEffect(() => {
    const metaValor = route.params.meta;
    setMeta(metaValor);
  }, []);

  const progressoPorcentagem = (): number => {
    const pontuacaoTotal = meta;
    const pontuacaoUsuario = conteudos.reduce((total, conteudo) => {
      if (conteudo.pontuacao !== 0) {
        return total + conteudo.pontuacao;
      }
      return total;
    }, 0);
    const porcentagem = (pontuacaoUsuario / pontuacaoTotal) * 100;
    return isNaN(porcentagem) ? 0 : porcentagem;
  };

  if (carregarConteudo) {
    return (
      <View style={[styles.container, styles.carregarConteudoContainer]}>
        <ActivityIndicator size={50} color="#0000ff" />
      </View>
    );
  }

  const porcentagemConclusao = progressoPorcentagem();

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.titulo}>{route.params.titulo}</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {conteudos.map((conteudo) => (
          <TouchableOpacity
            key={conteudo.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("ConteudoDetalhe", {
                moduloId: route.params.moduloId,
                conteudoId: conteudo.id,
              })
            }
          >
            <Text style={styles.tituloCard}>{conteudo.tipo}</Text>
            <Text
              style={styles.descricaoCard}
            >{`${conteudo.numTestes || 0} Teste${conteudo.numTestes !== 1 ? "s" : ""}`}</Text>
            {conteudo.pontuacao !== 0 && (
              <View style={styles.completo}>
                <MaterialIcons name="check-circle" size={20} color="#4BFF02" />
              </View>
            )}
            <View style={styles.estrela}>
              {[...Array(conteudo.pontos)].map((_, index) => (
                <MaterialIcons
                  key={index}
                  name="star"
                  size={20}
                  color="#FFA900"
                />
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.barraProgressoContainer}>
        <View style={styles.barraProgresso}>
          <View
            style={[styles.corBarra, { width: `${porcentagemConclusao}%` }]}
          />
          <Text
            style={styles.textoPorcentagem}
          >{`${Math.round(porcentagemConclusao)}%`}</Text>
        </View>
      </View>

      {funcaoUsuario === "admin" && (
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() =>
            navigation.navigate("NovoConteudo", {
              moduloId: route.params.moduloId,
            })
          }
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
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 15,
  },
  botaoVoltar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
  },
  card: {
    width: "48%",
    aspectRatio: 1.5,
    backgroundColor: "#4747D1",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 25,
    position: "relative",
  },
  tituloCard: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descricaoCard: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
  },
  completo: {
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  estrela: {
    position: "absolute",
    bottom: 5,
    right: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  carregarConteudoContainer: {
    justifyContent: "center",
  },
  barraProgressoContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  barraProgresso: {
    width: "80%",
    height: 30,
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  corBarra: {
    height: "100%",
    backgroundColor: "#4747D1",
    borderRadius: 15,
  },
  textoPorcentagem: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 30,
    zIndex: 1,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  botaoAdicionar: {
    position: "absolute",
    bottom: 70,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4747D1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default Conteudo;
