import React, { Component } from 'react'
import { View, StyleSheet, Image} from 'react-native'
import { Button, Text, ActivityIndicator, withTheme } from 'react-native-paper'

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

class NextEventCounter extends Component {
  constructor(props){
    super(props);
    this.state = {
      eventId: 4,
      isMounted: false,
      timestamp: "",
      countdown : {},
      name: "",
    };
  }
  
  /*componentDidMount(){
    fetch('http://junk')
      .then(res => this.setState({isAuthenticated: true, isMounted: true}))
      .catch(err => this.setState({isAuthenticated: true, isMounted: true}))
  }*/
  componentDidMount(){
    this.countdown(new Date(), new Date((new Date()).getTime() + 5000));
  }

countdown = (timestamp1, timestamp2) =>{
    // Calculate the time difference in milliseconds
    const timeDiff = Math.abs(timestamp2 - timestamp1);
  
    // Convert the time difference to seconds
    let remainingTime = timeDiff / 1000;
  
    // Update the countdown timer every second
    const countdownInterval = setInterval(() => {
      // Calculate hours, minutes, and seconds from remaining time
      this.setState({
        isMounted : true,
        countdown : {
          hours : Math.floor(remainingTime / 3600),
          minutes : Math.floor((remainingTime % 3600) / 60),
          seconds : Math.floor(remainingTime % 60)
        }
      });
  
      // Decrease the remaining time by one second
      remainingTime--;
  
      // If the countdown timer reaches zero, stop the interval
      if (remainingTime < 0) {
        clearInterval(countdownInterval);
        this.props.setEventId(this.state.eventId);
      }
    }, 1000); // Update the timer every second
  }
  

  render() {
    const colors = this.props.theme.colors;
    const {countdown, isMounted } = this.state;
    const {hours, minutes, seconds} = countdown;
    return(
      <View style={{
        flex: 1,
        alignItems: 'center',
        width: '100%'
      }}>
        {isMounted == true ? (
          <>
            <Image
              style= {{height : 100, width : 100, position: 'absolute', top: 0, right: 0}}
              source={require('../assets/logo2.png')}
            />
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '80%' // Set maxWidth instead of width
            }}>
              <Text style={{...styles.titleText, color : colors.secondary}}>Your next event will start in:</Text>
              <View style={{ width: '100%', paddingVertical : '20px', alignItems : 'center'}}> {/* Set width to '100%' for TextInput container */}
              <Text style={{...styles.baseText, color: colors.dark_purple}}>{hours.toString().padStart(2, '0')} : {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
              </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent : 'center',
            width: '100%'
          }}>
            <ActivityIndicator animating={true} color={colors.primary} size={'large'}/>
          </View>
        )}
      </View>
    )
  }
};

export default withTheme(NextEventCounter)