import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {decode as atob, encode as btoa} from 'base-64';

export default function Feedback({route, navigation}) {
  const [errorMsg, setMessage] = useState(false);
  const [name, setName] = useState('');
  const [message, setMsg] = useState('');
  const [email, setEmail] = useState('');
  const subject = 'New message from diabetes friend';
  const appEmail = 'ebtehalalrawahi24@gmail.com';

  const handleSave = () => {
    setMessage('');
    if (name != '' && message != '' && email != '') {
      fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        body: JSON.stringify({
          Messages: [
            {
              From: {
                Email: appEmail,
                Name: name,
              },
              To: [
                {
                  Email: appEmail,
                  Name: 'Diabetes friend',
                },
              ],
              Subject: subject,
              TextPart: message + '\n' + email,
            },
          ],
        }),
        headers: new Headers({
          Authorization:
            'Basic ' +
            btoa(
              '33de7a288170f3832affea7fc312ca44:062dc1ea7971a99e7538898d0e38a799',
            ),
          //'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      })
        .then(response => {
          if (!response.ok) {
            setMessage('Error while trying to send your feedback, try again..');
          } else {
            navigation.navigate('TabScreens');
          }
        })
        .catch(err => {
          setMessage('Error while trying to send your feedback, try again..');
        });
    } else {
      setMessage('Please insert all the required feilds..');
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View style={Styles.content}>
        <Text style={Styles.label}>Name</Text>
        <TextInput
          onChangeText={val => setName(val)}
          placeholder="Enter your name"
          style={Styles.input}
        />
        <Text style={Styles.label}>E-mail</Text>
        <TextInput
          onChangeText={val => setEmail(val)}
          placeholder="Enter your email"
          style={Styles.input}
        />
        <Text style={Styles.label}>Feedback Message</Text>
        <TextInput
          onChangeText={val => setMsg(val)}
          placeholder="Feedback"
          style={Styles.input}
        />
        {errorMsg && (
          <Text style={{color: 'red', padding: 15}}>{errorMsg}</Text>
        )}
        <TouchableOpacity style={Styles.btn} onPress={handleSave}>
          <Text style={Styles.btnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
