import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, AppState, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EditModal } from "./editModal";

export function CronometroItem({ data, onDelete, reloadData }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeFinished, setTimeFinished] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
        const elapsedTime = Math.floor((currentTime - parseInt(storedStartTime)) / 1000);
        const durationInSeconds = parseInt(storedDuration) * 60;

        const remainingTime = durationInSeconds - elapsedTime;

        if (remainingTime <= 0) {
          const finishedTime = await AsyncStorage.getItem(finishedTimeKey);
          if (!finishedTime) {
            const horario = new Date();
            const formattedTime = `${horario.getHours()}:${String(horario.getMinutes()).padStart(2, "0")}`;
            setTimeFinished(formattedTime);
            await AsyncStorage.setItem(finishedTimeKey, formattedTime);
          }
        }

        setTimeLeft(remainingTime > 0 ? remainingTime : 0);
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

    startCronometro();

    const appStateListener = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        calculateTimeLeft();
      }
    });

    return () => {
      appStateListener.remove();
    };
  }, [data.minutos]);

  useEffect(() => {
    if (timeLeft === null || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o cronômetro "${data.nomeCrianca}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDelete(data.nomeCrianca),
        },
      ]
    );
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

  return (
    <>
      <TouchableOpacity style={styles.container} onLongPress={() => setModalVisible(true)}>
        <View style={styles.infoArea}>
          <Text style={styles.nome}>{data.nomeCrianca}</Text>
          <Text>Status: {data.pago ? "Pago" : "Não Pago"}</Text>
        </View>
        <View style={styles.cronometroArea}>
          <Text style={timeLeft === 0 ? styles.textRed : styles.textDefault}>
            {timeLeft === 0 ? "Finalizado" : "Tempo"}
          </Text>
          <Text style={timeLeft === 0 ? styles.tempoRed : styles.tempo}>
            {timeLeft !== null ? formatTime(timeLeft) : "Carregando..."}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <MaterialIcons name="delete-forever" size={45} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>

      <EditModal
        visible={modalVisible}
        data={data}
        onClose={() => setModalVisible(false)}
        onSave={handleEditSave}
      />
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    width: "100%",
    height: height * 0.1, 
    marginBottom: 14,
    padding: "2%",
    gap: 8,
    borderRadius: 8,
    alignSelf: "center", 
  },
  infoArea: {
    backgroundColor: "#f7f7f7",
    borderRadius: 6,
    flex: 2,
  },
  cronometroArea: {
    borderRadius: 6,
    backgroundColor: "#f7f7f7",
    flex: 1,
    padding: "3%",
    alignItems: "center",
    justifyContent: "center",
  },
  nome: {
    fontSize: width * 0.045, 
    fontWeight: "bold",
  },
  tempo: {
    fontSize: width * 0.05, 
    fontWeight: "bold",
  },
  textDefault: {
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  textRed: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "red",
  },
  tempoRed: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "red",
  },
  button: {
    backgroundColor: "#f7f7f7",
    padding: "2%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  }
});
