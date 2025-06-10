import { View, Text, Image, TextInput, StyleSheet, Pressable, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useContext, useState, useEffect } from 'react' // Added useEffect
import Colors from './../../constant/Colors'
import { useRouter } from 'expo-router'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserDetailContext';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the eye icon

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState(''); // Initialize with empty string
  const [email, setEmail] = useState(''); // Initialize with empty string
  const [password, setPassword] = useState(''); // Initialize with empty string
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [emailError, setEmailError] = useState(''); // State for email validation error

  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  // Email validation function
  const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          setEmailError('Please enter a valid email address.');
      } else {
          setEmailError('');
      }
  };

  // Effect for real-time email validation
  useEffect(() => {
      if (email) { // Only validate if email is not empty
          const handler = setTimeout(() => {
              validateEmail(email);
          }, 500); // Debounce the validation for 500ms
          return () => clearTimeout(handler);
      } else {
          setEmailError(''); // Clear error if email input is empty
      }
  }, [email]);

  const CreateNewAccount = () => {
      // Basic client-side validation before attempting account creation
      if (!fullName || !email || !password) {
          ToastAndroid.show("Please fill in all fields.", ToastAndroid.BOTTOM);
          return;
      }
      if (emailError) { // Prevent creation if email is invalid
          ToastAndroid.show("Please fix the email error.", ToastAndroid.BOTTOM);
          return;
      }

      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
          .then(async(resp) => {
              const user = resp.user;
              await SaveUser(user);
              setLoading(false); // Set loading to false after successful save
          })
          .catch(e => {
              console.log(e.message);
              setLoading(false);
              ToastAndroid.show(e.message, ToastAndroid.BOTTOM);
          });
  }

  const SaveUser = async(user) => {
      const data = {
          name: fullName,
          email: email,
          member: false, // Default to false for new users
          uid: user?.uid
      };
      
      try {
          // Check if user already exists in Firestore (though Firebase Auth might handle this too)
          const existingUserDoc = await getDoc(doc(db, 'users', email));
          if (!existingUserDoc.exists()) {
              await setDoc(doc(db, 'users', email), data);
              setUserDetail(data); // Set user details in context
              ToastAndroid.show("Account Created Successfully!", ToastAndroid.BOTTOM);
              router.replace('/(tabs)/home'); // Redirect to home
          } else {
              // This case should ideally not happen if Firebase Auth prevents duplicate emails
              // But good to have a fallback
              ToastAndroid.show("User already exists in database.", ToastAndroid.BOTTOM);
          }
      } catch (error) {
          console.log("Error saving user data to Firestore:", error);
          ToastAndroid.show("Error saving user data.", ToastAndroid.BOTTOM);
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

          <TextInput
              placeholder='Full Name'
              onChangeText={(value) => setFullName(value)}
              style={styles.textInput}
              value={fullName} // Controlled component
          />
          
          <TextInput
              placeholder='Email'
              onChangeText={(value) => setEmail(value)}
              style={styles.textInput}
              keyboardType='email-address' // Suggest email keyboard
              autoCapitalize='none' // Prevent auto-capitalization
              value={email} // Controlled component
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={styles.passwordContainer}>
              <TextInput
                  placeholder='Password'
                  onChangeText={(value) => setPassword(value)}
                  secureTextEntry={!showPassword} // Toggle secureTextEntry
                  style={styles.passwordInput}
                  value={password} // Controlled component
              />
              <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
              >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
              </TouchableOpacity>
          </View>

          <TouchableOpacity
              onPress={CreateNewAccount}
              disabled={loading || !!emailError || !fullName || !email || !password} // Disable if loading, email invalid, or fields empty
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
      borderRadius: 8,
      borderColor: Colors.GRAY,
  },
  passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      width: '100%',
      marginTop: 20,
      borderRadius: 8,
      borderColor: Colors.GRAY,
  },
  passwordInput: {
      flex: 1,
      padding: 15,
      fontSize: 18,
  },
  eyeIcon: {
      padding: 10,
  },
  errorText: {
      color: 'red',
      fontSize: 12,
      alignSelf: 'flex-start',
      marginLeft: 5,
      marginTop: 5,
  }
})