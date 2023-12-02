/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import Spacing from '../../constants/Spacing';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontSize from '../../constants/FontSize';
import Colors from '../../constants/Colors';
import Font from '../../constants/Font';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../../Components/Loading';

function getdate(date: any) {
  const dateTime = new Date(date);

  const formattedDate = dateTime.toLocaleDateString();

  return formattedDate;
}

function getTime(date: any) {
  const dateTime = new Date(date);
  const formattedTime = dateTime.toLocaleTimeString();

  return formattedTime;
}

const CourseDetails = ({ route, navigation }: any) => {
    const [Course, setCourse]: any = useState(route.params.course);
    const [Users, setUsers]: any = useState([]);
    const [instructor, setinst]: any = useState({});
    const [UsersC, setCt]: any = useState([]);
    const [Check, setCheck] = useState(false);
    const [attendanceid, setattendance]: any = useState();

    const RemoveTr = async (ctid:any) => {
      await axios.delete('https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/CourseTrainee/Delete/'+parseInt(ctid))
      .then(res=>{
        Alert.alert('deleted');
    }).catch(err=>console.log(err));


    }

    const fetchDataUsers = async () => {
        await axios.get('https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/User')
            .then(async (result1) => {
                setUsers(result1.data);
                setinst(result1.data.find((us: any) => us.userid === Course.userid));


                await axios.get('https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/CourseTrainee/GetUserCourse/' + parseInt(Course.courseid))
                    .then(async (result) => {

                        setCt(result.data);

                    })
                    .catch((err) => console.log(err));

            })
            .catch((err) => console.log(err));
    };

    const fetchDataAt = async () => {

        await axios.get('https://c090-2a01-9700-1091-6200-1488-cf3c-ec44-b1a7.ngrok-free.app/api/Attendance')
            .then(async (result) => {
                const id = result.data.find((c: any) => c.courseid == route.params.course.courseid)
                setattendance(id.attendanceid);
            })
            .catch((err) => console.log(err));
    };




    useEffect(() => {
 
        fetchDataUsers();
        fetchDataAt();

    }, []);

    return (
      Users && UsersC && instructor ?(
        <SafeAreaView style={{backgroundColor:'white' , flex:1}}>
            <ScrollView >
                <View
                    style={{
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={{ uri: Course.image }}
                        style={{
                            width: '100%',
                            height: 200,
                            marginBottom: Spacing * 2,
                            resizeMode: 'cover'
                        }}
                    />
                    <Text style={styles.TitlePage}>{Course.name} ({Course.sectionnum})</Text>

                    <View style={styles.containerb}>
                        <TouchableOpacity style={styles.button} onPress={() => setCheck(false)}>
                            <Text style={[styles.buttonText, !Check ? { color: Colors.secondary } : { color: Colors.primary }]}>Details</Text>
                        </TouchableOpacity>

                        <View style={styles.line}></View>

                        <TouchableOpacity style={styles.button} onPress={() => setCheck(true)}>
                            <Text style={[styles.buttonText, Check ? { color: Colors.secondary } : { color: Colors.primary }]}>Members</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {Check ? (

                    <View>
                        <View style={{ paddingLeft: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity
                                style={styles.button1}
                                onPress={() => navigation.navigate('AddTraineeToCourse', {
                                    courseid: Course.courseid,
                                    users: Users, usersR: UsersC, coursenum:Course.coursenum
                                })}>

                                <Text style={styles.buttonText1}>Add Trinees</Text>

                            </TouchableOpacity>

                        </View>

                        <View key="header" style={styles.header}>
                            <Text style={styles.headerText}>FullName</Text>
                            <Text style={styles.headerText}>Email</Text>
                            <Text style={styles.headerText}>Remove</Text>
                        </View>
                        {

                            UsersC.map((item: any, index: any) =>
                            (
                                <View key={item.userid} style={styles.row}>
                                    <Text style={styles.cell}>{item.firstname}</Text>
                                    <Text style={styles.cell}>{item.email}</Text>
                                    <Text style={styles.cell}>
                                    <Icon name="times" size={25} color='red' onPress={()=>RemoveTr(item.ctid)}/>
                                    </Text>
                                </View>
                            ))
                        }



                    </View>

                ) : (

                    <View style={{ margin: Spacing }}>

                        <Text style={styles.Text1}>Section : {Course.sectionnum}</Text>
                        <Text style={styles.Text1}>Instructor : {instructor.firstname} {instructor.lastname}</Text>
                        <Text style={styles.Text1}>Trainees Number : {UsersC.length}</Text>
                        <Text style={styles.Text1}>Date : {getdate(Course.datefrom)} - {getdate(Course.dateto)} </Text>
                        <Text style={styles.Text1}>Time : {getTime(Course.datefrom)} - {getTime(Course.dateto)} </Text>

                    </View>
                )}


            </ScrollView>
        </SafeAreaView>
      ):(<Loading/>)
    );

}


const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  TitlePage: {
    fontSize: FontSize.xLarge / 1.2,
    fontWeight: 'bold',
    marginBottom: Spacing * 2,
    color: Colors.primary,
    textAlign: 'center',
  },
  containerb: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
    marginHorizontal: 50,
  },
  Text1: {
    fontSize: FontSize.large,
    fontFamily: Font['poppins-semiBold'],
    color: Colors.gray,
    marginBottom: Spacing * 2.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: FontSize.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingVertical: 8,
    padding: 10,
  },
  cell: {
    fontSize: FontSize.medium ,
    textAlign: 'left',
  },
  button1: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
    marginRight: 5,
    width: 150,
  },
  buttonText1: {
    fontSize: FontSize.medium / 1.2,
    color: Colors.secondary,
  },
});

export default CourseDetails;
