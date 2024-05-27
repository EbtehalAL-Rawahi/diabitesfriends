import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import Styles from './Styles';

export default function Myaccount({navigation}) {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        //
      });
  };

  return (
    <ScrollView>
      <TouchableOpacity
        style={Styles.card}
        onPress={() => navigation.navigate('Advices')}>
        <Text style={Styles.cardText}>Tips & Advices</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Styles.card}
        onPress={() => navigation.navigate('Notifications')}>
        <Text style={Styles.cardText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Styles.card}
        onPress={() => navigation.navigate('Feedback')}>
        <Text style={Styles.cardText}>Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Styles.card}
        onPress={() => navigation.navigate('Change Password')}>
        <Text style={Styles.cardText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.card} onPress={handleLogout}>
        <Text style={Styles.cardText}>Signout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
