/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
//import {withNavigation} from 'react-navigation';

const Criteria = ({navigation}:any) => {
  const [badges, setBadges] = useState([]);
  const [criteriaArray, setCriteriaArray] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [activeCriterias, setActiveCriterias] :any = useState([]);
  const [selectedBadge, setSelectedBadge]:any = useState(null);


  const handleEstablishCriteria = (badge: any) => {
    const criteria: any = badge.criteria;
    const criteriaArray = criteria
      .split(',')
      .map((criterion: any) => criterion.trim());
    setCriteriaArray(criteriaArray);
    setSelectedBadge(badge);
    setIsModalVisible(true);
  };

  const toggleCriteriaSelection = (criterion: any) => {
    let updatedCriterias = [...activeCriterias];
    if (updatedCriterias.includes(criterion)) {
      updatedCriterias = updatedCriterias.filter(
        criteria => criteria !== criterion,
      );
    } else {
      updatedCriterias.push(criterion);
    }
    setActiveCriterias(updatedCriterias);
  };

  const saveActiveCriterias = async (badge: any) => {
    const selectedCriterias = activeCriterias.map(
      (index: any) => criteriaArray[index],
    );
    const selectedCriteriasString = selectedCriterias.join(', ');
    try {
      await axios.put(


        'https://2c7d-92-253-55-73.ngrok-free.app/api/Badges/Update',

        {
          badgesid: badge.badgesid,
          type: badge.type,
          text: badge.text,
          image: badge.image,
          criteria: badge.criteria,
          activecriteria: selectedCriteriasString,
        },
      );
      console.log('Successfully saved for the badge', selectedBadge.badgesid);
      closeModal();
    } catch (error) {
      console.error('Error :', error);
    }
  };
  const closeModal = () => {
    setIsModalVisible(false);
    setCriteriaArray([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://2c7d-92-253-55-73.ngrok-free.app/api/Badges',
        );
        const fetchedBadges = response.data;
        setBadges(fetchedBadges);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Badges</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('GenerateBadge')}>
          <Text style={styles.button}>Generate a badge</Text>
        </TouchableOpacity>
      </View>
      {badges.map((badge: any) => (
        <View style={styles.card} key={badge.badgesid}>
          <Text style={styles.cardHeader}>{badge.type}</Text>
          <View style={styles.badge}>
            <Image source={{uri: badge.image}} style={styles.badgeImage} />
            <View>
              <TouchableOpacity onPress={() => handleEstablishCriteria(badge)}>
                <Text style={styles.button}>Establish Criteria</Text>
              </TouchableOpacity>
              <TouchableOpacity
                 onPress={() => navigation.navigate('UploadFile', { Badge: badge })}>
                <Text style={styles.button}>Change Badge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Establish Criteria: </Text>
          <ScrollView style={styles.criteriaContainer}>
            {criteriaArray.map((criterion, index) => (
              <View key={index}>
                <View style={styles.row}>
                  <Text style={styles.criteriaItem}>- {criterion} </Text>
                  <TouchableOpacity
                    onPress={() => toggleCriteriaSelection(index)}>
                    {activeCriterias.includes(index) ? (
                      <Text style={{color: '#0bda51'}}>✔</Text>
                    ) : (
                      <Text style={{color: 'red'}}>✖</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => saveActiveCriterias(selectedBadge)}>
            <Text style={styles.okButton}>save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  badgeImage: {
    width: 100,
    height: 100,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#0bda51',
    color: 'white',
    borderRadius: 5,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    margin: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  criteriaContainer: {
    maxHeight: 200,
    marginBottom: 15,
  },
  criteriaItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  okButton: {
    padding: 10,
    backgroundColor: '#0bda51',
    color: 'white',
    borderRadius: 5,
    width: '50%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Criteria;