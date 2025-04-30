import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Home from "../../screens/Home/Home";
import Perfil from "../../screens/Perfil/Perfil";
import Duvidas from "../../screens/Duvidas/Duvidas";
import Opcoes from "../../screens/Opcoes/Opcoes";
import CustomStatusBar from "../StatusBar/StatusBar";

const isAndroid10 = Platform.OS === "android" && Platform.Version === 29;

type TabParamList = {
  Início: undefined;
  Perfil: undefined;
  "Dúvidas e Ajuda": undefined;
  Configurações: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const Navbar: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: Platform.OS === "ios" ? 83 : 60,
            paddingBottom: Platform.OS === "ios" ? 20 : 0,
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            backgroundColor: "#fff",
          },
          tabBarActiveTintColor: "#4747D1",
          tabBarInactiveTintColor: "#c0c0c0",
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Início"
          component={Home as React.ComponentType<any>}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={Perfil as React.ComponentType<any>}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome name="user" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Dúvidas e Ajuda"
          component={Duvidas as React.ComponentType<any>}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome name="question-circle" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Configurações"
          component={Opcoes as React.ComponentType<any>}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome name="cog" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Navbar;
