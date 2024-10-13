import React, { useState } from 'react';
import { ScrollView, View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, StatusBar, Platform, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { RadioButton, Checkbox } from 'react-native-paper';
import { cadastrar } from '../../api/api';

const Cadastro = () => {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [genero, setGenero] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [termos, setTermos] = useState(false);

  const fazerCadastro = async () => {
    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Insira um email válido.');
      return;
    }

    if (!senhaValida(senha, confirmarSenha)) {
      Alert.alert('Erro', 'As senhas não combinam.');
      return;
    }

    const dadosCadastro = {
      nome,
      email,
      senha,
      dataNascimento,
      genero,
      localizacao,
    };

    await cadastrar(
      {
        nome,
        email,
        senha,
        dataNascimento,
        genero,
        localizacao,
      },
      navigation
    );
    
  };

  const validarEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const senhaValida = (senha, confirmarSenha) => {
    return senha === confirmarSenha;
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dataNascimento;
    setShowDatePicker(Platform.OS === 'ios');
    setDataNascimento(currentDate);
  };

  const ajustarData = dataNascimento.toLocaleDateString('pt-BR');

  const abrirTermos = () => {
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
    Alert.alert('Termos de Uso e Políticas de Privacidade', termosDeUso, [{ text: 'OK' }], { cancelable: false });
  };

  const ativarBotao = () => {
    return !(nome && email && senha && confirmarSenha && dataNascimento && localizacao && genero && termos);
  };

  return (
    <ImageBackground source={require('../../../assets/bg2.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.logo}>Faça seu cadastro!</Text>
          <View style={styles.formContainer}>
            <Text style={styles.campoTexto}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe seu nome"
              value={nome}
              onChangeText={(text) => setNome(text)}
            />

            <Text style={styles.campoTexto}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe seu e-mail"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={styles.campoTexto}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe sua senha"
              value={senha}
              onChangeText={(text) => setSenha(text)}
              secureTextEntry
            />

            <Text style={styles.campoTexto}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChangeText={(text) => setConfirmarSenha(text)}
              secureTextEntry
            />

            <Text style={styles.campoTexto}>Data de Nascimento</Text>
            <View style={styles.containerData}>
              <TouchableOpacity style={styles.botaoData} onPress={showDatepicker}>
                <Ionicons name="calendar" size={20} color="#4747D1" style={styles.iconeCalendario} />
                <Text style={styles.textoData}>
                  {ajustarData === 'data invalida' ? 'Selecione sua data de nascimento' : ajustarData}
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
            <RadioButton.Group onValueChange={(value) => setGenero(value)} value={genero}>
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
                onValueChange={(itemValue) => setLocalizacao(itemValue)}
              >
                <Picker.Item label="Escolha seu País/Região" value="" />
                <Picker.Item label="Brasil" value="Brasil" />
              </Picker>
            </View>

            <View style={styles.checkContainer}>
              <Checkbox
                status={termos ? 'checked' : 'unchecked'}
                onPress={() => setTermos(!termos)}
                color="#4747D1"
              />
                <Text style={styles.checkboxLabel}>
                    Concordo com os {''}
                    <TouchableOpacity onPress={abrirTermos}>
                      <Text style={styles.link}>Termos de Uso</Text>
                    </TouchableOpacity>
                </Text>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: ativarBotao() ? '#B0B0B0' : '#4747D1' }]}
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
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  botaoVoltar: {
    position: 'absolute',
    top: -30,
    left: 20,
    zIndex: 1,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4747D1',
    width: '85%',
  },
  formContainer: {
    width: '80%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#4747D1',
  },
  loginButton: {
    backgroundColor: '#4747D1',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerData: {
    marginBottom: 20,
  },
  botaoData: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 50,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#4747D1',
  },
  iconeCalendario: {
    marginRight: 10,
  },
  textoData: {
    flex: 1,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#4747D1',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioBotao: {
    marginLeft: 8,
    color: '#0D0D0D',
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#0D0D0D',
  },
  link: {
    marginBottom: -4,
    color: '#4747D1',
    textDecorationLine: 'underline',
  },
});

export default Cadastro;