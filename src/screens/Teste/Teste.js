import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useSound } from '../../context/SoundContext';

const Teste = ({ navigation, route }) => {
  const { ModuloId, conteudoId } = route.params;
  const { sfxEnabled } = useSound();

  const [perguntas, setPerguntas] = useState([]);
  const [indexPerguntaAtual, setIndexPerguntaAtual] = useState(0);
  const [opcaoEscolhida, setOpcaoEscolhida] = useState(null);
  const [erros, setErros] = useState(0);

  useEffect(() => {
    pegarPerguntas(ModuloId, conteudoId);
  }, []);

  const pegarPerguntas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token inexistente');
        return;
      }
  
      const response = await axios.get(`http://localhost:3000/testes/${ModuloId}/${conteudoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const perguntasRandom = response.data.sort(() => Math.random() - 0.5);
  
      setPerguntas(perguntasRandom);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    }
  };
  
  
  const sfxErro = async () => {
    if (!sfxEnabled) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../sfx/fail.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('erro:', error);
    }
  };

  const checarResposta = async () => {
    
    const perguntaAtual = perguntas[indexPerguntaAtual];
  
    if (opcaoEscolhida === perguntaAtual.respostas) {
      if (indexPerguntaAtual + 1 < perguntas.length) {
        setIndexPerguntaAtual(indexPerguntaAtual + 1);
        setOpcaoEscolhida(null);
      } else {
        adicionarPontuacao();
      }
    } else {
      setErros(erros + 1);
      await sfxErro();
      Alert.alert(
        'Resposta Incorreta',
        `A resposta correta é: ${perguntaAtual.respostas}`,
        [{ text: 'Continuar' }]
      );
      if (erros + 1 === 3) {
        navigation.navigate('Fail');
      } else {
        if (indexPerguntaAtual + 1 < perguntas.length) {
          setIndexPerguntaAtual(indexPerguntaAtual + 1);
          setOpcaoEscolhida(null);
        }
      }
    }
  };
  
  const vidas = () => {
    const iconeVida = [];
    for (let i = 0; i < erros; i++) {
      iconeVida.push(<MaterialIcons key={i} name="favorite-border" size={30} color="red" />);
    }
    for (let i = erros; i < 3; i++) {
      iconeVida.push(<MaterialIcons key={i} name="favorite" size={30} color="red" />);
    }
    return iconeVida;
  };  

  const alertVoltar = () => {
    Alert.alert(
      'Confirmar',
      'Deseja desistir?',
      [
        { text: 'Sim', onPress: () => navigation.goBack() },
        { text: 'Não', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  const adicionarPontuacao = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token inexistente');
        return;
      }
  
      // pra pegar userid
      const perfilResponse = await axios.get('http://localhost:3000/perfil', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const UsuarioId = perfilResponse.data.userId;

      const conteudoResponse = await axios.get(`http://localhost:3000/conteudos/modulo/${ModuloId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const conteudo = conteudoResponse.data.find(item => item.id === conteudoId);
      const pontos = conteudo.pontos;
      
      await axios.post(`http://localhost:3000/pontuacoes/${UsuarioId}/${ModuloId}/${conteudoId}`, {
        valor: pontos,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigation.navigate('Win');
    } catch (error) {
      console.error('Erro ao adicionar pontuação:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
      <TouchableOpacity style={styles.botaoVoltar} onPress={alertVoltar}>
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
    <View style={styles.containerPergunta}>
    <Text style={styles.tituloPergunta}>Pergunta {indexPerguntaAtual + 1}</Text>
    <Text style={styles.pergunta}>{perguntas[indexPerguntaAtual]?.titulo}</Text>
    </View>
    <View style={styles.containerAlternativas}>
    <Text style={styles.alternativas}>Escolha uma das opções:</Text>
    {perguntas[indexPerguntaAtual]?.perguntas.map((pergunta, index) => (
        <TouchableOpacity
        key={index}
        style={styles.botaoRadio}
        onPress={() => setOpcaoEscolhida(pergunta)}
        >
        <MaterialIcons name={opcaoEscolhida === pergunta ? 'radio-button-checked' : 'radio-button-unchecked'} size={24} color="#FFFFFF" />
        <Text style={styles.textoAlternativa}>{pergunta}</Text>
        </TouchableOpacity>
    ))}
    </View>
      <TouchableOpacity
        style={[styles.botaoResponder, !opcaoEscolhida && styles.botaoDesativado]}
        onPress={checarResposta}
        disabled={!opcaoEscolhida}
      >
        <Text style={styles.textoResponder}>Responder</Text>
      </TouchableOpacity>
      <View style={styles.erros}>
        <View style={styles.containerVidas}>
          {vidas()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tituloPergunta: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: 'white',
  },
  pergunta: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'left',
    color: 'white',
  },
  containerPergunta: {
    width: '90%',
    backgroundColor: '#4747D1',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  botaoVoltar: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  botaoResponder: {
    backgroundColor: '#4747D1',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  botaoDesativado: {
    backgroundColor: '#A9A9A9',
  },
  textoResponder: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  erros: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  efeitoErro: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerVidas: {
    flexDirection: 'row',
  },
  containerAlternativas: {
    width: '90%',
    backgroundColor: '#4747D1',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
  },
  alternativas: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  botaoRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textoAlternativa: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
  },
});

export default Teste;