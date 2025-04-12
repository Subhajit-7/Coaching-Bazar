import { View, Text, Image, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { imageAssets } from '../../constant/Option'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constant/Colors'
import Button from './../../components/Shared/Button'
import { useRouter } from 'expo-router'
import { UserDetailContext } from "./../../context/UserDetailContext";
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'

export default function Intro({ course, enroll }) {
    const router = useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);

    const isUserCourse = userDetail?.email === course?.createdBy;
    const isCourseCompleted = (course?.completedChapter?.length || 0) === (course?.chapters?.length || 0);

    const OnEnrollCourse = async() => {
        // if (userDetail?.member == false) {
        //     router.push('/subscriptionWall')
        //     return;
        // }
        const docId = Date.now().toString();
        setLoading(true);
        const data = {
            ...course,
            docId,
            createdBy: userDetail?.email,
            createdOn: new Date(),
            enrolled: true,
            completedChapter: []
        }

        await setDoc(doc(db, 'courses', docId), data)
        router.push({
            pathname: '/courseView/' + docId,
            params: {
                courseParams: JSON.stringify(data),
                enroll: false
            }
         })
        setLoading(false);
    }

    const handleStartCourse = () => {
        router.push({
            pathname: '/courseView/' + course?.docId,
            params: {
                courseParams: JSON.stringify(course),
                enroll: false
            }
        });
    }

  return (
    <View>
      <Image source={imageAssets[course?.banner_image]} 
        style={{
            width: '100%',
            height: 280
        }}
      />
      <View style={{
        padding: 20
      }}>
        <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 25,
        }}>{course?.courseTitle}</Text>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            marginTop: 5
        }}>
            <Ionicons name='book-outline' size={20} color={Colors.PRIMARY} />
            <Text style={{
                fontFamily: 'outfit',
                fontSize: 18,
                color: Colors.PRIMARY
            }}>{course?.chapters?.length} Chapters</Text>
        </View>
        <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 20,
            marginTop: 10
        }}>Description:</Text>
        <Text style={{
            fontFamily: 'outfit',
            fontSize: 18,
            color: Colors.GRAY
        }}>{course?.description}</Text>
        
        {isUserCourse ? (
            isCourseCompleted ? (
                <View style={{
                    backgroundColor: Colors.GREEN,
                    padding: 15,
                    borderRadius: 10,
                    width: '100%',
                    alignItems: 'center',
                    marginVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <Ionicons name="checkmark-circle" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text style={{ 
                        color: Colors.WHITE, 
                        fontSize: 20,
                        fontFamily: 'outfit-bold'
                    }}>Course Completed</Text>
                </View>
            ) : (
                <Button text="Start Now" onPress={handleStartCourse} />
            )
        ) : enroll === 'true' ? (
            <Button text="Enroll Now" loading={loading} onPress={OnEnrollCourse} />
        ) : null}
      </View>
      <Pressable style={{
            position: 'absolute',
            padding: 10
        }}
            onPress={() => router.back()}
        >
            <Ionicons name='arrow-back' size={34} color="black" />
        </Pressable>

    </View>
  )
}