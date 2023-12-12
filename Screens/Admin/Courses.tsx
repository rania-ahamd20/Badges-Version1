/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import axios from 'axios';
import React, {useEffect, useState } from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import Cards from '../../Components/Card';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../Components/Loading';

const Courses = ({navigation}: any) => {
  const [Courses, setCourses] = useState([]);
  const [CoursesSec, setCoursesSec] = useState([]);




  const fetchDataCourses = () => {
    axios
      .get(
        'https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Course',
      )
      .then(async result => {
        
        setCourses(result.data);
        const uniqueValues = new Set();
        setCoursesSec(
          result.data.filter((item: any) => {
            const value = item.coursenum;
            if (!uniqueValues.has(value)) {
              uniqueValues.add(value);
              return true;
            }
            return false;
          }),
        );
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchDataCourses();
    navigation.addListener('focus', fetchDataCourses );

  }, []);



  return (
    Courses && CoursesSec ?(
    <ScrollView>
      <Cards
        courses={Courses}
        coursesSec={CoursesSec}
        navigation={navigation}
      />
    </ScrollView>
    ): (
      <Loading/>
    )
  );
};

const styles = StyleSheet.create({});

export default Courses;