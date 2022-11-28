import React, {Component, Fragment} from 'react';
import {View, Text, Image, style, StyleSheet, Tab, Stack, Button, } from 'react-native';
import { NavigationContainer, Navigator, useIsFocused  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../AfterLogged/Profile';
import Home from '../AfterLogged/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Users from '../AfterLogged/Users';
import Edit from '../hidden/Edit';
import ChatRoom from '../AfterLogged/ChatRoom';
import UserProfile from '../AfterLogged/UserProfile';
import Comment from '../hidden/Comment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SentIcon from '../../assets/sent.png'
import Post from '../AfterLogged/CreatePost'
import { onFocus } from 'deprecated-react-native-prop-types/DeprecatedTextInputPropTypes';
import CreatePost from '../AfterLogged/CreatePost';
import Notification from '../AfterLogged/Notification';
import StoryToProfile from '../AfterLogged/StoryToProfile';
import LikeUsers from '../AfterLogged/LikeUsers';
import Chat from '../AfterLogged/Chat';
import UpdatePost from '../AfterLogged/UpdatePost';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import Story from '../AfterLogged/Story';

const AppStack = createNativeStackNavigator();

export default class App extends Component {
  render =()=>{
    return (
      <NavigationContainer>
        <AppStack.Navigator >
        <AppStack.Screen name="Home" component={HomeTabs} options={{headerShown: false}} />
        
        <AppStack.Screen name="UserProfile" component={UserProfile} />
        <AppStack.Screen name="Comments" component={Comment} />
        <AppStack.Screen name="Chat Room" component={ChatRoom}/>
        <AppStack.Screen name="Edit" component={Edit} options={{
          headerShown:false }}/>
        <AppStack.Screen name="Post" component={Post} options={{
          headerShown:false
        }}/>
        <AppStack.Screen name="Notification" component={Notification}/>
        <AppStack.Screen name="StoryPage" component={Story} options={{
          headerShown:false
        }} />
        <AppStack.Screen name='LikeUsers' component={LikeUsers} />
        <AppStack.Screen name='Chat' component={Chat} options={({navigation,route}) => ({
          headerRight:() => <Image style={{ width:40, height:40, borderRadius:20 }} source={route.params.profilePicture ? {uri:route.params.profilePicture} : require('../../assets/user.png')} />,
          headerTitle:route.params.username
        })} />
        <AppStack.Screen
        name='UpdatePost'
        component={UpdatePost}
        options={{
          headerShown:false
         }}
         />
      </AppStack.Navigator>
      </NavigationContainer>
    );
  }
}
const TabScreen = createBottomTabNavigator();

function HomeTabs({navigation}) {
  const [chats, setChats] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3000/getChat`,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'GET'
    })
    .then(res => res.json())
    .then((chats) => {
      let chatsArray = []
        chats.forEach((chat) => {
          if (chat.otherUser.uid === getAuth().currentUser.uid && chat.uid !== getAuth().currentUser.uid && chat.isRead === false || chat.currentUser.uid === getAuth().currentUser.uid && chat.uid !== getAuth().currentUser.uid && chat.isRead === false) {
            chatsArray.push(chat)
          }
        })
        setChats(chatsArray)
    })
    .catch(e => {
        console.log(e.message)
    })
  },[chats])

  return (
    <TabScreen.Navigator tabBarOptions={{
      showLabel:false,
      tabBarActiveTintColor: '#fffff',
      tabBarInactiveTintColor: '#586589',
  }}>
      <TabScreen.Screen name="Posts" component={Home} options={{
        tabBarLabel: '',
        headerShown: false,
        tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,          
      }}/>
      <TabScreen.Screen name="Users" component={Users} options={{
        tabBarLabel: '',
      tabBarIcon: ({size,color}) => <FontAwesome name="users" size={size} color={color} />, 
    
    }}/>
    <TabScreen.Screen name="Add" component={CreatePost} options={{
        tabBarLabel: '',
        headerShown: false,
        tabBarIcon: ({ color, size }) => <AntDesign name="pluscircleo" size={size} color={color} />,             
      }} />
    <TabScreen.Screen name="Chat Room" component={ChatRoom} options={{
      tabBarLabel: '',
        tabBarIcon: ({ color, size }) => <AntDesign name="message1" size={size} color={color} />,
       tabBarBadge:chats.length || null             
      }} />
      <TabScreen.Screen name="Profile" component={Profile} options={{
        tabBarLabel: '',
        headerShown: false,
        tabBarIcon: ({ color, size }) => <AntDesign name="user" size={size} color={color} />,             
      }} />

    </TabScreen.Navigator>
  );
}

