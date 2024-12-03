import {View, Text, StyleSheet} from 'react-native'

export default function HomeScreen() {
  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BrincaAI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
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
    fontSize: 23
  }
});
