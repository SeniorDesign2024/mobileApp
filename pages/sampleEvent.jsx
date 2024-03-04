import React, { Component } from 'react'
import { View, Image} from 'react-native'
import { Button, Text, TextInput,  Modal, Portal, PaperProvider } from 'react-native-paper'
export default class SampleEvent extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      isMounted: false,
      email: "",
      password: "",
      alert : false,
      interval : 0
    };
  }
  
  componentDidMount(){
    fetch('http://localhost:3001/api/event/test',{
      headers: {'Content-Type': 'application/json'},
      credentials: "include",
    }).then(res => {
      this.setState({isAuthenticated: true, isMounted: true}, () =>{
        this.setState({interval : 0}, () => {
          const intervalId = setInterval(() => {
            this.stream(intervalId);
          }, 1000);
        })
      })
    })
    .catch(err => this.setState({isAuthenticated: true, isMounted: true}))
  }

  stream = (id) => {
    const formData = new FormData();
    formData.append('image', {
      uri: require('../assets/sparse_crowd_1.jpg'),
      type: 'image/jpeg', // Set the MIME type explicitly
      name: 'image.jpg' // Set the file name
    });

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    fetch('http://localhost:3001/api/event/process-event', requestOptions)
    .then(res => {if(this.state.error) this.setState({error : false})})
    .catch(err => {if(!this.state.error) this.setState({error : true})})
    this.setState({interval : this.state.interval+1} , () =>{
      if(this.state.interval >= 60*60) clearInterval(id);
    })
  }


  render() {
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../assets/sparse_crowd_1.jpg')}
          style={{ width: 200, resizeMode: 'contain' }}
        />
        <Text>Images sent {this.state.interval}</Text>
      </View>
    )
  }
};
