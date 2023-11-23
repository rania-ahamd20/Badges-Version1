/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../../constants/Colors';
import axios from 'axios';
const GenerateBadge = ({route, navigation}: any) => {
  const [users, setUsers] = useState([]);
  const fetchDataUsers = async () => {
    try {
      const result = await axios.get(
        'https://d6c8-92-253-55-73.ngrok-free.app/api/User',
      );
      const filteredUsers = result.data.filter(user => user.roleid == '3');
      setUsers(filteredUsers);
      console.log(filteredUsers);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchDataUsers();
  }, []);

  const badge: any[] = route.params?.ba || [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Generate Badges</Text>
      {badge.map((badgeItem: any) => (
        <View style={styles.card} key={badgeItem.badgesid}>
          <Text style={styles.cardHeader}>{badgeItem.text}</Text>
          <View style={styles.badge}>
            <Image source={{uri: badgeItem.image}} style={styles.badgeImage} />
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ManualBadges', {
                    badge: badgeItem,
                    users: users,
                  })
                }>
                <Text style={styles.button}>View Trainee's</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
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
    backgroundColor: Colors.secondary,
    color: 'white',
    borderRadius: 5,
    margin: 10,
  },
});

export default GenerateBadge;
