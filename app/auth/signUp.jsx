import { View, Text, Image, TextInput, StyleSheet, Pressable, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from './../../constant/Colors'
import { useRouter } from 'expo-router'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserDetailContext';

export default function SignUp() {
    const router = useRouter();
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const CreateNewAccount = () => {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
      .then(async(resp) => {
        const user = resp.user;
        // console.log(user);
        await SaveUser(user);
        setLoading(false);
        // Save User to Database
      })
      .catch(e => {
        console.log(e.message);
        setLoading(false);
        ToastAndroid.show(e.message, ToastAndroid.BOTTOM)
      })
    }

    const SaveUser = async(user) => {
      const data = {
        name: fullName,
        email: email,
        member: false,
        uid: user?.uid
      };
    
      const existingUser = await getDoc(doc(db, 'users', email));
      if (!existingUser.exists()) {
        await setDoc(doc(db, 'users', email), data);
        setUserDetail(data);
      }
    }

  return (
    <View style={{
        display: 'flex',
        alignItems: 'center',
        paddingTop: 100,
        flex: 1,
        padding: 25,
        backgroundColor: Colors.WHITE
    }}>
      <Image source={require('./../../assets/images/logo.png')} 
        style={{
            width: 180,
            height: 180
        }}
      />

      <Text style={{
        fontSize: 30,
        fontFamily: 'outfit-bold'
      }}>Create New Account</Text>

      <TextInput placeholder='Full Name' onChangeText={(value) => setFullName(value)} style={styles.textInput} />
      <TextInput placeholder='Email' onChangeText={(value) => setEmail(value)} style={styles.textInput} />
      <TextInput placeholder='Password' onChangeText={(value) => setPassword(value)} secureTextEntry={true} style={styles.textInput} />

      <TouchableOpacity
      onPress={CreateNewAccount}
        style={{
            padding: 15,
            backgroundColor: Colors.PRIMARY,
            width: '100%',
            marginTop: 25,
            borderRadius: 10
        }}
      >
        {!loading ? <Text style={{
          fontFamily: 'outfit',
          fontSize: 20,
          color: Colors.WHITE,
          textAlign: 'center'
        }}>Create Account</Text> :
          <ActivityIndicator size={'large'} color={Colors.WHITE} />
        }
      </TouchableOpacity>

      <View style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        marginTop: 20
      }}>
        <Text style={{
            fontFamily: 'outfit'
        }}>Already have an account?</Text>
        <Pressable
            onPress={() => router.push('/auth/signIn')}
        >
            <Text style={{
                color: Colors.PRIMARY,
                fontFamily: 'outfit-bold'
            }}>Sign In Here</Text>
        </Pressable>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        width: '100%',
        padding: 15,
        fontSize: 18,
        marginTop: 20,
        borderRadius: 8
    }
})