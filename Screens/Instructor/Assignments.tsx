/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState,useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Modal from 'react-native-modal';


const Assignments = ({route , navigation}:any) => {
 

  const [item,setitem] = useState(route.params.course);
 
  const [courseid] = useState(item.courseid);
  const [coursename] = useState(item.name);
  const [sectionnum] = useState(item.sectionnum);
  const [assignments, setAssignments] : any = useState([]);
  const [showConfirmation, setShowConfirmation] :any = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] :any = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] :any = useState(null);

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
    axios
      .post(
        'https://d199-92-253-117-43.ngrok-free.app/api/Assignment',
        newAssignment,
      )
      .then((response) => {
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
      .catch((error) => {
        console.error('Error adding assignment:', error);
        Alert.alert('Failed to add assignment');
      });
  };

  const fetchAssignments = useCallback(() => {
    fetch('https://d199-92-253-117-43.ngrok-free.app/api/Assignment')
      .then((response) => response.json())
      .then((responseJson) => {
        const filteredAssignments = responseJson.filter(
          (assignment:any) => assignment.courseid === courseid,
        );
        setAssignments(filteredAssignments);
      })
      .catch((error) => console.log(error));
    }, [courseid]);

  useEffect(() => {
   // console.log('items ' , route.params.course);
    fetchAssignments();
  },[courseid, fetchAssignments]);

  const handleUpdate = (id:any) => {
    const selected = assignments.find(
      (assignment:any) => assignment.assignmentsid === id,
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
          'https://d199-92-253-117-43.ngrok-free.app/api/Assignment/Update',
          selectedAssignment,
        )
        .then(response => {
          const updatedAssignment = response.data;
          setAssignments((prevAssignments:any) =>
            prevAssignments.map((assignment:any) =>
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

  const handleDelete = (id:any) => {
    setShowConfirmation(true);
    setSelectedAssignmentId(id);
  };
  const confirmDelete = () => {
    if (selectedAssignmentId) {
      axios
        .delete(

          `https://d199-92-253-117-43.ngrok-free.app/api/Assignment/Delete/${selectedAssignmentId}`,
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

  return (
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
        {assignments.map((assignment:any,index :any) => (
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
               onPress={() => navigation.navigate('MarkAssignments', { Assignment: assignment })}>
                <Icon name="check-square-o" size={30} color="#0bda51" style={styles.icon} />
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
                    setSelectedAssignment((prevState :any) => ({
                      ...prevState,
                      datecreate: text,
                    }))
                  }
                  placeholder="Date Created"
                />
                <TextInput
                  value={selectedAssignment?.deadline}
                  onChangeText={text =>
                    setSelectedAssignment((prevState :any) => ({
                      ...prevState,
                      deadline: text,
                    }))
                  }
                  placeholder="Deadline"
                />
                <TextInput
                  value={selectedAssignment?.name}
                  onChangeText={text =>
                    setSelectedAssignment((prevState :any) => ({
                      ...prevState,
                      name: text,
                    }))
                  }
                  placeholder="Name"
                />
                <TextInput
                  value={selectedAssignment?.mark.toString()}
                  onChangeText={text =>
                    setSelectedAssignment((prevState :any) => ({
                      ...prevState,
                      mark: parseInt(text),
                    }))
                  }
                  placeholder="Mark"
                />
                <TextInput
                  value={selectedAssignment?.description}
                  onChangeText={text =>
                    setSelectedAssignment((prevState :any) => ({
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

            <Modal isVisible={showAddModal}>
              <View style={styles.modalContainer}>
                <Text>Add New Assignment</Text>
                <TextInput
                  value={newAssignment.datecreate}
                  onChangeText={text =>
                    setNewAssignment(prevState => ({
                      ...prevState,
                      datecreate: text,
                    }))
                  }
                  placeholder="Date Created"
                />
                <TextInput
                  value={newAssignment.deadline}
                  onChangeText={text =>
                    setNewAssignment(prevState => ({
                      ...prevState,
                      deadline: text,
                    }))
                  }
                  placeholder="Deadline"
                />
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
                  <Button
                    onPress={() => setShowAddModal(false)}
                    title="Cancel"
                  />
                </View>
              </View>
            </Modal>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
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
