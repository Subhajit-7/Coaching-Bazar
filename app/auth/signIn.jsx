import { View, Text, Image, TextInput, StyleSheet, Pressable, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Colors from './../../constant/Colors'
import { useRouter } from 'expo-router'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserDetailContext';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the eye icon

export default function SignIn() {
    const router = useRouter();
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

    const onSignInClick = () => {
        // Basic client-side validation before attempting sign-in
        if (!email || !password) {
            ToastAndroid.show("Please enter both email and password.", ToastAndroid.BOTTOM);
            return;
        }
        if (emailError) { // Prevent sign-in if email is invalid
            ToastAndroid.show("Please fix the email error.", ToastAndroid.BOTTOM);
            return;
        }

        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .catch(e => {
                console.log(e);
                setLoading(false);
                ToastAndroid.show(e.message, ToastAndroid.BOTTOM);
            });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && !userDetail) { // Ensure user is logged in and userDetail hasn't been set yet
                setLoading(true); // Show loading while fetching user details
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.email));
                    if (userDoc.exists()) {
                        setUserDetail(userDoc.data());
                        router.replace('/(tabs)/home');
                    } else {
                        ToastAndroid.show("User details not found!", ToastAndroid.BOTTOM);
                    }
                } catch (error) {
                    console.log(error);
                    ToastAndroid.show("Error fetching user details!", ToastAndroid.BOTTOM);
                } finally {
                    setLoading(false); // Hide loading after fetching user data, regardless of success or failure
                }
            } else if (user && userDetail) {
                // If user is logged in and userDetail is already set (e.g., coming back to sign-in screen),
                // redirect to home without re-fetching user details.
                router.replace('/(tabs)/home');
            } else {
                setLoading(false); // If no user, ensure loading is false
            }
        });

        return unsubscribe; // Cleanup listener
    }, [userDetail]); // Re-run effect if userDetail changes to handle re-direction

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
            }}>Welcome Back</Text>

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
                onPress={onSignInClick}
                disabled={loading || !!emailError} // Disable if loading or email is invalid
                style={{
                    padding: 15,
                    backgroundColor: Colors.PRIMARY, // Dim button if disabled
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
                }}>Sign In</Text> :
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
                }}>Don't have an account?</Text>
                <Pressable
                    onPress={() => router.push('/auth/signUp')}
                >
                    <Text style={{
                        color: Colors.PRIMARY,
                        fontFamily: 'outfit-bold'
                    }}>Create New Here</Text>
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
        borderColor: Colors.GRAY, // Add default border color
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        width: '100%',
        marginTop: 20,
        borderRadius: 8,
        borderColor: Colors.GRAY, // Add default border color
    },
    passwordInput: {
        flex: 1, // Take up remaining space
        padding: 15,
        fontSize: 18,
    },
    eyeIcon: {
        padding: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        alignSelf: 'flex-start', // Align error text to the left
        marginLeft: 5, // Small margin for better spacing
        marginTop: 5,
    }
})