import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, StatusBar, ToastAndroid, Animated, PanResponder, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

const Welcome = () => {
  const navigation = useNavigation();
  const [exibirToast, setExibirToast] = useState(false);
  const [checarRede, setChecarRede] = useState(true);
  const [exibirModal, setExibirModal] = useState(false);
  const animacaoModal = useRef(new Animated.Value(height)).current;

  const verificarRefresh = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        setExibirToast(true);
      }
    } catch (error) {
      console.error('erro:', error);
    }
  };

  const verificarConexao = async () => {
    try {
      const state = await NetInfo.fetch();
      setChecarRede(state.isConnected);
      return state.isConnected;
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      return false;
    }
  };
  

  const fazerLogin = async () => {
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
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      navigation.navigate('Login');
      return;
    }
  
    navigation.navigate('Main');
    if (exibirToast) {
      ToastAndroid.showWithGravityAndOffset(
        'Usuário autenticado. Bem-vindo!',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        30,
        50
      );
    }
  };

  const fecharModal = () => {
    Animated.timing(animacaoModal, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setExibirModal(false);
    });
  };

  // articular com gesto usando panresponder
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          animacaoModal.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
      <View style={styles.containerHeader}>
        <Text style={styles.tituloHeader}>GAME/ACADEMY</Text>
      </View>
      <View style={styles.containerImagem}>
        <Image
          source={require('../../../assets/welcome.png')}
          style={styles.imagem}
        />
        <Text style={styles.titulo}>Já pensou em aprender se divertindo?</Text>
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
            <TouchableOpacity style={styles.iconeFechar} onPress={fecharModal}>
              <Icon name="close" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Sem Conexão</Text>
            <Icon name="wifi" size={80} color="#4747D1" />
            <Text style={styles.modalTexto}>
              Não foi possível realizar o login. Verifique sua conexão com a internet e tente novamente.
            </Text>
            <TouchableOpacity style={styles.botaoModal} onPress={fecharModal}>
              <Text style={styles.textoBotaoModal}>Entendi</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  tituloHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4747D1',
  },
  containerImagem: {
    flex: 1,
    alignItems: 'center',
    marginTop: '25%',
  },
  imagem: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    color: '#0D0D0D',
    width: '85%',
  },
  textoDescricao: {
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    color: '#333333',
    width: '80%',
  },
  containerBotao: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botao: {
    backgroundColor: '#4747D1',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 50,
    width: '85%',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  modalArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  modalFundo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  iconeFechar: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  modalTexto: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoModal: {
    backgroundColor: '#4747D1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  textoBotaoModal: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Welcome;