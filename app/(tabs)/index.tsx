import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ModalConfig } from "@/components/modal/configModal";
import { CronometroItem } from "@/components/modal/cronometroItem";
import useStorage from "@/hooks/useStorage";

export default function HomeScreen() {
  const [listData, setListData] = useState([]);
  const [modalConfigVisible, setModalConfigVisible] = useState(false);
  const focused = useIsFocused();
  const { getItem, deleteItem } = useStorage();

  const loadList = async () => {
    const cronometros = await getItem();
    setListData(cronometros);
  };

  useEffect(() => {
    loadList();
  }, [focused, modalConfigVisible === false]);

  const handleDelete = async (nomeCrianca) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o cronômetro de ${nomeCrianca}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const success = await deleteItem(nomeCrianca);
            if (success) {
              await loadList(); 
            } else {
              Alert.alert("Erro", "Ocorreu um problema ao excluir o item.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BrincaAI</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          style={{ paddingLeft: 14, paddingTop: 14 }}
          data={listData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <CronometroItem data={item} onDelete={() => handleDelete(item.nomeCrianca)} />
          )}
        />
      </View>

      <Modal visible={modalConfigVisible} animationType="fade" transparent={true}>
        <ModalConfig handleClose={() => setModalConfigVisible(false)} />
      </Modal>

      <TouchableOpacity style={styles.button} onPress={() => setModalConfigVisible(true)}>
        <Text style={styles.buttonTitle}>Adicionar +</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F75F7",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 26,
  },
  listContainer: {
    flex: 1,
  },
  button: {
    marginLeft: "20%",
    width: "60%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#49d72d",
    bottom: 50,
    position: "absolute",
  },
  buttonTitle: {
    color: "#f0f2f5",
    fontSize: 20,
    fontWeight: "bold",
  },
});
