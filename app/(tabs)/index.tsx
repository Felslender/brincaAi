import {useState} from 'react'
import { View, Text, FlatList, StyleSheet, Button, Alert, TouchableOpacity, Modal } from 'react-native';
import { ModalConfig } from '@/components/modal/configModal';


export default function HomeScreen() {

  const [modalConfigVisible, setModalConfigVisible] = useState(false)


  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BrincaAI</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={ () => setModalConfigVisible(true)}>
        <Text style={styles.buttonTitle}>Adicionar +</Text>
      </TouchableOpacity>

      <Modal visible={modalConfigVisible} animationType='fade' transparent={true}>
        <ModalConfig handleClose={ () => setModalConfigVisible(false) } />
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F75F7"
  },
  title: {
    color: '#FFFFFF',
    fontWeight: "bold",
    fontSize: 26
  },
  button: {
    width: "60%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#49d72d",
    bottom: 55,
    position: "absolute"
  },
  buttonTitle: {
    color: "#f0f2f5",
    fontSize: 20,
    fontWeight: "bold",
  }
});
