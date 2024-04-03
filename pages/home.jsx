import React, { Component } from 'react'
import NextEventCounter from '../components/nextEventCounter';
import VideoStream from '../components/stream/wrapper';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      isMounted: false,
      eventId : null
    };
    this.setEventId = this.setEventId.bind(this);
  }

  setEventId = (eventId) =>{
    this.setState({eventId});
  }
  test = () =>{

  }

  render() {
    const {eventId} = this.state;
    return(
      <>
        {eventId ? (
          <VideoStream setEventId={this.setEventId} eventId = {eventId}/>
        ) : (
          <NextEventCounter setEventId={this.setEventId}/>
        )}
      </>
    );
  }
};
