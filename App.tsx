import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, NativeModules } from "react-native";

import Welcome from "./src/screens/Welcome/Welcome";
import Cadastro from "./src/screens/Cadastro/Cadastro";
import Perfil from "./src/screens/Perfil/Perfil";
import Login from "./src/screens/Login/Login";
import Navbar from "./src/components/Navbar/Navbar";
import Home from "./src/screens/Home/Home";

import { SoundProvider } from "./src/context/SoundContext";

import Win from "./src/screens/Results/Win";
import Fail from "./src/screens/Results/Fail";

import Conteudo from "./src/screens/Conteudo/Conteudo";
import ConteudoDetalhe from "./src/screens/ConteudoDetalhe/ConteudoDetalhe";
import Teste from "./src/screens/Teste/Teste";
import NovoModulo from "./src/screens/NovoModulo/NovoModulo";
import NovoConteudo from "./src/screens/NovoConteudo/NovoConteudo";
import NovoTeste from "./src/screens/NovoTeste/NovoTeste";
import EsqueceuSenha from "./src/screens/EsqueceuSenha/EsqueceuSenha";
import AlterarSenha from "./src/screens/AlterarSenha/AlterarSenha";
import { RootStackParamList } from "./src/types/navigation";

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type ScreenComponentProps<T extends keyof RootStackParamList> = {
  navigation: RootStackNavigationProp;
  route: RouteProp<RootStackParamList, T>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const isAndroid10 = Platform.OS === "android" && Platform.Version === 29;

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: "#FFFFFF" },
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SoundProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={screenOptions}
          >
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
            <Stack.Screen name="AlterarSenha" component={AlterarSenha} />
            <Stack.Screen name="Cadastro" component={Cadastro} />

            <Stack.Screen name="Main" component={Navbar} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Perfil" component={Perfil} />

            <Stack.Screen name="Win" component={Win} />
            <Stack.Screen name="Fail" component={Fail} />

            <Stack.Screen name="Conteudo" component={Conteudo} />
            <Stack.Screen name="ConteudoDetalhe" component={ConteudoDetalhe} />
            <Stack.Screen name="Teste" component={Teste} />

            <Stack.Screen name="NovoModulo" component={NovoModulo} />
            <Stack.Screen name="NovoConteudo" component={NovoConteudo} />
            <Stack.Screen name="NovoTeste" component={NovoTeste} />
          </Stack.Navigator>
        </NavigationContainer>
      </SoundProvider>
    </GestureHandlerRootView>
  );
};

export default App;
