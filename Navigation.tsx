/* eslint-disable eqeqeq */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useEffect, useState} from 'react';
import Login from './Screens/Login';
import Courses from './Screens/Admin/Courses';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Colors from './constants/Colors';
import CourseDetails from './Screens/Admin/CourseDetails';
import Sections from './Screens/Admin/Sections';
import CreateSection from './Screens/Admin/CreateSection';
import UpdateSection from './Screens/Admin/UpdateSection';
import TakeAttendance from './Screens/Instructor/TakeAttendance';
import GetAllTrainee from './Screens/Admin/GetAllTrainee';
import AddTraineeToCourse from './Screens/Admin/AddTrineeCourse';
import AddTrainee from './Screens/Admin/AddTrainee';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InstrctorPage from './Screens/Instructor/InstructorPage';
import Assignments from './Screens/Instructor/Assignments';
import MarkAssignments from './Screens/Instructor/MarkAssignments';
import UploadFileComponent from './Screens/Trainee/Uploadfile';
import Criteria from './Screens/Admin/Criteria';
import HomeTrainee from './Screens/Trainee/TraineeHome';
import CourseDetailsTr from './Screens/Trainee/CourseDetailsTr';
import ProfileScreen from './Screens/Trainee/Profile';
import Loading from './Components/Loading';
import SettingsScreen from './Screens/Settings';
import CourseDetailsInst from './Screens/Instructor/CourseDetailsInst';
import UploadFile from './Screens/Admin/UploadFile';
import GenerateBadge from './Screens/Admin/GenerateBadge';
import SimpleLineIconsI from 'react-native-vector-icons/SimpleLineIcons';
import Leaderboards from './Screens/System/Leaderboards';
import ManualBadges from './Screens/Admin/ManualBadges';
import ShowBadges from './Screens/Trainee/ShowBadge';
function navigation() {
  const StackIns = createNativeStackNavigator();
  const StackAdmin = createNativeStackNavigator();
  const StackTrainee = createNativeStackNavigator();
  const [role, Setrole]: any = useState();
  const [userid, setuser]: any = useState();
  const [loading, setloading]: any = useState(true);
  let idforuser: any;
  const checkuser = async () => {
    await AsyncStorage.getItem('role').then(async result => {
      //console.log("role User", result);
      await Setrole(result);
    });
    //console.log("roles User", role);

    await AsyncStorage.getItem('userid').then(async result => {
      if (result) {
        await setuser(result?.toString());
      } else {
        await setuser(4);
      }
    });
  };

  useEffect(() => {
    checkuser();
  }, [role]);

  const NavigatorInstractor = () => {
    return (
      <StackIns.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: Colors.secondary},
          headerTintColor: 'white',
          headerShown: false,
        }}>
        <StackIns.Screen
          name="InstrctorPage"
          component={InstrctorPage}
          options={{title: 'My Courses'}}
        />
        <StackIns.Screen
          name="CourseDetailsInst"
          component={CourseDetailsInst}
          options={{title: 'Info'}}
        />
        <StackIns.Screen name="Assignments" component={Assignments} />
        <StackIns.Screen name="TakeAttendance" component={TakeAttendance} />
        <StackIns.Screen name="MarkAssignments" component={MarkAssignments} />
        <StackIns.Screen name="Leaderboards" component={Leaderboards} />
      </StackIns.Navigator>
    );
  };

  const NavigatorStackForTrainee = () => {
    return (
      <StackTrainee.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: Colors.secondary},
          headerTintColor: 'white',
          headerShown: false,
        }}>
        <StackTrainee.Screen name="HomeTrainee" component={HomeTrainee} />
        <StackTrainee.Screen name="CDetails" component={CourseDetailsTr} />
        <StackTrainee.Screen name="Leaderboards" component={Leaderboards} />
      </StackTrainee.Navigator>
    );
  };

  const NavigatorManageBadges = () => {
    return (
      <StackAdmin.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: Colors.secondary},
          headerTintColor: 'white',
          headerShown: false,
        }}>
        <StackAdmin.Screen
          name="Criteria"
          options={{title: 'Badges'}}
          component={Criteria}
        />
        <StackAdmin.Screen name="GenerateBadge" component={GenerateBadge} />
        <StackAdmin.Screen name="ManualBadges" component={ManualBadges} />
      </StackAdmin.Navigator>
    );
  };

  const NavigatorStackForAdmin = () => {
    return (
      <StackAdmin.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: Colors.secondary},
          headerTintColor: 'white',
          headerShown: false,
        }}>
        <StackAdmin.Screen name="Courses" component={Courses} />
        <StackAdmin.Screen name="Login" component={Login} />
        <StackAdmin.Screen name="CourseDetails" component={CourseDetails} />
        <StackAdmin.Screen name="ManageSections" component={Sections} />
        <StackAdmin.Screen name="CreateSection" component={CreateSection} />
        <StackAdmin.Screen name="UpdateSection" component={UpdateSection} />
        <StackAdmin.Screen
          name="AddTraineeToCourse"
          component={AddTraineeToCourse}
        />
        <StackAdmin.Screen name="Leaderboards" component={Leaderboards} />
      </StackAdmin.Navigator>
    );
  };

  const NavigatorManageTrainee = () => {
    return (
      <StackAdmin.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: Colors.secondary},
          headerTintColor: 'white',
          headerShown: false,
        }}>
        <StackAdmin.Screen name="GetAllTrainee" component={GetAllTrainee} />
        <StackAdmin.Screen name="AddTrainee" component={AddTrainee} />
      </StackAdmin.Navigator>
    );
  };
  const Tap = createMaterialTopTabNavigator();

  const TabTrainee = ({route}: any) => {
    return (
      <Tap.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: Colors.secondary},
          tabBarPressColor: 'white',
          tabBarInactiveTintColor: 'white',
          tabBarActiveTintColor: 'white',
          tabBarShowLabel: false,
        }}>
        <Tap.Screen
          name="Stack"
          component={NavigatorStackForTrainee}
          options={{
            tabBarIcon: () => <Icon name="book" color={'white'} size={25} />,
          }}
        />

        <Tap.Screen
          name="Profile"
          component={StackAchivments}
          options={{
            tabBarIcon: () => <Icon name="trophy" color={'white'} size={25} />,
          }}
        />

        <Tap.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => <Icon name="cog" color={'white'} size={25} />,
          }}
        />
      </Tap.Navigator>
    );
  };
  const stackach = createNativeStackNavigator();

  const StackAchivments = () => {
    return (
      <stackach.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: Colors.secondary},
          headerTintColor: 'white',
          headerShown: false,
        }}>
        <stackach.Screen name="profile" component={ProfileScreen} />
        <stackach.Screen name="ShowBadges" component={ShowBadges} />
      </stackach.Navigator>
    );
  };
  const Tap1 = createMaterialTopTabNavigator();
  const Tabadmin = () => {
    return (
      <Tap1.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: Colors.secondary},
          tabBarPressColor: 'white',
          tabBarInactiveTintColor: 'white',
          tabBarActiveTintColor: 'white',
          tabBarShowLabel: false,
        }}>
        <Tap1.Screen
          name="Stack"
          component={NavigatorStackForAdmin}
          options={{
            tabBarIcon: () => <Icon name="book" color={'white'} size={25} />,
          }}
        />
        <Tap1.Screen
          name="Profile"
          component={NavigatorManageTrainee}
          options={{
            tabBarIcon: () => (
              <Icon name="user-circle" color={'white'} size={25} />
            ),
          }}
        />

        <Tap1.Screen
          name="Badges"
          component={NavigatorManageBadges}
          options={{
            title: 'Badges',
            tabBarIcon: () => (
              <SimpleLineIconsI name="badge" color={'white'} size={25} />
            ),
          }}
        />

        <Tap1.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => <Icon name="cog" color={'white'} size={25} />,
          }}
        />
      </Tap1.Navigator>
    );
  };

  const Tap2 = createMaterialTopTabNavigator();

  const TabInst = () => {
    return (
      <Tap2.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: Colors.secondary},
          tabBarPressColor: 'white',
          tabBarInactiveTintColor: 'white',
          tabBarActiveTintColor: 'white',
          tabBarShowLabel: false,
        }}>
        <Tap1.Screen
          name="Stack"
          component={NavigatorInstractor}
          options={{
            tabBarIcon: () => <Icon name="book" color={'white'} size={25} />,
          }}
        />

        <Tap1.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => <Icon name="cog" color={'white'} size={25} />,
          }}
        />
      </Tap2.Navigator>
    );
  };

  const stackall = createNativeStackNavigator();

  return userid ? (
    <NavigationContainer>
      <stackall.Navigator
        initialRouteName={
          role == 1
            ? 'Admin'
            : role == 2
            ? 'Instractor'
            : role == 3
            ? 'Trainee'
            : 'Login'
        }
        screenOptions={{headerShown: false}}>
        <stackall.Screen name="Admin" component={Tabadmin} />
        <stackall.Screen name="Instractor" component={TabInst} />
        <stackall.Screen name="Login" component={Login} />
        <stackall.Screen name="Trainee" component={TabTrainee} />
      </stackall.Navigator>
    </NavigationContainer>
  ) : (
    <Loading />
  );
}

export default navigation;
