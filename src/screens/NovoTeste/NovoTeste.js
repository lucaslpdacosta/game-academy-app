import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NovoTeste = ({ navigation, route }) => {
  const [titulo, setTitulo] = useState('');
  const [perguntas, setPerguntas] = useState([{ pergunta: '' }]);
  const [perguntasConfirmadas, setPerguntasConfirmadas] = useState([]);
  const [respostaCorretaIndex, setRespostaCorretaIndex] = useState(null);
  const [botaoAtivo, setBotaoAtivo] = useState(false);

  useEffect(() => {
    const checarAlternativaMarcada = perguntasConfirmadas.every(pergunta => pergunta.pergunta.trim() !== '');
    const respostaCorretaSelecionada = respostaCorretaIndex !== null;
    const tituloPreenchido = titulo.trim() !== '';

    setBotaoAtivo(checarAlternativaMarcada && respostaCorretaSelecionada && tituloPreenchido);
  }, [perguntasConfirmadas, respostaCorretaIndex, titulo]);

  const adicionarPergunta = () => {
    setPerguntas([...perguntas, { pergunta: '' }]);
  };

  const removerPergunta = () => {
    if (perguntas.length > 1) {
      setPerguntas(perguntas.slice(0, -1));
    }
  };

  const confirmarPerguntas = () => {
    setPerguntasConfirmadas(perguntas);
    setPerguntas([]);
    setRespostaCorretaIndex(null);
  };

  const atribuirResposta = (index) => {
    setRespostaCorretaIndex(index);
  };

  const criarTeste = async () => {
    const respostaCorreta = perguntasConfirmadas[respostaCorretaIndex].pergunta;
  
    try {
      const response = await fetch(`http://localhost:3000/testes/${route.params.moduloId}/${route.params.conteudoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          perguntas: perguntasConfirmadas.map(pergunta => pergunta.pergunta),
          respostas: respostaCorreta,
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(`erro: ${response.statusText}`);
      }

      Alert.alert('Teste Criado', 'Seu teste foi criado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('erro:', error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.titulo}>Novo Teste</Text>
      <Text style={styles.subtitulo}>Texto da questão:</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira o título do teste"
        value={titulo}
        onChangeText={setTitulo}
      />
      <ScrollView style={{ width: '100%' }}>
        {perguntas.map((pergunta, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.subtituloOpcao}>Opção {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Opção ${index + 1}`}
              value={pergunta.pergunta}
              onChangeText={text => {
                const updatedPerguntas = [...perguntas];
                updatedPerguntas[index].pergunta = text;
                setPerguntas(updatedPerguntas);
              }}
            />
          </View>
        ))}
        <View style={styles.botoesContainer}>
          <TouchableOpacity style={styles.botaoIcone} onPress={adicionarPergunta}>
            <Ionicons name="add-circle" size={36} color="#4747D1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoIcone} onPress={removerPergunta}>
            <Ionicons name="remove-circle" size={36} color="#FF5733" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.botaoConfirmar} onPress={confirmarPerguntas}>
          <Text style={styles.textoBotao}>CONFIRMAR</Text>
        </TouchableOpacity>
      </ScrollView>
      {perguntasConfirmadas.length > 0 && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={[styles.subtitulo, { marginTop: 20 }]}>Escolha a resposta correta:</Text>
          <ScrollView style={{ width: '100%' }}>
            {perguntasConfirmadas.map((pergunta, index) => (
              <View key={index} style={styles.inputContainer}>
                <View style={styles.opcaoContainer}>
                  <Text style={styles.textoPergunta}>{pergunta.pergunta}</Text>
                  <TouchableOpacity
                    style={[styles.checkbox, respostaCorretaIndex === index ? styles.checkboxSelecionado : null]}
                    onPress={() => atribuirResposta(index)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: botaoAtivo ? '#4747D1' : '#B0B0B0' }]}
        onPress={criarTeste}
        disabled={!botaoAtivo}
      >
        <Text style={styles.textoBotao}>ADICIONAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  subtituloOpcao: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 20,
  },
  botaoVoltar: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  botaoIcone: {
    alignItems: 'center',
  },
  botaoConfirmar: {
    backgroundColor: '#4747D1',
    width: '50%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginLeft: 90,
    marginBottom: 10,
    alignItems: 'center',
  },
  botao: {
    backgroundColor: '#4747D1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoPergunta: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 5,
  },
  opcaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    marginRight: 10,
  },
  checkboxSelecionado: {
    backgroundColor: '#4747D1',
  },
});

export default NovoTeste;