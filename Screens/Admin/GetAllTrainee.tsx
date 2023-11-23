/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-trailing-spaces */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React ,{useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import axios from 'axios';
import Colors from '../../constants/Colors';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { Card,  PaperProvider, Portal } from 'react-native-paper';




function GetAllTrainee({navigation}:any): JSX.Element {

    
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [visible, setVisible] = React.useState(false);

    const [Userid,setUserid] = useState('');
    const [Firstname,setFName] = useState('');
    const [Lastname,setLname] = useState('');
    const [Email,setEmail] = useState('');
    const [Username,setUsername] = useState('');
    const [Password,setPassword] = useState('');
    const [Phone,setPhone] = useState('');
    const [imgname,setImg] = useState('');
    const [roleid,setRoleid] = useState('');



    const showModal = (item: any) => {
        setVisible(true);
        setSelectedItem(item);

        setUserid(item.userid);
        setFName(item.firstname);
        setLname(item.lastname);
        setEmail(item.email);
        setUsername(item.username);
        setPassword(item.password);
        setPhone(item.phone);
        setImg(item.image);
        setRoleid(item.roleid);
      };

    const hideModal = () => setVisible(false);
    const [data,setData] = useState([]);

   

    useEffect(  () => {
        handelGetAll();
      },[]);


    const handelGetAll = ()=>{

    axios.get('https://d6c8-92-253-55-73.ngrok-free.app/api/User')
    .then(result=>{

        const filteredData = result.data.filter((item:any) => item.roleid === 3);
        setData(filteredData);
       // console.log('Filtered data:', filteredData);

    }).catch(err=>console.log(err));

    };

  const handelDelete = (id:any)=>{

    axios.delete(`https://d6c8-92-253-55-73.ngrok-free.app/api/User/Delete/${id}`)
    .then(res=>{
        Alert.alert('deleted');
    }).catch(err=>console.log(err));

  };



  const handelUpdate= async()=>{
    axios.put('https://d6c8-92-253-55-73.ngrok-free.app/api/User/Update',{
        "userid":Userid,
        "firstname":Firstname,
        "lastname":Lastname,
        "email":Email,
        "username":Username,
        "password":Password,
        "phone":Phone,
        "image":imgname,
        "roleid":roleid,
  
    }).then(result=>{
        Alert.alert('Update...');
        hideModal(); 
    
    }).catch(err=>{
        console.log(err);
    });
  };

  return (

    <ScrollView style={{flex:1, backgroundColor:'white'}}>
            <View style={styles.buContainer}>
              <TouchableOpacity onPress={()=> navigation.navigate('AddTrainee',{trainee:data}) } style={styles.button}>
                  <Text style={styles.buttonText}>ADD Trainee</Text>
              </TouchableOpacity>
            </View>
    {data.map((item:any, index) => (
      <View style={styles.card2} key={index}> 
        <Card  style={styles.card}>
            <Card.Content>
                <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                        <Text style={styles.label}>Name:{item.username}</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.label}>Email: {item.email}</Text>
                    </View>
                    <View style={styles.tableCell}>
                    <Text style={styles.label}>Phone Number: {item.password}</Text>
                    </View>
                    <View  style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => handelDelete(item.userid)}>
                            <Icon style={{marginRight:20,}} name="times" size={30} color="red" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => showModal(item)}>
                            <Icon name="edit" size={29} color={Colors.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Card.Content>
        </Card>
        </View>
    ))}

    {/* Modal */}
    <PaperProvider>
        <Portal>
            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>UPDATE TRAINEE</Text>
                        {selectedItem && (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="First Name"
                      value={Firstname}
                      onChangeText={firstname => setFName(firstname)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Last Name"
                      value={Lastname}
                      onChangeText={lastname => setLname(lastname)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>User Name:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="User Name"
                      value={Username}
                      onChangeText={username => setUsername(username)}
                    />
                  </View>
                </View>
                )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={hideModal} style={styles.button}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handelUpdate} style={styles.button}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Portal>
    </PaperProvider>
</ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      marginTop:15,
      marginBottom:10,
      alignItems:'flex-start',
      
    },
    card2: {
      backgroundColor: '#f0f0f0',
      borderRadius:10 ,
      marginTop:5,
      marginBottom:15,
      width:'90%',
      alignSelf: 'center', 
    },
    buContainer: {
        flexDirection: 'row',
        alignSelf: 'center', 
        alignItems: 'center', 
        paddingRight: 15, 
        paddingTop: 15,
        margin:10,
        marginBottom:15,
      },
    text: {
      marginBottom:15,
      textAlign: 'center',
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
      textInput:{
     
        height:50,
        margin:5,
        padding:10,
        borderWidth:1,
        borderRadius:10,
        borderColor:'@c0c0c0',
        paddingLeft:20,      
    },
    inputContainer: {
        marginBottom: 10,
      },
      label: {
        fontWeight: 'bold',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      button: {
        backgroundColor:Colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft:10,
        shadowColor:'#343c64',
        alignSelf:'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      card: {
        marginVertical: 5,
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    tableRow: {
        flexDirection:'column',
      
    },
    tableCell: {
        flex: 1,
        paddingHorizontal: 5,
        marginBottom:10,
    },
  });
export default GetAllTrainee;
