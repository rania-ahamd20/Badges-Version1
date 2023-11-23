/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontSize from '../../../constants/FontSize';
import Colors from '../../../constants/Colors';
import Spacing from '../../../constants/Spacing';
import { Card, Button } from 'react-native-paper';

const AllCourse = ({navigation}:any) => {
    const [Courses, setCourses] = useState([]);
    const [CoursesSec, setCoursesSec] = useState([]);
    const [Users, setUsers] = useState();



    const fetchDataCourses = () => {
        axios
            .get(
                'https://07ee-212-34-23-238.ngrok-free.app/api/Course',
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
    }, []);

    // Render your courses
    return (
        <ScrollView style={styles.container}>

            {/* Vertical Scroll View */}
           <View style={styles.section}>
                 <Image source={require('../../../Assets/images/study.png')} style={[styles.image, styles.center]}></Image>
            {Courses.map((item: any, index) => (
                <Card style={styles.card}>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between'
                        , marginTop: 20, marginBottom: 10
                    }}>
                        <Text style={styles.sectionTitle}>{item.name}</Text>
                    </View>
                    <Card.Content>
                        <Card.Cover source={{ uri: item.image }} />
    
                    </Card.Content>
                    <Card.Actions>
                        <TouchableOpacity
                         onPress={() =>navigation.navigate('BadgeTemplate' , {course: item})}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Badge</Text>
                        </TouchableOpacity>
                    </Card.Actions>
                </Card>
            ))}

</View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    section: {
        marginBottom: 20,
    },
    TitlePage: {
        fontSize: FontSize.xLarge,
        fontWeight: 'bold',
        marginBottom: Spacing * 2,
        color: Colors.active,
        textAlign: 'center'
    },
    sectionTitle: {
        fontSize: FontSize.large,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.primary
    },
    title: {
        fontSize: FontSize.medium * 1.15,
        fontWeight: 'bold',
        color: Colors.primary, textAlign: 'left',
        marginTop: 15
    },
    Details: {
        fontSize: FontSize.medium,
        color: Colors.gray, textAlign: 'left',
        marginTop: 15
    },
    card: {
        width: 310, margin: 20,
        color: Colors.onPrimary,
        backgroundColor: Colors.onPrimary
    },
    image: {
        width: '80%',
        height: 250,
        resizeMode: 'contain',
        marginBottom: 20
    },
    center: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    button: {
        borderWidth: 2, // Adjust the border width as needed
        borderColor: Colors.secondary, // Set the default border color here
        padding: 8,
        borderRadius: 15,
        alignItems: 'center',
        marginRight: 5
    },
    buttonText: {
        fontSize: FontSize.medium,
        color: Colors.secondary, // Set the text color to match the border color
    }
});

export default AllCourse;
