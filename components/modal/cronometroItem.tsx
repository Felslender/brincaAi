import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function CronometroItem({ data }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const startCronometro = async () => {
      const identifier = `cronometro-${data.nomeCrianca}`;
      const startTimeKey = `${identifier}-startTime`;
      const durationKey = `${identifier}-duration`;

      const storedStartTime = await AsyncStorage.getItem(startTimeKey);
      const storedDuration = await AsyncStorage.getItem(durationKey);

      if (!storedStartTime || !storedDuration) {
        const startTime = new Date().getTime();
        await AsyncStorage.setItem(startTimeKey, startTime.toString());
        await AsyncStorage.setItem(durationKey, data.minutos.toString());
        setTimeLeft(data.minutos * 60);
      } else {
        
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - parseInt(storedStartTime)) / 1000);
        const durationInSeconds = parseInt(storedDuration) * 60;

        const remainingTime = durationInSeconds - elapsedTime;
        setTimeLeft(remainingTime > 0 ? remainingTime : 0);
      }
    };

    startCronometro();
  }, [data]);

  useEffect(() => {
    if (timeLeft === 0) return; 

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

  return (
    <View style={styles.container}>
      <View style={styles.infoArea}>
        <Text style={styles.nome}>{data.nomeCrianca}</Text>
        <Text>Status: {data.pago ? "Pago" : "Não Pago"}</Text>
      </View>
      <View style={styles.cronometroArea}>
        <Text style={timeLeft === 0 ? styles.textRed : styles.textDefault}>Tempo</Text>
        <Text style={timeLeft === 0 ? styles.tempoRed : styles.tempo}>
          {timeLeft !== null ? formatTime(timeLeft) : "Carregando..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 7,
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    width: "85%",
    height: 90,
    marginBottom: 14,
    gap: 16,
    borderRadius: 8,
  },
  infoArea: {
    backgroundColor: "#f7f7f7",
    borderRadius: 6,
    gap: 5,
    width: 200,
    padding: 5,
  },
  cronometroArea: {
    borderRadius: 6,
    backgroundColor: "#f7f7f7",
    width: 105,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tempo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textDefault: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textRed: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  tempoRed: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
});
