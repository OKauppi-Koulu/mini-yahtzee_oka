import React from "react";
import styles from "../style/style";
import { Text, View } from "react-native";

export default Footer = () => {
    return (
        <View style={styles.footer}>
            <Text style={styles.author}>
                Kuka teki: Ossi Kauppi, TIK23KM
            </Text>
        </View>
    )
}