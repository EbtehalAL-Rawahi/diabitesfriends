import { useEffect, useState } from 'react';
import { Image, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import Home from './src/Home';
import Signin from './src/Signin';
import Signup from './src/Signup';
import HealthTracker from './src/HealthTracker';
import FoodJournal from './src/FoodJournal';
import Advices from './src/Advices';
import Styles from './src/Styles';
import NewMoniter from './src/NewMoniter';
import Myaccount from './src/Myaccount';
import NewBloodPressure from './src/NewBloodPressure';
import InsulinTakes from './src/InsulinTakes';
import NewActivity from './src/NewActivity';
import NewJournal from './src/NewJournal';
import ChangePassword from './src/ChangePassword';
import NewNotification from './src/NewNotification';
import Feedback from './src/Feedback';
import Notifications from './src/Notifications';
import Chatbot from './src/Chatbot';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (<SafeAreaProvider>
      <StatusBar
        backgroundColor="#426897"
      />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Signin" component={Signin} />

          <Stack.Screen options={{headerShown: true, title: 'Signup'}} name="Signup" component={Signup} />
        </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>);
  }

  const TabScreens = () => {
    
  return (
      <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveBackgroundColor: "#426897",
        tabBarActiveTintColor: "#fff",
        tabBarInactiveBackgroundColor: "#284392",
        tabBarInactiveTintColor: "#fff"
      }}
    >
      <Tab.Screen
        name="Moniter"
        component={Home}
        initialParams={{user: user}}
        options={{
          tabBarLabel: 'Moniter',
          tabBarIcon: ({ color, size }) => (
            <Image source={require('./src/assets/moniter.png')} style={Styles.btnImg} />
          ),
        }}
      />
      <Tab.Screen
        name="Activity Tracker"
        component={HealthTracker}
        initialParams={{user: user}}
        options={{
          tabBarLabel: 'Tracker',
          tabBarIcon: ({ color, size }) => (
            <Image source={require('./src/assets/tracker.png')} style={Styles.btnImg} />
          ),
        }}
      />
      <Tab.Screen
        name="Food Journal"
        component={FoodJournal}
        initialParams={{user: user}}
        options={{
          tabBarLabel: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <Image source={require('./src/assets/food.png')} style={Styles.btnImg} />
          ),
        }}
      />
      <Tab.Screen
        name="My Account"
        component={Myaccount}
        initialParams={{user: user}}
        options={{
          tabBarLabel: 'My Account',
          tabBarIcon: ({ color, size }) => (
            <Image source={require('./src/assets/more.png')} style={Styles.btnImg} />
          ),
        }}
      />
    </Tab.Navigator>)
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor="#426897"
      />
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="TabScreens" component={TabScreens} initialParams={{user: user}} />
        <Stack.Screen name="New Moniter" component={NewMoniter} options={{
          headerShown: true,
          headerTitle: "Add New Blood Suger Moniter"
        }} initialParams={{user: user}} />
        <Stack.Screen name="New BP Moniter" component={NewBloodPressure} options={{
          headerShown: true,
          headerTitle: "Add New Blood Pressure Moniter"
        }} initialParams={{user: user}} />
        <Stack.Screen name="Insulin" component={InsulinTakes} options={{
          headerShown: true,
          headerTitle: "Insulin Take Calculator"
        }} initialParams={{user: user}} />
        <Stack.Screen name="New Activity" component={NewActivity} options={{
          headerShown: true,
          headerTitle: "Add New Activity"
        }} initialParams={{user: user}} />
        <Stack.Screen name="New Journal" component={NewJournal} options={{
          headerShown: true,
          headerTitle: "Add New Food Journal"
        }} initialParams={{user: user}} />
        <Stack.Screen name="Change Password" component={ChangePassword} options={{
          headerShown: true,
          headerTitle: "Update your Password"
        }} initialParams={{user: user}} />
        <Stack.Screen name="Notifications" component={Notifications} options={{
          headerShown: true,
          headerTitle: "Notifications"
        }} initialParams={{user: user}} />
        <Stack.Screen name="New Notification" component={NewNotification} options={{
          headerShown: true,
          headerTitle: "New Notification"
        }} initialParams={{user: user}} />
        <Stack.Screen name="Advices" component={Advices} options={{
          headerShown: true,
          headerTitle: "Diabetes Information"
        }} initialParams={{user: user}} />
        <Stack.Screen name="Feedback" component={Feedback} options={{
          headerShown: true,
          headerTitle: "Feedback"
        }} initialParams={{user: user}} />
        <Stack.Screen name="Chatbot" component={Chatbot} options={{
          headerShown: true,
          headerTitle: "Chatbot"
        }} initialParams={{user: user}} />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>);
}

export default App;