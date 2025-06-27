import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Chat from './routes/chat';
import DailyLog from './routes/dailylog';
import FindPlaces from './routes/findplaces';
import FirstStartup from './screens/firststartup';
import {styles} from './constants/styles';

function BottomNav() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'findplaces', title: 'Find places', focusedIcon: 'book-play', unfocusedIcon: 'book-play-outline' },
    { key: 'dailylog', title: 'Your daily log', focusedIcon: 'cards-heart', unfocusedIcon: 'cards-heart-outline' },
    { key: 'chat', title: 'Chat with your friends', focusedIcon: 'chat', unfocusedIcon: 'chat-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    findplaces: FindPlaces,
    dailylog: DailyLog,
    chat: Chat,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      style={styles.navigation}
    />
  );
};

export default function App() {
  const [firstStartup, setFirstStartup] = useState(false);

  async function doesFileExist(uri : string) {
    const result = await FileSystem.getInfoAsync(uri);
    return result.exists && !result.isDirectory;
  }

  useEffect(() => {
    async function checkFirstStartup() {
      const exists = await doesFileExist(FileSystem.documentDirectory + "firststartup.txt")
      if (!exists) {
        setFirstStartup(true)
      }
    }
    checkFirstStartup()
  }, [])

  return (
    <SafeAreaProvider>
      {firstStartup ? <FirstStartup finishedCallback={() => { setFirstStartup(false) }}></FirstStartup> : 
      <View style={styles.container}>
        <BottomNav></BottomNav>
        </View>}
    </SafeAreaProvider>
  );
}
