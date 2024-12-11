import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Alert } from 'react-native';

export interface FormData {
    nomeCrianca: string;
    nomeResponsavel: string;
    numTelefone: string;
    dataNascimento: string;
    pago: boolean;
    brincando: boolean;
    minutos: string;
}

const useStorage = () => {
  const getItem = async () => {
    try {
      const cronometros = await AsyncStorage.getItem('@form');
      return cronometros ? JSON.parse(cronometros) : [];
    } catch (error) {
      console.log("erro ao buscar", error);
      return [];
    }
  };

  const saveItem = async (newData: FormData) => {
    try {
      const dados = await getItem();
      dados.push(newData);

      await AsyncStorage.setItem('@form', JSON.stringify(dados));

    } catch (error) {
      console.log("erro ao salvar", error);
      return [];
    }
  };

  const deleteItem = async (nomeCrianca: string) => {
    try {
        const dados = await getItem();

        const updatedDados = dados.filter(item => item.nomeCrianca !== nomeCrianca);
        await AsyncStorage.setItem('@form', JSON.stringify(updatedDados));

        const identifier = `cronometro-${nomeCrianca}`;

        const keysToRemove = [
            `${identifier}-startTime`,
            `${identifier}-duration`,
            `${identifier}-finishedTime`,
        ];

        await AsyncStorage.multiRemove(keysToRemove);
  
        return true;
    } catch (error) {
        console.log("Erro ao excluir", error);
        return false;
    }
};


  return {
    getItem,
    saveItem,
    deleteItem
  };
};

export default useStorage;
