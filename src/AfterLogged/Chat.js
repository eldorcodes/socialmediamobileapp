import { View, Text, TextInput, TouchableOpacity, Dimensions, Alert, ScrollView, Image, ActivityIndicator, Pressable } from 'react-native'
import React from 'react';
import { getUserData, createChat, getChat, getUsername, getUser } from './firebase';
import { useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import moment from 'moment';
import userpng from '../../assets/user.png'
import leftarrow from '../../assets/leftarrow.png'
moment.locale('uz');
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Amplify, {Storage} from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

export default function Chat({navigation,route}) {
    const { item } = route.params;
    let date = new Date().toString();
    let db = getDatabase();
    let auth = getAuth();

    const [loading,setLoading] = useState(true);
    const [image, setImage] = useState(null);


    const [chatMsgs,setChatMsgs] = useState([])

    const [message,setMessage] = useState(null);

    const [progressText, setProgressText] = useState('');
    const [isLoading, setisLoading] = useState(false);

    const scrollRef = useRef();

console.log('ITEM --- ', item);

    const sendMessage = () => {
       fetch(`http://localhost:3000/createChat`,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method:'post',
        body:JSON.stringify({
          message,
          image,
          uid:auth.currentUser.uid,
          item,
          isRead:false
        })
       })
       .then(res => {
        console.log(res);
        setMessage(null)
        setImage(null)
       })
       .catch(e => console.log(e)) 
    }

    const attachFile = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);

      uploadResource(result)
  
      if (result.cancelled) {
        setisLoading(false)
      }
    };



    const fetchResourceFromURI = async uri => {
      const response = await fetch(uri);
      console.log(response);
      const blob = await response.blob();
      return blob;
    };
    
    //// random string ///
    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    
    const uploadResource = async (asset) => {
      if (isLoading) return;
      setisLoading(true);
      const img = await fetchResourceFromURI(asset.uri);
      return Storage.put(`${makeid(10)}+${makeid(5)}.jpg`, img, {
        level: 'public',
        contentType: asset.type,
        progressCallback(uploadProgress) {
          setProgressText(
            `Progress: ${Math.round(
              (uploadProgress.loaded / uploadProgress.total) * 100,
            )} %`,
          );
          console.log(
            `Progress: ${uploadProgress.loaded}/${uploadProgress.total}`,
          );
        },
      })
        .then(res => {
          setProgressText('Upload Done: 100%');
          setisLoading(false);
          Storage.get(res.key)
            .then(result => {
              //console.log(result)
              let updatedUri = result.substring(0,result.indexOf('?'))
             if (!image) {
              setImage(updatedUri)
             }
              console.log(updatedUri);
            })
            .catch(err => {
              setProgressText('Upload Error');
              console.log(err);
            });
        })
        .catch(err => {
          setisLoading(false);
          setProgressText('Upload Error');
          console.log(err);
        });
    };


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
          if (chat.otherUser._id === item.otherUser._id && chat.currentUser._id === item.currentUser._id) {
            chatsArray.push(chat)
          }else if (chat.otherUser._id === item.currentUser._id && chat.currentUser._id === item.otherUser._id) {
            
          }
        })
        setChatMsgs(chatsArray)
    })
    .catch(e => {
        console.log(e.message)
    })
    ///// update chat
    chatMsgs.forEach((chat) => {
      if (chat.uid !== auth.currentUser.uid && chat.isRead === false) {
        fetch(`http://localhost:3000/updateChat`,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      method:'POST',
      body:JSON.stringify(chat)
      })
      .then((res) => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      })
      }
    })
   },[chatMsgs])

  return (
    <View style={{
        flex:1
    }}>

      <View style={{
        flex:7,
      }}>
        <ScrollView 
      
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated:true })}
        >
        {chatMsgs.map((chat,index) => (
            <View
            key={index} 
            style={{
              display:'flex',
              flex:1,
              justifyContent:'space-between',
          
            }}>

              <View style={{
                alignItems:chat.uid !== auth.currentUser.uid ? 'flex-start':'flex-end',
                display:'flex', 
              }}>
                {!!chat.message && <View>
                  <View style={{
                  borderRadius:20,
                  backgroundColor:chat.uid !== auth.currentUser.uid ?'gray' :'blue',
                  borderBottomRightRadius:chat.uid !== auth.currentUser.uid ? 20: 5,
                  borderBottomLeftRadius:chat.uid !== auth.currentUser.uid ? 5: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 4,
                  shadowRadius: 3,
                  shadowColor: 'black',
                  shadowOpacity: 0.2,
                  
                }}>
                <Text
                 style={{
                  color:'#fff',
                  padding: 10,
                  fontSize:15,
               

                }}>
                  {chat.message}
                </Text>

                </View>
                <Text style={{marginBottom:10, fontSize: 10}}>{moment(chat.date).startOf('seconds').fromNow()}</Text>
                </View>  }

                  {<View>
                  <View >
                {!!chat.image && <Image style={{width:200,height:200}} source={{uri:chat.image}} />}
                </View>
                <Text style={{marginBottom:10}}>{chat.image && moment(chat.date).startOf('seconds').fromNow()}</Text>
                  </View>}
              </View>

            </View>
        ))}
        </ScrollView>
      </View>

      <View style={{
        marginLeft:2,
        flexDirection:'row'
      }}>
      {!!image && <Pressable onPress={() => setImage(null)}><Image style={{width:64,height:64}} source={{uri:image}} /></Pressable>}
      {!!image && <AntDesign onPress={() => setImage(null)} name="close" size={28} color="black" /> }
      {isLoading &&  <ActivityIndicator size={'large'} color={'blue'} />}
      </View>

      <View style={{
        flex:1,
        width:Dimensions.get('screen').width,
        flexDirection:'row'
      }}>
        

        <View style={{
          flex: 1,
          flexDirection: 'row',
          borderTopWidth: 0.2,
          
          borderTopColor: 'black',
          alignItems: 'center',
        }}>
    <TextInput
    multiline
    style={{
      paddingLeft:5,
      height:40,
      backgroundColor: 'white',
      marginLeft: 5,
      borderRadius: 10,
      width: 270,
      marginLeft: 15,
    }}
    value={message}
        placeholder="Type a message ..."
        onChangeText={(text) => {setMessage(text)}}
        underlineColorAndroid="transparent"
    />

{<FontAwesome onPress={attachFile} name="picture-o" size={35} color="black" style={{marginLeft: 5}} />}

<FontAwesome onPress={sendMessage} name="send" size={35} color="black"  style={{marginLeft: 5}}/>

</View>
      </View>

    </View>
  )
}