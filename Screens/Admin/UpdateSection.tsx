/* eslint-disable prettier/prettier */
/* eslint-disable radix */
import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text, ScrollView, Alert} from 'react-native';
import {Provider, Card, Button} from 'react-native-paper';
import axios from 'axios';

const UpdateSection = (props: any) => {
  const {item} = props.route.params;
  const [courseid] = useState(item.courseid);
  const [datefrom, setDateFrom] = useState(item.datefrom);
  const [dateto, setDateTo] = useState(item.dateto);
  const [name, setName] = useState(item.name);
  const [duration, setDuration] = useState(item.duration);
  const [sectionnum, setSectionNum] = useState(item.sectionnum);
  const [image, setImage] = useState(item.image);
  const [userid] = useState(item.userid);
  const [coursenum, setCourseNum] = useState(item.coursenum);

  const handleSaveChanges = () => {
    axios
      .put(
        '  https://7df1-2a01-9700-1091-6200-5159-9f77-3e8f-df36.ngrok-free.app/api/Course/Update',
        {
          courseid: courseid,
          datefrom: datefrom,
          dateto: dateto,
          name: name,
          duration: parseInt(duration),
          sectionnum: parseInt(sectionnum),
          image: image,
          userid: userid,
          coursenum: coursenum,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(() => {
        Alert.alert('Updated Successfully');
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Sections'}],
        });
      })
      .catch(err => console.log(err));
  };

  return (
    <Provider>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <Card.Title title="The Learning Hub" subtitle="Edit the Section" />
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
            <Text>Image URL</Text>
            <TextInput
              style={styles.input}
              value={image}
              onChangeText={(text) => setImage(text)}
              placeholder="Image URL"
            />
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

export default UpdateSection;
