import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { authFetch } from '../../utils/tokenManager';


class CameraComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraRef: null,
      intervalId: null,
      dotOpacity: new Animated.Value(1)
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });

    const intervalId = setInterval(this.captureFrame, 10_000);
    this.setState({ intervalId });

    // Start animation for flashing dot
    this.startDotAnimation();
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  captureFrame = async () => {
    try {
      const pictureData = await this.takePicture();
      console.log(this.props.eventId)
      const res = await authFetch('http://localhost:3001/api/event/process-event', { 
        method: "POST", 
        body: JSON.stringify({ event_id : this.props.eventId, image: pictureData.base64 }),
        headers: {
          'Content-Type': 'application/json'

        }
      });
      await this.deletePhoto(pictureData);
    } catch (err) {
      console.error(err);
    }
  }

  takePicture = async () => {
    if (this.state.cameraRef) {
      const options = { quality: 1, base64: true };
      return await this.state.cameraRef.takePictureAsync(options);
    }
  }

  deletePhoto = async ({ uri }) => {
    try {
      await FileSystem.deleteAsync(uri);
    } catch(err) {
      console.error("Error: Unable to delete image from memory");
    }
  }

  setCameraRef = (ref) => {
    this.setState({ cameraRef: ref });
  };

  startDotAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.dotOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(this.state.dotOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  render() {
    const { hasPermission, dotOpacity } = this.state;

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          ref={this.setCameraRef}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'red',
            opacity: dotOpacity
          }}
        />
      </View>
    );
  }

}

export default CameraComponent;
