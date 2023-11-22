import * as React from 'react';
import { View , StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Loading = () => (
  <View style={styles.container}>
 

  <Spinner
        visible={true}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
        animation="fade"
        overlayColor="rgba(0, 0, 0, 0.7)"
      />

  </View>
);
const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:'50%'
  },
  text: {
    color:'red',
    fontSize:30
  }

});

export default Loading;