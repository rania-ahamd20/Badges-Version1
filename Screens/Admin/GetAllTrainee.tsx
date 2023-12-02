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

  TextInput,
} from 'react-native';
import Modal from 'react-native-modal' ;
import axios from 'axios';
import Colors from '../../constants/Colors';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { Button, Card,  PaperProvider, Portal } from 'react-native-paper';
import FontSize from '../../constants/FontSize';




function GetAllTrainee({navigation}:any): JSX.Element {

    
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [selectedId, setSelectedId] = useState(0);
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
    const hideModaldelete = () => setShowConfirmation(false);
    const [data,setData] = useState([]);

      const showmodel = (id:any) => {

        setSelectedId(id);
        setShowConfirmation(true);

      } 

    useEffect(  () => {
        handelGetAll();

        navigation.addListener('focus', handelGetAll );
      },[]);


    const handelGetAll = ()=>{

    axios.get(' https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/User')
    .then(result=>{

        const filteredData = result.data.filter((item:any) => item.roleid === 3);
        setData(filteredData);
       

    }).catch(err=>console.log(err));

    };

  const handelDelete = (id:any)=>{

    axios.delete(` https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/User/Delete/${id}`)
    .then(res=>{
        Alert.alert('Deleted Successfully');
        setShowConfirmation(false);
    }).catch(err=>console.log(err));

  };

 

  const handelUpdate= async()=>{
    axios.put(' https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/User/Update',{
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
                    <Text style={styles.label}>Phone Number: {item.phone}</Text>
                    </View>
                    <View  style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => showmodel(item.userid)}>
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


    <PaperProvider>
        <Portal>
            <Modal isVisible={visible}  >
                <View style={styles.modalContainer1}>
                    <View style={styles.modalContent}>
                        <Text style={styles.labelTitle}>UPDATE TRAINEE</Text>
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
            <Modal isVisible={showConfirmation}>
        <View style={styles.modalContainer1}>
          <Text>Are you sure you want to delete this Trainee?</Text>
          <View style={styles.modalButtons1}>
            <Button textColor={Colors.primary} onPress={() => handelDelete(selectedId)}>Delete</Button>
            <Button textColor={Colors.primary} onPress={hideModaldelete}>Cancel</Button>
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
        borderRadius: 10,
        marginHorizontal: 20,
      },
      textInput:{
        height:50,
        margin:5,
        padding:10,
        borderWidth:1,
        borderRadius:10,
        paddingLeft:20,      
    },
    inputContainer: {
        marginBottom: 10,
      },
      label: {
        fontWeight: 'bold',
      },
      labelTitle: {
        fontWeight: 'bold',
        marginBottom: 20,
        fontSize:FontSize.large /1.2
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
    modalContainer1: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
    },
    modalButtons1: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    }
  });
export default GetAllTrainee;
