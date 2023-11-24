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
    courseData.forEach((course) => {
      if (course.sectionnum > maxSection) {
        maxSection = course.sectionnum;
      }
    });
    return maxSection;
  };
  const maxSection = getMaxSectionNumber();
  const newSectionNum = maxSection + 1;
  const handleCreate = async () => {

    const startDate = new Date(`${courseData[0].datefrom.split('T')[0]}T${datefrom}:00.000Z`);

    const endDate = new Date(`${courseData[0].dateto.split('T')[0]}T${dateto}:00.000Z`);

    if (file != null) {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: file[0].uri,
          type: file[0].type || 'application/octet-stream',
          name: file[0].name || 'file',
        });

        await axios
          .post(
            'https://d199-92-253-117-43.ngrok-free.app/api/Upload/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
          .then(async (res: any) => {
            const responseData = res.data;
            // console.log(responseData);
            axios
              .post(
                ' https://d199-92-253-117-43.ngrok-free.app/api/Course/Create',
                {
                  datefrom: startDate,
                  dateto: endDate,
                  name: courseData[0].name,
                  duration: parseInt(courseData[0].duration),
                 sectionnum: newSectionNum,
                  image: responseData,
                  userid: parseInt(userid),
                  coursenum: courseData[0].coursenum,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              )
              .then(() => {
                Alert.alert('Created Successfully');

              })
              .catch(err => console.log(err));
          });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      axios
        .post(
          ' https://d199-92-253-117-43.ngrok-free.app/api/Course/Create',
          {
            datefrom: startDate,
            dateto: endDate,
            name: courseData[0].name,
            duration: parseInt(courseData[0].duration),
            sectionnum: newSectionNum,
            image:
              'https://ik.imagekit.io/bspelc5r6/6-convincing-reasons-take-elearning-course.jpg?updatedAt=1700505559366',
            userid: parseInt(userid),
            coursenum: courseData[0].coursenum,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => {
          Alert.alert('Created Successfully');

        })
        .catch(err => console.log(err));
    }
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
              <Text>User id</Text>
              <TextInput
                style={styles.input}
                value={userid.toString()}
                onChangeText={text => setUserid(text)}
                keyboardType="numeric"
                placeholder="User id"
              />
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
});

export default CreateSection;
