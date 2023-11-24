/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../constants/Colors';
import FontSize from '../../constants/FontSize';
import Spacing from '../../constants/Spacing';
import axios from 'axios';
const ManualBadges = ({route, navigation}: any) => {
  const [users, setUsers]: any = useState(route.params.users);
  const [checkboxValues, setCheckboxValues]: any = useState(
    Array(route.params.users.length).fill(false),
  );
  const [badge, setbadge]: any = useState([]);
  const currentDate = new Date();
  const getdata = async () => {
    const newbadge = [];

    for (let i = 0; i < users.length; i++) {
      newbadge.push({
        badgesid: route.params.badge.badgesid,
        userid: route.params.users[i].userid,
      });
    }
    setbadge(newbadge);
  };

  useEffect(() => {
    getdata();
  }, [users]);

  const updatebadge = (index: any, value: any) => {
    setCheckboxValues((prevValues: any) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    setbadge((prevbadge: any) => {
      const newbadge = [...prevbadge];
      newbadge[index] = {
        ...newbadge[index],
        checkat: value ? 1 : 0,
      };
      //console.log('new : ', newbadge);
      return newbadge;
    });

    //console.log('badge : ', badge);
  };

  const submit = async () => {
    for (let i = 0; i < users.length; i++) {
      await axios
        .post(
          ' https://3847-92-253-117-43.ngrok-free.app/api/BadgesTr/Create',
          badge[i],
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(function (response) {
          if (i == users.length - 1) {
            Alert.alert('Generated Successfully');
            navigation.navigate('Criteria');
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
        <Text style={styles.texttitle}>Trainee Name</Text>
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
              onPress={() => updatebadge(index, !checkboxValues[index])}>
              <Icon name="check-circle-o" size={30} color={'#0bda51'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => updatebadge(index, !checkboxValues[index])}>
              <Icon name="circle-o" size={30} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={styles.button1} onPress={submit}>
          <Text style={styles.buttonText1}>Generate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
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
export default ManualBadges;
