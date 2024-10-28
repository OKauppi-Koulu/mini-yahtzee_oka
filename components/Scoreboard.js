import React, {useState, useEffect} from "react";
import { Text, View } from "react-native";

import Header from "./Header";
import Footer from "./Footer";

import { SCOREBOARD_KEY } from "../constants/Game";
import styles from '../style/style';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default Scoreboard = ({ navigation }) =>  {

    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        })
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if(jsonValue !== null) {
                const tmpScores = JSON.parse(jsonValue);
                
                //Tähän väliin lajittelu pistemäärän mukaan
                setScores(tmpScores);
                console.log("Scoreboard: Read successful");
                console.log("Scoreboard: Number of scores: " + tmpScores.length);
            }
        } catch(e) {
            console.log("Error: " + e);
        }
    }

    const clearScoreboard = async () => {
        try {
            await AsyncStorage.removeItem(SCOREBOARD_KEY);
            setScores([]);
        } catch(e) {
            console.log("Clear error: " + e);
        }
    }

    return (
        <>
            <Header />
            <View>
                <Text>
                    Scoreboard
                </Text>
            </View>
            <Footer />
        </>
    )
}