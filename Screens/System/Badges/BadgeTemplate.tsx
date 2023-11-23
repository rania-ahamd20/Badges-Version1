/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';
import {
  Text,
  View,
  ScrollView,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,

} from 'react-native';

import { Card, PaperProvider, Portal } from 'react-native-paper';
import Loading from '../../../Components/Loading';


function BadgeTemplate({route}:any): JSX.Element {

    const [item,setitem] = useState(route.params.course);

    const [courseid] = useState(item.courseid);

    const [courseName] = useState(item.name);
    const [badgeid,setbadgeid] = useState('');
    const [badgeType,setType] = useState('');
    const [badgeText,setText] = useState('');
    const [badgeImage,setImage] = useState('');
    const [badgeCriteria,setCriteria] = useState('');
    const [badgeActivecriteria,setActivecriteria] = useState('');
    const [selectedBadgeTemplate,setSelectedBadgeTemplate] = useState('');

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    const [data,setData] = useState([]);
    const [BadgesData,setBadgesData] = useState<any>('');


    useEffect(  () => {
        handelGetAllBadges();
      },[]);


    const handelGetAllBadges = ()=>{

        axios.get('https://07ee-212-34-23-238.ngrok-free.app/api/Badges')
        .then(result=>{
            setBadgesData(result.data);
          //console.log("Badges.......",result.data)
        }).catch(err=>console.log(err));

        };


 const handelUpdateBadges = async()=>{
            axios.put('https://07ee-212-34-23-238.ngrok-free.app/api/Badges/Update',{
                'badgeid':badgeid,
                'type':badgeType,
                'text':badgeText,
                'image':badgeImage,
                'criteria':badgeCriteria,
                'activecriteria':badgeActivecriteria,

            }).then(result=>{

              hideModal();

              Alert.alert('Update...');
            }).catch(err=>{
                console.log(err);
            });
          };


    const showModal = (item: any) => {
        setVisible(true);

        setSelectedItem(item);
        setSelectedBadgeTemplate(item);
        setbadgeid(item.badgesid);
        setType(item.type);
        setText(courseName);
        setImage(item.image);
        setCriteria(item.criteria);
        setActivecriteria(item.activecriteria);

      };

    const hideModal = () =>{
        setVisible(false);

    };


    return (
      BadgesData ? (
        <ScrollView>

          {BadgesData.map((item: any, index:any) => {
        return (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.imageContainer}>
                <Text style={styles.text}>{item.type}</Text>
                <Card.Cover source={{ uri: item.image }} style={styles.image} />

                {selectedBadgeTemplate && (
                  <Text style={styles.courseText}>{courseName}</Text>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => showModal(item)} style={styles.button}>
                  <Text style={styles.buttonText}> Choose Template </Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        );
      })}
            {/* Modal */}
            <PaperProvider>
                <Portal>
                    <Modal visible={visible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.label}>Are You Sure Add {courseName} to Templet</Text>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={handelUpdateBadges}  style={styles.button}>
                                        <Text style={styles.buttonText}>ADD</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={hideModal}  style={styles.button}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </Portal>
            </PaperProvider>

        </ScrollView>
      ) : (
        <View>
          <Loading/>
        </View>
      )
    );
}
const styles = StyleSheet.create({
    container: {
      marginTop:15,
      marginBottom:10,
      alignItems:'flex-start',
    },
    buContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 15,
        paddingTop: 15,
      },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
      },
   text:{

    bottom: 10, // Adjust the position of the course text as needed
    color:'black',
    fontSize: 18,
    fontWeight: 'bold',
    zIndex: 1,
   },

      label: {
        fontWeight: 'bold',

      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        marginLeft:50,

      },
      button: {
        backgroundColor: '#343c64',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft:10,
        shadowColor:'#343c64',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      card: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    imageContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: 200, // Adjust the height of the image as needed
      borderRadius: 5,
    },
    badgeText: {
      position: 'absolute',
      top: 10, // Adjust the position of the badge text as needed
      left: 10, // Adjust the position of the badge text as needed
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
      zIndex: 1, // Ensure the text is above the image
    },
    courseText: {
      position: 'absolute',
      bottom: 10, // Adjust the position of the course text as needed
      right: 150, // Adjust the position of the course text as needed
      color:'black',
      fontSize: 16,
      fontWeight: 'bold',
      zIndex: 1, // Ensure the text is above the image
    },
  });

export default BadgeTemplate;
