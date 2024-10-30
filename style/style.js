import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'center',
    padding: 10,
  },
  header: {
    marginTop: 40,
    marginBottom: 15,
    backgroundColor: 'skyblue',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 20,
    backgroundColor: 'skyblue',
    flexDirection: 'row'
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  ruleTitle: {
    color: '#555555',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    margin: 5,
  },
  ruleSection: {
    color: '#555555',
    fontSize: 13,
    textAlign: 'center',
    margin: 10,
  }, 
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10,
  },
  row: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
  },
  button: {
    margin: 5,
    padding: 5,
    backgroundColor: "#599bc7",
    width: 300,
    borderRadius: 15,
  },
  textinput: {
    width: 200,
    flexDirection:'row',
    color: "#555555",
    borderColor: "black",
    margin: 10,
  },
  buttonText: {
    color:"#2B2B52",
    fontSize: 20,
  }
});