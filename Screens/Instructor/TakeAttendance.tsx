/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../constants/Colors';
import FontSize from '../../constants/FontSize';
import Spacing from '../../constants/Spacing';
import axios from 'axios';

const TakeAttendance = ({route, navigation}: any) => {
  const [users, setUsers]: any = useState(route.params.users);
  const [checkboxValues, setCheckboxValues]: any = useState(
    Array(route.params.users.length).fill(false),
  );
  const [attendance, setattendance]: any = useState([]);
  const currentDate = new Date();
  const getdata = async () => {
    const newAttendance = [];

    for (let i = 0; i < users.length; i++) {
      newAttendance.push({
        attendantedate: currentDate,
        checkat: 0,
        attendanceid: route.params.attendanceid,
        userid: route.params.users[i].userid,
      });
    }
   // console.log('Attendance', newAttendance);
    setattendance(newAttendance);
  };

  useEffect(() => {
    getdata();
  }, [users]);

  const updateAttendance = (index: any, value: any) => {
    setCheckboxValues((prevValues: any) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    setattendance((prevAttendance: any) => {
      const newAttendance = [...prevAttendance];
      newAttendance[index] = {
        ...newAttendance[index],
        checkat: value ? 1 : 0,
      };
      //console.log('new : ', newAttendance);
      return newAttendance;
    });

    //console.log('attendance : ', attendance);
  };

  const submit = async () => {
    for (let i = 0; i < users.length; i++) {
      await axios
        .post(
          ' https://a1e8-2a01-9700-1108-6f00-69b2-6829-7765-ea85.ngrok-free.app/api/AttendanceTr',
          attendance[i],
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(function (response) {
          if (i == users.length - 1) {
            Alert.alert('AttendanceTr Created Successfully');
          }
        })
        .catch(function (error) {
          Alert.alert(error.message);
        });
    }
  };

  return (
    <ScrollView style={{padding: 20}}>
      <View
        style={{
          marginBottom: Spacing * 3,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.texttitle}>Name</Text>
        <Text style={styles.texttitle}>Presence</Text>
      </View>

      {users.map((user: any, index: any) => (
        <View
          key={index}
          style={{
            marginBottom: Spacing * 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textname}>
            {user.firstname} {user.lastname}{' '}
          </Text>

          {checkboxValues[index] ? (
            <TouchableOpacity
              onPress={() => updateAttendance(index, !checkboxValues[index])}>
              <Icon name="check-circle-o" size={30} color={'#0bda51'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => updateAttendance(index, !checkboxValues[index])}>
              <Icon name="circle-o" size={30} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={styles.button1} onPress={submit}>
          <Text style={styles.buttonText1}>Sumbit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TakeAttendance;
const styles = StyleSheet.create({
  textname: {
    fontSize: FontSize.large,
    color: Colors.gray,
    marginRight: Spacing * 1.5,
  },
  texttitle: {
    fontSize: FontSize.large * 1.2,
    color: Colors.primary,
    marginRight: 1,
  },
  button1: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
    marginRight: 5,
    width: 200,
  },
  buttonText1: {
    fontSize: FontSize.medium,
    color: Colors.secondary,
  },
});
