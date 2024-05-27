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
export default function NewMoniter({route, navigation}) {
  const [errorMsg, setMessage] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setalue] = useState('');
  const [date, setDate] = useState(new Date());
  const {user} = route.params;

  const handleSave = () => {
    if (value != '') {
      firestore()
        .collection('moniter')
        .add({
          date: date,
          value: value,
          user: user.uid,
          type: 'blood suger',
        })
        .then(() => {
          navigation.navigate('Moniter', {updated: Date.now()});
        })
        .catch(err => {
          setMessage('Something went wrong..');
        });
    } else {
      setMessage('Please insert the value first..');
    }
  };

  return (
    <ScrollView>
      <View style={Styles.content}>
        <Text style={Styles.label}>Blood Suger (mg/dL)</Text>
        <TextInput
          onChangeText={val => setalue(val)}
          placeholder="Blood Suger value"
          style={Styles.input}
          keyboardType="numeric"
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
