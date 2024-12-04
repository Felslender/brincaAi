import React from 'react'
import {View, Text, StyleSheet, Pressable} from 'react-native'
import { FormData } from '@/hooks/useStorage'

export function CronometroItem({data}){

    return (
        <View style={styles.container}>
            <View style={styles.infoArea}>
                <Text style={styles.nome}>{data.nomeCrianca}</Text>
                <Text>Status:</Text>
            </View>
            <View style={styles.cronometroArea}>
                <Text style={styles.tempo}>15:00</Text>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 7,
        flexDirection: "row",
        backgroundColor: "#e0e0e0",
        width: "85%",
        height: 90,
        marginBottom: 14,
        gap: 16,
        borderRadius: 8
    },
    title: {
        color: "red"
    },
    infoArea: {
        backgroundColor: "#f7f7f7",
        borderRadius: 6,
        gap: 5,
        width: 200,
        padding: 5,
    },
    cronometroArea: {
        borderRadius: 6,
        backgroundColor: "#f7f7f7",
        width: 105,
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    nome: {
        fontSize: 16,
        fontWeight: "bold",

    },
    tempo: {
        fontSize: 18,
        fontWeight: "bold",
    }

})