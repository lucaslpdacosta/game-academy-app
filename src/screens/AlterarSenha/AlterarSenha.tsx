import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { redefinirSenha } from "../../api/api";
import { RootStackParamList } from "../../types/navigation";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

type AlterarSenhaScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AlterarSenha"
>;
type AlterarSenhaScreenRouteProp = RouteProp<
  RootStackParamList,
  "AlterarSenha"
>;

const AlterarSenha: React.FC = () => {
  const navigation = useNavigation<AlterarSenhaScreenNavigationProp>();
  const route = useRoute<AlterarSenhaScreenRouteProp>();
  const { email } = route.params;
  const [novaSenha, setNovaSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const handleRedefinirSenha = async (): Promise<void> => {
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      await redefinirSenha(email, novaSenha);
      navigation.navigate("Login");
    } catch (error) {
      alert("Erro ao redefinir senha");
      console.error("Erro:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/bg2.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <CustomStatusBar />
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Altere a sua senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe sua nova senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={styles.botaoConfirmar}
          onPress={handleRedefinirSenha}
        >
          <Text style={styles.textoBotao}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoVoltar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  botaoConfirmar: {
    backgroundColor: "#4747D1",
    width: "50%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  textoBotao: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AlterarSenha;
