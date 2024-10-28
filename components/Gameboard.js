import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Container, Row, Col } from 'react-native-flex-grid';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS, BONUS_POINTS_LIMIT, SCOREBOARD_KEY } from '../constants/Game';

import Header from "./Header";
import Footer from "./Footer";

import styles from '../style/style';
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

let board = [];

export default Gameboard = ({navigation, route}) =>  {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices.');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [dicesThrown, setDicesThrown] = useState(false);

    // Mitkä arpakuutiot ovat valittuina?
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    // Arpakuutioiden silmäluvut
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
    // Mitkä arpakuutioiden silmäluvuista on valittu pisteisiin
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(0));
    // Valittujen arpakuutioiden kokonaispistemäärä
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));

    const [playerName, setPlayerName] = useState('');
    const [scores, setScores] = useState('');
    
    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        } 
    }, []);

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
                console.log("Gameboard: Read succesful");
                console.log("Gameboard: Number of scores: " + tmpScores.length);
            }
        } catch(e) {
            console.log("Gameboard: Error: " + e);
        }
    }

    const savePlayerPoints = async () => {
        const newKey = scores.length + 1;
        const playerPoints = {
            key: newKey,
            name: playerName,
            date: 'date', // Tänne päivämäärä
            time: 'time', // Tänne kelloaika
            points: dicePointsTotal
        }
        try {
            const newScore = [...scores, playerPoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);

            //Miten resetoidaan peli ??

            
            console.log("Gameboard: Save successful: " + jsonValue);
        } catch(e) {
            console.log("Gameboard: Save error: " + e);
        }
    }



    // Luodaan arpakuutiorivi
    const dicesRow  = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        dicesRow.push(
            <Col key={"dice" + i}>
                <Pressable
                    key={"dice"+i}
                    onPress={() => chooseDice(i)}>
                    <MaterialCommunityIcons
                        name={board[i]}
                        key={"dice"+i}
                        size={50}
                        color={getDiceColor(i)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    // Tässä tehdään pisterivit sarakkeittain (Col)
    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot} style={{alignItems:'center'}}>
                <Text key={"pointsRow"+spot}>{getSpotTotal(spot)}</Text>
            </Col>
        )
    }

    // Tässä tehdään rivi, joka kertoo onko pisteet jo valittu silmäluvulle
    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable key={"buttonsRow" + diceButton}
                    onPress={() => chooseDicePoints(diceButton)}
                >
                    <MaterialCommunityIcons
                        name={"numeric-" + (diceButton + 1) + "-circle"}
                        key={"buttonsRow" + diceButton}
                        size={35}
                        color={getDicePointsColor(diceButton)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    // Valitaan noppia
    const chooseDice = (i) => {
        if(nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        } else {
            setStatus('You have to throw dices first.');
        };
    }

    //Valitaan noppapisteet
    const chooseDicePoints = (i) => {
        
        if(dicesThrown) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if(!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total +1 : total), 0);
                points[i] = nbrOfDices * (i + 1);
                setDicesThrown(false);
            } else {
                setStatus("You already selected points for " + (i + 1));
                return points[i];
            }
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);
            setNbrOfThrowsLeft(3);
            setSelectedDices([false, false, false, false, false]);
            const allPointsSelected = selectedPoints.every(point => point === true);
            if(allPointsSelected) {
                setGameEndStatus(true);
                setStatus('Game has ended, save scores!');
            }
            
            return points[i];
        }
    }

    

    //Vaihdellaan nopan väriä
    function getDiceColor(i) {    
        return selectedDices[i] ? "black" : "steelblue";
    }

    function getDicePointsColor(i) {
        return (selectedDicePoints[i] ) ? "red" : "green";
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

    const sumOfScores = dicePointsTotal.reduce((acc, curr) => acc + curr, 0);

    const throwDices = () => {
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if(!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random()*6+1);
                board[i] = 'dice-'+randomNumber;
                spots[i] = randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
        setDiceSpots(spots);
        setStatus("Select and throw dices again");
        setDicesThrown(true);
    }

    return (
        <>
            <Header />
            <View style={styles.container}>
                <Container>
                    <Row>{dicesRow}</Row>
                </Container>
                
                <Text>Throws left: {nbrOfThrowsLeft}</Text>
                <Text>{status}</Text>

                { nbrOfThrowsLeft > 0 && !gameEndStatus ? 
                    <Pressable onPress={() => throwDices()}>
                        <Button style={styles.button}>Heitä noppaa!</Button>
                    </Pressable> : <Text>No throws left!</Text>
                }
                
                <Container>
                    <Row>
                        {pointsRow}
                    </Row>
                </Container>
                <Container>
                    <Row>
                        {pointsToSelectRow}
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Text>Total score: {sumOfScores}</Text>
                    </Row>
                    <Row>
                        <Text>Bonus: {sumOfScores < 63 ? 0 : 50}</Text>
                    </Row>
                </Container>
                
                <Text style={{marginTop: 30}}>Player: {playerName} </Text>
                <Pressable onPress={() => savePlayerPoints()}>
                    
                    <Button style={styles.button} mode="elevated">Save points!</Button>
                </Pressable>
            </View>
            <Footer />
        </>
    )
}