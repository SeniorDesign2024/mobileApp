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
      loading : false
    };
  }
  
  /*componentDidMount(){
    fetch('http://junk')
      .then(res => this.setState({isAuthenticated: true, isMounted: true}))
      .catch(err => this.setState({isAuthenticated: true, isMounted: true}))
  }*/

  login = async () => {
    try{
    //this.setState({alert : true})
    const res = await fetch(`http://localhost:3001/api/auth/signin`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "username": this.state.email,
        "password": this.state.password
      })
    })
    if(!res.ok){
      throw new Error("Bad");
    }
      const body = await res.json();
      await storeToken(body.accessToken);
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
          <Image
            style= {{height : 250, width : 250}}
            source={require('../assets/logo2.png')}
          />
          <Text style={{...styles.titleText, color : colors.secondary}}>Sign In</Text>
          <View style={{ width: '100%', paddingVertical : '20px' }}> {/* Set width to '100%' for TextInput container */}
            <Text style={{...styles.baseText, color : colors.dark_purple}}>Username</Text>
            <TextInput
              style={{ width: '100%' }} // Set width to '100%'
              mode = 'outlined'
              onChangeText={(text) => this.setState({ email: text })}
            />
          </View>
          <View style={{ width: '100%', paddingVertical : '20px'}}> {/* Set width to '100%' for TextInput container */}
            <Text style={{...styles.baseText, color : colors.dark_purple}}>Password</Text>
            <TextInput
              style={{ width: '100%' }} // Set width to '100%'
              mode = 'outlined'
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>
          <Button textColor = {colors.light_purple} buttonColor = {colors.primary} loading = {this.state.loading} onPress={() => this.setState({loading : true}, () => this.login())} mode="outlined">
            Login
          </Button>
          <Portal>
            <Modal visible={this.state.alert} onDismiss={() => this.setState({ alert: false })}>
              <Text>{this.state.email} {this.state.password}</Text>
            </Modal>
          </Portal>
        </View>
      </View>
    )
  }
};

export default withTheme(Login)