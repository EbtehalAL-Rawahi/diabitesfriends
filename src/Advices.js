import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Styles from './Styles';

export default function Advices({route, navigation}) {
  const [data, setData] = useState(null);
  useEffect(() => {
    firestore()
      .collection('advices')
      .orderBy('date', 'asc')
      .get()
      .then(res => {
        let tmpArr = [];
        res.forEach(doc => {
          tmpArr.push({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content.replaceAll('\\n', '\n'),
          });
        });

        setData(tmpArr);
      })
      .catch(() => {
        //
      });
  }, []);

  return (
    <View style={{padding: 15, backgroundColor: '#fff'}}>
      <FlatList
        keyExtractor={item => item.id}
        data={data}
        renderItem={({item, index, separators}) => (
          <>
            <Text style={Styles.title}>{item.title}</Text>
            <Text style={Styles.paragraph}>{item.content}</Text>
          </>
        )}
      />
      <View style={{padding: '5%'}}></View>
    </View>
  );
}
