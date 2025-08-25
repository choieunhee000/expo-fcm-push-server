import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging'; // Firebase SDK FCM 모듈 불러오기기
import React, {useEffect} from 'react';

export default function App() {

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission(); // 앱에서 푸시 알림 권한을 요청하고, 사용자의 선택 상태를 반환

    // AUTHORIZED: 사용자가 알림을 허용한 경우
    // PROVISIONAL: 사용자가 알림을 허용한 경우
    // DENIED: 사용자가 알림을 거절한 경우
    const enabled = 
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) { // 권한이 허용되었을 때
      console.log('Authorization status:', authStatus);
    }

    return enabled;
  }


  useEffect(() => {

    console.log('앱실행중');

    /**
     * 앱 인스턴스 등록 (토큰 생성)
     * 
     * 1.messaging().getToken() 호출
     * 2. Firebase 서버에 앱 인스턴스 정보를 등록 (디바이스 식별 정보, 앱 버전, 플랫폼)
     * 3. Firebase 서버가 앱 인스턴스를 기반으로 UUID(고유 식별자)를 생성 = FCM 토큰
     * 4. 앱에 토큰 전달 (토큰은 앱 설치 시마다 또는 필요할 때 재발급 가능)
     * 5. 클라이언트 전달
     * 6. 서버에서 알림 전송 시 사용용
     */

    if (requestUserPermission()) {
      messaging() // 내부적으로 Firebase에 연결 -> FCM 서비스 초기화화
      .getToken() // Firebase Cloud Messaging에서 토큰 생성 -> 특정 앱 인스턴스를 식별할 숭 있는 고유 ID를 만들어 앱에 전달달
      .then((token) => {
        console.log('Token:', token);

        fetch('http://localhost:3000/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, title: '푸시 알림', body: 'push-test' }),
        });
      });
    }else{
      console.log('Permission not granted', authStatus);
    }

    // 앱이 꺼진 상태에서 알림을 눌러서 실행된 경우, 그 알림 정보를 가져옴옴
    messaging()
    .getInitialNotification() // 앱이 종료된 상태에서 알림을 눌러 실행된 경우, 그 알림 데이터를 가져오는 함수수
    .then(async (remoteMessage) => {
      if (remoteMessage) {
       console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });

   // ========================
   // 1) 앱이 "완전히 종료된 상태(quit state)"에서 알림을 눌러 실행된 경우
   // - 보통 앱을 아예 꺼놓은 상태에서 알림을 눌렀을 때 실행됨
   // - 사용 예시: 알림 데이터에 따라 특정 화면으로 이동
   //   ex) remoteMessage.data.type === 'chat' → 채팅 화면으로 이동
   // ========================
    messaging()
    .onNotificationOpenedApp((remoteMessage) => {// 앱이 백그라운드 상태일 때, 사용자가 푸시 알림을 눌러 앱을 열었을 때 실행되는 함수
      console.log('Notification caused app to open from background state:', remoteMessage);
    });


    // Register background handler
    // 앱이 백그라운드 또는 종료된 상태에서 메시지를 받으면 실행되는 핸들러
    messaging()
    .setBackgroundMessageHandler(async (remoteMessage) => { // 앱이 맥그라운드나 종료 상태일 때, FCM 메시지가 도착하면 실행되는 콜백(Handler)을 등록하는 함수
      console.log('Message handled in the background!', remoteMessage);
    });

    // Register foreground handler
    // 앱이 실생중(foreground)일 때, 알림이 도착하면 실행되는 핸들러러
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {// 앱이 실행 중 일때 FCM 메시지가 도착하면 실행되는 핸들러
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    // messageing().onMeessage는 이벤트 리스너로 등록되기 때문에
    // 앱이 포그라운드일 떼 메시지가 오면 계속 remoteMessage를 받을 수 있음
    // 따라서 cleaup 함수로 리스너 해제 함
    return unsubscribe; 
  }, []);


  return (
    <View style={styles.container}>
      <Text>FCM TEST</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
