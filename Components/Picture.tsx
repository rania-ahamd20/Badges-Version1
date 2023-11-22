import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Picture = (props:any) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.banner}
        source={{ uri:'https://ik.imagekit.io/bspelc5r6/Static/background.jpg?updatedAt=1700583938411' }}
      />
      <View style={styles.profilePictureContainer}>
        <Image
          style={styles.profilePicture}
          source={{uri : props.imageuser}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 60
  },
  banner: {
    height: 200, // You can adjust the height as needed
    width: '100%',
  },
  profilePictureContainer: {
    position: 'absolute',
    top: 130, // Adjust the positioning as needed
    left: 0,
    right: 0,
    alignItems: 'center',
    borderRadius: 100
  },
  profilePicture: {
    width: 140, // Adjust the size as needed
    height: 140,
    borderRadius: 75, // Make it a circle
    
  },
});

export default Picture;
