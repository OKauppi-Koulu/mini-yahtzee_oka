import React from "react";
import styles from '../style/style'
import { Text, View } from "react-native";

export default Header = () =>  {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>
                Mini-Jatsipeli
            </Text>
        </View>
    )
}