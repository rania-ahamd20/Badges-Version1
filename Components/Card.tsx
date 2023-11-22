import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Image, TouchableOpacity ,Button} from 'react-native';
import { Card  } from 'react-native-paper';
import Colors from '../constants/Colors';
import FontSize from '../constants/FontSize';
import Spacing from '../constants/Spacing';



const Cards = (props:any) => {

  


  return (
    <ScrollView style={styles.container}>
      {/* Vertical Scroll View */}
      <View style={styles.section}>
        <Image source={require('../Assets/images/study.png')} style = {[styles.image,styles.center]}></Image>
   
        
          {props.coursesSec.map((Citem :any , index1 :any) => (
            <ScrollView key={index1} >
              <View style={{flexDirection:'row', justifyContent: 'space-between'
               , marginTop:20 , marginBottom:10}}>
              <Text style={styles.sectionTitle}>{Citem.name}</Text>
              <Button title="Manage Secions" color={Colors.secondary}
               onPress={()=>props.navigation.navigate('ManageSections',{courses : props.courses , coursenum : Citem.coursenum })}/>
              </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
              
                {props.courses
                  .filter((c: any) => c.coursenum === Citem.coursenum)
                  .map((item :any , index:any) => 
                    
                    (
                    
                  <View key={index} style = {styles.center}>
                    <Card  style={styles.card} >
                  <Card.Cover source={{ uri: item.image }}/>      
                  <Card.Content>
                      <Text style={styles.title}>{item.name} - Sec {item.sectionnum}</Text>
                      <Text style={styles.Details}>CourseNum : {item.coursenum}</Text>
                  </Card.Content>
                  <Card.Actions>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>props.navigation.navigate('CourseDetails' , {course: item})}>

                    <Text style={styles.buttonText}>Details</Text>
                    </TouchableOpacity>

                  </Card.Actions>
                  </Card>
                  </View>
                  
                ))}


            </ScrollView>
            </ScrollView>
          ))}
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {    
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  TitlePage: {
    fontSize: FontSize.xLarge,
    fontWeight: 'bold',
    marginBottom: Spacing * 2,
    color:Colors.active ,
    textAlign:'center'
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    marginBottom: 8,
    color:Colors.primary
  },
  title: {
    fontSize: FontSize.medium * 1.15,
    fontWeight: 'bold',
    color:Colors.primary, textAlign:'left', 
    marginTop:15
  },
  Details:{
    fontSize: FontSize.medium ,
    color:Colors.gray, textAlign:'left', 
    marginTop:15
},
  card: {
    width:310 ,margin:20 ,
     color:Colors.onPrimary,
    backgroundColor:Colors.onPrimary
} ,
image : {
  width: '80%',
  height: 250,
  resizeMode: 'contain',
  marginBottom: 20
},
center : {
  marginLeft:'auto',
  marginRight:'auto'
},
button: {
  borderWidth: 2, // Adjust the border width as needed
  borderColor: Colors.secondary, // Set the default border color here
  padding: 8,
  borderRadius: 15,
  alignItems: 'center',
  marginRight:5
},
buttonText: {
  fontSize: FontSize.medium,
  color: Colors.secondary, // Set the text color to match the border color
}
});

export default Cards;