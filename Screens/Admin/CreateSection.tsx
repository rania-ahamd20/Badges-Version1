/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable radix */
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import {Provider, Card, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import {Picker} from '@react-native-picker/picker';

const CreateSection = ({navigation, route}: any) => {
  const [datefrom, setDateFrom] = useState('');
  const [dateto, setDateTo] = useState('');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [sectionnum, setSectionNum] = useState('');
  const [userid, setUserid] = useState('');
  const [coursenum, setCourseNum] = useState('');
  const [file, setFile]: any = useState(null);
  const {courseData} = route.params;
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const getUserByID = async userID => {
    try {
      const response = await axios.get(
        `https://d199-92-253-117-43.ngrok-free.app/api/User/GetUserById/${userID}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };
  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      }).then((res: any) => {
        setFile(res);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

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
  const getMaxSectionNumber = () => {
    let maxSection = 0;
    courseData.forEach(course => {
      if (course.sectionnum > maxSection) {
        maxSection = course.sectionnum;
      }
    });
    return maxSection;
  };
  const maxSection = getMaxSectionNumber();
  const newSectionNum = maxSection + 1;
  const handleCreate = async () => {
    try {
      const startDate = new Date(
        `${courseData[0].datefrom.split('T')[0]}T${datefrom}:00.000Z`,
      );
      const endDate = new Date(
        `${courseData[0].dateto.split('T')[0]}T${dateto}:00.000Z`,
      );

      if (file != null) {
        const formData = new FormData();
        formData.append('file', {
          uri: file[0].uri,
          type: file[0].type || 'application/octet-stream',
          name: file[0].name || 'file',
        });

        const response = await axios.post(
          'https://d199-92-253-117-43.ngrok-free.app/api/Upload/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        const responseData = response.data;

        const sectionResponse = await axios.post(
          ' https://d199-92-253-117-43.ngrok-free.app/api/Course/Create',
          {
            datefrom: startDate,
            dateto: endDate,
            name: courseData[0].name,
            duration: parseInt(courseData[0].duration),
            sectionnum: newSectionNum,
            image: responseData,
            userid: parseInt(selectedInstructor.userid),
            coursenum: courseData[0].coursenum,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const createdSectionId = sectionResponse.data.courseid;

        const attendanceData = {
          courseid: createdSectionId,
          attendanceid: 0,
        };

        await axios.post(
          'https://d199-92-253-117-43.ngrok-free.app/api/Attendance',
          attendanceData,
        );

        Alert.alert('Created Successfully', '', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ManageSections'),
          },
        ]);
      } else {
        const sectionResponse = await axios.post(
          ' https://d199-92-253-117-43.ngrok-free.app/api/Course/Create',
          {
            datefrom: startDate,
            dateto: endDate,
            name: courseData[0].name,
            duration: parseInt(courseData[0].duration),
            sectionnum: newSectionNum,
            image:
              'https://ik.imagekit.io/bspelc5r6/6-convincing-reasons-take-elearning-course.jpg?updatedAt=1700505559366',
            userid: parseInt(selectedInstructor.userid),
            coursenum: courseData[0].coursenum,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const createdSectionId = sectionResponse.data.courseid;

        const attendanceData = {
          courseid: createdSectionId,
          attendanceid: 0,
        };

        await axios.post(
          'https://d199-92-253-117-43.ngrok-free.app/api/Attendance',
          attendanceData,
        );

        Alert.alert('Created Successfully', '', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ManageSections'),
          },
        ]);
      }
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const fetchedInstructors = await axios.get(
          'https://d199-92-253-117-43.ngrok-free.app/api/User',
        );
        const filteredInstructors = fetchedInstructors.data.filter(
          instructor => instructor.roleid == '2',
        );

        //console.log('Filtered Instructors:', filteredInstructors);
        setInstructors(filteredInstructors);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      }
    };
    fetchInstructors();
  }, []);

  const handleInstructorSelect = async instructorID => {
    const selectedUser = await getUserByID(instructorID);
    setSelectedInstructor(selectedUser);
  };
  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Title title="The Learning Hub" subtitle="Add a Section" />
          <Card.Content>
            <View>
              <Text>Course Name</Text>
              <TextInput
                style={styles.input}
                value={courseData[0].name}
                editable={false}
              />
            </View>
            <View>
              <Text>Course Number</Text>
              <TextInput
                style={styles.input}
                value={courseData[0].coursenum}
                editable={false}
              />
            </View>
            <View>
              <Text>Section Number</Text>
              <TextInput
                style={styles.input}
                value={newSectionNum.toString()}
                editable={false}
              />
            </View>
            <View>
              <Button onPress={pickDocument}>Upload Document</Button>
            </View>
            <View>
              <Text>Start Date</Text>
              <TextInput
                style={styles.input}
                value={getdate(courseData[0].datefrom)}
                editable={false}
              />
            </View>
            <View>
              <Text>Start Time</Text>
              <TextInput
                style={styles.input}
                value={datefrom}
                onChangeText={text => setDateFrom(text)}
                placeholder="Start Time"
              />
            </View>
            <View>
              <Text>End Date</Text>
              <TextInput
                style={styles.input}
                value={getdate(courseData[0].dateto)}
                editable={false}
              />
            </View>
            <View>
              <Text>End Time</Text>
              <TextInput
                style={styles.input}
                value={dateto}
                onChangeText={text => setDateTo(text)}
                placeholder="End Time"
              />
            </View>
            <View>
              <Text>Select Instructor</Text>
              <Picker
                selectedValue={
                  selectedInstructor ? selectedInstructor.userid : ''
                }
                onValueChange={itemValue => handleInstructorSelect(itemValue)}
                style={styles.picker}>
                {instructors.map(instructor => (
                  <Picker.Item
                    key={instructor.userid}
                    label={`${instructor.firstname} ${instructor.lastname}`}
                    value={instructor.userid}
                  />
                ))}
              </Picker>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              style={styles.btnSec}
              mode="contained"
              onPress={handleCreate}>
              Add
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF7FA',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 380,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    padding: 15,
    marginBottom: 20,
    marginTop: 30,
    alignSelf: 'center',
  },
  btnSec: {
    marginHorizontal: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: 'white',
    color: 'black',
  },
});

export default CreateSection;
