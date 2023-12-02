/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View, Button} from 'react-native';
import CardsTr from '../../Components/CardT';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeTrainee = ({navigation, route}: any) => {
  const [Courses, setCourses] = useState([]);
  const [CoursesSec, setCoursesSec] = useState([]);

  const fetchDataCourses = async () => {
    await AsyncStorage.getItem('userid').then(async (id: any) => {
      await axios
        .get(
          ' https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/CourseTrainee/GetCoursesUser/' +
            parseInt(id, 10),
        )
        .then(async result => {
          setCourses(result.data);
          const uniqueValues = new Set();
          setCoursesSec(
            result.data.filter((item: any) => {
              const value = item.coursenum;
              if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                //console.log('the value ', value);
                return true;
              }
              return false;
            }),
          );
        })
        .catch(err => console.log(err));
    });
  };

  useEffect(() => {
    fetchDataCourses();
  }, []);

  return (
    <ScrollView>
      <CardsTr
        courses={Courses}
        coursesSec={CoursesSec}
        navigation={navigation}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default HomeTrainee;
