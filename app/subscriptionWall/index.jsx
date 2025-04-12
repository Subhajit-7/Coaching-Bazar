import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

export default function SubscriptionWall() {
  const [selectedPlan, setSelectedPlan] = useState('Annual');
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image 
        source={require('./../../assets/images/edu.png')} 
        style={styles.headerImage}
      />

      {/* Subscription Details */}
      <View style={styles.subscriptionContainer}>
        <Text style={styles.title}>Get started with our Standard plan</Text>

        {/* Toggle between Standard & Premium */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={styles.toggleButton}
            onPress={() => setSelectedPlan('Monthly')}
          >
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 15
            }}>Standard</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setSelectedPlan('Annual')}
          >
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 15
            }}>Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Features List */}
        <View>
            <Text style={styles.featureText}>✔ Access to 30 cinematic LUTs</Text>
            <Text style={styles.featureText}>✔ Pro fonts and transition effects</Text>
            <Text style={styles.featureText}>✔ 10+ templates</Text>
        </View>
      </View>

        {/* Pricing Options */}
        <View style={{
            paddingHorizontal: 20,
            marginTop: -15
        }}>
            <TouchableOpacity 
            style={[
                styles.planOption, 
                selectedPlan === 'Annual' && styles.selectedPlan
            ]}
            onPress={() => setSelectedPlan('Annual')}
            >
                <Text style={styles.planTitle}>Annual</Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 14
                }}>Full access for just $39.99/yr</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[
                styles.planOption, 
                selectedPlan === 'Monthly' && styles.selectedPlan
            ]}
            onPress={() => setSelectedPlan('Monthly')}
            >
                <Text style={styles.planTitle}>Monthly</Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 14
                }}>Full access for just $4.99/mo</Text>
            </TouchableOpacity>

            {/* Continue & Cancel Buttons */}
            <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancleButton}
                onPress={() => router.back()}
            >
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  headerImage: {
    width: '100%',
    height: 280,
  },
  subscriptionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 19,
    marginBottom: 8,
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: Colors.BG_GRAY,
    elevation: 2
  },
  toggleButton: {
    padding: 15,
    width: 100,
    alignItems: 'center',
  },
  featureText: {
    fontFamily: 'outfit',
    fontSize: 14,
    marginBottom: 1,
  },
  planOption: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
    borderColor: Colors.GRAY,
  },
  selectedPlan: {
    backgroundColor: Colors.LIGHT_GREEN,
    borderColor: Colors.GREEN,
  },
  planTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: Colors.GREEN,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  cancleButton: {
    width: '100%',
    alignItems: 'center',
  },
  continueText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
  cancelText: {
    color: Colors.GRAY,
    fontSize: 14,
  },
})