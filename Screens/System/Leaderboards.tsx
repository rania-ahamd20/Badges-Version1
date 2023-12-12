/* eslint-disable react-hooks/exhaustive-deps */
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
    Image,
} from 'react-native';
import axios from 'axios';
import Loading from '../../Components/Loading';
import FontSize from '../../constants/FontSize';




function Leaderboards({ navigation , route}: any): JSX.Element {

    const [top10Data,setData]:any = useState();

    const GetAllUserCourseTr = async () => {

        await axios.get(` https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/CourseTrainee/GetUserCourse/${route.params.course.courseid}`)
            .then(result => {
                
                let filteredData = result.data.filter((dataItem: any) => dataItem.mark >= 80);
                filteredData.sort((a: any, b: any) => b.mark - a.mark);
                setData(filteredData.slice(0, 10));
                
            }).catch(err => console.log(err));

    };

    useEffect(() => {
        GetAllUserCourseTr();
      }, []);

    return (
        top10Data ? ( 
        <ScrollView>
           
            <View>
                <Text style={styles.label}>Top 10 users in course {route.params.course.name} </Text>
            </View>
            
                <View style={styles.container}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCellR, styles.header]}>Ranking</Text>
                        <Text style={[styles.tableCell, styles.header]}>User</Text>
                        <Text style={[styles.tableCell, styles.header]}>Mark</Text>
                    </View>
                    {top10Data.map((dataItem: any, index: any) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCellR}>{index + 1}</Text>
                            <View style={styles.userData}>
                                <Image source={{ uri: dataItem.image }} style={styles.userImage} />
                                <Text style={styles.userName}>{dataItem.firstname} {dataItem.lastname}</Text>
                            </View>
                            <Text style={styles.tableCell}>{dataItem.mark}</Text>
                        </View>
                    ))}
                </View>
           
        
        </ScrollView>
         ) : (
            <View>
                <Loading/>
            </View>
         )
    );
}

const styles = StyleSheet.create({


    label: {
        margin:10,
        fontSize:FontSize.large,
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
        padding: 10,
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
    tableCellR:{
        flex: 1,
        paddingTop: 10,
        paddingLeft:10,
        paddingBottom:10,
        paddingRight:2,
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
