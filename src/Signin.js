import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Styles from './Styles';

export default function Signin({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignin = () => {
    setErrorMsg('');
    if (email !== '' && password !== '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          //console.log('User account created & signed in!');
        })
        .catch(error => {
          setErrorMsg('wrong email or password.');
        });
    } else {
      setErrorMsg('Please enter you email and password.');
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View style={Styles.content}>
        <Image source={require('./assets/logo.png')} style={Styles.logo} />
        <Text style={Styles.title}>Signin</Text>
        <Text style={Styles.label}>E-mail</Text>
        <TextInput
          onChangeText={val => setEmail(val)}
          placeholder="E-mail"
          style={Styles.input}
        />
        <Text style={Styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          style={Styles.input}
          secureTextEntry={true}
          onChangeText={val => setPassword(val)}
        />
        <Text style={{color: 'red'}}>{errorMsg}</Text>
        <View style={Styles.inline}>
          <TouchableOpacity style={Styles.btn} onPress={handleSignin}>
            <Text style={Styles.btnText}>Signin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.btn}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={Styles.btnText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
