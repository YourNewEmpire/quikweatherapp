import { useState, useRef, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { add, setCurrent } from "../../redux/reducers/locations";
import styles from "../../style";
import { londonCoords, iconArr } from "../../lib/home";
import { getCurrentWeather } from "../../lib/api";
import Toast from "react-native-root-toast";

const Home = ({ navigation }) => {
  const currentLocation = useSelector((state) => state.location.current);
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [weather, setWeather] = useState(false);
  // BUTTON HANDLERS
  const getLocation = async () => {
    Toast.show("Fetching your location...", {
      position: Toast.positions.CENTER,
    });
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let newObj = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      dispatch(setCurrent(newObj));
    } catch (error) {
      Toast.show("Error getting location!", {
        position: Toast.positions.CENTER,
      });
    }
  };

  const saveLocation = () => {
    if (!currentLocation || !weather.city) {
      Toast.show("Cannot save this location, no name or coordinates", {
        position: Toast.positions.CENTER,
      });

      return;
    }
    dispatch(add({ name: weather.city, data: currentLocation }));
  };

  const handleMapPress = (event) => {
    dispatch(setCurrent(event.coordinate));
  };

  //? When currentLocation redux state changes, fetch weather data.
  useEffect(() => {
    async function weatherData() {
      try {
        const data = await getCurrentWeather(currentLocation);
        if (data.error) {
          //todo - call toast
          Toast.show("there was an error getting weather data", {
            position: Toast.positions.CENTER,
          });

          setWeather(false);
        }
        setWeather(data);
        mapRef.current.animateCamera(
          {
            center: currentLocation ? currentLocation : londonCoords,
          },
          3000
        );
      } catch (error) {
        //todo - call toast
        Toast.show("there was an error getting weather data", {
          position: Toast.positions.CENTER,
        });

        console.error(error);
        setWeather(false);
      }
    }
    if (Object.keys(currentLocation).length > 0) weatherData();
  }, [currentLocation]);
  //todo - clean to components in home folder.
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.mapcontainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={londonCoords}
            onPress={(e) => handleMapPress(e.nativeEvent)}
            pointerEvents="none"
          >
            <Marker
              coordinate={currentLocation ?? londonCoords}
              title={"Your Marker"}
            />
          </MapView>
          <View style={styles.overlay}>
            <Pressable
              style={{ ...styles.styledButton, justifyContent: "flex-start" }}
              onPress={getLocation}
            >
              <MaterialIcons name="my-location" size={18} color="white" />
              <Text style={{ ...styles.text, fontWeight: 700 }}>
                Use My Location
              </Text>
            </Pressable>
            <Pressable
              style={{ ...styles.styledButton, justifyContent: "flex-start" }}
              onPress={saveLocation}
            >
              <MaterialIcons name="save" size={18} color="white" />
              <Text style={{ ...styles.text, fontWeight: 700 }}>
                Save Current location
              </Text>
            </Pressable>
          </View>
        </View>
        {weather.temp ? (
          <View style={styles.weather}>
            <Text style={styles.text}>
              {`${weather.city}, ${weather.country} `}
            </Text>
            <View style={styles.weatherTitle}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.text}>{`${weather.title}`}</Text>
                <Text style={{ ...styles.text, fontSize: 12, color: "#666" }}>
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
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "#aab",
                marginVertical: 4,
              }}
            />
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
        <Pressable
          style={styles.styledButton}
          onPress={() => navigation.navigate("Saved")}
        >
          <Text style={{ ...styles.text, fontWeight: 700 }}>
            {" "}
            Saved Locations
          </Text>
          <MaterialIcons name="arrow-forward" size={18} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default Home;
