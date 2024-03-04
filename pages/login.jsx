import React, { Component } from 'react'
import { View} from 'react-native'
import { Button, Text, TextInput,  Modal, Portal, PaperProvider } from 'react-native-paper'
export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      isMounted: false,
      email: "",
      password: "",
      alert : false
    };
  }
  
  /*componentDidMount(){
    fetch('http://junk')
      .then(res => this.setState({isAuthenticated: true, isMounted: true}))
      .catch(err => this.setState({isAuthenticated: true, isMounted: true}))
  }*/

  login = () => {
    //this.setState({alert : true})
    fetch(`http://localhost:3001/api/auth/signin`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      credentials: "include",
      body: JSON.stringify({
        "username": this.state.email,
        "password": this.state.password
      })
    }).then(res =>{
      if(res.ok) this.props.navigation.replace('Home');
      else throw new Error("Bad");
    }).catch(err => {
      console.log("error");
    })
  }

  render() {
    return(
      <View style = {{
        flex: 1,
        justifyContent: 'center',
      }}>
        <Text>Welcome back.</Text>
        <View>
          <Text>Email</Text>
          <TextInput
            onChangeText={(text) => this.setState({email : text})}
          />
        </View>
        <View>
          <Text>Password</Text>
          <TextInput
            onChangeText={(text) => this.setState({password : text})}
          />
        </View>
        <Button onPress={this.login} >
          Login
        </Button>
        <Portal>
          <Modal visible={this.state.alert} onDismiss={() => this.setState({alert : false})} >
            <Text>{this.state.email} {this.state.password}</Text>
          </Modal>
        </Portal>
      </View>
      
    )
  }
};
