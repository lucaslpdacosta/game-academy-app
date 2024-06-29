import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, TouchableOpacity, StyleSheet, StatusBar, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { send } from '@emailjs/react-native';

const EsqueceuSenha = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [numeroVerificacao, setNumeroVerificacao] = useState('');
  const [tempoGeracao, setTempoGeracao] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [checarNumero, setChecarNumero] = useState(new Array(6).fill(''));
  const [enviarEmail, setEnviarEmail] = useState(false);
  const [confirmarNumero, setConfirmarNumero] = useState(false);
  const [loginDisponivel, setLoginDisponivel] = useState(true);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const gerarNumeroVerificacao = () => {
    const criarNumero = Math.floor(100000 + Math.random() * 900000);
    setNumeroVerificacao(criarNumero.toString());
    setTempoGeracao(new Date());
    dispararEmail(email, criarNumero.toString());
  };

  const dispararEmail = (destinatarioEmail, codigoVerificacao) => {
    if (!validarEmail(destinatarioEmail)) {
      Alert.alert('Erro', 'Por favor, insira um endereço de e-mail válido.');
      return;
    }
  
    setEnviarEmail(true);
    send(
      'service_p4htcg6',
      'template_w96ooro',
      {
        to_email: destinatarioEmail,
        codigo_verificacao: codigoVerificacao,
      },
      {
        publicKey: 'xKP7T2npC_CJz3rjP',
      },
    )
    .then(() => {
      setModalVisible(true);
    })
    .catch((error) => {
      console.error('Erro ao enviar e-mail:', error);
    })
    .finally(() => {
      setEnviarEmail(false);
    });
  };
  

  const verificarNumero = () => {
    setConfirmarNumero(true);

    if (!tempoGeracao) {
      Alert.alert('Erro', 'O número de verificação não pôde ser gerado. Tente novamente.');
      setConfirmarNumero(false);
      return;
    }

    const momentoAtual = new Date();
    const diferencaTempo = momentoAtual - tempoGeracao;
    const minutosPassados = diferencaTempo / (1000 * 60);

    if (minutosPassados > 10) {
      Alert.alert('Erro', 'O seu número de verificação expirou.');
      gerarNumeroVerificacao();
      setConfirmarNumero(false);
      return;
    }

    const codigoDigitado = checarNumero.join('');
    if (numeroVerificacao === codigoDigitado) {
      navigation.navigate('AlterarSenha', { email: email });
    } else {
      Alert.alert('Erro', 'O número de verificação inválido. Tente novamente.');
    }

    setConfirmarNumero(false);
  };

  const habilitarLogin = () => {
    if (email && !enviarEmail && !confirmarNumero) {
      setLoginDisponivel(false);
    } else {
      setLoginDisponivel(true);
    }
  };

  const handleChangeText = (text, index) => {
    const newChecarNumero = [...checarNumero];
    newChecarNumero[index] = text;
    setChecarNumero(newChecarNumero);
    if (text && index < 5) {
      // move to next input
      const nextInput = inputRefs[index + 1];
      nextInput.focus();
    }
  };

  const inputRefs = [];

  return (
    <ImageBackground source={require('../../../assets/bg1.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Alterar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe seu email"
          value={email}
          keyboardType="email-address"
          onChangeText={(text) => {
            setEmail(text);
            habilitarLogin();
          }}
        />
        <TouchableOpacity
          style={[styles.botaoConfirmar, { backgroundColor: !email || enviarEmail || confirmarNumero ? '#A9A9A9' : '#4747D1' }]}
          onPress={gerarNumeroVerificacao}
          disabled={!email || enviarEmail || confirmarNumero}
        >
          <Text style={styles.textoBotaoConfirmar}>Confirmar</Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.botaoFechar} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={30} color="#000000" />
              </TouchableOpacity>
              <Text style={styles.modalTitulo}>Código de verificação</Text>
              <Text style={styles.modalTexto}>Por favor, entre com o código de 6 dígitos enviado ao seu e-mail.</Text>
              <View style={styles.codigoContainer}>
                {checarNumero.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={styles.codigoInput}
                    placeholder="0"
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChangeText(text, index)}
                    ref={(ref) => inputRefs[index] = ref}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={[styles.botaoConfirmar, { backgroundColor: checarNumero.includes('') || confirmarNumero ? '#A9A9A9' : '#4747D1' }]}
                onPress={verificarNumero}
                disabled={checarNumero.includes('') || confirmarNumero}
              >
                <Text style={styles.textoBotaoConfirmar}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  botaoFechar: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalTexto: {
    fontSize: 16,
    marginBottom: 15,
    marginTop: 20,
    textAlign: 'center',
  },
  botaoConfirmar: {
    backgroundColor: '#4747D1',
    width: '50%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoConfirmar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  codigoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  codigoInput: {
    width: 45,
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 3,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 28,
  },
});

export default EsqueceuSenha;