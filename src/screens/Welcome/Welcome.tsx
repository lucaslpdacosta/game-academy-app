import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  StatusBar,
  ToastAndroid,
  Animated,
  PanResponder,
  Dimensions,
  GestureResponderEvent,
  PanResponderGestureState,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import { X, WifiOff } from "react-native-feather";
import { RootStackParamList } from "../../types/navigation";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

const { height } = Dimensions.get("window");

type WelcomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const Welcome: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [exibirToast, setExibirToast] = useState<boolean>(false);
  const [checarRede, setChecarRede] = useState<boolean>(true);
  const [exibirModal, setExibirModal] = useState<boolean>(false);
  const animacaoModal = useRef(new Animated.Value(height)).current;

  const verificarRefresh = async (): Promise<void> => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        setExibirToast(true);
      }
    } catch (error) {
      console.error("erro:", error);
    }
  };

  const verificarConexao = async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch();
      const isConnected = state.isConnected ?? false;
      setChecarRede(isConnected);
      return isConnected;
    } catch (error) {
      console.error("Erro ao verificar conexão:", error);
      return false;
    }
  };

  const fazerLogin = async (): Promise<void> => {
    const conectado = await verificarConexao();

    if (!conectado && !exibirModal) {
      setExibirModal(true);
      Animated.timing(animacaoModal, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return;
    }

    setExibirToast(false);
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      navigation.navigate("Login");
      return;
    }

    navigation.navigate("Main");
    if (exibirToast) {
      ToastAndroid.showWithGravityAndOffset(
        "Usuário autenticado. Bem-vindo!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        30,
        50
      );
    }
  };

  const fecharModal = (): void => {
    Animated.timing(animacaoModal, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setExibirModal(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ): boolean => {
        return gestureState.dy > 0;
      },
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ): void => {
        if (gestureState.dy > 0) {
          animacaoModal.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ): void => {
        if (gestureState.dy > 100) {
          fecharModal();
        } else {
          Animated.timing(animacaoModal, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    verificarRefresh();
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/bg1.jpg")}
      style={styles.backgroundImage}
    >
      <CustomStatusBar />
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <Text style={styles.tituloHeader}>GAME/ACADEMY</Text>
        </View>
        <View style={styles.containerImagem}>
          <Image
            source={require("../../../assets/welcome.png")}
            style={styles.imagem}
          />
          <Text style={styles.titulo}>
            Já pensou em aprender se divertindo?
          </Text>
          <Text style={styles.textoDescricao}>
            Com a Game Academy, você pode aprender de forma dinâmica!
          </Text>
        </View>
        <View style={styles.containerBotao}>
          <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
            <Text style={styles.textoBotao}>Começar</Text>
          </TouchableOpacity>
        </View>

        {exibirModal && (
          <View style={styles.modalArea}>
            <View style={styles.modalFundo} />
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [
                    {
                      translateY: animacaoModal,
                    },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity
                style={styles.iconeFechar}
                onPress={fecharModal}
              >
                <X width={30} height={30} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitulo}>Sem Conexão</Text>
              <View style={styles.iconContainer}>
                <WifiOff width={80} height={80} color="#4747D1" />
              </View>
              <Text style={styles.modalTexto}>
                Não foi possível realizar o login. Verifique sua conexão com a
                internet e tente novamente.
              </Text>
              <TouchableOpacity style={styles.botaoModal} onPress={fecharModal}>
                <Text style={styles.textoBotaoModal}>Entendi</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerHeader: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  tituloHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4747D1",
  },
  containerImagem: {
    flex: 1,
    alignItems: "center",
    marginTop: "25%",
  },
  imagem: {
    width: 240,
    height: 240,
    resizeMode: "contain",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
    color: "#0D0D0D",
    width: "85%",
  },
  textoDescricao: {
    fontSize: 16,
    marginTop: 15,
    textAlign: "center",
    color: "#333333",
    width: "80%",
  },
  containerBotao: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  botao: {
    backgroundColor: "#4747D1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 50,
    width: "85%",
    alignItems: "center",
  },
  textoBotao: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  modalArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  modalFundo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  iconeFechar: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  iconContainer: {
    marginVertical: 20,
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4747D1",
    marginTop: 20,
  },
  modalTexto: {
    fontSize: 16,
    textAlign: "center",
    color: "#333333",
    marginVertical: 20,
    width: "80%",
  },
  botaoModal: {
    backgroundColor: "#4747D1",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  textoBotaoModal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default Welcome;
