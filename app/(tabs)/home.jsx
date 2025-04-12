import { View, Text, Platform, FlatList, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Home/Header'
import Colors from './../../constant/Colors'
import NoCourse from '../../components/Home/NoCourse'
import { db } from "./../../config/firebaseConfig";
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { UserDetailContext } from '../../context/UserDetailContext'
import CourseList from '../../components/Home/CourseList'
import PraticeSection from '../../components/Home/PraticeSection'
import CourseProgress from '../../components/Home/CourseProgress'

export default function Home() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (userDetail?.email && !hasFetched) {
      setHasFetched(true);  
      GetCourseList();
    }
  }, [userDetail?.email])

  const GetCourseList = async () => {
    if (!userDetail?.email) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'courses'),
        where('createdBy', '==', userDetail.email),
        orderBy('createdOn', 'desc')
      );
      const querySnapshot = await getDocs(q);
      setCourseList(querySnapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoading(false);
  };

  return (
    <FlatList
      data={courseList}
      keyExtractor={(item, index) => index.toString()}
      onRefresh={GetCourseList}
      refreshing={loading}
      ListHeaderComponent={
        <View style={{
          flex: 1,
          backgroundColor: Colors.WHITE
        }}>
          <Image source={require('./../../assets/images/wave.png')} 
            style={{
              position: 'absolute',
              width: '100%',
              height: 700
            }}
          />
          <View style={{
            padding: 25
          }}>
            <Header />
            {courseList?.length == 0 ?
              <NoCourse /> :
              <View>
                <CourseProgress courseList={courseList} />
                <PraticeSection />
                <CourseList courseList={courseList} />
              </View>  
            }

          </View>
        </View>
    } />
  )
}