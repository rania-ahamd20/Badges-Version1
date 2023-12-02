/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet, TextInput, View, Button, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import Colors from '../../constants/Colors';


const AddTrainee = ({ navigation, route }: any) => {

  const [item, setItem]: any = useState(route.params.trainee);
  const [file, setFile]: any = useState(null);
  const [Firstname, setFName] = useState('');
  const [Lastname, setLname] = useState('');
  const [Email, setEmail] = useState('');
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [Phone, setPhone] = useState('');
  const [roleid, setRoleid] = useState(3);


  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      }).then((res: any) => {
        setFile(res);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  const handleFileUpload = async () => {

    //let { isValid, errorMessage } = validateUser();
    let isValid = true;
    let errorMessage = '';

    const usernameExists = item.some((user: { username: string; }) => user.username.toLowerCase() == Username.toLowerCase());
    const emailExists = item.some((user: { email: string; }) => user.email == Email);

    

    if (emailExists) {
      isValid = false;
      errorMessage = 'Email already exists';
    }

    
    if (usernameExists) {
      isValid = false;
      errorMessage = 'Username already exists';
     };

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file[0].uri,
        type: file[0].type || 'application/octet-stream', // use a default type if not available
        name: file[0].name || 'file', // use a default name if not available
      });


      const response = await axios.post('https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/Upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      );

      const responseData = response.data;
      
      if (response.status === 200) {
          console.log(responseData)
        if (isValid) {
          axios.post('https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/User/Create', {
            "Firstname": Firstname,
            "Lastname": Lastname,
            "Email": Email,
            "Username": Username,
            "Password": Password,
            "Phone": Phone,
            "Image": responseData,
            "Roleid": roleid,

          }, {
            "headers": {
              'Content-Type': 'application/json',
            }
          }).then(result => {
            Alert.alert("created...")
            navigation.navigate('GetAllTrainee');
          }).catch(err => {
            console.log(err)
          })
        } else {
          Alert.alert('Validation Error', errorMessage);
          console.log(errorMessage);

        }

      } else {
        
       
      }
    } catch (error) {

      if (isValid) {
        axios.post('https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/User/Create', {
          "Firstname": Firstname,
          "Lastname": Lastname,
          "Email": Email,
          "Username": Username,
          "Password": Password,
          "Phone": Phone,
          "Image": 'https://ik.imagekit.io/bspelc5r6/Static/user.png?updatedAt=1700583939738',
          "Roleid": roleid,

        }, {
          "headers": {
            'Content-Type': 'application/json',
          }
        }).then(result => {
          Alert.alert("created...");
          navigation.navigate('GetAllTrainee');
        }).catch(err => {
          console.log(err)
        })
      } else {
        Alert.alert('Validation Error', errorMessage);
        console.log(errorMessage);

      }
    }
  };

  const AddTrainee = async () => {


  }
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>
        ADD Trainee
      </Text>
      <View>
        <Text style={styles.label}>First Name:</Text>
        <TextInput style={styles.textInput}
          placeholder='First Name'
          onChangeText={Firstname => setFName(Firstname)}
        />
      </View>
      <View>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput style={styles.textInput}
          placeholder='Last Name'
          onChangeText={Lastname => setLname(Lastname)}
        />
      </View>
      <View>
        <Text style={styles.label}>Email:</Text>
        <TextInput style={styles.textInput}
          placeholder='Email'
          onChangeText={Email => setEmail(Email)}
        />
      </View>
      <View>
        <Text style={styles.label}>User Name:</Text>
        <TextInput style={styles.textInput}
          placeholder='User Name '
          onChangeText={Username => setUsername(Username)}
        />
      </View>
      <View>
        <Text style={styles.label}>Password:</Text>
        <TextInput style={styles.textInput}
          placeholder='Password'
          onChangeText={Password => setPassword(Password)}
        />
      </View>
      <View>
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput style={styles.textInput}
          placeholder='Phone Number'
          onChangeText={Phone => setPhone(Phone)}
        />
      </View>
      <View>
        <Text style={styles.label}>Image:</Text>
        <TouchableOpacity onPress={pickDocument} style={styles.textInput}>
          {file ? (
            <View>
              <Text>{file[0].name}</Text>
            </View>
          ) : (
            <Text>No file choose</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleFileUpload} style={styles.button}>
          <Text style={styles.buttonText}>ADD</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1

  },
  text: {
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {

    height: 50,
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,

    paddingLeft: 20,

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 60
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 12,
    shadowColor: '#343c64',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 15,
    textAlign: 'center',

  },
  label: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 15,
  },
});

export default AddTrainee;