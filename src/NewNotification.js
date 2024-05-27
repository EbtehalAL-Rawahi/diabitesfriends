import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';
import PushNotification, {Importance} from 'react-native-push-notification';

export default function NewNotification({route, navigation}) {
  const [errorMsg, setMessage] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [repeatType, setRepeatType] = useState('day');
  const [updated, setUpdated] = useState(Date.now());
  const {user} = route.params;

  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      //console.log('NOTIFICATION:', notification);
      // process the notification
      // (required) Called when a remote is received or opened, or local notification is opened
      //notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      //console.log('ACTION:', notification.action);
      //console.log('NOTIFICATION:', notification);
      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    popInitialNotification: true,
    requestPermissions: true,
  });

  const handleCreateNotification = () => {
    setMessage('');
    const notificationId = Date.now().toString();

    if (content != '') {
      firestore()
        .collection('notifications')
        .add({
          content: content,
          notificationId: notificationId,
          date: date,
          timestamp: new Date(),
          user: user.uid,
        })
        .then(res => {
          PushNotification.createChannel(
            {
              channelId: 'ch' + notificationId,
              channelName: 'Notifications',
              channelDescription: 'Notifications DESCRIPTION',
              //playSound: true,
              //soundName: 'scanner.mp3',
              //soundName: 'android.resource://com.elderlyhealthapp/raw/scanner.mp3',
              importance: Importance.HIGH,
              vibrate: true,
            },
            //created => console.log(`createChannel returned '${created}'`),
          );

          let p = PushNotification.localNotificationSchedule({
            channelId: 'ch' + notificationId,
            title: 'Daibetes friends Notification',
            message: content,
            playSound: true,
            priority: 'high',
            vibrate: true,
            vibration: 300,
            onlyAlertOnce: true,
            date: date,
            largeIcon: 'ic_launcher',
            repeatType: repeatType,
            repeatTime: 1,
          });
          setMessage('Notification has been created successfully');
          navigation.navigate('Notifications', {updated: updated});
        })
        .catch(err => {
          setMessage('Error while creating notification, try again..');
        });
    } else {
      setMessage('Please insert title first..');
    }
  };

  return (
    <ScrollView>
      <View style={Styles.content}>
        <Text style={Styles.label}>Notification Content</Text>
        <TextInput
          onChangeText={val => setContent(val)}
          placeholder="Notification Title, Ex: Check Blood suger, Drug Time"
          style={Styles.input}
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
        <View style={{flexDirection: 'row', margin: 3}}>
          <TouchableOpacity
            style={{
              borderBottomLeftRadius: 15,
              borderTopLeftRadius: 15,
              backgroundColor: '#426897',
              padding: 15,
              borderWidth: !repeatType ? 2 : 0,
              borderColor: '284392',
            }}
            onPress={() => setRepeatType(null)}>
            <Text style={{color: '#fff'}}>One Time</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomRightRadius: 15,
              borderTopRightRadius: 15,
              backgroundColor: '#426897',
              padding: 15,
              borderWidth: repeatType == 'day' ? 2 : 0,
              borderColor: '284392',
            }}
            onPress={() => setRepeatType('day')}>
            <Text style={{color: '#fff'}}>Repeat Daily</Text>
          </TouchableOpacity>
        </View>
        {errorMsg && (
          <Text style={{color: 'red', padding: 15}}>{errorMsg}</Text>
        )}
        <TouchableOpacity style={Styles.btn} onPress={handleCreateNotification}>
          <Text style={Styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
