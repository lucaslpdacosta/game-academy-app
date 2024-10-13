import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Conteudo = ({ navigation, route }) => {
  const [conteudos, setConteudos] = useState([]);
  const [carregarConteudo, setCarregarConteudo] = useState(true);
  const [funcaoUsuario, setFuncaoUsuario] = useState('');
  const [meta, setMeta] = useState(0);

  useEffect(() => {
    const pegarFuncaoUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('token inexistente');
          return;
        }

        const response = await axios.get('http://localhost:3000/perfil', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFuncaoUsuario(response.data.userData.funcao);
      } catch (error) {
        console.error('erro ao recuparar dado de funcao', error);
      }
    };

    pegarFuncaoUsuario();
  }, []);

  useEffect(() => {
    const carregarConteudos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          console.error('token inexistente');
          return;
        }

        const infoUsuario = await axios.get('http://localhost:3000/perfil', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usuarioId = infoUsuario.data.userId;

        const [dadosConteudo, dadosPontuacao] = await Promise.all([
          axios.get(`http://localhost:3000/conteudos/modulo/${route.params.moduloId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`http://localhost:3000/pontuacoes/modulo/${route.params.moduloId}/usuario/${usuarioId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        const pegarCont = dadosConteudo.data;
        const pegarPontuacao = dadosPontuacao.data;

        const conteudoTeste = await Promise.all(pegarCont.map(async (conteudo) => {
          try {
            const testesResponse = await axios.get(`http://localhost:3000/testes/${route.params.moduloId}/${conteudo.id}`);
            const numTestes = testesResponse.data.length;
            return { ...conteudo, numTestes };
          } catch (error) {
            console.error(`Erro ao carregar testes para o conteúdo ${conteudo.id}:`, error);
            return conteudo;
          }
        }));

        const pontuacaoConteudos = conteudoTeste.map(conteudo => {
          const pontuacao = pegarPontuacao.find(p => p.ConteudoId === conteudo.id);
          return {
            ...conteudo,
            pontuacao: pontuacao ? pontuacao.valor : 0
          };
        });

        setConteudos(pontuacaoConteudos);
        setCarregarConteudo(false);
      } catch (error) {
        console.error('erro ao recuperar conteudos:', error);
      }
    };
    
    carregarConteudos();
  }, []);

  useEffect(() => {
    // Recuperar o valor da meta dos parâmetros da rota
    const metaValor = route.params.meta;
    setMeta(metaValor);
  }, []);

  const progressoPorcentagem = () => {
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
            <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.titulo}>{route.params.titulo}</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {conteudos.map(conteudo => (
          <TouchableOpacity
            key={conteudo.id}
            style={styles.card}
            onPress={() => navigation.navigate('ConteudoDetalhe', { moduloId: route.params.moduloId, conteudoId: conteudo.id })}
          >
            <Text style={styles.tituloCard}>{conteudo.tipo}</Text>
            <Text style={styles.descricaoCard}>{`${conteudo.numTestes || 0} Teste${conteudo.numTestes !== 1 ? 's' : ''}`}</Text>
            {conteudo.pontuacao !== 0 && (
              <View style={styles.completo}>
                <MaterialIcons name="check-circle" size={20} color="#4BFF02" />
              </View>
            )}
            <View style={styles.estrela}>
              {[...Array(conteudo.pontos)].map((_, index) => (
                <MaterialIcons key={index} name="star" size={20} color="#FFA900" />
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.barraProgressoContainer}>
        <Text style={styles.textoPorcentagem}>{`${Math.round(porcentagemConclusao)}%`}</Text>
        <View style={styles.barraProgresso}>
          <View style={[styles.corBarra, { width: `${porcentagemConclusao}%` }]}></View>
        </View>
      </View>
      
      {funcaoUsuario === 'admin' && (
        <TouchableOpacity style={styles.botaoAdicionar} onPress={() => navigation.navigate('NovoConteudo', { moduloId: route.params.moduloId })}>
          <MaterialIcons name="add" size={40} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  botaoVoltar: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  card: {
    width: 180,
    height: 120,
    backgroundColor: '#4747D1',
    borderRadius: 10,
    margin: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    position: 'relative',
  },
  tituloCard: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descricaoCard: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  completo: {
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
  estrela: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  carregarConteudoContainer: {
    justifyContent: 'center',
  },
  barraProgressoContainer: {
    width: '70%',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 25,
  },
  barraProgresso: {
    width: '100%',
    height: '28%',
    backgroundColor: '#868DF0',
    borderRadius: 25,
    overflow: 'hidden',
  },
  corBarra: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4747D1',
    borderRadius: 25,
  },
  textoPorcentagem: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    top: 24,
    zIndex: 1,
  },
  botaoAdicionar: {
    position: 'absolute',
    bottom: 62,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4747D1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Conteudo;