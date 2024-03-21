import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

// Function to encode image file to Base64
const encodeImageToBase64 = async (uri) => {
  try {
    // Read the image file using Expo FileSystem module
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Read the file content and encode it to Base64
    const fileContent = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return `data:image/jpg;base64,${fileContent}`; // Return Base64 encoding with appropriate data URL prefix
  } catch (error) {
    console.error('Error encoding image to Base64:', error);
    throw error;
  }
};

export default function Stream() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      // if(status === 'granted'){
      //   startRecording()
      // }
    })();
  }, []);

  const startRecording = async () => {
    console.log("1");
    if (cameraRef) {
      console.log("2");
      // Interval to capture frames every second
      const intervalId = setInterval(async () => {
        try {
          const { uri } = await cameraRef.takePictureAsync();
  
          // Read the image file and encode it to Base64
          const base64Image = await encodeImageToBase64(uri);
  
          // Send the captured frame in a fetch call
          const response = await fetch('http://localhost:3001/api/events/process-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Image,
              event_id: '65cc369ac82d9815657992bf',
            }),
          });
  
          // Handle response if needed
          console.log('Frame captured and sent successfully:', response);
        } catch (error) {
          console.error('Error capturing frame and sending:', error);
        }
      }, 1000); // Capture frame every second
  
      // Stop recording after a certain time (e.g., 10 seconds)
      setTimeout(() => {
        clearInterval(intervalId);
      }, 10000); // Stop after 10 seconds (adjust as needed)
    }
  };
  

  const stopRecording = async () => {
    setIsRecording(false);
    cameraRef.stopRecording();
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => {
          setCameraRef(ref)
          startRecording()
        }}
      >
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
