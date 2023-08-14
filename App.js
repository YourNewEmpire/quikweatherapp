import MapView, { Marker } from "react-native-maps";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { REACT_APP_OPEN_WEATHER_KEY } from "@env";

const Stack = createNativeStackNavigator();
const londonCoords = {
  latitude: 51.50853,
  longitude: -0.12574,
  latitudeDelta: 1,
  longitudeDelta: 1,
};
const iconArr = {
  "01d": require("./img/icons/01d.png"),
  "01n": require("./img/icons/01n.png"),
  "02d": require("./img/icons/02d.png"),
  "02n": require("./img/icons/02n.png"),
  "03d": require("./img/icons/03d.png"),
  "03n": require("./img/icons/03n.png"),
  "04d": require("./img/icons/04d.png"),
  "04n": require("./img/icons/04n.png"),
  "09d": require("./img/icons/09d.png"),
  "09n": require("./img/icons/09n.png"),
  "10d": require("./img/icons/10d.png"),
  "10n": require("./img/icons/10n.png"),
  "11d": require("./img/icons/11d.png"),
  "11n": require("./img/icons/11n.png"),
  "13d": require("./img/icons/13d.png"),
  "13n": require("./img/icons/13n.png"),
  "50d": require("./img/icons/50d.png"),
  "50n": require("./img/icons/50n.png"),
  unknown: require("./img/icons/unknown.png"),
};
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "QuikWeather",
            headerStyle: {
              backgroundColor: "#115500",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen name="Saved" component={SavedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  // const insets = useSafeAreaInsets();

  const mapRef = useRef();
  const [location, setLocation] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [weatherIcon, setIcon] = useState();
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    let newObj = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    console.log("location changed:");
    console.log(newObj);
    setLocation(newObj);
    // mapRef.current?.animateToRegion(newObj, 100);
  };

  const handleMapPress = (event) => {
    console.log("location changed:");
    console.log(event.coordinate);
    setLocation(event.coordinate);
  };

  useEffect(() => {
    async function weatherData() {
      try {
        const data = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${REACT_APP_OPEN_WEATHER_KEY}&units=metric`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const json = await data.json();
        // could use array for state, but want more easy access to each variable in the UI
        let newObj = {
          city: json.name,
          country: json.sys.country,
          temp: json.main.temp,
          tempMin: json.main.temp_min,
          tempMax: json.main.temp_max,
          feelsLike: json.main.feels_like,
          humidity: json.main.humidity,
          rain: json.rain ? json.rain["1h"] : "none",
          title: json.weather[0].main,
          desc: json.weather[0].description,
          icon: json.weather[0].icon,
        };
        setWeather(newObj);
        setIsLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }
    mapRef.current.animateCamera(
      {
        center: location,
      },
      3000
    );
    if (location) weatherData();
    //42b4f4c33a3acac786fd199e521a4624
  }, [location]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.mapcontainer}>
          <MapView
            ref={mapRef}
            // onRegionChangeComplete={(region) => setRegion(region)}
            // region={{ ...location, latitudeDelta: 1, longitudeDelta: 1 }}
            style={styles.map}
            initialRegion={londonCoords}
            onPress={(e) => handleMapPress(e.nativeEvent)}
            pointerEvents="none"
          >
            <Marker
              coordinate={location ? location : londonCoords}
              title={"Your Marker"}
            />
          </MapView>
          <Pressable
            style={{
              ...styles.locBtn,
              backgroundColor: styles.regalGreen,
            }}
            onPress={() => getLocation()}
          >
            <Text style={{ ...styles.text, fontWeight: 700 }}>
              Use My Location
            </Text>
          </Pressable>
        </View>

        {weather ? (
          <View style={styles.weather}>
            <View style={styles.weatherTitle}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.text}>
                  {`${weather.title} - ${weather.city}, ${weather.country}`}
                </Text>
                <Text style={{ ...styles.text, fontSize: 18, color: "#666" }}>
                  {weather.desc}
                </Text>
              </View>
              <View
                style={{
                  padding: 2,
                  backgroundColor: "#fff",
                  borderRadius: 25,
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  source={iconArr[weather.icon]}
                />
              </View>
              <Text style={styles.text}>
                {weather.rain === "none" ? "" : `${weather.rain} mm`}
              </Text>
            </View>

            <Text style={styles.text}>
              {`Temps: ${weather.temp.toFixed(
                0
              )}°C (min ${weather.tempMin.toFixed(
                0
              )}°C max ${weather.tempMax.toFixed(0)}°C)`}
            </Text>
            <Text style={styles.text}>
              {`Feels Like: ${weather.feelsLike.toFixed(0)}°C`}
            </Text>
            <Text style={styles.text}>{`Humidity: ${weather.humidity}%`}</Text>
          </View>
        ) : (
          <View style={styles.weather}>
            <Text style={styles.text}>
              Pick a location, or permit app to use location{" "}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.nav}>
        <Button
          color={styles.regalGreen}
          title="Saved Locations"
          onPress={() => navigation.navigate("Saved", { name: "Person" })}
        />
      </View>
    </View>
  );
};
const SavedScreen = ({ navigation, route }) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

const styles = StyleSheet.create({
  regalGreen: "#115500",

  text: { color: "#fff", fontSize: 22 },

  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    backgroundColor: "#000",
  },

  nav: {
    width: "100%",
    display: "flex",
    padding: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  main: {
    flex: 1,
  },

  weather: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 4,
    height: 200,
    padding: 8,
  },
  weatherTitle: {
    display: "flex",
    flexDirection: "row",
    columnGap: 12,
    alignItems: "center",
  },
  mapcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: Dimensions.get("screen").width,
    height: "100%",
  },

  locBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 5,
    padding: 8,
  },
});
