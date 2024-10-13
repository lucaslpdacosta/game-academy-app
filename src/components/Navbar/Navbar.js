import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Home from '../../screens/Home/Home';
import Perfil from '../../screens/Perfil/Perfil';
import Duvidas from '../../screens/Duvidas/Duvidas';
import Opcoes from '../../screens/Opcoes/Opcoes';

const Tab = createMaterialTopTabNavigator();

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4747D1" barStyle="light-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 10 }}>{route.name}</Text>
          ),
          tabBarIcon: ({ color, size }) => {
            let iconname;
            let iconMargin = 0;

            if (route.name === 'Início') {
              iconname = 'home';
            } else if (route.name === 'Perfil') {
              iconname = 'user';
            } else if (route.name === 'Dúvidas e Ajuda') {
              iconname = 'question-circle';
            } else if (route.name === 'Configurações') {
              iconname = 'cog';
            }

            return (
              <View style={{ alignItems: 'center' }}>
                <FontAwesome name={iconname} size={24} color={color} style={{ marginTop: iconMargin }} />
              </View>
            );
          },
          tabBarActiveTintColor: '#4747D1',
          tabBarInactiveTintColor: '#c0c0c0',
          tabBarIndicatorStyle: { backgroundColor: '#4747D1' },
          tabBarStyle: { backgroundColor: '#fff'},
          indicatorStyle: { backgroundColor: '#4747D1' },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        })}
        tabBarPosition="bottom"
      >
        <Tab.Screen name="Início" component={Home} options={{ headerShown: false }} />
        <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
        <Tab.Screen name="Dúvidas e Ajuda" component={Duvidas} options={{ headerShown: false }} />
        <Tab.Screen name="Configurações" component={Opcoes} options={{ headerShown: false }} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Navbar;
