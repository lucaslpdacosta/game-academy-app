import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { criarNovoModulo } from "../../api/api";
import { RootStackParamList } from "../../types/navigation";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

type Props = NativeStackScreenProps<RootStackParamList, "NovoModulo">;

const NovoModulo: React.FC<Props> = ({ navigation }) => {
  const [titulo, setTitulo] = useState<string>("");
  const [meta, setMeta] = useState<string>("");

  const handleCriarModulo = async (): Promise<void> => {
    if (!titulo.trim() || !meta.trim()) {
      Alert.alert("Erro", "Insira um título e uma meta válidos.");
      return;
    }

    const metaInt = parseInt(meta, 10);
    if (isNaN(metaInt)) {
      Alert.alert("Erro", "Meta deve ser um número válido.");
      return;
    }

    Alert.alert(
      "Confirmar",
      `Criar módulo "${titulo}" com meta de ${metaInt}?`,
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: () => criarModulo(titulo, metaInt) },
      ]
    );
  };

  const criarModulo = async (titulo: string, meta: number): Promise<void> => {
    const sucesso = await criarNovoModulo(titulo, meta);
    if (sucesso) {
      Alert.alert("Módulo adicionado", "Módulo adicionado com sucesso");
      navigation.goBack();
    } else {
      Alert.alert("Erro", "Não foi possível adicionar o módulo");
    }
  };

  const ativarBotao = (): boolean => {
    return !(titulo && meta);
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.titulo}>Novo Módulo</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira o título do módulo"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Insira a meta do módulo"
        value={meta}
        onChangeText={setMeta}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[
          styles.botaoCriar,
          { backgroundColor: ativarBotao() ? "#B0B0B0" : "#4747D1" },
        ]}
        onPress={handleCriarModulo}
        disabled={ativarBotao()}
      >
        <Text style={styles.textoBotao}>ADICIONAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 15,
  },
  botaoVoltar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#4747D1",
    borderRadius: 8,
    width: "80%",
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  botaoCriar: {
    backgroundColor: "#4747D1",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NovoModulo;
