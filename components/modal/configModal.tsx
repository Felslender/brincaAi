import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'


export function ModalConfig({handleClose}){
    
    return(
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Adicionar cronômetro</Text>
                <View style={styles.inputArea}>
                    <Text>Nome da criança</Text>
                    <TextInput style={styles.input} placeholder='Nome da criança' />
                    <Text>Nome do Responsavel</Text>
                    <TextInput style={styles.input} placeholder='Nome do responsavel' />
                    <Text>Número de telefone</Text>
                    <TextInput style={styles.input} placeholder='Número de telefone' keyboardType='numeric' />
                </View>

                <View style={styles.buttonArea}>
                    <TouchableOpacity style={styles.button} onPress={handleClose}>
                        <Text style={styles.buttonTitle}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonSave]}>
                        <Text style={styles.buttonTitleSave}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
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
        marginBottom: 60,
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
        justifyContent: "space-between"
    },
    button: {
        flex: 1,
        alignItems: "center",
        marginTop: 14,
        marginBottom: 14,
        padding: 8,
        borderRadius: 6
    },
    buttonSave: {
        backgroundColor: "#49d72d"
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: "bold"
    },
    buttonTitleSave: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF"
    }

})