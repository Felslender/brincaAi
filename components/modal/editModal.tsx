import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import useStorage from "@/hooks/useStorage";

export function EditModal({ visible, data, onClose, onSave }) {
  const [editData, setEditData] = useState({ ...data });
  const { getItem } = useStorage();

  useEffect(() => {
    if (visible) {
      setEditData({ ...data });
      console.log("EditModal is visible:", visible);
      console.log("Current data:", data);
    }
  }, [visible]);

  const handleSave = async () => {
    const existingItems = await getItem();

    const isDuplicate = existingItems.some(
      (item) => item.nomeCrianca === editData.nomeCrianca && item.nomeCrianca !== data.nomeCrianca
    );

    if (isDuplicate) {
      Alert.alert("Erro", "Já existe um cronômetro com esse nome. Escolha outro nome.");
      return;
    }

    if (editData.nomeCrianca !== data.nomeCrianca) {
      const identifierOld = `cronometro-${data.nomeCrianca}`;
      const keysToRemove = [
        `${identifierOld}-startTime`,
        `${identifierOld}-duration`,
        `${identifierOld}-finishedTime`,
      ];

      await AsyncStorage.multiRemove(keysToRemove);
    }

    onSave(editData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Editar Cronômetro</Text>
        <TextInput
          style={styles.input}
          value={editData.nomeCrianca}
          onChangeText={(text) => setEditData({ ...editData, nomeCrianca: text })}
          placeholder="Nome da Criança"
        />
        <TextInput
          style={styles.input}
          value={editData.nomeResponsavel || ""}
          onChangeText={(text) => setEditData({ ...editData, nomeResponsavel: text })}
          placeholder="Responsável"
        />
        <TextInput
          style={styles.input}
          value={editData.numTelefone || ""}
          onChangeText={(text) => setEditData({ ...editData, numTelefone: text })}
          placeholder="Telefone"
        />
        <TextInput
          style={styles.input}
          value={editData.minutos || ""}
          onChangeText={(text) => setEditData({ ...editData, minutos: text })}
          placeholder="Minutos"
          keyboardType="numeric"
        />
        <View style={styles.modalButtons}>
          <Button title="Salvar" onPress={handleSave} />
          <Button title="Cancelar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
});
