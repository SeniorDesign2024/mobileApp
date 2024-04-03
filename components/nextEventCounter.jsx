import React, { Component } from 'react'
import { View, StyleSheet, Image} from 'react-native'
import { Button, Text, ActivityIndicator, withTheme } from 'react-native-paper'
import { authFetch } from '../utils/tokenManager';

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
      event_id : null,
      name : "Your event",
      isMounted: false,
      countdown : {},
    };
  }

  async componentDidMount(){
    try{
      const res = await authFetch('http://localhost:3001/api/event/next-event',{
        headers: {'Content-Type': 'application/json'}
      });
      if(res.status == 400) {
        this.setState({isMounted : true})
      }else if(!res.ok) {
        throw res.status;
      }else{
        const { name, event_id, timestamp } = await res.json();
        this.setState({event_id, timestamp, name}, () => {
          this.countdown(new Date(), new Date(this.state.timestamp));
        })
      }
    } catch(err){
      console.error(err);
      this.props.navigation.replace('Login');
    }
  }

countdown = (timestamp1, timestamp2) =>{
  
    const timeDiff = timestamp2 - timestamp1;
    let remainingTime = timeDiff / 1000;
    const countdownInterval = setInterval(() => {
      this.setState({
        countdown : {
          hours : Math.floor(remainingTime / 3600),
          minutes : Math.floor((remainingTime % 3600) / 60),
          seconds : Math.floor(remainingTime % 60)
        },
        countdownInterval,
        isMounted : true
      });
  
      remainingTime--;
      if (remainingTime < 0) {
        clearInterval(countdownInterval);
        console.log(this.state.event_id)
        this.props.setEventId(this.state.event_id);
      }
    }, 1000);
  }
  
mostRecentEvent = async () =>{
  try{
    const res = authFetch('http://localhost:3001/api/event/test',{
      headers: {'Content-Type': 'application/json'}
    });
    if(!res.ok) throw res.status;
    const body = await res.json();
    // TODO: handle no event
    this.setState({event : body, isMounted : true}, () => {
      this.countdown(new Date(), this.state.event.end_time);
    })
  } catch(err){
    // TODO implement retry loop
    this.props.navigation.replace('Login');
  }

  const countdownInterval = setInterval(() => {
    this.setState({
      countdown : {
        hours : Math.floor(remainingTime / 3600),
        minutes : Math.floor((remainingTime % 3600) / 60),
        seconds : Math.floor(remainingTime % 60)
      }
    });

    remainingTime--;
    if (remainingTime < 0) {
      clearInterval(countdownInterval);
      this.props.setEventId(this.state.eventId);
    }
  }, 1000);
}

  render() {
    const colors = this.props.theme.colors;
    const {countdown : {hours, minutes, seconds}, isMounted, name, event_id, timestamp} = this.state;

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
              { event_id ? (
                <>
                  <Text style={{...styles.titleText, color : colors.secondary}}>{name} will start in:</Text>
                  <View style={{ width: '100%', paddingVertical : '20px', alignItems : 'center'}}>
                    <Text style={{...styles.baseText, color: colors.dark_purple}}>
                      {hours.toString().padStart(2, '0')} : {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
                    </Text>
                  </View>
                </>                
              ) : (
                  <Text style={{...styles.titleText, color : colors.secondary}}>You currently have no events scheduled</Text>
              )}
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