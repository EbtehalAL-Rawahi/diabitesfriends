import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Styles from './Styles';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSignup = () => {
    let enable = true;

    if (
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      password === ''
    ) {
      setErrorMsg('Please fill in all the required fields.');
      enable = false;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      enable = false;
    }

    if (repeatedPassword !== repeatedPassword) {
      setErrorMsg('Password are not matched try again.');
      enable = false;
    }

    if (enable) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          firestore()
            .collection('users_profiles')
            .doc(res.user.uid)
            .set({
              name: firstName,
              lastName: lastName,
              email: email,
            })
            .then(() => {
              //console.log('User added!');
            });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setErrorMsg('That email address is already in use!');
          } else if (error.code === 'auth/invalid-email') {
            setErrorMsg('That email address is invalid!');
          } else {
            setErrorMsg('Something went wrong, try again!');
          }
        });
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      {/* <ImageBackground source={require('./assets/bg.jpg')} style={Styles.bg}> */}
      <View style={Styles.content}>
        <Text style={Styles.label}>First Name</Text>

        <TextInput
          placeholder="First Name"
          style={Styles.input}
          onChangeText={val => setFirstName(val)}
        />

        <Text style={Styles.label}>Last Name</Text>

        <TextInput
          placeholder="Last Name"
          style={Styles.input}
          onChangeText={val => setLastName(val)}
        />

        <Text style={Styles.label}>E-mail</Text>

        <TextInput
          placeholder="E-mail"
          style={Styles.input}
          onChangeText={val => setEmail(val)}
        />

        <Text style={Styles.label}>Password</Text>

        <TextInput
          placeholder="Password"
          style={Styles.input}
          secureTextEntry={true}
          onChangeText={val => setPassword(val)}
        />

        <Text style={Styles.label}>Repeat Password</Text>

        <TextInput
          placeholder="Repeat Password"
          style={Styles.input}
          secureTextEntry={true}
          onChangeText={val => setRepeatedPassword(val)}
        />

        {errorMsg && (
          <Text style={{color: 'red', padding: 5, margin: 3}}>{errorMsg}</Text>
        )}

        <TouchableOpacity style={Styles.btn} onPress={handleSignup}>
          <Text style={Styles.btnText}>Register</Text>
        </TouchableOpacity>
      </View>
      {/* </ImageBackground> */}
    </ScrollView>
  );
}
