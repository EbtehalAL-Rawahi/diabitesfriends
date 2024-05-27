import React, {useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Styles from './Styles';

export default function Home({route, navigation}) {
  const [data, setData] = useState(null);
  const {user, updated} = route.params;
  const [deleted, setDeleted] = useState(Date.now);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('New Moniter')}
            title="Info"
            style={Styles.headerBtn}>
            <Image
              source={require('./assets/moniter.png')}
              style={Styles.headerBtnImg}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('New BP Moniter')}
            title="Info"
            style={Styles.headerBtn}>
            <Image
              source={require('./assets/bptracker.png')}
              style={Styles.headerBtnImg}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Insulin')}
            title="Info"
            style={Styles.headerBtn}>
            <Image
              source={require('./assets/insulin.png')}
              style={Styles.headerBtnImg}
            />
          </TouchableOpacity>
        </View>
      ),
    });

    firestore()
      .collection('moniter')
      .where('user', '==', user.uid)
      .orderBy('date', 'desc')
      .get()
      .then(res => {
        let moniterData = [];
        res.forEach(doc => {
          moniterData.push({
            id: doc.id,
            value:
              doc.data().type == 'blood suger'
                ? doc.data().value
                : doc.data().systolic + '/' + doc.data().diastolic,
            date: doc.data().date.toDate().toLocaleString(),
            status:
              doc.data().type == 'blood suger'
                ? bloodSugerStatus(doc.data().value)
                : bloodPbStatus(doc.data().systolic, doc.data().diastolic),
            type: doc.data().type,
          });
        });

        setData(moniterData);
      })
      .catch(err => {
        console.log(err);
        //
      });
  }, [updated, deleted]);

  const bloodSugerStatus = value => {
    if (parseInt(value) <= 125 && parseInt(value) >= 70) {
      return 'Normal';
    } else if (parseInt(value) > 125 && parseInt(value) < 220) {
      return 'Ideal';
    } else if (parseInt(value) > 220) {
      return 'High';
    } else {
      return 'Low';
    }
  };

  const bloodPbStatus = (systolic, diastolic) => {
    if (parseInt(systolic) <= 140 && parseInt(diastolic) <= 90) {
      return 'Normal';
    } else if (
      parseInt(systolic) >= 140 &&
      parseInt(systolic) <= 159 &&
      parseInt(diastolic) >= 90 &&
      parseInt(diastolic) <= 99
    ) {
      return 'High, Stage 1';
    } else if (parseInt(systolic) >= 159 && parseInt(diastolic) >= 100) {
      return 'High, Stage 2';
    } else if (parseInt(systolic) >= 90 && parseInt(diastolic) <= 60) {
      return 'Low';
    } else {
      return 'Ideal';
    }
  };

  const handleDelete = item => {
    Alert.alert('Delete', 'Are you sure?', [
      {
        onPress: () => {
          firestore()
            .collection('moniter')
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
          <View
            style={Styles.card}
            //renderRightActions={renderRightActions}
          >
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '35%', padding: 15, alignItems: 'center'}}>
                <Text style={Styles.cardTitle}>{item.value}</Text>
                <Text style={Styles.cardText}>
                  {item.type == 'blood suger' ? 'mg/dL' : 'mmHg'}
                </Text>
              </View>
              <View style={{justifyContent: 'center', width: '57%'}}>
                <Text style={Styles.cardText}>{item.date}</Text>
                <Text style={Styles.cardContentText}>
                  {item.status && item.status}
                </Text>
                <Text style={Styles.cardText}>{item.type}</Text>
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
