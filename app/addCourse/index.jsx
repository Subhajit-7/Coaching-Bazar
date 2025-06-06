import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from './../../constant/Colors'
import Button from "./../../components/Shared/Button";
import { GenerateCourseAIModel, GenerateTopicsAIModel } from "./../../config/AiModel";
import Prompt from './../../constant/Prompt'
import { db } from "./../../config/firebaseConfig";
import { UserDetailContext } from "./../../context/UserDetailContext";
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState();
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const router = useRouter();

  const onGenerateTopic = async() => {
    // if (userDetail?.member == false) {
    //   router.push('/subscriptionWall')
    //   return;
    // }
    setLoading(true);
    // Get Topic Ideas from AI Model
    const PROMPT = userInput + Prompt.IDEA;
    const aiResp = await GenerateTopicsAIModel.sendMessage(PROMPT);
    const topicIdea = JSON.parse(aiResp.response.text());
    console.log(topicIdea);
    setTopics(topicIdea?.course_titles);
    setLoading(false);
  }

  const onTopicSelect = (topic) => {
    const isAlreadyExist = selectedTopics.find((item) => item == topic);
    if (!isAlreadyExist) {
      setSelectedTopics(prev => [...prev, topic])
    } else {
      const topics = selectedTopics.filter(item => item != topic);
      setSelectedTopics(topics);
    }
  }

  const isTopicSelected = (topic) => {
    const selection = selectedTopics.find(item => item == topic);
    return selection ? true : false
  }

  /**
   * Used to Generate Course using AI Model
   */
  const onGenerateCourse = async () => {
    setLoading(true);
    const PROMPT = selectedTopics + Prompt.COURSE;
  
    try {
      const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);
      console.log("AI Raw Response:", aiResp.response.text());
  
      // Parse AI response safely
      const parsedResponse = JSON.parse(aiResp.response.text());
      console.log("Parsed Response:", parsedResponse);
  
      // Validate the structure of the response
      if (!parsedResponse?.courses || !Array.isArray(parsedResponse.courses)) {
        throw new Error("Invalid response format: 'courses' field is missing or not an array");
      }
  
      const courses = parsedResponse.courses;
  
      // Save to Firestore if courses is an array
      courses.forEach(async (course) => {
        const docId = Date.now().toString();
        await setDoc(doc(db, "courses", docId), {
          ...course,
          createdOn: new Date(),
          createdBy: userDetail?.email ?? "",
          docId: docId,
        });
      });
  
      router.push("/(tabs)/home");
    } catch (e) {
      console.error("Error generating course:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{
      padding: 25,
      backgroundColor: Colors.WHITE,
      height: '100%'
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 30
      }}>Create New Course</Text>
      <Text style={{
        fontFamily: 'outfit',
        fontSize: 23,
        marginTop: 8,
      }}>What You want to learn today?</Text>

      <Text style={{
        fontFamily: 'outfit',
        fontSize: 16,
        marginTop: 8,
        color: Colors.GRAY
      }}>Write what course you want to create (Ex.Learn Python, Digital Marketting Guide, 10th Science Chapter, etc...)</Text>

      <TextInput placeholder='(Ex. Learn Python, Learn 12th Chemistry)' 
        style={styles.textInput} 
        numberOfLines={3}
        multiline={true}
        onChangeText={(value) => setUserInput(value)}
      />

      <Button text={'Generate Topic'} type="outline" 
        onPress={() => onGenerateTopic()} loading={loading} />

      <View style={{
        marginTop: 15
      }}>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 20
        }}>Select all topics which you want to add in the course</Text>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 6
        }}>
          {topics.map((item, index) => (
            <Pressable key={index} onPress={() => onTopicSelect(item)}>
              <Text style={{
                padding: 7,
                borderWidth: 0.4,
                borderRadius: 99,
                paddingHorizontal: 15,
                backgroundColor: isTopicSelected(item) ? Colors.PRIMARY : null,
                color: isTopicSelected(item) ? Colors.WHITE : Colors.PRIMARY
              }}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedTopics?.length > 0 && <Button text={'Generate Course'} 
        onPress={() => onGenerateCourse()}
        loading={loading}
      />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  textInput:  {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    marginTop: 10,
    alignItems: 'flex-start',
    fontSize: 16
  }
})