import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Styles from './Styles';

export default function InsulinTakes({navigation}) {
  const [wieght, setWeight] = useState('0');
  const [total, setTotal] = useState('0');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCalculate = () => {
    let tmp_total = 0;

    tmp_total = 0.55 * parseFloat(wieght);
    setTotal(tmp_total);
  };

  return (
    <ScrollView>
      <View style={Styles.content}>
        <Text style={Styles.label}>Your Weight</Text>
        <TextInput
          onChangeText={val => setWeight(val)}
          placeholder="Weight in Kilograms"
          style={Styles.input}
          keyboardType="numeric"
        />
        {total && (
          <Text style={{color: 'red', padding: 15, fontSize: 20}}>
            {parseInt(total) + ' Units of insulin/day'}
          </Text>
        )}
        {errorMsg && (
          <Text style={{color: 'red', padding: 15}}>{errorMsg}</Text>
        )}
        <View style={Styles.inline}>
          <TouchableOpacity style={Styles.btn} onPress={handleCalculate}>
            <Text style={Styles.btnText}>Calculate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
