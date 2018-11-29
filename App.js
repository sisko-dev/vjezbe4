/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { Button } from "native-base";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      uri: '',
      karte: [],
      trenutna: null,
      rezultat: ''

    };
  }
  onPress = async () => {
    let res=null
    if(this.state.id === null){
      res = await fetch(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
    }
    if (res.status === 200) {
      const response = JSON.parse(res._bodyInit);
      this.setState({ id: response.deck_id });
      console.log(response.deck_id);
    }

   
  };


  provjeri=(karta)=>{
    if(karta === 'ACE') return 1
    if(karta === 'KING') return 13
    if(karta ==='QUEEN') return 12
    if(karta === 'JOKER') return 11 
    return karta
  }

  dohvatiKartu = async () =>{
    let res = await fetch(`https://deckofcardsapi.com/api/deck/${this.state.id}/draw/?count=1`)
    const response = JSON.parse(res._bodyInit);
    this.setState({ uri: response.cards[0].images.png });
    await this.setState({
      karte: [...this.state.karte,parseInt(this.provjeri(response.cards[0].value))]
    })
    await this.setState({trenutna:this.state.karte[this.state.karte.length - 1] })

  }

  onPressVeca=async ()=>{
    
    const {trenutna} = this.state
    console.log(this.state.trenutna)
    await this.dohvatiKartu()
    const zadnja = this.state.karte[this.state.karte.length - 1]
    console.log(zadnja)
    if (zadnja > trenutna){this.setState({rezultat: 'Pogodak'})}
    if (zadnja < trenutna){this.setState({rezultat: 'Promasaj'})}
    if (zadnja === trenutna){this.setState({rezultat: 'Jednake su '})}

    
   

  }

  onPressManja=async ()=>{
    
    const {trenutna} = this.state
    console.log(this.state.trenutna)
    await this.dohvatiKartu()
    const zadnja = this.state.karte[this.state.karte.length - 1]
    console.log(zadnja)
    if (zadnja < trenutna){this.setState({rezultat: 'Pogodak'})}
    if (zadnja > trenutna){this.setState({rezultat: 'Promasaj'})}
    if (zadnja === trenutna){this.setState({rezultat: 'Jednake su '})}

    
  }


  render() {
    return (
      <View style={styles.container}>
        <Button onPress={() => this.onPress()} style={styles.button} block>
          <Text>Dohvati spil</Text>
        </Button>
        <Button success onPress={() => this.dohvatiKartu()} style={styles.button} block>
          <Text>Dohvati kartu</Text>
        </Button>
        <View style={{marginTop: 20}}>
          <Image style={{ height: 300, width: 200 }} source={{uri: this.state.uri}} />
        </View>
        <View>
          <Button success block onPress={()=>this.onPressVeca()}><Text>Veca</Text></Button>
          <Button danger block onPress={()=>this.onPressManja()}><Text>Manja</Text></Button>
          <Text>{this.state.rezultat}</Text>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  button: {}
});
