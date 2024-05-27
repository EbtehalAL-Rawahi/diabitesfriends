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
export default function NewJournal({route, navigation}) {
  const [errorMsg, setMessage] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date());
  const {user} = route.params;

  const handleSave = () => {
    if (title != '' && calories != '') {
      firestore()
        .collection('journal')
        .add({
          date: date,
          title: title,
          calories: calories,
          user: user.uid,
        })
        .then(() => {
          navigation.navigate('Food Journal', {updated: Date.now()});
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
        <Text style={Styles.label}>Meal Title</Text>
        <TextInput
          onChangeText={val => setTitle(val)}
          placeholder="Meal name"
          style={Styles.input}
        />
        <Text style={Styles.label}>Calories</Text>
        <TextInput
          onChangeText={val => setCalories(val)}
          placeholder="How many calories for this meeal"
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
