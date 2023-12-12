/* eslint-disable prettier/prettier */
/* eslint-disable radix */
import React, {useState,useEffect} from 'react';
import {View, StyleSheet, TextInput, Text, ScrollView, Alert} from 'react-native';
import {Provider, Card, Button} from 'react-native-paper';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
const UpdateSection = ({route,navigation}: any) => {
  const {item} = route.params;
  const [courseid] = useState(item.courseid);
  const [datefrom, setDateFrom] = useState(item.datefrom);
  const [dateto, setDateTo] = useState(item.dateto);
  const [name, setName] = useState(item.name);
  const [sectionnum, setSectionNum] = useState(item.sectionnum);
  const [image] = useState(item.image);
  const [userid] = useState(item.userid);
  const [coursenum, setCourseNum] = useState(item.coursenum);
  const [selectedInstructor, setSelectedInstructor] : any = useState(null);
  const [instructors, setInstructors] :any = useState([]);
  const [file, setFile]: any = useState(null);
  function getdate(date: any) {
    const dateTime = new Date(date);

    const formattedDate = dateTime.toLocaleDateString();

    return formattedDate;
  }

  const getUserByID = async (userID:any) => {
    try {
      const response = await axios.get(
        `https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/User/GetUserById/${userID}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };
  const handleInstructorSelect = async (instructorID : any) => {
    const selectedUser = await getUserByID(instructorID);
    setSelectedInstructor(selectedUser);
  };
  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.pick({
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
  const handleSaveChanges = async () => {
    let checkf = false;
    let checkl = false;

    const startDate = new Date(`${item.datefrom.split('T')[0]}T${datefrom}:00.000Z`);
    startDate.setHours(startDate.getHours());

    const endDate = new Date(`${item.dateto.split('T')[0]}T${dateto}:00.000Z`);
    endDate.setHours(endDate.getHours());

    const start_s = startDate.getHours();
    const end_s = endDate.getHours();

    if (start_s >= end_s || start_s < 8 || end_s > 17) {
      checkf = true;
    }

    if (!checkf) {
      const start = new Date(datefrom).getHours();
      const end = new Date(dateto).getHours();
      if (checkl) {
        return;
      }

      if ((start_s >= start && start_s < end) || (end_s > start && end_s <= end)) {
        checkl = true;
      }
    } else {
      Alert.alert('You entered a time that is outside working hours or is invalid');
    }

    if (!checkl && !checkf) {
      try {
        if (file !== null) {
          const formData = new FormData();
          formData.append('file', {
            uri: file[0].uri,
            type: file[0].type || 'application/octet-stream',
            name: file[0].name || 'file',
          });

          const uploadResponse = await axios.post(
            'https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Upload/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          const responseData = uploadResponse.data;

          await axios.put(
            'https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Course/Update',
            {
              courseid: courseid,
              datefrom: startDate,
              dateto: endDate,
              name: name,
              duration: '1',
              sectionnum: parseInt(sectionnum),
              image: responseData,
              userid: parseInt(selectedInstructor.userid),
              coursenum: coursenum,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        } else {
          await axios.put(
            'https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Course/Update',
            {
              courseid: courseid,
              datefrom: startDate,
              dateto: endDate,
              name: name,
              duration: '1',
              sectionnum: parseInt(sectionnum),
              image: image,
              userid: userid,
              coursenum: coursenum,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }

        Alert.alert('Updated Successfully');
        navigation.navigate('ManageSections');
      } catch (error) {
        console.error('Error updating Section:', error);
        Alert.alert('Failed to update. Please try again.');
      }
    }
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const fetchedInstructors = await axios.get(
          'https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/User',
        );
        const filteredInstructors = fetchedInstructors.data.filter(
          (instructor : any) => instructor.roleid == '2',
        );

        //console.log('Filtered Instructors:', filteredInstructors);
        setInstructors(filteredInstructors);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      }
    };
    fetchInstructors();
  }, []);

  return (
    <Provider>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <Card.Title title="The Learning Hub" subtitle="Edit the Section" />
        <Card.Content>
        <View style={styles.rowContainer}>
          <View style={styles.halfInput}>
            <Text>Course Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              editable={false}
            />
          </View>
          <View style={styles.halfInput}>
            <Text>Course Number</Text>
            <TextInput
              style={styles.input}
              value={coursenum}
              onChangeText={(text) => setCourseNum(text)}
              editable={false}
            />
          </View>
          </View>
          <View style={styles.rowContainer}>
          <View style={styles.halfInput}>
            <Text>Section Number</Text>
            <TextInput
              style={styles.input}
              value={sectionnum.toString()}
              onChangeText={(text) => setSectionNum(text)}
              keyboardType="numeric"
              editable={false}
            />
          </View>
          <View style={styles.halfInput}>
                <Button onPress={pickDocument}>Upload Image </Button>
              </View>
          </View>
          <View style={styles.rowContainer}>
              <View style={styles.halfInput}>
                <Text>Start Date</Text>
                <TextInput
                  style={styles.input}
                  value={getdate(item.datefrom)}
                  editable={false}
                />
              </View>
              <View style={styles.halfInput}>
                <Text>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={getdate(item.dateto)}
                  editable={false}
                />
              </View>
            </View>
          <View style={styles.rowContainer}>
              <View style={styles.halfInput}>
                <Text>Start Time</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setDateFrom(text)}
                  placeholder="Start Time"
                />
              </View>
              <View style={styles.halfInput}>
                <Text>End Time</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setDateTo(text)}
                  placeholder="End Time"
                />
              </View>
            </View>
            <View>
              <Text>Select Instructor</Text>
              <Picker
                selectedValue={
                  selectedInstructor ? selectedInstructor.userid : ''
                }
                onValueChange={itemValue => handleInstructorSelect(itemValue)}>
                {instructors.map((instructor:any) => (
                  <Picker.Item
                    key={instructor.userid}
                    label={`${instructor.firstname} ${instructor.lastname}`}
                    value={instructor.userid}
                  />
                ))}
              </Picker>
            </View>
        </Card.Content>
        <Card.Actions >
          <Button
            style={styles.btnSec}
            mode="contained"
            onPress={handleSaveChanges}>
            SAVE
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
  halfInput:{width:'48%'},
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width:'90%',
    backgroundColor: '#fff',
    borderRadius: 10,
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
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default UpdateSection;
