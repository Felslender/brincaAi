import { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialData: FormData | null;
}

interface FormData {
  childName: string;
  guardianName: string;
  phone: string;
  birthDate: string;
  startDate: string;
  duration: string;
}

const FormModal: React.FC<FormModalProps> = ({ visible, onClose, onSubmit, initialData }) => {
  const [childName, setChildName] = useState<string>('');
  const [guardianName, setGuardianName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setChildName(initialData.childName);
      setGuardianName(initialData.guardianName);
      setPhone(initialData.phone);
      setBirthDate(initialData.birthDate);
      setStartDate(initialData.startDate);
      setDuration(initialData.duration);
    } else {
      setChildName('');
      setGuardianName('');
      setPhone('');
      setBirthDate('');
      setStartDate('');
      setDuration('');
    }
  }, [initialData]);

  const handleSave = () => {
    const formData: FormData = {
      childName,
      guardianName,
      phone,
      birthDate,
      startDate,
      duration,
    };
    onSubmit(formData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{initialData ? 'Editar Registro' : 'Novo Registro'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da Criança"
            value={childName}
            onChangeText={setChildName}
          />
          <TextInput
            style={styles.input}
            placeholder="Nome do Responsável"
            value={guardianName}
            onChangeText={setGuardianName}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Data de Nascimento"
            value={birthDate}
            onChangeText={setBirthDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Data de Início"
            value={startDate}
            onChangeText={setStartDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Duração"
            value={duration}
            onChangeText={setDuration}
          />
          <Button title="Salvar" onPress={handleSave} />
          <Button title="Cancelar" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default FormModal;