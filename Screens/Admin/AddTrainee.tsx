/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet, TextInput, View ,Button, Text, Alert,ScrollView, TouchableOpacity} from 'react-native';
import React ,{useState, useEffect} from 'react';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';


const AddTrainee = ({navigation,route}:any) => {

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [item,setItem]:any = useState(route.params.trainee);
    const [showDataFile, setShow] = useState(false);

    const [Firstname,setFName] = useState('');
    const [Lastname,setLname] = useState('');
    const [Email,setEmail] = useState('');
    const [Username,setUsername] = useState('');
    const [Password,setPassword] = useState('');
    const [Phone,setPhone] = useState('');
    const [imgname,setImg] = useState('');
    const [roleid,setRoleid] = useState(3);
    const [data,setData] = useState([]);

    const validateUser = () => {
 
        const usernameExists = item.some((user: { username: string; }) => user.username === Username);
        const emailExists = item.some((user: { email: string; }) => user.email === Email);
      
        if (usernameExists) {
          return { isValid: false, errorMessage: 'Username already exists' };
        }
      
        if (emailExists) {
          return { isValid: false, errorMessage: 'Email already exists' };
        }
      
        return { isValid: true };
      };

    const fileName = selectedFile ? selectedFile[0]?.name : '';

    const pickFile = async () => {
        try {
          const res:any = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles], 
          });
         
          setSelectedFile(res);
          setShow(true);
          setImg(fileName);
          
          //console.log("SelectedFile..............",res);
         
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            
            console.log('User cancelled the file picker');
          } else {
           
            console.error('Error while picking the file', err);
          }
        }
      };

const AddTrainee = async()=>{

    const { isValid, errorMessage } = validateUser();

    if (isValid) {
        axios.post('https://916d-92-253-117-43.ngrok-free.app/api/User/Create',{
            "Firstname":Firstname,
            "Lastname":Lastname,
            "Email":Email,
            "Username":Username,
            "Password":Password,
            "Phone":Phone,
            "Image":imgname,
            "Roleid":roleid,
    
        },{
            "headers":{
             'Content-Type':'application/json',
            }
        }).then(result=>{
            Alert.alert("created...")
            
        }).catch(err=>{
            console.log(err)
        })
      } else {
        Alert.alert('Validation Error', errorMessage);
        console.log(errorMessage);
        
      }
    
 }
  return (
    <ScrollView style={styles.container}>
    <Text style={styles.title}>
    ADD Trainee  
    </Text>
    <View>
    <Text style={styles.label}>First Name:</Text>
    <TextInput style={styles.textInput}
      placeholder=' First Name'
      onChangeText={Firstname=>setFName(Firstname)}
    />
    </View>
     <View>
     <Text style={styles.label}>Last Name:</Text>
    <TextInput style={styles.textInput}
        placeholder='Last Name'
        onChangeText={Lastname=>setLname(Lastname)}
    />
    </View>
     <View>
    <Text style={styles.label}>Emale:</Text>
    <TextInput style={styles.textInput}
        placeholder='Email'
        onChangeText={Email=>setEmail(Email)}
    />
    </View>
    <View>
    <Text style={styles.label}>User Name:</Text>
    <TextInput style={styles.textInput}
        placeholder='User Name '
        onChangeText={Username=>setUsername(Username)}
    />
    </View>
    <View>
    <Text style={styles.label}>Password:</Text>
    <TextInput style={styles.textInput}
        placeholder='Password'
        onChangeText={Password=>setPassword(Password)}
    />
    </View>
    <View>
    <Text style={styles.label}>Phone Number:</Text>
    <TextInput style={styles.textInput}
        placeholder='Phone Number'
        onChangeText={Phone=>setPhone(Phone)}
    />
    </View>
    <View>
    <Text style={styles.label}>Image:</Text>
    <TouchableOpacity onPress={pickFile} style={styles.textInput}>
    {showDataFile ? (
          <View>
            <Text>{fileName}</Text>
          </View>
        ) : (
          <Text>Press</Text>
        )}
     </TouchableOpacity>
    </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={AddTrainee} style={styles.button}>
                  <Text style={styles.buttonText}>ADD</Text>
              </TouchableOpacity>
          </View>

   </ScrollView>
  );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    //   justifyContent: 'center',
      // alignItems:"flex-start",
    },
    text: {
      marginBottom:15,
      textAlign: 'center',
    },
    textInput:{
     
        height:50,
        margin:12,
        padding:10,
        borderWidth:1,
        borderRadius:10,
        borderColor:"@c0c0c0",
        paddingLeft:20,
          
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
      },
      button: {
        backgroundColor: '#343c64',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft: 10,
        marginRight:12,
        shadowColor:'#343c64',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      title: {
        marginTop:10,
        fontSize:20,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft:15,
        textAlign:'center',
        
      },
      label: {
        marginTop:10,
        fontSize:15,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft:15,
      },
  });

export default AddTrainee;