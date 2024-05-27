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
export default function NewBloodPressure({route, navigation}) {
  const [errorMsg, setMessage] = useState(false);
  const [open, setOpen] = useState(false);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [date, setDate] = useState(new Date());
  const {user} = route.params;

  const handleSave = () => {
    if (systolic != '' && diastolic != '') {
      firestore()
        .collection('moniter')
        .add({
          date: date,
          systolic: systolic,
          diastolic: diastolic,
          user: user.uid,
          type: 'blood pressure',
        })
        .then(() => {
          navigation.navigate('Moniter', {updated: Date.now()});
        })
        .catch(err => {
          setMessage('Something went wrong..');
        });
    } else {
      setMessage('Please insert systolic and diastolic first..');
    }
  };

  return (
    <ScrollView>
      <View style={Styles.content}>
        <Text style={Styles.label}>Systolic BP</Text>
        <TextInput
          onChangeText={val => setSystolic(val)}
          placeholder="Blood Pressure Systolic value"
          style={Styles.input}
        />
        <Text style={Styles.label}>Diastolic BP</Text>
        <TextInput
          onChangeText={val => setDiastolic(val)}
          placeholder="Blood Pressure Diastolic value"
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
