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

export default function App() {
  const [firstStartup, setFirstStartup] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  const [index, setIndex] = useState(defaultTab);
  const [passedValue, setPassedValue] = useState<any>(null);
  const [routes] = useState([
    { key: 'findplaces', title: 'Find places', focusedIcon: 'map-check', unfocusedIcon: 'map' },
    { key: 'events', title: 'Events', focusedIcon: 'clock-time-eleven', unfocusedIcon: 'clock-time-eleven-outline' },
    { key: 'dailylog', title: 'Your daily log', focusedIcon: 'google-spreadsheet', unfocusedIcon: 'google-spreadsheet' },
    { key: 'chat', title: 'Chat with your friends', focusedIcon: 'chat', unfocusedIcon: 'chat-outline' },
  ]);

  const [loaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Function to switch tabs
  const navigateToFindPlaces = (value: any, index: number) => {
    setPassedValue(value);
    setIndex(index);
  };

  const renderScene = BottomNavigation.SceneMap({
    findplaces: () => <FindPlaces passedLocation={passedValue} />,
    events: () => <Events navigateToFindPlaces={navigateToFindPlaces} />,
    dailylog: DailyLog,
    chat: Chat,
  });

  useEffect(() => {
    async function checkFirstStartup() {
      const exists = await doesFileExist(FileSystem.documentDirectory + "firststartup.txt")
      if (!exists) {
        setFirstStartup(true)
      }
    }
    checkFirstStartup()
  }, [])

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          {firstStartup ? (
            <FirstStartup finishedCallback={() => setFirstStartup(false)} />
          ) : (
            <BottomNavigation
              navigationState={{ index, routes }}
              onIndexChange={setIndex}
              renderScene={renderScene}
              style={styles.navigation}
            />
          )}
        </View>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}