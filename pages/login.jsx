import React, { Component } from 'react'
import { View, StyleSheet, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform} from 'react-native'
import { Button, Text, TextInput, withTheme, Snackbar } from 'react-native-paper'
import { storeToken } from '../utils/tokenManager';

// The mobile app requires different views when rendered in the web
const config = {
  device : 'web' // enum : ['web', 'mobile']
}

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

/**
 * Login Page
 * @extends Component
 */

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      isMounted: false,
      username: "",
      password: "",
      loading : false,
      error : false
    };
  }
  
/**
 * Handles user authentication by sending a request to the server.
 * @async
 * @function login
 * @memberof Login
 * @returns {void}
 */
  login = async () => {
    const {username, password} = this.state;
    if(!username) {
      this.setState({error : "Must enter a username"})
      return this.setState({loading : false});
    } 
    if(!password){
      this.setState({error : "Must enter a password"})
      return this.setState({loading : false});
    }

    try{
      const res = await fetch(`http://localhost:3001/api/auth/signin`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "username": this.state.username,
          "password": this.state.password
        })
      })
      if(!res.ok){
        throw new Error("Unable to login");
      }
      const {accessToken} = await res.json();
      
      await storeToken(accessToken); // <- stores session token
      this.props.navigation.replace('Home');
    } catch(err) {
      //console.error(err);
      this.setState({error : "Incorrect username or password"});
    }
    this.setState({loading : false})
  }

  render() {
    const colors = this.props.theme.colors;
    const {error} = this.state;
    
    const WrapperComponent = config.device == "web" ? View : TouchableWithoutFeedback;
    return(
      <WrapperComponent onPress={config.device !== 'web' ? Keyboard.dismiss : null}>
        <KeyboardAvoidingView style={{
          flex: 1,
          alignItems: 'center',
          width: '100%'
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '80%'
          }}>
            <Image
              style= {{height : 250, width : 250}}
              source={require('../assets/logo2.png')}
            />
            <Text style={{...styles.titleText, color : colors.secondary}}>Sign In</Text>
            <View style={{ width: '100%', paddingVertical : 15 }}> 
              <Text style={{...styles.baseText, color : colors.dark_purple}}>Username</Text>
              <TextInput
                style={{ width: '100%' }}
                mode = 'outlined'
                onChangeText={(text) => this.setState({ username: text })}
              />
            </View>
            <View style={{ width: '100%', paddingVertical : 15}}>
              <Text style={{...styles.baseText, color : colors.dark_purple}}>Password</Text>
              <TextInput
                style={{ width: '100%' }}
                mode = 'outlined'
                onChangeText={(text) => this.setState({ password: text })}
              />
            </View>
            <View style = {{marginTop: 20, marginBottom : 50}}>
              <Button textColor = {colors.light_purple} buttonColor = {colors.primary} loading = {this.state.loading} onPress={() => this.setState({loading : true}, () => this.login())} mode="outlined">
                Login
              </Button>
            </View>
            <Snackbar
              visible={error}
              onDismiss={() => this.setState({error : ""})}
              duration={5000}
              style={{ backgroundColor: 'red', alignItems: 'center' }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>{error}</Text>
            </Snackbar>
          </View>
        </KeyboardAvoidingView>
      </WrapperComponent>
    )
  }
};

export default withTheme(Login);