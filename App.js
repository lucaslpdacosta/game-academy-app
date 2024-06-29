import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './src/screens/Welcome/Welcome';
import Cadastro from './src/screens/Cadastro/Cadastro';
import Perfil from './src/screens/Perfil/Perfil';
import Login from './src/screens/Login/Login';
import Navbar from './src/components/Navbar/Navbar';

import { SoundProvider } from './src/context/SoundContext';

import Win from './src/screens/Results/Win';
import Fail from './src/screens/Results/Fail';

import Conteudo from './src/screens/Conteudo/Conteudo';
import ConteudoDetalhe from './src/screens/ConteudoDetalhe/ConteudoDetalhe';
import Teste from './src/screens/Teste/Teste';
import NovoModulo from './src/screens/NovoModulo/NovoModulo';
import NovoConteudo from './src/screens/NovoConteudo/NovoConteudo';
import NovoTeste from './src/screens/NovoTeste/NovoTeste';
import EsqueceuSenha from './src/screens/EsqueceuSenha/EsqueceuSenha';
import AlterarSenha from './src/screens/AlterarSenha/AlterarSenha';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SoundProvider>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" options={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }}/>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
          <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} options={{ headerShown: false }}/>
          <Stack.Screen name="AlterarSenha" component={AlterarSenha} options={{ headerShown: false }}/>
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }}/>

          <Stack.Screen name="Main" component={Navbar} options={{ headerShown: false }}/>
          <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }}/>
          
          <Stack.Screen name="Win" component={Win} options={{ headerShown: false }}/>
          <Stack.Screen name="Fail" component={Fail} options={{ headerShown: false }}/>

          <Stack.Screen name="Conteudo" component={Conteudo} options={{ headerShown: false }}/>
          <Stack.Screen name="ConteudoDetalhe" component={ConteudoDetalhe} options={{ headerShown: false }}/>
          <Stack.Screen name="Teste" component={Teste} options={{ headerShown: false }}/>

          <Stack.Screen name="NovoModulo" component={NovoModulo} options={{ headerShown: false }}/>
          <Stack.Screen name="NovoConteudo" component={NovoConteudo} options={{ headerShown: false }}/>
          <Stack.Screen name="NovoTeste" component={NovoTeste} options={{ headerShown: false }}/>
        </Stack.Navigator>

      </NavigationContainer>
    </SoundProvider>
  );
};

export default App;