import { styles } from '@/constants/styles';
import * as FileSystem from 'expo-file-system';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import 'react-native-gesture-handler';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CombinedDarkTheme, CombinedDefaultTheme } from './constants/colors';
import Chat from './routes/chat';
import DailyLog from './routes/dailylog';
import Events from './routes/events';
import FindPlaces from './routes/findplaces';
import FirstStartup from './screens/firststartup';
import { doesFileExist } from './utils/utils';

const defaultTab = 1;

function BottomNav() {
  // You can set the default tab here
  const [index, setIndex] = useState(defaultTab);
  const [passedValue, setPassedValue] = useState<any>(null);
  const [routes] = useState([
    { key: 'findplaces', title: 'Find places', focusedIcon: 'book-play', unfocusedIcon: 'book-play-outline' },
    { key: 'events', title: 'Events', focusedIcon: 'cards-heart', unfocusedIcon: 'cards-heart-outline' },
    { key: 'dailylog', title: 'Your daily log', focusedIcon: 'cards-heart', unfocusedIcon: 'cards-heart-outline' },
    { key: 'chat', title: 'Chat with your friends', focusedIcon: 'chat', unfocusedIcon: 'chat-outline' },
  ]);

  // Function to switch to Find places tab with a value (USAGE OF AI)
  const navigateToFindPlaces = (value: any, index : number) => {
    setPassedValue(value);
    setIndex(index);
  };

  const renderScene = BottomNavigation.SceneMap({
    findplaces: () => <FindPlaces passedLocation={passedValue} />,
    events: () => <Events navigateToFindPlaces={navigateToFindPlaces} />,
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
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  const [loaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
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
    <PaperProvider theme={theme} >
        <SafeAreaProvider>
          <View style={{ flex: 1 }}>
            <View style={{ display: firstStartup ? 'flex' : 'none', flex: 1 }}>
              <FirstStartup finishedCallback={() => setFirstStartup(false)} />
            </View>
            <View style={{ display: firstStartup ? 'none' : 'flex', flex: 1 }}>
              <BottomNav />
            </View>
          </View>
        </SafeAreaProvider>
        <StatusBar style="auto" />
    </PaperProvider>
  );
}
