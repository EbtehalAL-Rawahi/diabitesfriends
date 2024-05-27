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
import PushNotification from 'react-native-push-notification';
import Styles from './Styles';

export default function Notifications({route, navigation}) {
  const [data, setData] = useState(null);
  const [deleted, setDeleted] = useState(Date.now);
  const {updated, user} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('New Notification')}
          title="Info"
          style={Styles.headerBtn}>
          <Image
            source={require('./assets/newicon.png')}
            style={Styles.headerBtnImg}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    firestore()
      .collection('notifications')
      .where('user', '==', user.uid)
      .orderBy('timestamp', 'desc')
      .get()
      .then(res => {
        let tmpArr = [];
        res.forEach(doc => {
          tmpArr.push({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content.replaceAll('\\n', '\n'),
            date:
              doc.data().date.toDate().getDate() +
              '/' +
              (doc.data().date.toDate().getMonth() + 1) +
              '/' +
              doc.data().date.toDate().getFullYear(),
            notificationId: doc.data().notificationId,
          });
        });

        setData(tmpArr);
      })
      .catch(er => {
        console.log(er);
        //
      });
  }, [updated, deleted]);

  const handleDelete = (item, notificationId) => {
    Alert.alert('Delete', 'Are you sure?', [
      {
        text: 'Cancel',
      },
      {
        onPress: () => {
          firestore()
            .collection('notifications')
            .doc(item)
            .delete()
            .then(res => {
              setDeleted(Date.now());
              const p = PushNotification.deleteChannel('ch' + notificationId);
            })
            .catch(err => {
              //console.log(err);
              //
            });
        },
        text: 'Ok',
      },
    ]);
  };

  return (
    <>
      <FlatList
        keyExtractor={item => item.id}
        data={data}
        renderItem={({item, index, separators}) => (
          <View style={Styles.card}>
            <View style={{flexDirection: 'row', padding: 0}}>
              <View
                style={{
                  justifyContent: 'center',
                  marginLeft: 15,
                  width: '85%',
                }}>
                <Text style={Styles.cardText}>{item.date}</Text>
                <Text style={Styles.cardContentText}>{item.content}</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    margin: 4,
                    backgroundColor: '#426897',
                    borderRadius: 5,
                  }}
                  onPress={() => handleDelete(item.id, item.notificationId)}>
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
