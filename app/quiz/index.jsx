import { View, Text, Image, Pressable, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';
import * as Progress from 'react-native-progress'
import Button from './../../components/Shared/Button'
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./../../config/firebaseConfig";

export default function Quiz() {
    const router = useRouter();
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const quiz = course?.quiz;
    const [selectedOption, setSelectedOption] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const GetProgress = (currentPage) => {
        const perc = (currentPage / quiz?.length);
        return perc;
    }

    const OnOptionSelect = (selectedChoice) => {
        setResult(prev => ({
            ...prev,
            [currentPage]: {
                userChoice: selectedChoice,
                isCorrect: quiz[currentPage]?.correctAns == selectedChoice,
                question: quiz[currentPage]?.question,
                correctAns: quiz[currentPage]?.correctAns
            }
        }));
        console.log(result);
    }

    const onQuizFinish = async() => {
        setLoading(true);
        // Save The result in Database for Quiz
        try {
            await updateDoc(doc(db, 'courses', course?.docId), {
                quizResult: result
            })
            setLoading(false);

            router.replace({
                pathname: '/quiz/summery',
                params: {
                    quizResultParam: JSON.stringify(result)
                }
            })
        } catch (e) {
            setLoading(false);
        }
        // Redirect user to Quiz Summary
    }

  return (
    <View>
      <Image source={require('./../../assets/images/quizz.png')} 
        style={{
            height: '100%',
            width: '100%'
        }}
        blurRadius={5}
      />
      <View style={{
        position: 'absolute',
        padding: 25,
        width: '100%'
      }}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Pressable onPress={() => router.back()}>
                <Ionicons name='arrow-back' size={30} color="white" />
            </Pressable>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 20,
                color: Colors.WHITE
            }}>{currentPage + 1} of {quiz?.length}</Text>
        </View>

        <View style={{
            marginTop: 20
        }}>
            <Progress.Bar progress={GetProgress(currentPage)} width={Dimensions.get('window').width * 0.85} 
                color={Colors.WHITE} height={10} />
        </View>

        <View style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            marginTop: 30,
            height: Dimensions.get('screen').height * 0.65,
            elevation: 1,
            borderRadius: 20
        }}>
            <Text style={{
                fontSize: 25,
                fontFamily: 'outfit-bold',
                textAlign: 'center'
            }}>{quiz[currentPage]?.question}</Text>

            {quiz[currentPage]?.options.map((item, index) => (
                <TouchableOpacity 
                onPress={() => { setSelectedOption(index);
                    OnOptionSelect(item)
                 }}
                key={index} style={{
                    padding: 20,
                    borderWidth: 1,
                    borderRadius: 15,
                    marginTop: 8,
                    backgroundColor: selectedOption == index ? Colors.LIGHT_GREEN : null,
                    borderColor: selectedOption == index ? Colors.GREEN : null
                }}>
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 20
                    }}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {(selectedOption?.toString() && quiz?.length - 1 > currentPage) && <Button text={'Next'} 
            onPress={() => { setCurrentPage(currentPage + 1); setSelectedOption(null) }}
        />}

        {(selectedOption?.toString() && quiz?.length - 1 == currentPage) && 
            <Button text={"Finish"} 
                loading={loading}
                onPress={() => onQuizFinish()}
            />}
      </View>
    </View>
  )
}