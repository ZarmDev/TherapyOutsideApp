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
import DailyLog from './routes/dailylog';
import Events from './routes/events';
import FindPlaces from './routes/findplaces';
import FirstStartup from './screens/firststartup';
import { doesFileExist, readInDocumentDirectory } from './utils/utils';

const defaultTab = 1;

export default function App() {
  const [firstStartup, setFirstStartup] = useState(false);
  const [index, setIndex] = useState(defaultTab);
  const [passedValue, setPassedValue] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [routes] = useState([
    { key: 'findplaces', title: 'Find places', focusedIcon: 'map-check', unfocusedIcon: 'map' },
    { key: 'events', title: 'Events', focusedIcon: 'clock-time-eleven', unfocusedIcon: 'clock-time-eleven-outline' },
    { key: 'dailylog', title: 'Your daily log', focusedIcon: 'google-spreadsheet', unfocusedIcon: 'google-spreadsheet' },
    // { key: 'chat', title: 'Chat with your friends', focusedIcon: 'chat', unfocusedIcon: 'chat-outline' },
  ]);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  const [loaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Function to switch tabs
  const navigateToFindPlaces = (value: any, index: number) => {
    setPassedValue(value);
    setIndex(index);
  };

  const renderScene = BottomNavigation.SceneMap({
    findplaces: () => <FindPlaces passedLocation={passedValue} username={username} password={password} />,
    events: () => <Events navigateToFindPlaces={navigateToFindPlaces} username={username} password={password} />,
    dailylog: DailyLog,
    // chat: Chat,
  });

  async function checkFirstStartup() {
    const exists = await doesFileExist(FileSystem.documentDirectory + "firststartup.txt")
    if (!exists) {
      setFirstStartup(true)
    } else {
      getUserInfo();
    }
  }

  async function getUserInfo() {
    const data = await readInDocumentDirectory("userdata");
    if (data) {
      const split = data.split('\n')
      const username = split[0];
      const password = split[1];
      setUsername(username);
      setPassword(password);
    }
  }

  useEffect(() => {
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
            <FirstStartup finishedCallback={() => {
              setFirstStartup(false)
              getUserInfo();
            }} />
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