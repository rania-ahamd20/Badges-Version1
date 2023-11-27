/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import { Button, ScrollView } from 'react-native';
import CardInst from '../../Components/CardInst';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../Components/Loading';

const InstrctorPage = ({navigation}: any) => {
  const [courses, setCourses]: any = useState();
  const [coursesSec, setCoursesSec]: any = useState();


  const fetchData = async () => {
    await AsyncStorage.getItem('userid').then(async (id: any) => {
      axios

        .get(' https://bb39-92-253-117-43.ngrok-free.app/api/Course')
        .then(async (result) => {
         
          const userCourses = result.data.filter((course:any) => course.userid == id);
          setCourses(userCourses);

          const uniqueValues = new Set();
          setCoursesSec(
            userCourses.filter((item: any) => {
              const value = item.coursenum;
              if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                return true;
              }
              return false;
            }),

          );     
        })
        .catch((err) => console.log(err));
      })
  }



  useEffect( () => {
   fetchData();

  }, []);

  return coursesSec ? (
    <ScrollView>
      <CardInst
        courses={courses}
        coursesSec={coursesSec}
        navigation={navigation}
      />
    </ScrollView>

  ) : (
    <Loading />
  );
};

export default InstrctorPage;
