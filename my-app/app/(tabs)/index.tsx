import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

/**
 * expo의 알림(푸시 알림) 기능을 사용하기 위한 라이브러리
 * 
 * 주요 역할:
 * 1. 알림 권한 관리
 * 2. 알림 스케줄링
 * 3. 알림 표시
 * 4. 알림 클릭 이벤트 처리
 * 5. 알림 푸시 토큰 관리
 * 6. 알림 푸시 토큰 관리
 */
import * as Notifications from 'expo-notifications'; 
import { Button } from 'react-native';
type Todo = {
  id: string;
  title: string;
  completed: boolean;
};


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // 알림 표시 여부
    shouldPlaySound: true, // 알림 사운드 재생 여부
    shouldSetBadge: false, // 알림 배지 설정 여부
    shouldShowBanner: true, // 알림 배너 표시 여부
    shouldShowList: true, // 알림 목록 표시 여부
  }),
});

export default function HomeScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    // registerForPushNotificationsAsync();
    // alert('hi');

  
  }, []);

  

  // const registerForPushNotificationsAsync = async () => {
  //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   alert(existingStatus);

  //   if (existingStatus !== 'granted') {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     // alert(status);
  //     finalStatus = status;
  //   }

  //   if (finalStatus !== 'granted') {
  //     alert('Failed to get push token for push notification!');
  //     return;
  //   }

  //   // const pushTokenData = await Notifications.getExpoPushTokenAsync();
  //   // setExpoPushToken(pushTokenData.data);
  //   const DUMMY_TOKEN = "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]";
  //   setExpoPushToken(DUMMY_TOKEN);

  //   alert(DUMMY_TOKEN);
  // }

  // const sendPushNotification = async (token: string) => {
  //   await fetch('https://exp.host/--/api/v2/push/send', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       to: token,
  //       title: 'Hello',
  //       body: 'Hello from your app!',
  //     }),
  //   });
  // };
// 알림 보내기 (버튼으로 호출)
const sendPushNotification = async () => {
  if (!expoPushToken) return;

  alert(expoPushToken);
    // 모바일에서만 expo-notifications 사용
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "테스트 알림",
        body: "이건 앱에서 직접 발송한 로컬 알림입니다.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
        // repeats: false,
      },
    });

    // expo 토큰 발급
    const pushToken = await Notifications.getExpoPushTokenAsync();
    setExpoPushToken(pushToken.data);


};


  return (
    <SafeAreaView style={styles.container}>
      <Text>PUSH 알림 연습중</Text>
      <Text>토큰: {expoPushToken}</Text>
      <Button title="알림 보내기" onPress={sendPushNotification} />
      {/* <Button title="FCM 토큰 발급 + 알림 보내기" onPress={handlePushNotification} /> */}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    paddingTop: Platform.select({ ios: 8, default: 0 }),
    backgroundColor: '#fff',
  },
 
});