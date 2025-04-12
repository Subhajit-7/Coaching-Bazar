import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { UserDetailContext } from '../../context/UserDetailContext';
import CourseProgressCard from '../../components/Shared/CourseProgressCard';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

export default function Progress() {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetail) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    const q = query(
      collection(db, 'courses'),
      where("createdBy", '==', userDetail?.email),
      orderBy('createdOn', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ ...doc.data(), docId: doc.id });
    });

    setCourseList(courses);
    setLoading(false);
  };

  return (
    <View style={{ 
      flex: 1 
    }}>
      <Image
        source={require('./../../assets/images/wave.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: 700,
        }}
      />

      <View style={{ 
        flex: 1, 
        padding: 20, 
        marginTop: 20 
      }}>
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 30,
            color: Colors.WHITE,
            marginBottom: 10,
          }}
        >
          Course Progress
        </Text>

        <FlatList
          data={courseList}
          keyExtractor={(item) => item.docId}
          showsVerticalScrollIndicator={false}
          onRefresh={GetCourseList}
          refreshing={loading}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/courseView/' + item?.docId,
                  params: {
                    courseParams: JSON.stringify(item),
                  },
                })
              }
            >
              <CourseProgressCard item={item} width={'96%'} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }} // Adds spacing to allow scrolling
        />
      </View>
    </View>
  );
}
