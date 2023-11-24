/* eslint-disable prettier/prettier */
/* eslint-disable handle-callback-err */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Alert,
  Image,
  LogBox,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Spacing from '../constants/Spacing';
import FontSize from '../constants/FontSize';
import Colors from '../constants/Colors';
import Font from '../constants/Font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const Login = ({navigation}: any) => {
  const [focused, setFocused] = useState<boolean>(false);
  const [focused1, setFocused1] = useState<boolean>(false);
  useEffect(() => {
    //removeerrors
    LogBox.ignoreLogs(['Reanimated 2']);

    LogBox.ignoreLogs([
      'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes ' +
        "exported from 'deprecated-react-native-prop-types'.",

      'NativeBase: The contrast ratio of',
      '[react-native-gesture-handler] ' +
        +"Seems like you're using an old API with gesture components, check out new Gestures system!",
    ]);
  });

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const setUser = async (usertoken: any, role: any, userid: any) => {
    await AsyncStorage.setItem('userid', userid.toString());
    await AsyncStorage.setItem('username', usertoken);
    await AsyncStorage.setItem('role', role);

    if (role == 1) {
      navigation.replace('Admin');
    } else if (role == 2) {
      navigation.replace('Instractor');
    } else if (role == 3) {
      navigation.replace('Trainee');
    }
  };

  (globalThis as any).url = 'https://d199-92-253-117-43.ngrok-free.app/api';

  const CheckValidation = async () => {
    axios
      .post(
        (globalThis as any).url + '/JWT/token',
        username.includes('@') && username.includes('.com')
          ? {
              email: username,
              password: password,
            }
          : {
              username: username,
              password: password,
            },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(async res => {
        let token = res.data;
        if (token) {
          token = jwt_decode(res.data);
          Alert.alert('Login Successfully');

          //console.log('token : ', token);

          setUser(token.name, token.role, token.userid);
        } else {
          Alert.alert('username or password is incorrect');
        }
      })
      .catch(err => Alert.alert('username or password is incorrect'));
  };

  return (
    <SafeAreaView style={{backgroundColor:'#EFF7FA',flex:1}}>
      <ScrollView
        style={{
          padding: Spacing * 2,
        }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor:'#EFF7FA',
          }}>
          <Image
            source={require('../Assets/images/logo.png')}
            style={{
              width: '100%',
              height: 100,
              marginBottom: Spacing * 2,
              resizeMode: 'contain',
            }}
          />
          <Text
              style={{
                fontFamily: Font['poppins-semiBold'],
                fontSize: FontSize.large,
                maxWidth: '60%',
                textAlign: 'center',
                fontWeight: 'bold',
                color:Colors.primary}}>
            Welcome back you've been missed!
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}>
          <TextInput
            placeholder="UserName or Email"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChangeText={username => setUserName(username)}
            style={[
              {
                fontFamily: Font['poppins-regular'],
                fontSize: FontSize.small,
                padding: Spacing * 2,
                backgroundColor:'white',
                borderRadius: Spacing,
                marginVertical: Spacing,
              },
              focused && {
                borderWidth: 3,
                borderColor: Colors.primary,
                backgroundColor:'white',
                shadowOffset: {width: 4, height: Spacing},
                shadowColor: Colors.primary,
                shadowOpacity: 0.2,
                shadowRadius: Spacing,
              },
            ]}
          />
          <TextInput
            placeholder="Password"
            onFocus={() => setFocused1(true)}
            onBlur={() => setFocused1(false)}
            onChangeText={password => setPassword(password)}
            secureTextEntry={passwordVisible}
            style={[
              {
                fontFamily: Font['poppins-regular'],
                fontSize: FontSize.small,
                padding: Spacing * 2,
                backgroundColor: 'white',
                borderRadius: Spacing,
                marginVertical: Spacing,
              },
              focused1 && {
                borderWidth: 3,
                borderColor: Colors.primary,
                shadowOffset: {width: 4, height: Spacing},
                shadowColor: Colors.primary,
                shadowOpacity: 0.2,
                shadowRadius: Spacing,
              },
            ]}
          />
        </View>

        <View>
          <Text
            style={{
              fontFamily: Font['poppins-semiBold'],
              fontSize: FontSize.small,
              color: Colors.secondary,
              alignSelf: 'flex-end',
            }}>
            Forgot your password ?
          </Text>
        </View>

        <TouchableOpacity
          style={{
            padding: Spacing * 1.25,
            backgroundColor:Colors.secondary,
            marginVertical: Spacing * 3,
            borderRadius: 50,
            shadowColor: Colors.primary,
            shadowOffset: {
              width: 0,
              height: Spacing,
            },
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
          }}
          onPress={CheckValidation}>
          <Text
            style={{
              fontFamily: Font['poppins-bold'],
              color: Colors.onPrimary,
              textAlign: 'center',
              fontSize: FontSize.large,
            }}>
            Sign in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          /* onPress={() => navigate("Register")}*/
          style={{
            padding: Spacing,
          }}>
          <Text
            style={{
              fontFamily: Font['poppins-semiBold'],
              color: Colors.text,
              textAlign: 'center',
              fontSize: FontSize.small,
            }}>
            Create new account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({});
