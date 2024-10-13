import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Duvidas = () => {
  const [categorias, setCategorias] = useState([
    {
      tituloDropdown: 'O aplicativo',
      topicos: [
        { titulo: 'Introdução', descricao: 'O Game/Adacemy é uma plataforma simples de ensino com gamificação que permite com que o usuário possa aprender de uma forma envolvente e cativante.' },
        { titulo: 'Como funciona', descricao: 'Em sua jornada, o usuário pode progredir colecionando estrelas ao realizar missões, que são necessárias para completar um módulo.' },
        { titulo: 'O que são as estrelas?', descricao: 'Cada missão de um módulo possui um valor de estrelas, que é relacionada à sua dificuldade. Ao completar uma missão, o usuário ganha o valor de estrelas da missão. Um módulo pode ser completo ao atingir a quantidade de estrelas necessárias.' },
      ],
    },
    {
      tituloDropdown: 'Missões',
      topicos: [
        { titulo: 'Como funcionam?', descricao: 'Após o usuário estudar o conteúdo de uma unidade, o mesmo deve passar no teste que consiste em uma série de questões sobre o assunto. Mas deve-se ter cuidado, pois há um limite de erros em cada missão.' },
        { titulo: 'Sobre as vidas', descricao: 'Cada missão possui uma tolerância de quantos erros podem ser feitos durante o teste. Caso o usuário perca todas as suas vidas, a missão é considerada falhada.' },
      ],
    },
    {
      tituloDropdown: 'Perfil',
      topicos: [
        //{ titulo: 'Informações Pessoais', descricao: 'Embora optativos, é possível informar os dados de usuário como nome e sobrenome, idade e local. Caso o usuário não deseje exibí-los, é possível ajustar a visualização de dados pessoais nas configurações.' },
        { titulo: 'Customização', descricao: 'O usuário pode customizar seu perfil com figuras, escolher um fundo e destacar suas conquistas.' },
        { titulo: 'Itens desbloqueáveis', descricao: 'Há alguns itens cosméticos desbloqueáveis a serem liberados, inclusive alguns secretos!' },
        { titulo: 'Estatísticas', descricao: 'Os méritos alcançados pelo usuário serão incluídos automaticamente em seu perfil.' },
        //{ titulo: 'Conquistas', descricao: 'Também é possível destacar as conquistas liberadas preferidas no perfil. Faça a sua combinação preferida!' },
      ],
    },
    {
      tituloDropdown: 'Sobre minha conta',
      topicos: [
        //{ titulo: 'Alterar nome e/ou email', descricao: 'Nas configurações, você pode realizar a alteração de informações, mas esteja ciente de que não é possível alterar sua tag.' },
        { titulo: 'Quero deletar minha conta', descricao: 'Você pode solicitar a remoção de sua conta, mas cuidado: esta ação é irreversível!' },
      ],
    },
  ]);

  const [expandirCategoria, setExpandirCategoria] = useState(null);
  const [expandirTopico, setExpandirTopico] = useState(null);

  const ativarCategoria = (index) => {
    setExpandirCategoria(expandirCategoria === index ? null : index);
    setExpandirTopico(null);
  };

  const toggleTopic = (indexCategoria, indexTopico) => {
    setExpandirCategoria(indexCategoria);
    setExpandirTopico(expandirTopico === indexTopico ? null : indexTopico);
  };

  return (
    <ImageBackground source={require('../../../assets/bg1.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.textoTitulo}>Dúvidas e Ajuda</Text>
        {categorias.map((categoria, indexCategoria) => (
          <View key={indexCategoria} style={styles.categoriaContainer}>
            <TouchableOpacity onPress={() => ativarCategoria(indexCategoria)}>
              <View style={styles.categoriaHeader}>
                <Text style={styles.categoriaTitulo}>{categoria.tituloDropdown}</Text>
                <FontAwesome
                  name={expandirCategoria === indexCategoria ? 'chevron-up' : 'chevron-down'}
                  size={15}
                  color="grey"
                />
              </View>
            </TouchableOpacity>
            {expandirCategoria === indexCategoria && (
              <View>
                {categoria.topicos.map((topico, indexTopico) => (
                  <View key={indexTopico} style={styles.topicoContainer}>
                    <TouchableOpacity onPress={() => toggleTopic(indexCategoria, indexTopico)}>
                      <View style={styles.topicoHeader}>
                        <Text style={styles.textoTopico}>{topico.titulo}</Text>
                        <FontAwesome
                          tituloDropdown={expandirTopico === indexTopico ? 'chevron-up' : 'chevron-down'}
                          size={15}
                          color="grey"
                        />
                      </View>
                    </TouchableOpacity>
                    {expandirTopico === indexTopico && (
                      <View style={styles.containerDescricao}>
                        <Text style={styles.textoDescricao}>{topico.descricao}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  textoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoriaContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  categoriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoriaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4747D1',
  },
  topicoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  topicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  textoTopico: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  containerDescricao: {
    padding: 12,
  },
  textoDescricao: {
    fontSize: 15,
    color: '#333333',
    textAlign: 'justify',
  },
});

export default Duvidas;