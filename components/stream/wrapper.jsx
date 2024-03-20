import React, { Component } from 'react'
import Stream from './stream';
import { View } from 'react-native'
import { ActivityIndicator, withTheme, Text, } from 'react-native-paper'
class Wrapper extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      isMounted: false,
      isEventLive : false,
      endTime : new Date((new Date()).getTime() + 5000)
    };
  }

  componentDidMount(){
    //fetch('/api/event/event-details')
    /*this.setState({
      eventId : res.event_id,
      startTime : res.start_time,
      endTime : res.end_time,
      complianceLimit :res.compliance_limit,
      name : res.name,
    }, () =>{*/
      this.duration(this.state.endTime, () => this.props.setEventId(null))
      this.setState({isMounted : true})
    //})
  }

  duration(timestamp, callback) {
    const currentTime = new Date().getTime();
    const timeUntilExecution = timestamp.getTime() - currentTime;
  
    if (timeUntilExecution <= 0) {
      console.log(timeUntilExecution)
      callback();
    } else {
      console.log(timeUntilExecution);
      setTimeout(callback, timeUntilExecution);
    }
  }

  render() {
    const {eventId, isMounted } = this.state;
    const colors = this.props.theme.colors;
    return(
      <>
        {isMounted ? (
          <>
            <Stream eventId = {eventId} />
          </>
        ) : (
          <View style={{
            flex: 1,
            alignItems: 'center',
            width: '100%'
          }}>
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent : 'center',
              width: '100%'
            }}>
              <ActivityIndicator animating={true} color={colors.primary} size={'large'}/>
            </View>
          </View>
        )}
      </>
    );
  }
};

export default withTheme(Wrapper);