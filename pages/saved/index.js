import { Text, Pressable, ScrollView, View } from "react-native";
import { remove, clearAll, setCurrent } from "../../redux/reducers/locations";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../style";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";

export default SavedScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  // const [locations, setLocations] = useState([]);
  const locations = useSelector((state) => state.location.locations);

  return (
    <ScrollView style={{ backgroundColor: "#000", padding: 8 }}>
      <Text>This is your saved locations</Text>
      <View style={styles.locList}>
        {locations.map((loc) => (
          <View key={loc.name} style={styles.locItem}>
            <Pressable
              style={{ ...styles.styledButton, flex: 5 }}
              onPress={() => {
                dispatch(setCurrent(loc.data));
                navigation.navigate("Home");
              }}
            >
              <Text style={{ ...styles.text, fontWeight: 700 }}>
                {loc.name}
              </Text>
            </Pressable>
            <Pressable
              style={{ ...styles.styledButton, flex: 1, alignItems: "center" }}
              onPress={() => dispatch(remove(loc))}
            >
              <Text style={styles.text}>X</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Pressable
        style={{ ...styles.styledButton, marginTop: 32 }}
        onPress={() => dispatch(clearAll())}
      >
        <Text style={styles.text}>Clear all</Text>
      </Pressable>
    </ScrollView>
  );
};
