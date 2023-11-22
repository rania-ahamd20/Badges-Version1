
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Picture from '../../Components/Picture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loading from '../../Components/Loading';
import Colors from '../../constants/Colors';
import FontSize from '../../constants/FontSize';


const ProfileScreen = ({ navigation }: any) => {

  const [user, setUser]: any = useState();
  const [Check, setCheck] = useState(false);

  const logout = async () => {

    await AsyncStorage.clear();

    navigation.replace('Login');
  }

  const getuserData = async () => {
    await AsyncStorage.getItem('userid').then(async (id: any) => {
      await axios.get(`https://2c7d-92-253-55-73.ngrok-free.app/api/User/GetUserById/${parseInt(id)}`)
        .then(async (res: any) => {
         
          console.log('User : ', res.data);
          await setUser(res.data)

        })
    })
  }


  useEffect(() => {
    getuserData();
  }, []);



  return (
    user ? (
      <ScrollView  >
        <Picture imageuser={user.image}/>
        <Text style={styles.title}>{user.firstname} {user.lastname}</Text>
      </ScrollView>
    ) : (<Loading />)
  )

}


const styles = StyleSheet.create({
  title: {
    textAlign: 'center', fontSize: 25, marginTop: 25, color:Colors.primary
  },
  textstate: {
    fontSize: 20, marginTop: 10, marginLeft: 25, marginBottom: 15
  },
  containerb: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {

    fontSize: FontSize.large,
  },
  line: {
    height: 30,
    width: 1,
    backgroundColor: Colors.primary,
    marginVertical: 30,
    marginHorizontal: 50
  }

});

export default ProfileScreen;
