import AsyncStorage from '@react-native-async-storage/async-storage'; 

export interface FormData {
    nomeCrianca: string;
    nomeResponsavel: string;
    numTelefone: string;
    dataNascimento: string;
    pago: boolean;
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

  return {
    getItem,
    saveItem,
  };
};

export default useStorage;
