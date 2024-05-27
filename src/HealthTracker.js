import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Styles from './Styles';

export default function HealthTracker({route, navigation}) {
  const [data, setData] = useState(null);
  const {user, updated} = route.params;
  const [deleted, setDeleted] = useState(Date.now);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('New Activity')}
          title="Info"
          style={Styles.headerBtn}>
          <Image
            source={require('./assets/newicon.png')}
            style={Styles.headerBtnImg}
          />
        </TouchableOpacity>
      ),
    });

    firestore()
      .collection('activites')
      .where('user', '==', user.uid)
      .orderBy('date', 'desc')
      .get()
      .then(res => {
        let tmpArr = [];
        res.forEach(doc => {
          tmpArr.push({
            id: doc.id,
            title: doc.data().title,
            achievement: doc.data().achievement,
            date: doc.data().date.toDate().toLocaleString(),
          });
        });

        setData(tmpArr);
      })
      .catch(err => {
        console.log(err);
        //
      });
  }, [updated, deleted]);

  const handleDelete = item => {
    Alert.alert('Delete', 'Are you sure?', [
      {
        onPress: () => {
          firestore()
            .collection('activites')
            .doc(item)
            .delete()
            .then(res => {
              setDeleted(Date.now());
            })
            .catch(err => {
              console.log(err);
              //
            });
        },
        text: 'Ok',
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  return (
    <>
      <TouchableOpacity
        style={Styles.floatingBtn}
        onPress={() => navigation.navigate('Chatbot')}>
        <Image
          source={require('./assets/botanimated.gif')}
          style={Styles.floatingBtnImg}
        />
      </TouchableOpacity>
      <FlatList
        keyExtractor={item => item.id}
        data={data}
        renderItem={({item, index, separators}) => (
          <View style={Styles.card}>
            <View style={{flexDirection: 'row', padding: 0}}>
              <View
                style={{
                  backgroundColor: '#426897',
                  width: '35%',
                  padding: 15,
                  margin: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                }}>
                <Image
                  source={require('./assets/tracker.png')}
                  style={Styles.btnImg}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  marginLeft: 15,
                  width: '53%',
                }}>
                <Text style={Styles.cardText}>{item.date}</Text>
                <Text style={Styles.cardContentText}>{item.title}</Text>
                <Text style={Styles.cardText}>{item.achievement}</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    margin: 4,
                    backgroundColor: '#426897',
                    borderRadius: 5,
                  }}
                  onPress={() => handleDelete(item.id)}>
                  <Text style={{color: '#fff', margin: 5}}>x</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </>
  );
}
