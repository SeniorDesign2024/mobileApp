import React, { Component } from 'react'
import { View, StyleSheet, Image} from 'react-native'
import { Button, Text, TextInput,  Modal, Portal, withTheme } from 'react-native-paper'
import { storeToken } from '../utils/tokenManager';


const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color : "black"
  },
  baseText: {
    fontSize : 20,
    color : "black"
  }
});

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      isMounted: false,
      email: "",
      password: "",
      error : false
    };
  }
  
  componentDidMount(){
    console.log(this.props);
  }

  login = async () => {
    try{
    //this.setState({alert : true})
    const res = await fetch(`http://localhost:3001/api/auth/signin`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      credentials: "include",
      body: JSON.stringify({
        "username": this.state.email,
        "password": this.state.password
      })
    })
    if(!res.ok){
      throw new Error("Bad");
    }
      await storeToken(res.token)
      this.props.navigation.replace('Home');
      //else throw new Error("Bad");
    } catch(err) {
      this.setState({error : true})
    }
  }

  render() {
    const colors = this.props.theme.colors;
    return(
      <View style={{
        flex: 1,
        alignItems: 'center',
        width: '100%'
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%' // Set maxWidth instead of width
        }}>
          <View style={{ width: '100%', paddingVertical : '20px'}}> {/* Set width to '100%' for TextInput container */}
            <Text style={{...styles.baseText, color : colors.dark_purple}}>{this.props.hello}</Text>
            <TextInput
              style={{ width: '100%' }} // Set width to '100%'
              mode = 'outlined'
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>
        </View>
      </View>
    )
  }
};

export default withTheme(Login);