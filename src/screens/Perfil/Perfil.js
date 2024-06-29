import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, ToastAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { pegarPerfil, getPontuacoesUsuario, updateAvatar, updateCapa } from '../../api/api';

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [modalAvatar, setModalAvatar] = useState(false);
  const [covermodalAvatar, setCovermodalAvatar] = useState(false);
  const [avatarAtual, setAvatarAtual] = useState(null);
  const [capaAtual, setCapaAtual] = useState(null);
  const [pontosTotal, setPontosTotal] = useState(0);
  const [classificacao, setClassificacao] = useState('');

  const avatars = [
    { id: 1, source: require('../../../assets/avatar/default.jpg'), pontos: 0 },
    { id: 2, source: require('../../../assets/avatar/avatar1.jpg'), pontos: 0 },
    { id: 3, source: require('../../../assets/avatar/avatar2.jpg'), pontos: 1 },
    { id: 4, source: require('../../../assets/avatar/avatar3.jpg'), pontos: 1 },
    { id: 5, source: require('../../../assets/avatar/avatar4.jpg'), pontos: 2 },
    { id: 6, source: require('../../../assets/avatar/avatar5.jpg'), pontos: 0 },
    { id: 7, source: require('../../../assets/avatar/avatar6.jpg'), pontos: 3 },
    { id: 8, source: require('../../../assets/avatar/avatar7.jpg'), pontos: 4 },
    { id: 9, source: require('../../../assets/avatar/avatar8.jpg'), pontos: 5 },
    { id: 10, source: require('../../../assets/avatar/avatar9.jpg'), pontos: 6 },
    { id: 11, source: require('../../../assets/avatar/avatar10.jpg'), pontos: 7 },
    { id: 12, source: require('../../../assets/avatar/avatar11.jpg'), pontos: 8 },
    { id: 13, source: require('../../../assets/avatar/avatar12.jpg'), pontos: 9 },
    { id: 14, source: require('../../../assets/avatar/avatar13.jpg'), pontos: 10 },
    { id: 15, source: require('../../../assets/avatar/avatar14.jpg'), pontos: 15 },
    { id: 16, source: require('../../../assets/avatar/avatar15.jpg'), pontos: 20 },
    { id: 17, source: require('../../../assets/avatar/avatar16.jpg'), pontos: 30 },
    { id: 18, source: require('../../../assets/avatar/avatar17.jpg'), pontos: 40 },
    { id: 19, source: require('../../../assets/avatar/avatar18.jpg'), pontos: 50 },
    { id: 20, source: require('../../../assets/avatar/avatar19.jpg'), pontos: 100 }
];

const capas = [
  { id: 1, source: require('../../../assets/cover/default.jpg'), pontos: 0 },
  { id: 2, source: require('../../../assets/cover/cover1.jpg'), pontos: 0 },
  { id: 3, source: require('../../../assets/cover/cover2.jpg'), pontos: 1 },
  { id: 4, source: require('../../../assets/cover/cover3.jpg'), pontos: 0 },
  { id: 5, source: require('../../../assets/cover/cover4.jpg'), pontos: 5 },
  { id: 6, source: require('../../../assets/cover/cover5.jpg'), pontos: 10 },
  { id: 7, source: require('../../../assets/cover/cover6.jpg'), pontos: 25 },
  { id: 8, source: require('../../../assets/cover/cover7.jpg'), pontos: 50 },
  { id: 9, source: require('../../../assets/cover/cover8.jpg'), pontos: 100 }
];

const definirClassificacao = (pontos) => {
  if (pontos <= 10) {
    return 'Bronze';
  } else if (pontos <= 25) {
    return 'Prata';
  } else if (pontos <= 50) {
    return 'Ouro';
  } else {
    return 'Diamante';
  }
};

const definirCorIcone = (classificacao) => {
  switch (classificacao) {
    case 'Bronze':
      return '#F2700C';
    case 'Prata':
      return '#969696';
    case 'Ouro':
      return '#E9B115';
    case 'Diamante':
      return '#4AEDD9';
    default:
      return '#F2F2F2';
  }
};

useFocusEffect(
  React.useCallback(() => {
    const fetchUserData = async () => {
      const userData = await pegarPerfil();
      setUser(userData);
      if (userData) {
        const avatarId = userData.avatarId;
        const avatarAtual = avatars.find(image => image.id === avatarId);
        setAvatarAtual(avatarAtual || avatars[0]);

        const capaId = userData.capaId;
        const capaAtual = capas.find(image => image.id === capaId);
        setCapaAtual(capaAtual || capas[0]);

        const pontuacoes = await getPontuacoesUsuario(userData.id);
        const total = pontuacoes.reduce((acc, cur) => acc + cur.valor, 0);
        setPontosTotal(total);

        const classificacao = definirClassificacao(total);
        setClassificacao(classificacao);
      }
    };
    fetchUserData();
    return () => {};
  }, [])
);

const modalEscolherAvatar = () => {
  setModalAvatar(!modalAvatar);
};

const modalEscolherCapa = () => {
  setCovermodalAvatar(!covermodalAvatar);
};

const atualizarAvatar = async () => {
  await updateAvatar(avatarAtual?.id);
  setUser(prevUser => ({
    ...prevUser,
    avatarId: avatarAtual?.id,
  }));
};

const atualizarCapa = async () => {
  await updateCapa(capaAtual?.id);
  setUser(prevUser => ({
    ...prevUser,
    capaId: capaAtual?.id,
  }));
};

const salvarPerfil = async () => {
  ToastAndroid.showWithGravityAndOffset(
    'Perfil salvo com sucesso!',
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    30,
    50
  );
  await atualizarAvatar();
  await atualizarCapa();
};

  const avatarEscolhido = (image) => {
    if (image.pontos <= pontosTotal || image.id === avatarAtual?.id) {
      return (
        <TouchableOpacity
          key={image.id}
          onPress={() => {
            setAvatarAtual(image);
            modalEscolherAvatar();
          }}
          activeOpacity={0.5}
          style={styles.containerAvatar}>
          <Image source={image.source} style={styles.imagem} />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const capaEscolhida = (image) => {
    if (image.pontos <= pontosTotal || image.id === capaAtual?.id) {
      return (
        <TouchableOpacity
          key={image.id}
          onPress={() => {
            setCapaAtual(image);
            modalEscolherCapa();
          }}
          activeOpacity={0.5}
          style={styles.containerAvatar}>
          <Image source={image.source} style={styles.imagem} />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        {capaAtual && (
          <Image source={capaAtual.source} style={styles.imagemCapa} />
        )}
        {avatarAtual && (
          <Image source={avatarAtual.source} style={styles.imagemAvatar} />
        )}
        <TouchableOpacity style={styles.iconeContainer} onPress={modalEscolherAvatar}>
          <Feather name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconeCapa} onPress={modalEscolherCapa}>
          <Feather name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerSecao} />
      <View style={styles.containerInfo}>
        {user ? (
          <>
            <Text style={styles.username}>{user.nome}</Text>
            <Text style={styles.localizacao}> {user.localizacao}</Text>
            <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
              <Text style={styles.botaoSalvar}>SALVAR PERFIL</Text>
            </TouchableOpacity>
            <Text style={styles.estatisticasTitulo}>ESTATÍSTICAS</Text>
            <MaterialIcons name="star" size={60} color={definirCorIcone(classificacao)} />
            <Text style={styles.pontosTotal}>{pontosTotal}</Text>
          </>
        ) : (
          <Text>Carregando perfil...</Text>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAvatar}
        onRequestClose={() => setModalAvatar(false)}
      >
        <View style={styles.containerSelect}>
          <View style={styles.iconeModal}>
            <Feather name="x-circle" size={26} color="#333" onPress={modalEscolherAvatar}/>
          </View>
          <ScrollView>
            <View style={styles.containerScroll}>
              <View style={styles.containerImagem}>
                {avatars.map(avatarEscolhido)}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={covermodalAvatar}
        onRequestClose={() => setCovermodalAvatar(false)}
      >
        <View style={styles.containerSelect}>
          <View style={styles.iconeModal}>
            <Feather name="x-circle" size={26} color="#333" onPress={modalEscolherCapa}/>
          </View>
          <ScrollView>
            <View style={styles.containerScroll}>
              <View style={styles.containerImagem}>
                {capas.map(capaEscolhida)}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    position: 'relative',
    height: 200,
  },
  imagemCapa: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  containerSecao: {
    height: 80,
  },
  containerInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconeContainer: {
    position: 'absolute',
    top: 225,
    right: 145,
    backgroundColor: '#666',
    borderRadius: 12,
    padding: 5,
  },
  iconeCapa: {
    position: 'absolute',
    top: 165,
    right: 2,
    backgroundColor: '#666',
    borderRadius: 12,
    padding: 5,
  },
  imagemAvatar: {
    width: 140,
    height: 140,
    top:125,
    borderRadius: 80,
    position:'absolute',
    paddingBottom: 70,
    borderWidth: 3,
    borderColor: '#333',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  localizacao: {
    fontSize: 18,
  },
  containerSelect: {
    flex: 1,
    justifyContent: 'center',
    top: 200,
    left: 20,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    maxHeight: '47%',
    width: '90%',
    padding: 15,
  },
  containerImagem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  containerAvatar: {
    width: 80,
    height: 80,
    margin: 10,
  },
  containerScroll: {
    borderRadius: 10,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconeModal: {
    left: 150
  },
  imagem: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  botaoSalvar: {
    backgroundColor: '#4747D1',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
  },
  estatisticasTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 50,
    paddingBottom: 10
  },
  pontosTotal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Perfil;