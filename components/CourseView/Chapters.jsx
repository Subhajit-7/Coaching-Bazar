import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router'
import { UserDetailContext } from '../../context/UserDetailContext'

export default function Chapters({ course }) {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const isUserCourse = userDetail?.email === course?.createdBy;
  const isEnrolled = userDetail?.enrolledCourses?.includes(course?.docId);

  const isChapterCompleted = (index) => {
    const isCompleted = course?.completedChapter.find(item => item == index)
    return isCompleted ? true : false
  }

  const handleChapterPress = (item, index) => {
    if (isUserCourse || isEnrolled) {
      router.push({
        pathname: '/chapterView',
        params: {
          chapterParams: JSON.stringify(item),
          docId: course?.docId,
          chapterIndex: index
        }
      });
    } else {
      Alert.alert('Access Denied 🚫',
        'You need to enroll in this course to view the chapters.',)
    }
  }

  return (
    <View style={{
        padding: 20
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 25
      }}>Chapters</Text>

      <FlatList
        data={course?.chapters}
        renderItem={({item, index}) => (
          <TouchableOpacity 
          onPress={() => handleChapterPress(item, index)} 
          style={{
              padding: 18,
              borderWidth: 0.5,
              borderRadius: 15,
              marginTop: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
          }}>
              <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 10,
                  width: 260
              }}>
                  <Text style={styles.chapterText}>{index + 1}.</Text>
                  <Text style={styles.chapterText}>{item.chapterName}</Text>
              </View>
              {isUserCourse || isEnrolled ? (
                isChapterCompleted(index) ? (
                  <Ionicons name='checkmark-circle' size={24} color={Colors.GREEN} />
                ) : (
                  <Ionicons name='play' size={24} color={Colors.PRIMARY} />
                )
              ) : (
                <Ionicons name='play' size={24} color={Colors.PRIMARY} />
              )}
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    chapterText: {
        fontFamily: 'outfit',
        fontSize: 20
    }
})