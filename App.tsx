import { styles } from '@/constants/styles';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Chat from './routes/chat';
import DailyLog from './routes/dailylog';
import Events from './routes/events';
import FindPlaces from './routes/findplaces';
import FirstStartup from './screens/firststartup';
import { doesFileExist } from './utils/utils';

const defaultTab = 0;

function BottomNav() {
  // You can set the default tab here
  const [index, setIndex] = useState(defaultTab);
  const [routes] = useState([
    { key: 'findplaces', title: 'Find places', focusedIcon: 'book-play', unfocusedIcon: 'book-play-outline' },
    { key: 'events', title: 'Events', focusedIcon: 'cards-heart', unfocusedIcon: 'cards-heart-outline' },
    { key: 'dailylog', title: 'Your daily log', focusedIcon: 'cards-heart', unfocusedIcon: 'cards-heart-outline' },
    { key: 'chat', title: 'Chat with your friends', focusedIcon: 'chat', unfocusedIcon: 'chat-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    findplaces: FindPlaces,
    events: Events,
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
