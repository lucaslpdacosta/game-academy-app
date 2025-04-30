import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Share,
  BackHandler,
} from "react-native";
import { useSound } from "../../context/SoundContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Win">;

const Win: React.FC<Props> = ({ navigation }) => {
  const { playSound } = useSound();

  useEffect(() => {
    const playWinSound = async () => {
      await playSound(require("../../../src/sfx/win.wav"));
    };
    playWinSound();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const handleButtonPress = (): void => {
    navigation.navigate("Main");
  };

  const handleSharePress = async (): Promise<void> => {
    try {
      const shareOptions = {
        title: "Título",
        message:
          "Acabei de ganhar algumas estrelas no Game/Academy! Baixe o app e teste você também! <link aqui>",
        subject: "subject",
      };

      await Share.share(shareOptions);
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.shareIconContainer}>
        <TouchableOpacity onPress={handleSharePress}>
          <Icon name="share" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <Image
        source={require("../../../assets/congratulations.png")}
        style={styles.image}
      />
      <Text style={styles.text}>
        Você ganhou algumas estrelas pela vitória. Aproveite!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>OK!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  shareIconContainer: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  image: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    bottom: 120,
  },
  button: {
    backgroundColor: "#4747D1",
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Win;
