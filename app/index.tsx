import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { ModalConfig } from "@/components/modal/configModal";
import { CronometroItem } from "@/components/modal/cronometroItem";
import useStorage from "@/hooks/useStorage";

export default function HomeScreen() {
  const [listData, setListData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalConfigVisible, setModalConfigVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const focused = useIsFocused();
  const { getItem, deleteItem } = useStorage();

  const loadList = async () => {
    const cronometros = await getItem();
    const sortedList = cronometros.sort((a, b) => {
      if (a.brincando === b.brincando) return 0;
      return a.brincando ? -1 : 1;
    });
    setListData(sortedList);
  };

  useEffect(() => {
    loadList();
  }, [focused, modalConfigVisible === false]);

  const handleDelete = async (nomeCrianca) => {
    const success = await deleteItem(nomeCrianca);
    if (success) {
      await loadList();
    } else {
      Alert.alert("Erro", "Ocorreu um problema ao excluir o item.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <View style={styles.header}>
        <Text style={styles.title}>BrincaAI</Text>
      </View>

      <View style={styles.listContainer}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 14 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await loadList();
                setRefreshing(false);
              }}
              colors={["#2F75F7"]}
            />
          }
        >
          {listData.map((item) => (
            <CronometroItem
              key={item.nomeCrianca}
              data={item}
              onDelete={() => handleDelete(item.nomeCrianca)}
              reloadData={loadList}
            />
          ))}
        </ScrollView>
      </View>
      <Modal
        visible={modalConfigVisible}
        animationType="fade"
        transparent={true}
      >
        <ModalConfig handleClose={() => setModalConfigVisible(false)} />
      </Modal>

      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalConfigVisible(true)}
        >
          <Text style={styles.buttonTitle}>Adicionar +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    width: "100%",
    height: height * 0.12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F75F7",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: width * 0.06,
    marginTop: height * 0.02,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  buttonArea: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#ededed",
    width: "100%",
    height: height * 0.1,
    borderColor: "black",
  },
  button: {
    width: "80%",
    height: height * 0.07,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#49d72d",
  },
  buttonTitle: {
    color: "#f0f2f5",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});
