import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import Home from "./pages/home";
import SavedScreen from "./pages/saved";
import styles from "./style";
const Stack = createNativeStackNavigator();
const screenOptions = {
  title: "QuikWether",
  headerStyle: {
    backgroundColor: styles.regalGreen,
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={screenOptions}
            />
            <Stack.Screen
              name="Saved"
              component={SavedScreen}
              options={screenOptions}
            />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
