import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, View, Text, StyleSheet, TextInput, Button, Switch, Alert, Dimensions, TouchableOpacity } from "react-native";
import useStorage from "@/hooks/useStorage";

export function EditModal({ visible, data, onClose, onSave, onDelete }) {
  const [editData, setEditData] = useState({ ...data });
  const { getItem } = useStorage();

  useEffect(() => {
    if (visible) {
      setEditData({ ...data });
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

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o cronômetro "${data.nomeCrianca}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            onDelete(data.nomeCrianca);
            onClose();
          },
        },
      ]
    );
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
        <View style={styles.switchArea}>
          <Text style={styles.titleSwitch}>Pago:</Text>
          <Switch
            value={editData.pago}
            onValueChange={(value) => setEditData({ ...editData, pago: value })}
          />
        </View>
        <TextInput
          style={styles.input}
          value={editData.minutos || ""}
          onChangeText={(text) => setEditData({ ...editData, minutos: text })}
          placeholder="Minutos"
          keyboardType="numeric"
        />
        <View style={styles.modalButtons}>

          <TouchableOpacity style={styles.buttonGreen} onPress={handleSave}>
            <Text style={styles.title}>Salvar</Text>
          </TouchableOpacity >

          <TouchableOpacity style={styles.buttonRed} onPress={handleDelete}>
            <Text  style={styles.title}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity  style={styles.buttonCancel} onPress={onClose} >
            <Text style={styles.title}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalTitle: {
    fontSize: width * 0.06, 
    color: "#fff",
    marginBottom: 10,
  },
  input: {
    width: "90%", 
    height: height * 0.06, 
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: width * 0.045, 
  },
  modalButtons: {
    justifyContent: "space-around",
    width: "75%",
    marginTop: 10,
    gap: 10
  },
  title: {
    color: "#edf2ed",
    fontWeight: "bold",
  },
  buttonRed: {
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "red"
  },
  buttonGreen:{
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#4ac94a"
  },
  buttonCancel: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#0fbdfa"
  },
  switchArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%", 
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
    marginBottom: 10,
  },
  switch: {
    marginLeft: 10,
  },
  titleSwitch: {
    fontSize: width * 0.045, 
    color: "black",
  },
});
