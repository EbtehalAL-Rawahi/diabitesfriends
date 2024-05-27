import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
export default function NewActivity({route, navigation}) {
  const [errorMsg, setMessage] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [achievement, setAchievement] = useState('');
  const [date, setDate] = useState(new Date());
  const {user} = route.params;

  const handleSave = () => {
    if (title != '' && achievement != '') {
      firestore()
        .collection('activites')
        .add({
          date: date,
          title: title,
          achievement: achievement,
          user: user.uid,
        })
        .then(() => {
          navigation.navigate('Activity Tracker', {updated: Date.now()});
        })
        .catch(err => {
          setMessage('Something went wrong..');
        });
    } else {
      setMessage('Please insert all the required feilds..');
    }
  };

  return (
    <ScrollView>
      <View style={Styles.content}>
        <Text style={Styles.label}>Activity Title</Text>
        <TextInput
          onChangeText={val => setTitle(val)}
          placeholder="Describe the activity"
          style={Styles.input}
        />
        <Text style={Styles.label}>Achievement</Text>
        <TextInput
          onChangeText={val => setAchievement(val)}
          placeholder="Achievement, Ex: k/m for a running trip"
          style={Styles.input}
        />
        <Text style={Styles.label}>Date & Time</Text>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Text style={Styles.input}>{date.toLocaleString()}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={open}
          date={date}
          minimumDate={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        {errorMsg && (
          <Text style={{color: 'red', padding: 15}}>{errorMsg}</Text>
        )}
        <TouchableOpacity style={Styles.btn} onPress={handleSave}>
          <Text style={Styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
