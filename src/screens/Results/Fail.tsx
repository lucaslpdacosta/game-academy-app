import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useSound } from "../../context/SoundContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Fail">;

const Fail: React.FC<Props> = ({ navigation }) => {
  const { playSound } = useSound();

  useEffect(() => {
    const playFailSound = async () => {
      await playSound(require("../../../src/sfx/gameover.mp3"));
    };
    playFailSound();

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

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/fail.jpeg")}
        style={styles.image}
      />
      <Text style={styles.text}>
        Oops... não foi desta vez. Mas você pode tentar novamente!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Continuar</Text>
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
  image: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    bottom: 70,
    width: "80%",
  },
  button: {
    backgroundColor: "#4747D1",
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Fail;
