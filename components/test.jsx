import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class TestComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      isMounted : false
    };
  }

  componentDidMount(){
    fetch('http://localhost:3001/api/event/test')
    .then(res=> {
      if(!res.ok) this.setState({message : "Failed to connect", isMounted : true})
      return res.json();
    }).then(res =>{
      this.setState({message : res.message, isMounted : true})
    }).catch(err => {
      this.setState({message : err.message, isMounted : true})
    })
  }

  render() {
    const {isMounted, message} = this.state;
    return (
      <View>
        <Text>{isMounted ? message : "Loading..."}</Text>
      </View>
    );
  }
}