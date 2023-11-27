/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import Picture from '../../Components/Picture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loading from '../../Components/Loading';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontSize from '../../constants/FontSize';

function getdate(date: any) {
  const dateTime = new Date(date);

  const formattedDate = dateTime.toLocaleDateString();

  return formattedDate;
}

const ProfileScreen = ({ navigation }: any) => {

  const [user, setUser]: any = useState();
  const [courses, setCourses]: any = useState();
  const [badges, setBadges]: any = useState();
  const [badgesTr, setBadgesTr]: any = useState();
  const [visibleTexts, setVisibleTexts]: any = useState([]);
  const [assignmentuser, setAssignments]: any = useState();
  const [adminbadges, setbadgesAdmin]: any = useState();

  const toggleTextVisibility = (index: any) => {
    const newVisibleTexts = [...visibleTexts];
    newVisibleTexts[index] = !newVisibleTexts[index];
    setVisibleTexts(newVisibleTexts);
  };

  const getAssignments = async () => {
    await axios.get('https://bb39-92-253-117-43.ngrok-free.app/api/Assignment')
      .then(async (res: any) => {
        setAssignments(res.data);
      });

  }

  const getuserData = async () => {
    await AsyncStorage.getItem('userid').then(async (id: any) => {
      await axios.get(`https://bb39-92-253-117-43.ngrok-free.app/api/User/GetUserById/${parseInt(id)}`)
        .then(async (res: any) => {

          await setUser(res.data)

        })

      await axios
        .get(
          'https://bb39-92-253-117-43.ngrok-free.app/api/CourseTrainee/GetCoursesUser/' +
          parseInt(id)
        )
        .then(async Co => {
          const obj = {
            name: "You earned",
            userid: id,
          };
        
          const data = [...Co.data , obj];
        
          setCourses(data);


          await axios.get(
            'https://bb39-92-253-117-43.ngrok-free.app/api/Badges',
          ).then(async (badge: any) => {
            const fetchedBadges = badge.data;

            const fetchedAdmin = fetchedBadges.filter((fa:any) => fa.type.includes('ByAdmin'));
            const badgesid = fetchedAdmin.map((item: any) => item.badgesid);
            setbadgesAdmin(badgesid);

            const criteriacourse = fetchedBadges.find((c: any) => c.type.includes('course') && c.text.includes('Heigh Mark'))

            const criteriaAssignment = fetchedBadges.find((c: any) => c.type.includes('Assignment') && c.text.includes('Top Code'))

            const criteriaAttendance = fetchedBadges.find((c: any) => c.type.includes('Attendance'))
            setBadges(fetchedBadges);

            await axios.get(
              'https://bb39-92-253-117-43.ngrok-free.app/api/BadgesTr',
            ).then((badgeTr: any) => {
              const fetchedBadgesTr = badgeTr.data;

              setBadgesTr(fetchedBadgesTr);


              Co.data.map(async (item: any) => {

                if (criteriacourse.activecriteria) {
                  if (item.mark >= 90) {
                    const checkbadge = fetchedBadgesTr.find((bt: any) => bt.badgesid == criteriacourse.badgesid && bt.userid == id)

                    if (!checkbadge)
                      createbadgescourse(criteriacourse.badgesid, item.courseid, id);
                  }
                }

                await axios
                  .get(
                    `https://bb39-92-253-117-43.ngrok-free.app/api/AssignmentTr/GetAU/${parseInt(id)}/${parseInt(item.courseid)}`,
                  )
                  .then(async (fetchassignment: any) => {
                    const assignments = fetchassignment.data;

                    assignments.map(async (assignment: any) => {

                      const checkbadgeAss = fetchedBadgesTr.filter((bt: any) => bt.assignmentsid == assignment.assignmentsid && bt.userid == id)




                      if (checkbadgeAss.length == 0) {
                        if (criteriaAssignment.activecriteria.includes(',')) {

                          if (assignment.traineeMark >= parseInt(assignment.assignmentMark) * 80 / 100 && assignment.submitdate <= assignment.deadline) {
                            createbadgesAssignments(criteriaAssignment.badgesid, item.courseid, id, assignment.assignmentsid);
                          }
                        } else if (criteriaAssignment.activecriteria.includes('Submit')) {
                          if (assignment.submitdate <= assignment.deadline) {
                            createbadgesAssignments(criteriaAssignment.badgesid, item.courseid, id, assignment.assignmentsid);
                          }
                        } else if (criteriaAssignment.activecriteria.includes('Mark')) {
                          if (assignment.traineeMark >= parseInt(assignment.assignmentMark) * 80 / 100) {
                            createbadgesAssignments(criteriaAssignment.badgesid, item.courseid, id, assignment.assignmentsid);
                          }
                        }
                      }
                    });

                  })

                await axios
                  .get(
                    `https://bb39-92-253-117-43.ngrok-free.app/api/Attendance/GetattendanceCourse/${parseInt(item.courseid)}`,
                  )
                  .then(async (AttendancesData: any) => {
                    const Attendances = AttendancesData.data.filter((at: any) => at.userid == id && at.checkat == 0).length;
                    const date = new Date();

                    const checkbadgeAtt = fetchedBadgesTr.filter((bt: any) => bt.badgesid == 3 && bt.userid == id)
                    if (checkbadgeAtt.length == 0) {
                      if (criteriaAttendance.activecriteria.includes('lectures')) {
                        if (getdate(item.dateto) <= getdate(date) && Attendances == 0) {
                          createbadgescourse(criteriaAttendance.badgesid, item.courseid, id);
                        }
                      }
                    }

                  })

              })

            })
          });
        })
    })
  }


  const createbadgescourse = async (Dbadgesid: any, Dcourseid: any, Duserid: any) => {
    console.log('Dcourseid', Dcourseid, 'badgesid', Dbadgesid, 'userid', Duserid)
    await axios.post(
      'https://bb39-92-253-117-43.ngrok-free.app/api/BadgesTr/Create',
      {
        courseid: Dcourseid,
        badgesid: Dbadgesid,
        userid: Duserid
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((response: any) => {
      console.log('create ')
    })

  }

  const createbadgesAssignments = async (Dbadgesid: any, Dcourseid: any, Duserid: any, Dassignmentsid: any) => {
    console.log('Dcourseid', Dcourseid, 'badgesid', Dbadgesid, 'userid', Duserid, 'Dassignmentsid', Dassignmentsid)
    await axios.post(
      'https://bb39-92-253-117-43.ngrok-free.app/api/BadgesTr/Create',
      {
        courseid: Dcourseid,
        badgesid: Dbadgesid,
        userid: Duserid,
        assignmentsid: Dassignmentsid
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((response: any) => {
      console.log('create Assignment')
    })

  }

  useEffect(() => {
    getAssignments();
    getuserData();
  }, []);

  function getbadges(id: any) {
    const cou = badges.find((b: any) => b.badgesid == id)
    return cou;
  }

  function getAssignment(id: any) {
    const assi = assignmentuser.find((a: any) => a.assignmentsid == id)
    return assi;
  }

  return (
    user && courses && badgesTr && assignmentuser ? (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <Picture imageuser={user.image} />
        <Text style={styles.title}>{user.firstname} {user.lastname}</Text>

        <ScrollView style={styles.container}>
          <Text style={styles.header}>Your Achievements</Text>
          {courses.map((course: any, index: any) => (
            course.name != 'You earned'?(
            <View style={{ marginBottom: 30 }} key={index}>
              <TouchableOpacity style={styles.card}
                onPress={() => toggleTextVisibility(index)}>

                <Text style={styles.title2}>{course.name}</Text>
                <Icon name={!visibleTexts[index] ? 'arrow-down' : 'arrow-up'} size={20} />

              </TouchableOpacity>

              <View style={styles.color}>
                {badgesTr.filter((bt: any) => bt.courseid == course.courseid && bt.userid == user.userid).map((badge: any, index1: any) => (
                  visibleTexts[index] &&
                  <View key={index1} style={styles.container2}>

                    <Image source={{ uri: getbadges(badge.badgesid).image }} style={styles.icon} />
                    {getbadges(badge.badgesid).type == 'Assignment' ? (
                      <Text>{getbadges(badge.badgesid).text} in Assignment {getAssignment(badge.assignmentsid).name}</Text>
                    ) : (
                      <Text>{getbadges(badge.badgesid).text} in Course</Text>
                    )
                    }

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.navigate('ShowBadges',
                        {
                          coursename: course.name, image: getbadges(badge.badgesid).image,
                          username: `${user.firstname} ${user.lastname}`, assiname: badge.assignmentsid ? getAssignment(badge.assignmentsid).name : '0'
                        })}>

                      <Text style={styles.buttonText}>Show</Text>
                    </TouchableOpacity>
                  </View>
                ))
                }
              </View>
            </View>)
            :
            (
              <View style={{ marginBottom: 30 }} key={index}>
              <TouchableOpacity style={styles.card}
                onPress={() => toggleTextVisibility(index)}>

                <Text style={styles.title2}>{course.name}</Text>
                <Icon name={!visibleTexts[index] ? 'arrow-down' : 'arrow-up'} size={20} />

              </TouchableOpacity>

              <View style={styles.color}>
                {badgesTr.filter((bt: any) => adminbadges.includes(bt.badgesid) && bt.userid == user.userid)
                .map((badge: any, index1: any) => (visibleTexts[index] &&
                  <View key={index1} style={styles.container2}>

                    <Image source={{ uri: getbadges(badge.badgesid).image }} style={styles.icon} />
                      <Text>{getbadges(badge.badgesid).text}</Text>
                      
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.navigate('ShowBadges',
                        {
                          coursename: getbadges(badge.badgesid).text, image: getbadges(badge.badgesid).image ,
                          username: `${user.firstname} ${user.lastname}`, assiname: badge.assignmentsid ? getAssignment(badge.assignmentsid).name : '0'
                        })}>
                      
                      <Text style={styles.buttonText}>Show</Text>
                    </TouchableOpacity>
                  </View>
                ))
                }
              </View>
              </View>
            )
          ))}

        </ScrollView>
      </ScrollView>
    ) : (<Loading />)
  )

}


const styles = StyleSheet.create({
  title: {
    textAlign: 'center', fontSize: 25, marginTop: 25, color: Colors.primary
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    alignContent: 'center',
    elevation: 3, // for Android shadow
  },
  icon: {
    marginRight: 16,
    width: 50,
    height: 50
  },
  title2: {
    fontSize: 16,
    fontWeight: 'bold',

  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 15
  },
  color: {
    marginTop: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    borderWidth: 2, // Adjust the border width as needed
    borderColor: Colors.secondary, // Set the default border color here
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 5
  },
  buttonText: {
    fontSize: FontSize.medium / 1.2,
    color: Colors.secondary, // Set the text color to match the border color
  }
});

export default ProfileScreen;