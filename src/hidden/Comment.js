import { View, Text, Dimensions, TextInput, Pressable, TouchableOpacity, Alert, Image } from 'react-native'
import React, {useState, useEffect} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createComment } from '../AfterLogged/firebase';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, ref } from 'firebase/database';

export default function Comment({navigation,route}) {
  const {post} = route.params;

  const [comment,setComment] = useState('');

  const [comments,setComments] = useState([])

  const [users, setUsers] = useState([]);

  const date = new Date().toDateString();

  let auth = getAuth()


  function leaveComment(){
    createComment(post._id,auth.currentUser.uid,comment,date)
    /// clear text input value
    setComment('')
  }

  function getAllUsers(){
    fetch('http://localhost:3000/getUserData',{method:'GET'})
    .then((res) => res.json())
    .then((data) => {
        let friendsgroup = []
        data.forEach((user) => {
          friendsgroup.push(user)
        })
        setUsers(friendsgroup)
    })
    .catch((err) => {
      Alert.alert(err.message)
    })
  }

  // fetch all comments from db
  function getAllComments(){
    fetch(`http://localhost:3000/postComment/${post._id}`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method:'GET'
    })
    .then((res) => res.json())
    .then((cmts) => {
      console.log(cmts);
      setComments(cmts.commentsArray)
    })
    .catch(e => console.log(e))
  }

  function getUsername(id){
    let username = ''
    users.forEach((user) => {
      if (user._id === id) {
        username = user.username
      }
    })
    return username
  }

  function getUserAvatar(id){
    let avatar = null;
    users.forEach((user) => {
      if (user._id === id) {
        avatar = user.profilePicture
      }
    })
    return avatar
  }

  useEffect(() => {
    getAllComments()
  },[comments])

  useEffect(() => {
    getAllUsers()
  },[users])

  return (
    <View style={{
      flex:1
    }}>

      <View style={{
        width:Dimensions.get('screen').width,
        height:200,
        flex:2
      }}>
        {comments && comments.map((comment,index) => {
          return (
            <View 
            style={{
              flexDirection:'row',
              padding:5
            }}
            key={index}>
              <View style={{
                flexDirection:'row'
              }}>
                <Image source={getUserAvatar(comment.userId) ? { uri:getUserAvatar(comment.userId) } : require('../../assets/user.png')} 
                style={{width:50,height:50}} />
              <View>
              <Text 
              onPress={() => navigation.navigate('UserProfile',{
                id:comment.userId
              })}
              style={{
                  fontWeight:'bold',
                  fontSize:18
              }}>{getUsername(comment.userId)}</Text>
               <Text style={{
                backgroundColor:'#fff',
                fontSize:16,
                padding:5,
                maxWidth:250
              }}>
                {comment.comment}
                </Text>
                </View>
                </View>
              
             
            </View>
          )
        })}
      </View>

      <View style={{
        width:Dimensions.get('screen').width,
        height:150,
        flexDirection:'row'
      }}>
        <TextInput 
        value={comment}
        onChangeText={(comment) => setComment(comment)}
        selectionColor={'black'}
        style={{
          width:'85%',
          height:50,
          borderBottomWidth:1,
          paddingLeft:5,
        }} placeholder='Leave a comment' />
        <TouchableOpacity style={{
          width:'25%',
          padding:10
        }}>
          <MaterialCommunityIcons onPress={leaveComment} name="send-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

    </View>
  )
}