/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable radix */
import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text, ScrollView, Alert} from 'react-native';
import {Provider, Card, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';

const CreateSection = ({navigation}:any) => {
  const [datefrom, setDateFrom] = useState('');
  const [dateto, setDateTo] = useState('');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [sectionnum, setSectionNum] = useState('');
  const [userid,setUserid] = useState('');
  const [coursenum, setCourseNum] = useState('');
  const [file, setFile] : any = useState(null);


  const pickDocument = async () => {
    try {
      const result :any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      }).then((res:any) => {setFile(res);});


    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('Document picker cancelled');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };


  const handleCreate = async () => {
    if (file != null){
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file[0].uri,
        type: file[0].type || 'application/octet-stream',
        name: file[0].name || 'file',
      });


       await axios.post('https://44b3-92-253-55-73.ngrok-free.app/api/Upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(async (res:any) =>

      {
        const responseData = res.data;
       // console.log(responseData);
        axios
      .post(
        ' https://44b3-92-253-55-73.ngrok-free.app/api/Course/Create',
        {
          datefrom: datefrom,
          dateto: dateto,
          name: name,
          duration: parseInt(duration),
          sectionnum: parseInt(sectionnum),
          image: responseData,
          userid:  parseInt(userid),
          coursenum: coursenum,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(() => {
        Alert.alert('Created Successfully');
        navigation.reset({
          index: 0,
          routes: [{name: 'Sections'}],
        });
      })
      .catch(err => console.log(err));
      }

      );

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
    else {
      axios
      .post(

        ' https://44b3-92-253-55-73.ngrok-free.app/api/Course/Create',
        {
          datefrom: datefrom,
          dateto: dateto,
          name: name,
          duration: parseInt(duration),
          sectionnum: parseInt(sectionnum),
          image: 'https://ik.imagekit.io/bspelc5r6/6-convincing-reasons-take-elearning-course.jpg?updatedAt=1700505559366',
          userid:  parseInt(userid),
          coursenum: coursenum,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(() => {
        Alert.alert('Created Successfully');
        navigation.reset({
          index: 0,
          routes: [{name: 'Sections'}],
        });
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
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Course Name"
            />
          </View>
          <View>
            <Text>Course Number</Text>
            <TextInput
              style={styles.input}
              value={coursenum}
              onChangeText={(text) => setCourseNum(text)}
              placeholder="Course Number"
            />
          </View>
          <View>
            <Text>Section Number</Text>
            <TextInput
              style={styles.input}
              value={sectionnum.toString()}
              onChangeText={(text) => setSectionNum(text)}
              keyboardType="numeric"
              placeholder="Section Number"
            />
          </View>
          <View>

            <Button onPress={pickDocument} >Upload Document</Button>
          </View>
          <View>
            <Text>Start Date</Text>
            <TextInput
              style={styles.input}
              value={datefrom}
              onChangeText={(text) => setDateFrom(text)}
              placeholder="Start Date"
            />
          </View>
          <View>
            <Text>End Date</Text>
            <TextInput
              style={styles.input}
              value={dateto}
              onChangeText={(text) => setDateTo(text)}
              placeholder="End Date"
            />
          </View>
          <View>
            <Text>Duration</Text>
            <TextInput
              style={styles.input}
              value={duration.toString()}
              onChangeText={(text) => setDuration(text)}
              keyboardType="numeric"
              placeholder="Duration"
            />
          </View>
          <View>
            <Text>User id</Text>
            <TextInput
              style={styles.input}
              value={userid.toString()}
              onChangeText={(text) => setUserid(text)}
              keyboardType="numeric"
              placeholder="User id"
            />
          </View>
        </Card.Content>
        <Card.Actions >
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
