/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
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
import Loading from '../../Components/Loading';

const AddTraineeToCourse = ({route, navigation}: any) => {
  // Assuming you have a list of user objects and checkbox values
  const [users, setUsers]: any = useState([]);

  const getdata = async () => {
    await axios
      .get('https://916d-92-253-117-43.ngrok-free.app/api/Course')
      .then(async (courses: any) => {
        const filterSection = courses.data.filter(
          (c: any) => c.coursenum == route.params.coursenum);
        const coursesid = filterSection.map((item: any) => item.courseid);
        console.log(coursesid);
        await axios
          .get('https://916d-92-253-117-43.ngrok-free.app/api/CourseTrainee')
          .then(async (coursesTr: any) => {
            const usersIn = coursesTr.data.filter((tc: any) =>
              coursesid.includes(tc.courseid),
            );

            const usersid = usersIn.map((item: any) => item.userid);
            console.log(usersid);

            const filtered: any = await Promise.all(
              route.params.users.filter(
                (user: any) =>
                  user.roleid == 3 && !usersid.includes(user.userid),
              ),
            );

            setUsers(filtered);
          });
      });
  };

  useEffect(() => {
    getdata();
  }, []);

  const addUsers = async (userid: any) => {
    await axios
      .post(
        'https://916d-92-253-117-43.ngrok-free.app/api/CourseTrainee/Create',
        {
          mark: 0,
          courseid: route.params.courseid,
          userid: userid,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(function (response) {
        Alert.alert('Add Successfully');
      })
      .catch(function (error) {
        Alert.alert(error.message);
      });
  };

  return users ? (
    <ScrollView style={{padding: 20}}>
      <View
        style={{
          marginBottom: Spacing * 3,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.texttitle}>Name</Text>
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

          <TouchableOpacity
            style={styles.button1}
            onPress={() => addUsers(user.userid)}>
            <Text style={styles.buttonText1}>Add</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  ) : (
    <Loading />
  );
};

export default AddTraineeToCourse;
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
    width: 75,
  },
  buttonText1: {
    fontSize: FontSize.medium,
    color: Colors.secondary,
  },
});
