import React, {useState, useEffect} from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";

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
                
                setScores(tmpScores);
                console.log("Scoreboard: Read successful");
                console.log("Scoreboard: Number of scores: " + tmpScores.length);
            }
        } catch(e) {
            console.log("Error: " + e);
        }
    }
    
    const sortedScores = scores.sort((a, b) => b.total - a.total);

    // Get the top 10 scores
    const topScores = sortedScores.slice(0, 10);

    //Tätä en saanut toimimaan..
    const clearScoreboard = async () => {
        try {
            setScores([]);
            await AsyncStorage.removeItem(SCOREBOARD_KEY);
            console.log(`All data under key "${SCOREBOARD_KEY}" has been removed.`);
          } catch (error) {
            console.error(`Failed to remove data for key "${SCOREBOARD_KEY}":`, error);
          }
    };

    return (
        <>
        <Header />
        <View style={styles.container}>
            <Text style={styles.scoreHeader}>Top 10 Scores</Text>
            <ScrollView>
            
            {topScores.map((score, index) => (
                <Card style={styles.scores} key={score.key}>
                    <Text style={[styles.scoreRow1,{fontWeight: "bold"}]}>{index+1}   -   {score.name || 'Unnamed'}    {score.total} Points.</Text>
                    <Text style={styles.scoreRow1}>
                        Points {score.points} - Bonus {score.bonus}
                    </Text>
                    <Text style={styles.scoreRow2}>
                        Played at:   {score.date} , {score.time}
                    </Text>
                </Card>
            ))}
            </ScrollView>
             {/* <Pressable onPress={() => clearScoreboard()}>
                <Button style={styles.button} mode="elevated">Reset scores!</Button>
                </Pressable> */} 
        </View>
        <Footer />
        </>
    );
}