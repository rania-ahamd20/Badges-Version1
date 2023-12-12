/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Modal from 'react-native-modal';
import Loading from '../../Components/Loading';
import DateTimePicker from '@react-native-community/datetimepicker';

const Assignments = ({route, navigation}: any) => {
  const [item, setitem] = useState(route.params.course);

  const [courseid] = useState(item.courseid);
  const [coursename] = useState(item.name);
  const [sectionnum] = useState(item.sectionnum);
  const [assignments, setAssignments]: any = useState([]);
  const [showConfirmation, setShowConfirmation]: any = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId]: any = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment]: any = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker]:any = useState(false);
  const [createDate, setCreateDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  const [datePickerType, setDatePickerType] = useState('');

  const handleCreateDateChange = (selectedDate:any)  => {
    let currentDate =  createDate;
    
    if(selectedDate){
    const {timestamp, utcOffset} = selectedDate.nativeEvent;
     currentDate = new Date(timestamp + utcOffset * 60 * 1000);
    }
    console.log("currentDate 2 : " ,currentDate);
    setCreateDate(currentDate);
  };

  const handleDeadlineChange = (selectedDate:any) => {
    const currentDate = selectedDate || deadline;

    const {timestamp, utcOffset} = currentDate.nativeEvent;
    const cdate = new Date(timestamp + utcOffset * 60 * 1000);

    setDeadline(selectedDate || deadline);

  };
  const handleDateChange = (selectedDate: any) => {
    const currentDate = selectedDate || date;

    const {timestamp, utcOffset} = currentDate.nativeEvent;
    const cdate = new Date(timestamp + utcOffset * 60 * 1000);
    setDate(cdate);
    console.log(date);

    setShowDatePicker(false);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    courseid: courseid,
    datecreate: '',
    deadline: '',
    name: '',
    mark: '',
    description: '',
  });

  const handleAddAssignment = () => {
    const newAssignmentWithDates = {
      ...newAssignment,
      datecreate: createDate.toISOString(),
      deadline: deadline.toISOString(),
    };
    axios
      .post(
        'https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Assignment',
        newAssignmentWithDates,
      )
      .then(response => {
        const addedAssignment = response.data;
        fetchAssignments();
        setShowAddModal(false);
        setNewAssignment({
          courseid: courseid,
          datecreate: '',
          deadline: '',
          name: '',
          mark: '',
          description: '',
        });
        Alert.alert('Assignment added successfully');
      })
      .catch(error => {
        console.error('Error adding assignment:', error);
        Alert.alert('Failed to add assignment');
      });
  };

  const fetchAssignments = useCallback(() => {
    fetch(
      'https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Assignment',
    )
      .then(response => response.json())
      .then(responseJson => {
        const filteredAssignments = responseJson.filter(
          (assignment: any) => assignment.courseid === courseid,
        );
        setAssignments(filteredAssignments);
      })
      .catch(error => console.log(error));
  }, [courseid]);

  useEffect(() => {
    fetchAssignments();
  }, [courseid, fetchAssignments]);

  const handleUpdate = (id: any) => {
    const selected = assignments.find(
      (assignment: any) => assignment.assignmentsid === id,
    );
    setSelectedAssignment(selected);
    setShowUpdateModal(true);
  };
  const cancelUpdate = () => {
    setShowUpdateModal(false);
    setSelectedAssignment(null);
  };
  const handleUpdateConfirmation = () => {
    if (selectedAssignment) {
      axios
        .put(
          'https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Assignment/Update',
          selectedAssignment,
        )
        .then(response => {
          const updatedAssignment = response.data;
          setAssignments((prevAssignments: any) =>
            prevAssignments.map((assignment: any) =>
              assignment.assignmentsid === updatedAssignment.assignmentsid
                ? updatedAssignment
                : assignment,
            ),
          );
          setShowUpdateModal(false);
          setSelectedAssignment(null);
          Alert.alert('Assignment updated successfully');
          fetchAssignments();
        })
        .catch(error => {
          console.error('Error updating assignment:', error);
          Alert.alert('Failed to update assignment');
        });
    }
  };

  const handleDelete = (id: any) => {
    setShowConfirmation(true);
    setSelectedAssignmentId(id);
  };
  const confirmDelete = () => {
    if (selectedAssignmentId) {
      axios
        .delete(
          `https://f369-2a01-9700-11e9-d000-9d57-1fc5-6cda-63a6.ngrok-free.app/api/Assignment/Delete/${selectedAssignmentId}`,
        )
        .then(() => {
          Alert.alert('Assignment Deleted Successfully');
          fetchAssignments();
          setShowConfirmation(false);
          setSelectedAssignmentId(null);
        })
        .catch(err => {
          console.log(err);
          Alert.alert('Failed to delete assignment');
          setShowConfirmation(false);
          setSelectedAssignmentId(null);
        });
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setSelectedAssignmentId(null);
  };

  return assignments ? (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>
        Assignments for {coursename} - Section : {sectionnum}
      </Text>
      <TouchableOpacity
        style={styles.addSectionButton}
        onPress={() => setShowAddModal(true)}>
        <Text style={styles.addSectionText}>Add Assignment</Text>
      </TouchableOpacity>
      <ScrollView>
        {assignments.map((assignment: any, index: any) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>Assignment Details</Text>
            <View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date Created:</Text>
                <Text>{assignment.datecreate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Deadline:</Text>
                <Text>{assignment.deadline}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text>{assignment.name}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mark out of:</Text>
                <Text>{assignment.mark}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text>{assignment.description}</Text>
              </View>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('MarkAssignments', {
                    Assignment: assignment,
                  })
                }>
                <Icon
                  name="check-square-o"
                  size={30}
                  color="#0bda51"
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(assignment.assignmentsid)}>
                <Icon name="remove" size={30} color="red" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUpdate(assignment.assignmentsid)}>
                <Icon
                  name="edit"
                  size={30}
                  color="#007bff"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <Modal isVisible={showConfirmation}>
              <View style={styles.modalContainer}>
                <Text>Are you sure you want to delete this Assignment?</Text>
                <View style={styles.modalButtons}>
                  <Button onPress={confirmDelete} title="Delete" />
                  <Button onPress={cancelDelete} title="Cancel" />
                </View>
              </View>
            </Modal>

            <Modal isVisible={showUpdateModal}>
              <View style={styles.modalContainer}>
                <Text>Edit Assignment Details</Text>
                <TextInput
                  value={selectedAssignment?.datecreate}
                  onChangeText={text =>
                    setSelectedAssignment((prevState: any) => ({
                      ...prevState,
                      datecreate: text,
                    }))
                  }
                  placeholder="Date Created"
                />
                <TextInput
                  value={selectedAssignment?.deadline}
                  onChangeText={text =>
                    setSelectedAssignment((prevState: any) => ({
                      ...prevState,
                      deadline: text,
                    }))
                  }
                  placeholder="Deadline"
                />
                <TextInput
                  value={selectedAssignment?.name}
                  onChangeText={text =>
                    setSelectedAssignment((prevState: any) => ({
                      ...prevState,
                      name: text,
                    }))
                  }
                  placeholder="Name"
                />
                <TextInput
                  value={selectedAssignment?.mark.toString()}
                  keyboardType="numeric"
                  onChangeText={text =>
                    setSelectedAssignment((prevState: any) => ({
                      ...prevState,
                      mark: text==='' ? '' : parseInt(text),
                    }))
                  }
                  placeholder="Mark"
                />
                <TextInput
                  value={selectedAssignment?.description}
                  onChangeText={text =>
                    setSelectedAssignment((prevState: any) => ({
                      ...prevState,
                      description: text,
                    }))
                  }
                  placeholder="Description"
                />
                <View style={styles.modalButtons}>
                  <Button onPress={handleUpdateConfirmation} title="Update" />
                  <Button onPress={cancelUpdate} title="Cancel" />
                </View>
              </View>
            </Modal>
          </View>
        ))}
        <Modal isVisible={showAddModal}>
          <View style={styles.modalContainer}>
            <Text>Add New Assignment</Text>
            <Text>Select Create Date:</Text>
            <TouchableOpacity onPress={() => { setShowDatePicker(true); setDatePickerType('createDate'); }}>
              <TextInput
                placeholder="Select a date"
                value={createDate.toDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={createDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  handleCreateDateChange(selectedDate);
                }}
              />
            )}
            <Text>Select Deadline:</Text>
            <TouchableOpacity onPress={() => { setShowDatePicker(true); setDatePickerType('deadline'); }}>
              <TextInput
                placeholder="Select a date"
                value={deadline.toDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  handleDateChange(selectedDate);
                }}
              />
            )}
            <TextInput
              value={newAssignment.name}
              onChangeText={text =>
                setNewAssignment(prevState => ({...prevState, name: text}))
              }
              placeholder="Name"
            />
            <TextInput
              value={newAssignment.mark}
              onChangeText={text =>
                setNewAssignment(prevState => ({...prevState, mark: text}))
              }
              placeholder="Mark"
            />
            <TextInput
              value={newAssignment.description}
              onChangeText={text =>
                setNewAssignment(prevState => ({
                  ...prevState,
                  description: text,
                }))
              }
              placeholder="Description"
            />
            <View style={styles.modalButtons}>
              <Button onPress={handleAddAssignment} title="Add" />
              <Button onPress={() => setShowAddModal(false)} title="Cancel" />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ScrollView>
  ) : (
    <Loading />
  );
};

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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  addSectionText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addSectionButton: {
    marginLeft: 120,
    marginRight: 120,
    padding: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    backgroundColor: 'white',
    borderRadius: 6,
    alignItems: 'center',
  },
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
});

export default Assignments;