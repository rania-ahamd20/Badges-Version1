/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Colors from '../../constants/Colors';
import FontSize from '../../constants/FontSize';

const ShowBadges = ({route}: any) => {
  const createPDF = async () => {
    let options = {
      html: `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <style> body { margin: 0; padding: 0; position: relative; } .img { width: 800px; height: 700px; display: block; margin-left: auto; margin-right: auto; } .img1 { width:600px; height: 150px; display: block; margin-left: auto; margin-right: auto; position: absolute; top: 70%; left: 15%; } .text { display: block; margin-left: auto; margin-right: auto; color:white; position: absolute; top: 78%; left: 44%; } @media print { .course-label { top: 95%; /* Adjust as needed for your specific layout */ } } </style> </head> <body> <div> <img src="${route.params.image}" alt="Your Image" class="img"> <img src="https://ik.imagekit.io/bspelc5r6/Static/tape.png?updatedAt=1700860483614" class="img1" > <br> <h1 class="text" >${route.params.coursename}</h1> </div> </body> </html>`,

      fileName: `${route.params.coursename} ${route.params.username}`,
      directory: 'Documents',
    };

    let file: any = await RNHTMLtoPDF.convert(options);
    // console.log(file.filePath);
    Alert.alert(file.filePath);
  };

  return (
    <View style={{backgroundColor: 'white' , height:'100%'}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 30, textAlign: 'center' , marginTop:20}}>
        {route.params.username}
        </Text>
        
        <Text
          style={{
            fontSize: 25,
            marginTop: 10,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            {route.params.coursename} Badge { route.params.assiname != 0?route.params.assiname:''}     
        </Text>
      </View>
      <View style={{marginBottom: 50}}>
        <Image
          source={{
            uri: route.params.image,
          }}
          style={{
            width: '100%',
            height: 300,
            resizeMode: 'contain',
          }}
        />
        <Image
          source={{
            uri: 'https://ik.imagekit.io/bspelc5r6/Static/tape.png?updatedAt=1700860483614',
          }}
          style={{
            width: 300,
            height: 300,
            resizeMode: 'contain',
            position: 'absolute',
            top: '32%',
            left: '15%',
          }}
        />

        <Text
          style={{
            fontSize: FontSize.large,
            position: 'absolute',
            top: '82%',
            left: '40%',
            color: 'white',
          }}>
          {route.params.coursename}
        </Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={createPDF}>
          <Text style={styles.text}>Download Badges</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: Colors.secondary,
    margin: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
});

export default ShowBadges;
