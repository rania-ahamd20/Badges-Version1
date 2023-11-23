/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Modal,
    TextInput,
    Image,
} from 'react-native';
import axios from 'axios';




function Leaderboards({ navigation }: any): JSX.Element {

    const [courseId, setCourseID] = useState('');
    const [cTdata, setData] = useState<any>('');
    const [courseData, setCourseData] = useState<any>('');
    const [userCourseData, setuserCourseData] = useState<any>(null);
    const [showData, setShow] = useState(false);
    const [courseName, setCourseName] = useState('');
    const filteredData = userCourseData.filter((dataItem: any) => dataItem.mark >= 80);

 
    filteredData.sort((a: any, b: any) => b.mark - a.mark);

    
    const top10Data = filteredData.slice(0, 10);



    const GetAllUserCourseTr = async (id: any) => {

        await axios.get(`https://d6c8-92-253-55-73.ngrok-free.app/api/CourseTrainee/GetUserCourse/${id}`)
            .then(result => {
                setuserCourseData(result.data);
                setShow(true);
                //console.log("course Trainee ", userCourseData)
            }).catch(err => console.log(err));

    };


    return (

        <ScrollView>
            <View>
                <Text style={styles.label}>Top 10 users in course {courseName} </Text>
            </View>
            <View>
             
                <TextInput style={styles.textInput}
                    placeholder=" CourseID"
                    value={courseId}
                    onChangeText={courseId => setCourseID(courseId)}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => GetAllUserCourseTr(courseId)} style={styles.button}>
                        <Text style={styles.buttonText}> OK </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {showData && (
                <View style={styles.container}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.header]}>Ranking</Text>
                        <Text style={[styles.tableCell, styles.header]}>User</Text>
                        <Text style={[styles.tableCell, styles.header]}>Mark</Text>
                    </View>
                    {top10Data.map((dataItem: any, index: any) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{index + 1}</Text>
                            <View style={styles.userData}>
                                <Image source={{ uri: dataItem.image }} style={styles.userImage} />
                                <Text style={styles.userName}>{dataItem.firstname} {dataItem.lastname}</Text>
                            </View>
                            <Text style={styles.tableCell}>{dataItem.mark}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({


    textInput: {

        height: 50,
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '@c0c0c0',
        paddingLeft: 20,
    },
    label: {
        margin:10,
        fontSize:15,
        fontWeight: 'bold',

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        marginLeft: 50,
        marginRight: 10,

    },
    button: {
        backgroundColor: '#343c64',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft: 10,
        shadowColor: '#343c64',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        marginLeft: 5,
        marginRight: 5,

    },
    tableRow: {
        flexDirection: 'row',

        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    tableCell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
    },
    header: {
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userData: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    userName: {

        fontSize: 16,
    },


});
export default Leaderboards;
