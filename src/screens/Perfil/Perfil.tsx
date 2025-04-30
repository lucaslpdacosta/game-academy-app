import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ToastAndroid,
  ImageBackground,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import {
  pegarPerfil,
  getPontuacoesUsuario,
  updateAvatar,
  updateCapa,
} from "../../api/api";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  dataNascimento: string;
  genero: string;
  localizacao: string;
  avatarId: string;
  capaId: string;
}

interface Avatar {
  id: number;
  source: any;
  pontos: number;
}

interface Capa {
  id: number;
  source: any;
  pontos: number;
}

interface Pontuacao {
  valor: number;
}

const Perfil: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [modalAvatar, setModalAvatar] = useState<boolean>(false);
  const [covermodalAvatar, setCovermodalAvatar] = useState<boolean>(false);
  const [avatarAtual, setAvatarAtual] = useState<Avatar | null>(null);
  const [capaAtual, setCapaAtual] = useState<Capa | null>(null);
  const [pontosTotal, setPontosTotal] = useState<number>(0);
  const [classificacao, setClassificacao] = useState<string>("");

  const avatars: Avatar[] = [
    { id: 1, source: require("../../../assets/avatar/default.jpg"), pontos: 0 },
    { id: 2, source: require("../../../assets/avatar/avatar1.jpg"), pontos: 0 },
    { id: 3, source: require("../../../assets/avatar/avatar2.jpg"), pontos: 1 },
    { id: 4, source: require("../../../assets/avatar/avatar3.jpg"), pontos: 1 },
    { id: 5, source: require("../../../assets/avatar/avatar4.jpg"), pontos: 2 },
    { id: 6, source: require("../../../assets/avatar/avatar5.jpg"), pontos: 0 },
    { id: 7, source: require("../../../assets/avatar/avatar6.jpg"), pontos: 3 },
    { id: 8, source: require("../../../assets/avatar/avatar7.jpg"), pontos: 4 },
    { id: 9, source: require("../../../assets/avatar/avatar8.jpg"), pontos: 5 },
    {
      id: 10,
      source: require("../../../assets/avatar/avatar9.jpg"),
      pontos: 6,
    },
    {
      id: 11,
      source: require("../../../assets/avatar/avatar10.jpg"),
      pontos: 7,
    },
    {
      id: 12,
      source: require("../../../assets/avatar/avatar11.jpg"),
      pontos: 8,
    },
    {
      id: 13,
      source: require("../../../assets/avatar/avatar12.jpg"),
      pontos: 9,
    },
    {
      id: 14,
      source: require("../../../assets/avatar/avatar13.jpg"),
      pontos: 10,
    },
    {
      id: 15,
      source: require("../../../assets/avatar/avatar14.jpg"),
      pontos: 15,
    },
    {
      id: 16,
      source: require("../../../assets/avatar/avatar15.jpg"),
      pontos: 20,
    },
    {
      id: 17,
      source: require("../../../assets/avatar/avatar16.jpg"),
      pontos: 30,
    },
    {
      id: 18,
      source: require("../../../assets/avatar/avatar17.jpg"),
      pontos: 40,
    },
    {
      id: 19,
      source: require("../../../assets/avatar/avatar18.jpg"),
      pontos: 50,
    },
    {
      id: 20,
      source: require("../../../assets/avatar/avatar19.jpg"),
      pontos: 100,
    },
  ];

  const capas: Capa[] = [
    { id: 1, source: require("../../../assets/cover/default.jpg"), pontos: 0 },
    { id: 2, source: require("../../../assets/cover/cover1.jpg"), pontos: 0 },
    { id: 3, source: require("../../../assets/cover/cover2.jpg"), pontos: 1 },
    { id: 4, source: require("../../../assets/cover/cover3.jpg"), pontos: 0 },
    { id: 5, source: require("../../../assets/cover/cover4.jpg"), pontos: 5 },
    { id: 6, source: require("../../../assets/cover/cover5.jpg"), pontos: 10 },
    { id: 7, source: require("../../../assets/cover/cover6.jpg"), pontos: 25 },
    { id: 8, source: require("../../../assets/cover/cover7.jpg"), pontos: 50 },
    { id: 9, source: require("../../../assets/cover/cover8.jpg"), pontos: 100 },
  ];

  const definirClassificacao = (pontos: number): string => {
    if (pontos <= 10) {
      return "Bronze";
    } else if (pontos <= 25) {
      return "Prata";
    } else if (pontos <= 50) {
      return "Ouro";
    } else {
      return "Diamante";
    }
  };

  const definirCorIcone = (classificacao: string): string => {
    switch (classificacao) {
      case "Bronze":
        return "#F2700C";
      case "Prata":
        return "#969696";
      case "Ouro":
        return "#E9B115";
      case "Diamante":
        return "#4AEDD9";
      default:
        return "#F2F2F2";
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async (): Promise<void> => {
        const response = await pegarPerfil();
        if (!response || !response.userData) {
          console.error("Dados do usuário não disponíveis");
          return;
        }

        setUser(response.userData);
        const avatarId = parseInt(response.userData.avatarId, 10);
        const avatarAtual = avatars.find((image) => image.id === avatarId);
        setAvatarAtual(avatarAtual || avatars[0]);

        const capaId = parseInt(response.userData.capaId, 10);
        const capaAtual = capas.find((image) => image.id === capaId);
        setCapaAtual(capaAtual || capas[0]);

        const pontuacoes = await getPontuacoesUsuario(response.userData.id);
        const total = pontuacoes.reduce(
          (acc: number, cur: Pontuacao) => acc + cur.valor,
          0
        );
        setPontosTotal(total);

        const classificacao = definirClassificacao(total);
        setClassificacao(classificacao);
      };
      fetchUserData();
      return () => {};
    }, [])
  );

  const modalEscolherAvatar = (): void => {
    setModalAvatar(!modalAvatar);
  };

  const modalEscolherCapa = (): void => {
    setCovermodalAvatar(!covermodalAvatar);
  };

  const atualizarAvatar = async (): Promise<void> => {
    if (avatarAtual) {
      await updateAvatar(avatarAtual.id.toString());
      setUser((prevUser: UserProfile | null) =>
        prevUser
          ? {
              ...prevUser,
              avatarId: avatarAtual.id.toString(),
            }
          : null
      );
    }
  };

  const atualizarCapa = async (): Promise<void> => {
    if (capaAtual) {
      await updateCapa(capaAtual.id.toString());
      setUser((prevUser: UserProfile | null) =>
        prevUser
          ? {
              ...prevUser,
              capaId: capaAtual.id.toString(),
            }
          : null
      );
    }
  };

  const salvarPerfil = async (): Promise<void> => {
    ToastAndroid.showWithGravityAndOffset(
      "Perfil salvo com sucesso!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      30,
      50
    );
    await atualizarAvatar();
    await atualizarCapa();
  };

  const avatarEscolhido = (image: Avatar): JSX.Element | null => {
    if (image.pontos <= pontosTotal || image.id === avatarAtual?.id) {
      return (
        <TouchableOpacity
          key={image.id}
          onPress={() => {
            setAvatarAtual(image);
            modalEscolherAvatar();
          }}
          activeOpacity={0.5}
          style={styles.containerAvatar}
        >
          <Image source={image.source} style={styles.imagem} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const capaEscolhida = (image: Capa): JSX.Element | null => {
    if (image.pontos <= pontosTotal || image.id === capaAtual?.id) {
      return (
        <TouchableOpacity
          key={image.id}
          onPress={() => {
            setCapaAtual(image);
            modalEscolherCapa();
          }}
          activeOpacity={0.5}
          style={styles.containerAvatar}
        >
          <Image source={image.source} style={styles.imagem} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <ImageBackground
      source={require("../../../assets/bg1.jpg")}
      style={styles.backgroundImage}
    >
      <CustomStatusBar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topContainer}>
          {capaAtual && (
            <Image source={capaAtual.source} style={styles.imagemCapa} />
          )}
          {avatarAtual && (
            <Image source={avatarAtual.source} style={styles.imagemAvatar} />
          )}
          <TouchableOpacity
            style={styles.iconeContainer}
            onPress={modalEscolherAvatar}
          >
            <Feather name="edit" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconeCapa}
            onPress={modalEscolherCapa}
          >
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
              <MaterialIcons
                name="star"
                size={60}
                color={definirCorIcone(classificacao)}
              />
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
              <Feather
                name="x-circle"
                size={26}
                color="#333"
                onPress={modalEscolherAvatar}
              />
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
              <Feather
                name="x-circle"
                size={26}
                color="#333"
                onPress={modalEscolherCapa}
              />
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
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    position: "relative",
    height: 250,
    alignItems: "center",
  },
  imagemCapa: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagemAvatar: {
    width: 140,
    height: 140,
    borderRadius: 90,
    position: "absolute",
    bottom: -70,
    borderWidth: 4,
    borderColor: "#fff",
  },
  iconeContainer: {
    position: "absolute",
    bottom: -60,
    right: "30%",
    backgroundColor: "#656565",
    padding: 8,
    borderRadius: 20,
  },
  iconeCapa: {
    position: "absolute",
    bottom: 2,
    right: 5,
    backgroundColor: "#656565",
    padding: 8,
    borderRadius: 20,
  },
  containerSecao: {
    height: 60,
  },
  containerInfo: {
    padding: 20,
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  localizacao: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4747D1",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 30,
  },
  botaoSalvar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  estatisticasTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pontosTotal: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  containerSelect: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  iconeModal: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  containerScroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  containerImagem: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  containerAvatar: {
    width: "30%",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  imagem: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default Perfil;
