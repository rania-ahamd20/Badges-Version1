/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import Spacing from '../../constants/Spacing';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontSize from '../../constants/FontSize';
import Font from '../../constants/Font';
import axios from 'axios';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import {Card, Icon} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
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

const CourseDetailsTr = ({route, navigation}: any) => {
  const [Course, setCourse]: any = useState(route.params.course);
  const [Users, setUsers]: any = useState([]);

  const [instructor, setinst]: any = useState({});
  const [UsersC, setCt]: any = useState([]);
  const [Check, setCheck] = useState(false);

  const [User, setUser]: any = useState([]);
  const [Assignments, setAssignments]: any = useState([]);
  const [selectedAssignment, setSelectedAssignment]: any = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [file, setFile]: any = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  const Upload = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsVisible(true);
  };

  const handleFileUpload = async Assignment => {
    if (!file) {
      Alert.alert('Please pick a file first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file[0].uri,
        type: file[0].type || 'application/octet-stream',
        name: file[0].name || 'file',
      });

      const response = await axios.post(
        'https://44b3-92-253-55-73.ngrok-free.app/api/Upload/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const responseData = response.data;
      if (response.status === 200) {
        axios
          .post(
            'https://44b3-92-253-55-73.ngrok-free.app/api/AssignmentTr',
            {
              submitdate: new Date(),
              mark: 0,
              assignmentsid: Assignment.assignmentsid,
              userid: User.userid,
              assignmenturl: responseData,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(() => {
            Alert.alert('Updated Successfully');
            setIsVisible(false);
          })
          .catch(err => console.log(err));

        await setFile(null);
      } else {
        Alert.alert('Error uploading file', responseData.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchDataUsers = async () => {
    await axios
      .get('https://44b3-92-253-55-73.ngrok-free.app/api/User')
      .then(async result1 => {
        setUsers(result1.data);
        setinst(result1.data.find((us: any) => us.userid === Course.userid));

        await axios
          .get(
            'https://44b3-92-253-55-73.ngrok-free.app/api/CourseTrainee/GetUserCourse/' +
              parseInt(Course.courseid, 10),
          )
          .then(async result => {
            setCt(result.data);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const getAllAssignments = courseId => {
    axios
      .get('https://44b3-92-253-55-73.ngrok-free.app/api/Assignment')
      .then(result => {
        const assignments = result.data.filter(
          assignment => assignment.courseid === courseId,
        );
        setAssignments(assignments);
      })
      .catch(err => console.log(err));
  };

  const getuserData = async () => {
    await AsyncStorage.getItem('userid').then(async (id: any) => {
      await axios
        .get(
          `https://44b3-92-253-55-73.ngrok-free.app/api/User/GetUserById/${parseInt(
            id,
            10,
          )}`,
        )
        .then(async (res: any) => {
          await setUser(res.data);
        });
    });
  };

  useEffect(() => {
    fetchDataUsers();
    getuserData();
    getAllAssignments(Course.courseid);
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            source={{uri: Course.image}}
            style={{
              width: '100%',
              height: 200,
              marginBottom: Spacing * 2,
              resizeMode: 'cover',
            }}
          />
          <Text style={styles.TitlePage}>
            {Course.name} ({Course.sectionnum})
          </Text>

          <View style={styles.containerb}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCheck(false)}>
              <Text
                style={[
                  styles.buttonText,
                  !Check ? {color: Colors.secondary} : {color: Colors.primary},
                ]}>
                Details
              </Text>
            </TouchableOpacity>

            <View style={styles.line} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => setCheck(true)}>
              <Text
                style={[
                  styles.buttonText,
                  Check ? {color: Colors.secondary} : {color: Colors.primary},
                ]}>
                Assignments
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {Check ? (
          <ScrollView>
            {Assignments.map(assignment => (
              <View
                key={assignment.assignmentsid}
                style={styles.assignmentCard}>
                <Text style={styles.assignmentTitle}>{assignment.name}</Text>
                <Text>Deadline: {getdate(assignment.deadline)}</Text>
                <Text>Mark out of: {assignment.mark}</Text>
                <Text>Description: {assignment.description}</Text>
                <Text>Link of Submission: {'assignmenturl' || 'Unknown'}</Text>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => Upload(assignment)}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <ScrollView style={styles.assignmentCard}>
            <Text style={styles.Text1}>Section : {Course.sectionnum}</Text>
            <Text style={styles.Text1}>
              Instructor : {instructor.firstname} {instructor.lastname}
            </Text>
            <Text style={styles.Text1}>Trainees Number : {UsersC.length}</Text>
            <Text style={styles.Text1}>
              Date : {getdate(Course.datefrom)} - {getdate(Course.dateto)}{' '}
            </Text>
            <Text style={styles.Text1}>
              Time : {getTime(Course.datefrom)} - {getTime(Course.dateto)}{' '}
            </Text>
          </ScrollView>
        )}
      </ScrollView>
      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.submitButton} onPress={pickDocument}>
            <Text style={styles.submitButtonText}>Choose a file</Text>
          </TouchableOpacity>
          {file && (
            <View style={{padding: 20, borderRadius: 10, marginBottom: 40}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="file"
                  type="font-awesome"
                  size={30}
                  style={{marginRight: 10}}
                />
                <Text style={{flex: 1}}>{file[0].name || 'Unknown'}</Text>
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleFileUpload(selectedAssignment)}>
                <Text style={styles.submitButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
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
    fontSize: FontSize.medium / 1.2,
    textAlign: 'left',
  },
  button1: {
    borderWidth: 2,
    borderColor: Colors.gray,
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
    marginRight: 5,
    width: 150,
  },
  buttonText1: {
    fontSize: FontSize.medium / 1.2,
    color: Colors.gray,
  },
  assignmentCard: {
    padding: 20,
    margin: 15,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  assignmentTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 20,
    borderRadius: 8,
    width: '80%',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default CourseDetailsTr;
