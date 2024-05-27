import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Styles from './Styles';

export default function Chatbot({route, navigation}) {
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const scrollViewRef = useRef();
  const {user} = route.params;

  useEffect(() => {
    firestore()
      .collection('users_profiles')
      .doc(user.uid)
      .get()
      .then(res => {
        if (res.data()) {
          setMessages([
            {
              id: Date.now(),
              msg:
                'Hello ' +
                res.data().name +
                ' ' +
                res.data().lastName +
                ', Welcome to diabetes friends, how can I help you?',
              role: 'bot',
            },
          ]);

          setUsername(res.data().name + ' ' + res.data().lastName);
        } else {
          setMessages([
            {
              id: Date.now(),
              msg: 'Hello, Welcome to diabetes friends, how can I help you?',
              role: 'bot',
            },
          ]);
        }
      })
      .catch(err => {
        setMessages([
          {
            id: Date.now(),
            msg: 'Hello, Welcome to diabetes friends, how can I help you?',
            role: 'bot',
          },
        ]);
      });

    firestore()
      .collection('chats')
      .get()
      .then(res => {
        let tmpArr = [];
        res.forEach(doc => {
          tmpArr.push({
            id: doc.id,
            ...doc.data(),
          });
          setData(tmpArr);
        });
      })
      .catch(err => {
        //console.log(err);
      });
  }, []);

  const Ask = () => {
    setLoading(true)
    let tmpArr = [];
    tmpArr.push({
      id: Date.now(),
      msg: question,
      role: 'user',
    });
    setMessages(ol => [...ol, ...tmpArr]);
    setQuestion('');
    scrollViewRef.current.scrollToEnd({animated: true});
    const q = question.toLowerCase().replace('?', '');
    if (q.includes('hi') || q.includes('hello') || q.includes('salam')) {
      let tmpArr = [];
      tmpArr.push({
        id: Date.now(),
        msg: 'Hey ' + username + ', How can I Assist you today?',
        role: 'bot',
      });

      setMessages(ol => [...ol, ...tmpArr]);
      scrollViewRef.current.scrollToEnd({animated: true});
      setLoading(false)
    } else {
      answer();
    }
  };

  const answer = () => {
    let tmpArr = [];
    setTimeout(() => {
      if (data) {
        let restult = []
        const q = question.toLowerCase().replace('?', '');
        data.map(item => {
          // make sure question is valid and exist
          if(item.question || item.answer){
            // quesry any possible matches
            if(item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q)){
              //push to the result array "Chat answer".
              restult.push(item)
            }
          }
        })
        //
        // let restult = data.filter(item => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q));
        if (restult.length != 0) {
          tmpArr.push({
            id: Date.now(),
            msg: restult[0]
              ? restult[0].answer
              : "Sorry I did't find any answer for this question in my database...",
            role: 'bot',
          });
        } else {
          tmpArr.push({
            id: Date.now(),
            msg: "Sorry I did't find any answer for this question in my database...",
            role: 'bot',
          });
        }
      } else {
        tmpArr.push({
          id: Date.now(),
          msg: 'Please connect to the internet to use our chatbot service...',
          role: 'bot',
        });
      }
      scrollViewRef.current.scrollToEnd({animated: true});
      setMessages(ol => [...ol, ...tmpArr]);
      setLoading(false)
    }, 2000);
  };

  return (
    <View style={{backgroundColor: '#fff'}}>
      <ScrollView ref={scrollViewRef} style={{height: '90%'}}>
        {messages &&
          messages.map(item => (
            <View
              key={item.id}
              style={{
                ...Styles.card,
                ...{
                  backgroundColor: item.role == 'user' ? '#426897' : '#fff',
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: '#426897',
                  flexDirection: 'row',
                  width: '85%',
                  padding: 5,
                  right: item.role == 'user' ? -35 : 0,
                },
              }}>
              <Text
                style={{
                  color: item.role == 'user' ? '#fff' : '#426897',
                  padding: 15,
                  margin: 3,
                }}>
                {item.msg}
              </Text>

              {item.role == 'bot' && (
                <View style={{flex: 1}}>
                  <Image
                    source={require('./assets/bot.png')}
                    style={Styles.floatingBtnImg}
                  />
                </View>
              )}
            </View>
          ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#426897',
          margin: 5,
        }}>
        <TextInput
          style={{width: '87%', backgroundColor: '#fff', color: '#426897'}}
          onChangeText={val => setQuestion(val)}
          value={question}
          onSubmitEditing={Ask}
        />
        <TouchableOpacity style={Styles.headerBtn} onPress={Ask}>
          <Image
            source={loading?require('./assets/loading.gif'):require('./assets/send.png')}
            style={Styles.headerBtnImg}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
