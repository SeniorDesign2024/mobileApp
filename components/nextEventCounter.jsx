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
  }

  render() {
    console.log(this.props.event)
    const colors = this.props.theme.colors;
    const {id : eventId, name : eventName, countdown : {hours, minutes, seconds}} = this.props.event;

    return(
      <View style={{
        flex: 1,
        alignItems: 'center',
        width: '100%'
      }}>
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
              { eventId ? (
                <>
                  <Text style={{...styles.titleText, color : colors.secondary}}>{eventName} will start in:</Text>
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
      
      </View>
    )
  }
};

export default withTheme(NextEventCounter)