import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./../../config/firebaseConfig";
import CourseList from '../Home/CourseList';
import { UserDetailContext } from "./../../context/UserDetailContext";

export default function CourseListByCategory({ category }) {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GetCourseListByCategory();
    }, [category])

    const GetCourseListByCategory = async() => {
      setLoading(true);
      setCourseList([]);
    
      const q = query(
        collection(db, 'courses'),
        where('category', '==', category),
        orderBy('createdOn', 'desc')
      );
    
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter out user's own courses and enrolled courses
      const filteredCourses = courses.filter(course => 
        course.createdBy !== userDetail?.email && !userDetail?.enrolledCourses?.includes(course.id)
      );
    
      setCourseList(filteredCourses);
      setLoading(false);
    }

  return (
    <View>
      {courseList?.length > 0  && <CourseList courseList={courseList} heading={category} enroll={true} />}
    </View>
  )
}