import React, { Component } from 'react'
import { View} from 'react-native'
import { Button, Text, TextInput,  Modal, Portal, PaperProvider } from 'react-native-paper'
export default class Home extends Component {
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
  
  componentDidMount(){
    fetch('http://junk')
      .then(res => this.setState({isAuthenticated: true, isMounted: true}))
      .catch(err => this.setState({isAuthenticated: true, isMounted: true}))
  }
  

  render() {
    return(
      <View style = {{
        flex: 1,
        justifyContent: 'center',
      }}>
        <Button onPress={() => this.props.navigation.replace('Sample-Event')}>Sample Event</Button>
        <Button onPress={() => this.props.navigation.replace('Event')}>Real Event</Button>
      </View>
    )
  }
};
