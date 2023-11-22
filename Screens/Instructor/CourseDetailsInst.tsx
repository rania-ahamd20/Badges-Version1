import React, { useEffect, useState } from 'react';
import Spacing from '../../constants/Spacing';
import { Alert, Button, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontSize from '../../constants/FontSize';
import Colors from '../../constants/Colors';
import Font from '../../constants/Font';
import axios from 'axios';



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

const CourseDetailsInst = ({ route, navigation }: any) => {
    const [Course, setCourse]: any = useState(route.params.course);
    const [Users, setUsers]: any = useState([]);
    const [instructor, setinst]: any = useState({});
    const [UsersC, setCt]: any = useState([]);
    const [Check, setCheck] = useState(false);
    const [attendanceid, setattendance]: any = useState();


    const fetchDataUsers = async () => {
        await axios.get('https://2c7d-92-253-55-73.ngrok-free.app/api/User')
            .then(async (result1) => {
                setUsers(result1.data);
                setinst(result1.data.find((us: any) => us.userid === Course.userid));


                await axios.get('https://2c7d-92-253-55-73.ngrok-free.app/api/CourseTrainee/GetUserCourse/' + parseInt(Course.courseid))
                    .then(async (result) => {

                        setCt(result.data);

                    })
                    .catch((err) => console.log(err));

            })
            .catch((err) => console.log(err));
    };


    /*const fetchDataUC = async () => {
        await axios.get(' https://2c7d-92-253-55-73.ngrok-free.app/api/CourseTrainee/GetUserCourse/' + parseInt(Course.courseid))
            .then(async (result) => {
                setCt(result.data);
                
                const filtered :any = await Promise.all(Users.filter((user:any) => user.roleid == 3 &&!result.data.some((excludedUser:any) =>  excludedUser.userid == user.userid)))
                console.log('filterd',filtered)
                setUR(filtered);
            })
            .catch((err) => console.log(err));
    };*/

    const fetchDataAt = async () => {

        await axios.get('https://2c7d-92-253-55-73.ngrok-free.app/api/Attendance')
            .then(async (result) => {
                const id = result.data.find((c: any) => c.courseid == route.params.course.courseid)
                setattendance(id.attendanceid);
            })
            .catch((err) => console.log(err));
    };




    useEffect(() => {
        fetchDataUsers();
        //  fetchDataUC();
        fetchDataAt();

    }, []);

    const checkattendance = () => {
        const startdate: any = getdate(Course.datefrom);
        const enddate: any = getdate(Course.dateto);
        const cDate = new Date();
        const currentDate = getdate(cDate);
        if (startdate <= currentDate && currentDate <= enddate) {
            navigation.navigate('TakeAttendance', { users: UsersC, attendanceid: attendanceid });
        } else {
            Alert.alert("Sorry this Course not Started yet or End")
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View
                    style={{
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={{ uri: Course.image }}
                        style={{
                            width: '100%', // Adjust the width as needed
                            height: 200, // Adjust the height as needed
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
                                onPress={checkattendance}>

                                <Text style={styles.buttonText1}>Take Attendance</Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button1}
                                onPress={() => navigation.navigate('Assignments', {course:route.params.course})}>

                                <Text style={styles.buttonText1}>Assignments</Text>

                            </TouchableOpacity>

                        </View>

                        <View key="header" style={styles.header}>
                            <Text style={styles.headerText}>FullName</Text>
                            <Text style={styles.headerText}>Email</Text>
                            <Text style={styles.headerText}>Operation</Text>
                        </View>
                        {

                            UsersC.map((item: any, index: any) =>
                            (
                                <View key={item.userid} style={styles.row}>
                                    <Text style={styles.cell}>{item.firstname}</Text>
                                    <Text style={styles.cell}>{item.email}</Text>
                                    <Text style={styles.cell}>{item.username}</Text>
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
        textAlign: 'center'
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
    },
    Text1: {
        fontSize: FontSize.large,
        fontFamily: Font['poppins-semiBold'],
        color: Colors.gray,
        marginBottom: Spacing * 2.5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        padding: 10
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
        fontSize: FontSize.medium / 1.2,
        textAlign: 'left'
    },
    button1: {
        borderWidth: 2, // Adjust the border width as needed
        borderColor: Colors.gray, // Set the default border color here
        padding: 8,
        borderRadius: 15,
        alignItems: 'center',
        marginRight: 5,
        width: 150,

    },
    buttonText1: {
        fontSize: FontSize.medium / 1.2,
        color: Colors.gray, // Set the text color to match the border color
    }

});


export default CourseDetailsInst;