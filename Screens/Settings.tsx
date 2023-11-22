import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image , ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loading from '../Components/Loading';
import FontSize from '../constants/FontSize';



const SettingsScreen = ({ navigation }: any) => {
    const [user, setUser]: any = useState();
    const getuserData = async () => {
        await AsyncStorage.getItem('userid').then(async (id: any) => {
            await axios.get(`https://2c7d-92-253-55-73.ngrok-free.app/api/User/GetUserById/${parseInt(id)}`)
                .then(async (res: any) => {

                    console.log('User : ', res.data);
                    await setUser(res.data)

                })
        })
    }


    useEffect(() => {
        getuserData();
    }, []);


    const logout = async () => {

        await AsyncStorage.clear();

        navigation.replace('Login');
    }

    return (
        user ? (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Settings</Text>
                <View style={styles.settingimage}>

                    <Image
                        style={styles.profilePicture}
                        source={{ uri: user.image }}
                    />

                    <Text style={styles.settingName}>{user.firstname} {user.lastname}</Text>
                </View>
                <View style={styles.setting} >
                    <Text style={styles.settingText}>Email : {user.email}</Text>
                </View>
                <View style={styles.setting} >
                    <Text style={styles.settingText}>Phone Number : {user.phone}</Text>
                </View>
                <View style={styles.horizontalLine} />
                <View style={styles.setting} >
                    <Text style={styles.settingText} onPress={logout}>Logout</Text>
                    <Icon name="angle-right" size={30} color={Colors.gray} onPress={logout}
                    />
                </View>

            </ScrollView>) : (
            <View>
                <Loading />
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: FontSize.large * 1.2,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    settingimage: {

        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,

    },
    settingName: {
        fontSize: FontSize.large * 1.2,
    },
    settingText: {
        fontSize: 18,
    },

    profilePicture: {
        width: 80, // Adjust the size as needed
        height: 80,
        borderRadius: 75, // Make it a circle
        marginRight: 25
    },
    horizontalLine: {
        borderBottomColor: Colors.gray, // You can change the color
        borderBottomWidth: 1,       // You can change the width
        width: '100%',             // This makes the line span the width of the screen
        marginVertical: 20,         // Adjust as needed
    },
});

export default SettingsScreen;