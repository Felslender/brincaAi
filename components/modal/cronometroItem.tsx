import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AppState,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EditModal } from "./editModal";

export function CronometroItem({ data, onDelete, reloadData }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeFinished, setTimeFinished] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [brincando, setBrincando] = useState(data.brincando);

  useEffect(() => {
    const identifier = `cronometro-${data.nomeCrianca}`;
    const startTimeKey = `${identifier}-startTime`;
    const durationKey = `${identifier}-duration`;
    const finishedTimeKey = `${identifier}-finishedTime`;

    const calculateTimeLeft = async () => {
      const storedStartTime = await AsyncStorage.getItem(startTimeKey);
      const storedDuration = await AsyncStorage.getItem(durationKey);

      if (storedStartTime && storedDuration) {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor(
          (currentTime - parseInt(storedStartTime)) / 1000
        );
        const durationInSeconds = parseInt(storedDuration) * 60;

        const remainingTime = durationInSeconds - elapsedTime;

        if (remainingTime <= 0) {
          const finishedTime = await AsyncStorage.getItem(finishedTimeKey);
          if (!finishedTime) {
            const horario = new Date();
            const formattedTime = `${horario.getHours()}:${String(
              horario.getMinutes()
            ).padStart(2, "0")}`;
            setTimeFinished(formattedTime);
            await AsyncStorage.setItem(finishedTimeKey, formattedTime);
          }
        }

        setTimeLeft(remainingTime);
      }
    };

    const startCronometro = async () => {
      const storedStartTime = await AsyncStorage.getItem(startTimeKey);
      const storedDuration = await AsyncStorage.getItem(durationKey);

      if (!storedStartTime || !storedDuration) {
        const startTime = new Date().getTime();
        await AsyncStorage.setItem(startTimeKey, startTime.toString());
        await AsyncStorage.setItem(durationKey, data.minutos.toString());

        setTimeLeft(parseInt(data.minutos) * 60);
      } else {
        await calculateTimeLeft();
      }
    };

    if (brincando) {
      startCronometro();
    }

    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active" && brincando) {
          calculateTimeLeft();
        }
      }
    );

    return () => {
      appStateListener.remove();
    };
  }, [data.minutos, brincando]);

  useEffect(() => {
    if (timeLeft === null || !brincando) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, brincando]);

  const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds);
    const minutes = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
    return seconds < 0 ? `-${formattedTime}` : formattedTime;
  };

  const handleEditSave = async (updatedData) => {
    const identifier = `cronometro-${updatedData.nomeCrianca}`;
    const startTimeKey = `${identifier}-startTime`;
    const durationKey = `${identifier}-duration`;

    if (updatedData.minutos !== data.minutos) {
      const startTime = new Date().getTime();
      await AsyncStorage.setItem(startTimeKey, startTime.toString());
      await AsyncStorage.setItem(durationKey, updatedData.minutos.toString());
      setTimeLeft(parseInt(updatedData.minutos) * 60);
    }

    const storedData = await AsyncStorage.getItem("@form");
    const parsedData = storedData ? JSON.parse(storedData) : [];
    const updatedDataArray = parsedData.map((item) =>
      item.nomeCrianca === data.nomeCrianca ? updatedData : item
    );
    await AsyncStorage.setItem("@form", JSON.stringify(updatedDataArray));

    setModalVisible(false);
    reloadData();
  };

  const handleToggleBrincando = () => {
    Alert.alert(
      "Alterar Status",
      `Deseja realmente alterar o status de "${data.nomeCrianca}" para ${
        brincando ? "Concluído" : "Brincando"
      }?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            const updatedData = { ...data, brincando: !brincando };
            setBrincando(!brincando);
            if (!updatedData.brincando) {
              setTimeLeft(null);
            }
            const storedData = await AsyncStorage.getItem("@form");
            const parsedData = storedData ? JSON.parse(storedData) : [];
            const updatedDataArray = parsedData.map((item) =>
              item.nomeCrianca === data.nomeCrianca ? updatedData : item
            );
            await AsyncStorage.setItem("@form", JSON.stringify(updatedDataArray));
            reloadData();
          },
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onLongPress={() => setModalVisible(true)}
      >
        <View style={styles.infoArea}>
          <Text style={styles.nome}>{data.nomeCrianca}</Text>
          <Text>Status: {data.pago ? "Pago" : "Não Pago"}</Text>
        </View>
        <View style={styles.cronometroArea}>
          <Text style={styles.textDefault}>
            {timeLeft <= 0 ? "Finalizado" : "Tempo"}
          </Text>
          <Text style={timeLeft < 0 ? styles.textRed : styles.textDefault}>
            {timeLeft !== null && brincando ? formatTime(timeLeft) : ""}
          </Text>
        </View>

        <TouchableOpacity
          style={brincando ? styles.brincando : styles.concluido}
          onPress={handleToggleBrincando}
        >
          <Text>{brincando ? "Brincando" : "Concluído"}</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <EditModal
        visible={modalVisible}
        data={data}
        onClose={() => setModalVisible(false)}
        onSave={handleEditSave}
        onDelete={onDelete}
      />
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: width * 0.02, 
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    width: "100%", 
    height: height * 0.1, 
    marginBottom: height * 0.02, 
    gap: width * 0.02, 
    borderRadius: width * 0.02, 
  },
  infoArea: {
    backgroundColor: "#f7f7f7",
    borderRadius: width * 0.02,
    width: "42%", 
  },
  cronometroArea: {
    borderRadius: width * 0.02,
    backgroundColor: "#f7f7f7",
    width: "30%", 
    padding: height * 0.01,
    alignItems: "center",
    justifyContent: "center",
  },
  nome: {
    fontSize: width * 0.038, 
    fontWeight: "bold",
  },
  textDefault: {
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  textRed: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "red",
  },
  brincando: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "orange",
    paddingHorizontal: width * 0.02, 
    paddingVertical: height * 0.01,
    fontWeight: "bold",
    borderRadius: width * 0.02,
  },
  concluido: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#4ac94a",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
    fontWeight: "bold",
    borderRadius: width * 0.02,
  },
});