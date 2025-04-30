import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  pegarPerfil,
  pegarModulos,
  pegarValorConteudos,
  deletarModulo,
} from "../../api/api";
import { RootStackParamList } from "../../types/navigation";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface Modulo {
  id: string;
  titulo: string;
  meta: number;
}

interface PerfilData {
  nome: string;
  funcao: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [nome, setNome] = useState<string>("");
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [funcao, setFuncao] = useState<string>("");
  const [numeroConteudos, setNumeroConteudos] = useState<
    Record<string, number>
  >({});
  const [valorVoltar, setValorVoltar] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pegarDados = useCallback(async (): Promise<void> => {
    try {
      const response = await pegarPerfil();
      if (!response || !response.userData) {
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        return;
      }

      setNome(response.userData.nome);
      setFuncao(response.userData.funcao || "");

      const modulosData = await pegarModulos();
      if (modulosData) {
        setModulos(modulosData);

        const conteudosCounts = await Promise.all(
          modulosData.map(async (modulo) => {
            return { [modulo.id]: await pegarValorConteudos(modulo.id) };
          })
        );
        const conteudosCountsObject = Object.assign({}, ...conteudosCounts);
        setNumeroConteudos(conteudosCountsObject);
      }
    } catch (error) {
      console.error("Erro detalhado ao recuperar dados:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao carregar os dados. Tente novamente."
      );
    }
  }, []);

  const refreshData = useCallback(() => {
    pegarDados();
  }, [pegarDados]);

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
      return () => {};
    }, [refreshData])
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (valorVoltar === 0) {
          setValorVoltar(2);
          timeoutRef.current = setTimeout(() => {
            setValorVoltar(0);
          }, 2000);
          ToastAndroid.show(
            "Pressione mais uma vez para sair",
            ToastAndroid.SHORT
          );
          return true;
        } else {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          BackHandler.exitApp();
          return true;
        }
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [valorVoltar]);

  const handleDeleteModulo = async (moduloId: string): Promise<void> => {
    try {
      await deletarModulo(moduloId);
      setModulos(modulos.filter((modulo) => modulo.id !== moduloId));
    } catch (error) {
      console.error("erro ao excluir modulo:", error);
    }
  };

  const confirmarExclusao = (moduloId: string): void => {
    Alert.alert(
      "Confirmar",
      "Tem certeza de que deseja excluir o módulo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => handleDeleteModulo(moduloId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <CustomStatusBar />
      <View style={{ flex: 1, padding: 15, marginLeft: 15 }}>
        <Text style={styles.welcomeTitulo}>Bem-vindo,</Text>
        <Text style={styles.username}>{nome}</Text>
        <Text style={styles.tituloContainer}>O que vamos aprender hoje?</Text>
        <Text style={styles.containerDescricao}>
          Explore um dos módulos disponíveis para prosseguir em sua jornada!
        </Text>
        <ScrollView style={styles.container}>
          {modulos.map((modulo) => (
            <TouchableOpacity
              key={modulo.id}
              style={styles.cardContainer}
              onPress={() =>
                navigation.navigate("Conteudo", {
                  moduloId: modulo.id,
                  titulo: modulo.titulo,
                  meta: modulo.meta,
                })
              }
            >
              <Text style={styles.cardTitulo}>{modulo.titulo}</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardDesc}>
                  {numeroConteudos[modulo.id] || "0"} Missões
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={90}
                  color="#FFFFFF"
                  style={styles.icone}
                />
                {funcao === "admin" && (
                  <TouchableOpacity
                    style={styles.iconeDelete}
                    onPress={() => confirmarExclusao(modulo.id)}
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={30}
                      color="red"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {funcao === "admin" && (
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => navigation.navigate("NovoModulo")}
          >
            <MaterialCommunityIcons name="plus" size={40} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcomeTitulo: {
    fontSize: 16,
    marginTop: 30,
    marginBottom: 8,
    textAlign: "left",
  },
  username: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 60,
    textAlign: "left",
  },
  tituloContainer: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  },
  containerDescricao: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "left",
  },
  container: {
    flex: 1,
    marginBottom: 55,
  },
  cardContainer: {
    marginBottom: 16,
    backgroundColor: "#4747D1",
    borderRadius: 24,
    marginRight: 15,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitulo: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    paddingLeft: 30,
    marginTop: 20,
  },
  cardDesc: {
    fontSize: 22,
    color: "#FFFFFF",
    marginBottom: 20,
    paddingLeft: 30,
    marginTop: 20,
  },
  icone: {
    position: "absolute",
    right: 20,
    bottom: 18,
  },
  botaoAdicionar: {
    position: "absolute",
    bottom: 5,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4747D1",
    alignItems: "center",
    justifyContent: "center",
  },
  iconeDelete: {
    position: "absolute",
    bottom: 60,
    right: -20,
    width: 60,
    height: 60,
  },
});

export default Home;
