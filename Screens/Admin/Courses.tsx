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
        'https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/Course',
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