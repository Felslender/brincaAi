import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormModal from '@/components/FormModal';
import { MaterialIcons } from '@expo/vector-icons'; // For 3-dots menu icon

interface DataItem {
  childName: string;
}

const HomeScreen: React.FC = () => {
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null); // For edit mode

  // Load data from AsyncStorage
  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('formData');
      if (data) {
        setDataList(JSON.parse(data));
      } else {
        setDataList([]);
      }
    } catch (err) {
      console.error('Erro ao carregar os dados:', err);
    }
  };

  // Save or Update Data
  const handleSave = async (formData: DataItem) => {
    try {
      let updatedList;
      if (selectedItem !== null) {
        // Edit mode: Update item at index
        updatedList = [...dataList];
        updatedList[selectedItem] = formData;
      } else {
        // Add mode: Add new item
        updatedList = [...dataList, formData];
      }
      setDataList(updatedList);
      await AsyncStorage.setItem('formData', JSON.stringify(updatedList));
      Alert.alert('Sucesso', selectedItem !== null ? 'Registro atualizado!' : 'Registro adicionado!');
      setModalVisible(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  // Delete a single item
  const deleteItem = async (index: number) => {
    try {
      const updatedList = [...dataList];
      updatedList.splice(index, 1);
      setDataList(updatedList);
      await AsyncStorage.setItem('formData', JSON.stringify(updatedList));
      Alert.alert('Sucesso', 'Registro removido com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir o registro:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditModal = (index: number) => {
    setSelectedItem(index);
    setModalVisible(true);
  };

  const renderItem = ({ item, index }: { item: DataItem; index: number }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        <Text style={styles.label}>Nome da Criança:</Text> {item.childName}
      </Text>
      <TouchableOpacity style={styles.menuButton} onPress={() => openEditModal(index)}>
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Dados</Text>
      <FlatList
        data={dataList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Button title="Adicionar Novo" onPress={() => setModalVisible(true)} />
      {modalVisible && (
        <FormModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedItem(null);
          }}
          onSubmit={handleSave}
          initialData={selectedItem !== null ? dataList[selectedItem] : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 5,
  },
});

export default HomeScreen;