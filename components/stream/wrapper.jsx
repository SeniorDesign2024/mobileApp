import React, { Component } from 'react'
import Stream from './stream';
import { View } from 'react-native'
import { ActivityIndicator, withTheme, Text, } from 'react-native-paper'
import { authFetch } from '../../utils/tokenManager';

/**
 * Stream Wrappe responsible for rendering rendering stream and ensuring page is loaded before rendering
 * @extends Component
 */
class Wrapper extends Component {

  constructor(props){
    super(props);
    this.state = {
      isMounted: true,
    };
  }


  render() {
    const {isMounted } = this.state;
    const colors = this.props.theme.colors;
    return(
      <>
        {isMounted ? (
          <>
            <Stream eventId = {this.props.event.id} />
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