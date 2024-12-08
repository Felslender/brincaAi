import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert } from "react-native";
import useStorage from "@/hooks/useStorage";
import { FormData } from "@/hooks/useStorage";

export function ModalConfig( {handleClose} ) {
  const [formData, setFormData] = useState<FormData>({
    nomeCrianca: "",
    nomeResponsavel: "",
    numTelefone: "",
    dataNascimento: "",
    pago: false,
    minutos: "",
  });

  const {saveItem, getItem} = useStorage()

  const handleInputChange = (field, values) => {
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const handleDateChange = (text: string) => {
    const formattedText = text
      .replace(/[^0-9]/g, "")
      .replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    handleInputChange("dataNascimento", formattedText.slice(0, 10));
  };

  async function handleSave() {
    const cronometros = await getItem(); 
  
    const existe = cronometros.some(item => item.nomeCrianca === formData.nomeCrianca);
  
    if (existe) {
      Alert.alert(
        "Erro",
        `Já existe um cronômetro com o nome "${formData.nomeCrianca}". Por favor, escolha outro nome.`
      );
      return; 
    }
    await saveItem(formData);
    console.log(await getItem());
  
    handleClose(); 
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Adicionar cronômetro</Text>
        <View style={styles.inputArea}>
          <Text>Nome da Criança</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da criança"
            value={formData.nomeCrianca}
            onChangeText={(text) => handleInputChange("nomeCrianca", text)}
          />
          <Text>Nome do Responsavel</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do responsável"
            value={formData.nomeResponsavel}
            onChangeText={(text) => handleInputChange("nomeResponsavel", text)}
          />
          <Text>Número de Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de telefone"
            keyboardType="numeric"
            value={formData.numTelefone}
            onChangeText={(text) => handleInputChange("numTelefone", text)}
          />
          <Text>Pago:</Text>
          <View style={styles.switchArea}>
          <Switch style={styles.switch}
            value={formData.pago}
            onValueChange={(value) => handleInputChange("pago", value)}
          />
          </View>
          <Text>Minutos</Text>
          <TextInput
            style={styles.input}
            placeholder="Minutos"
            keyboardType="numeric"
            value={formData.minutos}
            onChangeText={(text) => handleInputChange("minutos", text)}
          />
        </View>
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonTitle}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
            <Text style={styles.buttonTitleSave}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(24,24,24,0.6)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "90%",
    padding: 24,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f6f3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  inputArea: {
    gap: 12,
    width: "100%",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingLeft: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonArea: {
    width: "90%",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    alignItems: "center",
    marginTop: 14,
    marginBottom: 14,
    padding: 8,
    borderRadius: 6,
  },
  buttonSave: {
    backgroundColor: "#49d72d",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTitleSave: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  switchArea: {
    flexDirection: "row"
  },
  switch: {
    
  }
});
