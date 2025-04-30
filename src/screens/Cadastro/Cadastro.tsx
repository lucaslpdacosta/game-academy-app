import React, { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
  ImageBackground,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { RadioButton, Checkbox } from "react-native-paper";
import { RootStackParamList } from "../../types/navigation";
import { cadastrar } from "../../api/api";
import CustomStatusBar from "../../components/StatusBar/StatusBar";

type CadastroScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string;
  genero: string;
  localizacao: string;
}

const Cadastro: React.FC = () => {
  const navigation = useNavigation<CadastroScreenNavigationProp>();

  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [dataNascimento, setDataNascimento] = useState<Date>(new Date());
  const [genero, setGenero] = useState<string>("");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [termos, setTermos] = useState<boolean>(false);

  const fazerCadastro = async (): Promise<void> => {
    if (!validarEmail(email)) {
      Alert.alert("Erro", "Insira um email válido.");
      return;
    }

    if (!senhaValida(senha, confirmarSenha)) {
      Alert.alert("Erro", "As senhas não combinam.");
      return;
    }

    const dadosCadastro: DadosCadastro = {
      nome,
      email,
      senha,
      dataNascimento: dataNascimento.toISOString().split("T")[0],
      genero,
      localizacao,
    };

    await cadastrar(dadosCadastro, navigation);
  };

  const validarEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const senhaValida = (senha: string, confirmarSenha: string): boolean => {
    return senha === confirmarSenha;
  };

  const showDatepicker = (): void => {
    setShowDatePicker(true);
  };

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ): void => {
    const currentDate = selectedDate || dataNascimento;
    setShowDatePicker(Platform.OS === "ios");
    setDataNascimento(currentDate);
  };

  const ajustarData = dataNascimento.toLocaleDateString("pt-BR");

  const abrirTermos = (): void => {
    const termosDeUso = `
1. ACEITAÇÃO DOS TERMOS
Ao utilizar nosso aplicativo, você concorda com os termos e condições estabelecidos neste documento.

2. COLETA DE DADOS PESSOAIS
Coletamos informações pessoais, como nome, e-mail e telefone, que são fornecidas por você durante o cadastro.

3. USO DE DADOS
Os dados coletados serão usados para criar sua conta, personalizar sua experiência e enviar comunicações relevantes.

4. COMPARTILHAMENTO DE DADOS
Não compartilharemos suas informações pessoais com terceiros sem seu consentimento, exceto quando exigido por lei.

5. SEGURANÇA DOS DADOS
Adotamos medidas de segurança para proteger suas informações, mas não podemos garantir segurança absoluta.

6. ALTERAÇÕES NOS TERMOS
Reservamo-nos o direito de modificar estes termos a qualquer momento.

7. CONTATO
Para dúvidas, entre em contato através do suporte no aplicativo.`;
    Alert.alert(
      "Termos de Uso e Políticas de Privacidade",
      termosDeUso,
      [{ text: "OK" }],
      { cancelable: false }
    );
  };

  const ativarBotao = (): boolean => {
    return !(
      nome &&
      email &&
      senha &&
      confirmarSenha &&
      dataNascimento &&
      localizacao &&
      genero &&
      termos
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/bg2.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <View style={styles.container}>
          <CustomStatusBar />
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={30} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.logo}>Faça seu cadastro!</Text>
          <View style={styles.formContainer}>
            <Text style={styles.campoTexto}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe seu nome"
              value={nome}
              onChangeText={(text: string) => setNome(text)}
            />

            <Text style={styles.campoTexto}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe seu e-mail"
              keyboardType="email-address"
              value={email}
              onChangeText={(text: string) => setEmail(text)}
            />

            <Text style={styles.campoTexto}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe sua senha"
              value={senha}
              onChangeText={(text: string) => setSenha(text)}
              secureTextEntry
            />

            <Text style={styles.campoTexto}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChangeText={(text: string) => setConfirmarSenha(text)}
              secureTextEntry
            />

            <Text style={styles.campoTexto}>Data de Nascimento</Text>
            <View style={styles.containerData}>
              <TouchableOpacity
                style={styles.botaoData}
                onPress={showDatepicker}
              >
                <Icon
                  name="calendar"
                  size={20}
                  color="#4747D1"
                  style={styles.iconeCalendario}
                />
                <Text style={styles.textoData}>
                  {ajustarData === "data invalida"
                    ? "Selecione sua data de nascimento"
                    : ajustarData}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dataNascimento}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            <Text style={styles.campoTexto}>Gênero</Text>
            <RadioButton.Group
              onValueChange={(value: string) => setGenero(value)}
              value={genero}
            >
              <View style={styles.radioButton}>
                <RadioButton value="Masculino" color="#4747D1" />
                <Text style={styles.radioBotao}>Masculino</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="Feminino" color="#4747D1" />
                <Text style={styles.radioBotao}>Feminino</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="Outro" color="#4747D1" />
                <Text style={styles.radioBotao}>Outro</Text>
              </View>
            </RadioButton.Group>

            <Text style={styles.campoTexto}>País</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={localizacao}
                style={styles.picker}
                onValueChange={(itemValue: string) => setLocalizacao(itemValue)}
              >
                <Picker.Item label="Escolha seu País/Região" value="" />
                <Picker.Item label="Brasil" value="Brasil" />
              </Picker>
            </View>

            <View style={styles.checkContainer}>
              <Checkbox
                status={termos ? "checked" : "unchecked"}
                onPress={() => setTermos(!termos)}
                color="#4747D1"
              />
              <Text style={styles.checkboxLabel}>
                Concordo com os {""}
                <TouchableOpacity onPress={abrirTermos}>
                  <Text style={styles.link}>Termos de Uso</Text>
                </TouchableOpacity>
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: ativarBotao() ? "#B0B0B0" : "#4747D1" },
              ]}
              onPress={fazerCadastro}
              disabled={ativarBotao()}
            >
              <Text style={styles.loginButtonText}>CONFIRMAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  botaoVoltar: {
    position: "absolute",
    top: -30,
    left: 20,
    zIndex: 1,
  },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4747D1",
    width: "85%",
  },
  formContainer: {
    width: "80%",
  },
  campoTexto: {
    fontSize: 16,
    marginBottom: 5,
    color: "#4747D1",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "#4747D1",
  },
  containerData: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  botaoData: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "#4747D1",
  },
  iconeCalendario: {
    marginRight: 10,
  },
  textoData: {
    color: "#4747D1",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioBotao: {
    marginLeft: 10,
    color: "#4747D1",
  },
  pickerContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4747D1",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    color: "#4747D1",
  },
  link: {
    color: "#4747D1",
    textDecorationLine: "underline",
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  containerScroll: {
    flexGrow: 1,
  },
});

export default Cadastro;
