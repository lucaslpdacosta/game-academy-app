import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const NovoConteudo = ({ navigation, route }) => {
  const [tipo, setTipo] = useState('');
  const [texto, setTexto] = useState('');
  const [linkVideo, setLinkVideo] = useState('');
  const [pontos, setPontos] = useState(1);
  const [botaoAtivo, setBotaoAtivo] = useState(false);

  const { moduloId } = route.params;

  useEffect(() => {
    if (tipo.trim() && texto.trim()) {
      setBotaoAtivo(true);
    } else {
      setBotaoAtivo(false);
    }
  }, [tipo, texto]);

  const criarConteudo = async () => {
    if (!validarLinkVideo(linkVideo)) {
      Alert.alert('Link Inválido', 'Por favor, insira um link de vídeo válido do YouTube.');
      return;
    }

    const videoId = pegarIdTexto(linkVideo);

    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja salvar este conteúdo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await axios.post(`http://localhost:3000/conteudos`, {
                tipo: tipo.substring(0, 50),
                texto,
                linkVideo: videoId ? `https://youtube.com/embed/${videoId}` : '',
                pontos,
                ModuloId: moduloId,
              });
              setTipo('');
              setTexto('');
              setLinkVideo('');
              setPontos(1);
              navigation.navigate('Main');
            } catch (error) {
              console.error('Erro ao criar conteúdo:', error);
            }
          },
        },
      ],
    );
  };

  const pegarIdTexto = (link) => {
    const match = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const validarLinkVideo = (link) => {
    // teste
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|v%3D)|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
    return regex.test(link);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.titulo}>Novo Conteúdo</Text>

      <TextInput
        style={styles.input}
        placeholder="Título (30 caracteres)"
        value={tipo}
        onChangeText={setTipo}
        maxLength={30}
      />
      <TextInput
        style={styles.inputTexto}
        placeholder="Texto de corpo"
        value={texto}
        onChangeText={setTexto}
        multiline={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite ou cole aqui um link válido"
        value={linkVideo}
        onChangeText={setLinkVideo}
      />
      <Picker
        style={styles.input}
        selectedValue={pontos}
        onValueChange={(itemValue) => setPontos(itemValue)}
      >
        <Picker.Item label="1 ponto" value={1} />
        <Picker.Item label="2 pontos" value={2} />
        <Picker.Item label="3 pontos" value={3} />
        <Picker.Item label="4 pontos" value={4} />
        <Picker.Item label="5 pontos" value={5} />
      </Picker>

      <TouchableOpacity
        style={[styles.botaoSalvar, { backgroundColor: botaoAtivo ? '#4747D1' : '#B0B0B0' }]}
        onPress={criarConteudo}
        disabled={!botaoAtivo}
      >
        <Text style={styles.textoBotaoSalvar}>Salvar</Text>
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
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  inputTexto: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingBottom: 65,
    marginVertical: 10,
  },
  botaoSalvar: {
    backgroundColor: '#4747D1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 20,
  },
  textoBotaoSalvar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NovoConteudo;