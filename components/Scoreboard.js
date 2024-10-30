import React, {useState, useEffect} from "react";
import { Text, View, Pressable } from "react-native";
import { Button } from "react-native-paper";

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


    //TYhjentää mutta gameboardin tempistä tulee uus tilalle.
    const clearScoreboard = async () => {
        try {
            setScores([]);
            await AsyncStorage.clear();
            console.log("Scoreboard cleared successfully.");
        } catch (error) {
            console.error("Error clearing scoreboard: ", error);
        }
    };

    const sortedScores = scores.sort((a, b) => b.total - a.total);

    // Get the top 10 scores
    const topScores = sortedScores.slice(0, 10);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top 10 Scores</Text>
            {topScores.map((score) => (
                <><Text key={score.key} style={styles.scoreText}>
                    {score.name || 'Unnamed'}: Points {score.points}, Bonus {score.bonus}, Total {score.total}
                </Text>
                <Text>
                    {score.date} , {score.time}
                </Text>
                </>
            ))}
            <Pressable onPress={() => clearScoreboard()}>
                <Button style={styles.button} mode="elevated">Reset scores!</Button>
            </Pressable>
        </View>
    );
}