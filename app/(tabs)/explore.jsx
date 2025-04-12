import { View, Text, FlatList, ScrollView, Image } from 'react-native'
import React from 'react'
import Colors from './../../constant/Colors'
import { CourseCategory } from "./../../constant/Option";
import CourseListByCategory from '../../components/Explore/CourseListByCategory';

export default function Explore() {
  return (
    <FlatList
    data={[]}
    style={{
      display: 'flex',
      flex: 1,
      backgroundColor: Colors.WHITE,
      paddingTop: 20
    }}
    ListHeaderComponent={
      <View style={{
        padding: 25
      }}>
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 30,
          color: Colors.BLACK
        }}>Explore More Courses</Text>

        {CourseCategory.map((item, index) => (
          <View key={index}>
            <CourseListByCategory category={item} />
          </View>
        ))}
      </View>
    }/>
  )
}