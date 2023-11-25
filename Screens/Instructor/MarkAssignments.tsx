/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Colors';
function MarkAssignments({route}:any) {
  const [assignment, setAssignments] = useState(route.params.Assignment);
  const [assignmentsid] = useState(assignment.assignmentsid);
  const [dataSource, setDataSource] = useState([]);
  const [userDetails,setUserDetails] :any = useState({});
  const [mark, setMark] = useState('-1');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(

          ' https://916d-92-253-117-43.ngrok-free.app/api/AssignmentTr',
        );
        const responseJson = response.data;
        const filteredData = responseJson.filter(
          (item:any) => item.assignmentsid == assignmentsid,
        );
        setDataSource(filteredData);

        const userPromises = filteredData.map((item:any) => GetUser(item.userid));
        const usersData = await Promise.all(userPromises);
        const usersDetails = usersData.reduce((acc, userDetails, index) => {
          acc[filteredData[index].userid] = userDetails;
          return acc;
        }, {});
        setUserDetails(usersDetails);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();

    const closeModalListener = navigation.addListener('focus', () => {
      if (!modalVisible) {
        fetchData();
      }
    });

    return () => {
      closeModalListener();
    };
  }, [assignmentsid, modalVisible, navigation]);

  const openURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL'));
  };

  const markAnswer = async (item:any) => {
    try {
      const getAss = await axios.get(
        ` https://916d-92-253-117-43.ngrok-free.app/api/Assignment/GetAssignmentById/${item.assignmentsid}`
      );
      const Assignment = getAss.data;
  if (parseInt(mark, 10) > parseInt(Assignment.mark, 10)) {
      Alert.alert('Input mark is More than existing mark!');
      return;
    }
      await axios.put(
        ' https://916d-92-253-117-43.ngrok-free.app/api/AssignmentTr/Update',
        {
          atid: item.atid,
          submitdate: item.submitdate,
          mark: mark,
          assignmentsid: item.assignmentsid,
          userid: item.userid,
          assignmenturl:item.assignmenturl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      Alert.alert('Marked Successfully');
      setModalVisible(false);
    } catch (error) {
      console.log('Error marking:', error);
    }
  };

  const GetUser = (id:any) => {
    return axios
      .get(
        ` https://916d-92-253-117-43.ngrok-free.app/api/User/GetUserById/${id}`,
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        throw error;
      });
  };

  return (
    <ScrollView>
      {dataSource.map((item:any) => (
        <View key={item.atid} style={styles.card}>
          <Text >Submission</Text>
          <View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date Submitted:</Text>
              <Text>{item.submitdate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mark:</Text>
              <Text>{item.mark}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text>
                {userDetails[item.userid]?.firstname}{' '}
                {userDetails[item.userid]?.lastname}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Link:</Text>
              <Text
                  style={{color: Colors.secondary}}
                  onPress={() =>
                    openURL(item.assignmenturl || '')
                  }>
                  {item.assignmenturl || 'Unknown'}
                </Text>
            </View>
          </View>
          <Button
            onPress={() => setModalVisible(true)}
            title="Mark the answer"
          />
          <Modal
            animationIn="slideInDown"
            isVisible={modalVisible}
            onResponderStart={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>Enter Mark:</Text>
                <View >
                  <TextInput
                    style={styles.input}
                    value={mark}
                    onChangeText={text => setMark(text)}
                    keyboardType="numeric"
                  />
                  <View style={styles.buttonContainer}>
                    <Button onPress={() => markAnswer(item)} title="Submit" />
                    <Button
                      onPress={() => setModalVisible(false)}
                      title="Close"
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  card: {
    borderWidth: 0,
    borderRadius: 10,
    padding: 15,
    margin: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    width: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
export default MarkAssignments;
