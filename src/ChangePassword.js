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

export default function ChangePassword({navigation}) {
  const [oldPass, setOldPassword] = useState('');
  const [newPass, setNewPassword] = useState('');
  const [renewPass, setReNewPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChangePassword = () => {
    setErrorMsg('');
    if (newPass !== '' && renewPass !== '' && newPass == renewPass) {
      var user = auth().currentUser;
      auth()
        .signInWithEmailAndPassword(user.email, oldPass)
        .then(() => {
          // User successfully reauthenticated.
          return auth()
            .currentUser.updatePassword(newPass)
            .then(() => {
              setErrorMsg('Password Updated Successfully.');
              //console.log('User account created & signed in!');
            })
            .catch(error => {
              setErrorMsg('Something went wrong.');
            });
        })
        .catch(error => {
          // Handle error.
        });
    } else {
      setErrorMsg('Please enter you email and password.');
    }
  };

  return (
    <ScrollView>
      <View style={Styles.content}>
        <Text style={Styles.label}>Current Password</Text>
        <TextInput
          placeholder="Enter your current Password"
          style={Styles.input}
          secureTextEntry={true}
          onChangeText={val => setOldPassword(val)}
        />
        <Text style={Styles.label}>New Password</Text>
        <TextInput
          placeholder="Enter the new Password"
          style={Styles.input}
          secureTextEntry={true}
          onChangeText={val => setNewPassword(val)}
        />
        <Text style={Styles.label}>Repeat New Password</Text>
        <TextInput
          placeholder="Repeat again the new Password"
          style={Styles.input}
          secureTextEntry={true}
          onChangeText={val => setReNewPass(val)}
        />
        <Text style={{color: 'red', padding: 15}}>{errorMsg}</Text>
        <View style={Styles.inline}>
          <TouchableOpacity style={Styles.btn} onPress={handleChangePassword}>
            <Text style={Styles.btnText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
