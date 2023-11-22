/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Provider, Card, Button } from 'react-native-paper';
import axios from 'axios';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

const Sections = ({ route , navigation}: any) => {
  const [dataSource, setDataSource] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const fetchUserData = async (id: any) => {
      try {
        const response = await axios.get(
          ` https://2c7d-92-253-55-73.ngrok-free.app/api/User/GetUserById/${id}`,
        );
        return response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };

    const formatDate = (dateString: any) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };








    axios
      .get(' https://2c7d-92-253-55-73.ngrok-free.app/api/Course')
      .then(async response => {
        const filteredCourse = response.data.filter(
          (item:any) => item.coursenum === route.params.coursenum,
        );
        const formattedData :any = await Promise.all(
          filteredCourse.map(async (item:any) => {
            const formattedFromDate = formatDate(item.datefrom);
            const formattedToDate = formatDate(item.dateto);
            const user = await fetchUserData(item.userid);
            return {
              ...item,
              datefrom: formattedFromDate,
              dateto: formattedToDate,
              user: user || {},
            };
          }),
        );
        setDataSource(formattedData);
      })
      .catch(error => console.error('Error fetching course data:', error));

  }, []);

  const handleDelete = (id: any) => {
    setSelectedCourseId(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (selectedCourseId) {
      axios
        .delete(
          `https://2c7d-92-253-55-73.ngrok-free.app/api/Course/Delete/${selectedCourseId}`,
        )
        .then(() => {
          Alert.alert('Section Deleted Successfully');
          setDataSource(prevDataSource =>
            prevDataSource.filter((item: any) => item.courseid !== selectedCourseId),
          );

          setShowConfirmation(false);
          setSelectedCourseId(null);
        })
        .catch(err => console.log(err));
    }
  };
  const cancelDelete = () => {
    setShowConfirmation(false);
    setSelectedCourseId(null);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.heading}>Course Sections</Text>
        <TouchableOpacity
          style={styles.addSectionButton}
          onPress={() => navigation.navigate('CreateSection')}>
          <Text style={styles.addSectionText}>Add Section</Text>
        </TouchableOpacity>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={dataSource}
          renderItem={({ item }: any) => (
            <Card style={styles.card}>
              <Card.Title title="The Learning Hub" subtitle="Beginner Level" />
              <Card.Content>
                <Text style={styles.cardTitle}>
                  {item.name} Course - Sec.{item.sectionnum}
                </Text>
                <Card.Cover
                  source={{ uri: item.image }}
                />
                <Text style={styles.cardContent}>
                  Duration: {item.datefrom} - {item.dateto}
                </Text>
                <Text style={styles.cardContent}>
                  Number of days: {item.duration}
                </Text>
                <Text style={styles.cardContent}>
                  Instructor Name:{' '}
                  {item.user.firstname + ' ' + item.user.lastname ||
                    'Loading...'}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.buttonContainer}>
                <Button
                  style={styles.btnDanger}
                  mode="contained"
                  onPress={() => handleDelete(item.courseid)}>
                  Remove
                </Button>
                <Button
                  style={styles.btnSec}
                  mode="contained"
                  onPress={() => navigation.navigate('UpdateSection', { item })}>
                  Edit
                </Button>
              </Card.Actions>
            </Card>
          )}
          keyExtractor={(item: any) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          extraData={dataSource}
        />
      </View>
      <Modal isVisible={showConfirmation}>
        <View style={styles.modalContainer}>
          <Text>Are you sure you want to delete this course section?</Text>
          <View style={styles.modalButtons}>
            <Button onPress={confirmDelete}>Delete</Button>
            <Button onPress={cancelDelete}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    backgroundColor: '#EFF7FA',
    alignItems: 'center',
  },
  heading: {
    marginVertical: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    width: 380,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  btnPri: {
    marginHorizontal: 5,
    backgroundColor: '#0033aa',
    borderRadius: 5,
  },
  btnSec: {
    marginHorizontal: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  btnDanger: {
    marginHorizontal: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  addSectionText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addSectionButton: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    backgroundColor: 'white',
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default Sections;
