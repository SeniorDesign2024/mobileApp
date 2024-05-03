import React, { Component } from 'react'
import NextEventCounter from '../components/nextEventCounter';
import VideoStream from '../components/stream/wrapper';
import { authFetch } from '../utils/tokenManager';

/**
 * Home page responsible for rendering event countdown or video stream
 * @extends Component
 */
export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      event : {
        name : "",
        id : null,
        startTime : null,
        endTime : null,
        countdownInterval : null,
        streamTimeout : null, 
        active : false,
        countdown : {
          hours : 0,
          minutes : 0,
          seconds : 0
        }
      },
      eventListeningIntervalFreq : 5_000,
      eventListeningInterval : null
    };
  }

  componentDidMount(){
    this.updateEvent();
    const eventListeningInterval = setInterval(this.updateEvent, this.state.eventListeningIntervalFreq);
    this.setState({eventListeningInterval});
  }

  componentWillUnmount(){
    const {eventListeningInterval, event : {countdownInterval, streamTimeout}} = this.state;
    clearInterval(eventListeningInterval);
    clearInterval(countdownInterval);
    clearTimeout(streamTimeout);
  }


  updateEvent = async ()=>{
    try{
      let res = await authFetch('http://localhost:3001/api/event/next-event',{
        headers: {'Content-Type': 'application/json'}
      });
      console.log(res.status)
      if(res.status == 400) {
        if(this.state.event.id != null){
          this.clearEvent();
        }
        return;
      }else if(!res.ok) {
        throw res.status;
      }else{
        const { name : eventName, event_id : eventId, timestamp : startTime } = await res.json();
        if(this.state.event.id != eventId) {
          try{
            res = await authFetch('http://localhost:3001/api/event/event-details',{
              headers: {'Content-Type': 'application/json'},
              method : 'POST',
              body : JSON.stringify({eventId})
            })
            if(!res.ok) {
              throw res.status;
            }else{
              const {name, endTime, startTime} = await res.json();
              console.log(name, endTime, startTime);
              let countdownInterval = null;
              let streamTimeout = null;
              const startTimeDate = new Date(startTime);
              if(startTimeDate.getTime() > Date.now()){
                countdownInterval = this.eventCountdown(new Date(), startTimeDate);
                this.setState({
                  event : {
                    ...this.state.event,
                    active : false, 
                    countdownInterval,
                  }
                });
              } else {
                streamInterval = this.streamDuration(endTime);
                this.setState({
                  event : {
                    ...this.state.event, 
                    active : true, 
                    streamInterval
                  }
                });
              }
              this.setState(prevState => ({
                event: {
                  ...prevState.event,
                  id : eventId, 
                  name, 
                  startTime, 
                  endTime, 
                  countdownInterval, 
                  streamTimeout,
                }
              }), () => console.log(this.state))
            }
          } catch(err){
            console.error(err);
          }
        } else{
          return;
        }
      }
    }catch(err){
      console.error(err);
      return;
    }
  }

  eventCountdown = (timestamp1, timestamp2) =>{
    console.log("hello????")
    console.log(timestamp1, timestamp2)
    const timeDiff = timestamp2 - timestamp1;
    let remainingTime = timeDiff / 1000;

    const countdownInterval = setInterval(() => {
      this.setState(prevState =>({
        event : {
          ...prevState.event,
          countdown : {
            hours : Math.floor(remainingTime / 3600),
            minutes : Math.floor((remainingTime % 3600) / 60),
            seconds : Math.floor(remainingTime % 60)
          }
        }
      }));
  
      remainingTime--;
      console.log(remainingTime);
      if (remainingTime < 0) {
        clearInterval(countdownInterval);
        const {startTime, endTime} = this.state.event;
        this.streamDuration(endTime);
      }
    }, 1000);
    return countdownInterval;
  }

  streamDuration = (timestamp) =>{
    const currentTime = new Date().getTime();
    const timeUntilExecution = new Date(timestamp).getTime() - currentTime;
    if (timeUntilExecution <= 0) {
      this.clearEvent();
    } else {
      const streamTimeout = setTimeout(this.clearEvent(), timeUntilExecution);
      this.setState(prevState =>({event : {... prevState.event, streamTimeout, active : true}}))
    }
  }

  clearEvent =()=>{
    const {countdownInterval, streamTimeout} = this.state.event;
    clearInterval(countdownInterval);
    clearTimeout(streamTimeout);
    this.setState({
      event : {
        name : "",
        id : null,
        startTime : null,
        endTime : null,
        active : false,
        countdownInterval : null,
        streamTimeout : null,
        countdown : {
          hours : 0,
          minutes : 0,
          seconds : 0
        }
      }
    });
  }

  render() {
    const {event} = this.state;
    return(
      <>
        {event.active ? (
          <VideoStream event = {event}/>
        ) : (
          <NextEventCounter event = {event}/>
        )}
      </>
    );
  }
};
