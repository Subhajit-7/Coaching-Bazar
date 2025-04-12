import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useContext } from 'react'
import Colors from './../../constant/Colors'
import { UserDetailContext } from '../../context/UserDetailContext';
import { signOut } from 'firebase/auth';
import { ProfileMenu } from "./../../constant/Option";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import { auth } from '../../config/firebaseConfig';

export default function Profile() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const onMenuClick = (menu) => {
    if (menu.name == 'Logout') {
      signOut(auth).then(() => {
        // Sign-out successful.
        setUserDetail(null)
        router.push('/');
      }).catch((error) => {
        // An error happened
        console.log(error);
      });
    } else {
      router.push(menu.path)
    }
  }
  
  return (
    <FlatList data={[]}
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE
      }}
      ListHeaderComponent={
        <View style={{
          padding: 25,
          backgroundColor: Colors.WHITE,
          flex: 1,
        }}>
          <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 35
          }}>Profile</Text>
          <View style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <Image source={require('./../../assets/images/logo.png')} 
              style={{
                width: 180,
                height: 180
            }} />
            <Text style={{
              fontFamily: 'outfit-bold',
              fontSize: 27,
              marginTop: 5,
            }}>{userDetail?.name}</Text>
            <Text style={{
              fontSize: 18,
              color: Colors.GRAY,
            }}>{userDetail?.email}</Text>
          </View>

          {ProfileMenu.map((item, index) => (
            <TouchableOpacity key={index} 
              onPress={() => onMenuClick(item)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                backgroundColor: Colors.WHITE,
                elevation: 1,
                borderRadius: 10,
                marginVertical: 5,
            }}>
              <View style={{
                backgroundColor: Colors.BG_GRAY,
                padding: 8,
                borderRadius: 10,
                elevation: 1
              }}>
                <Ionicons name={item.icon} size={25} color={Colors.PRIMARY} />
              </View>
              <Text style={{
                fontFamily: 'outfit',
                fontSize: 20,
                marginLeft: 10,
              }}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      } 
    />
  );
}