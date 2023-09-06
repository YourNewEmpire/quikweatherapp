import { Text, Pressable, ScrollView, View } from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearAll } from "../../redux/reducers/locations";
import styles from "../../style";
import CenteredModal from "../../components/CenteredModal";
import Location from "../../components/Location";
export default SavedScreen = ({ navigation }) => {
  const locations = useSelector((state) => state.location.locations);
  const dispatch = useDispatch();
  const [clearAllModal, setClearAllModal] = useState(false);

  const handleOpenModal = () => {
    setClearAllModal(true);
  };

  const handleCloseModal = () => {
    setClearAllModal(false);
  };
  const handleClear = () => {
    dispatch(clearAll());
    setClearAllModal(false);
  };
  return (
    <ScrollView style={{ backgroundColor: "#000", padding: 8 }}>
      <CenteredModal
        visible={clearAllModal}
        onClose={handleCloseModal}
        action={handleClear}
        title="Are you sure you want to clear all locations?"
        actionText="Confirm & Clear All"
      />

      <Text>This is your saved locations</Text>
      <View style={styles.locList}>
        {locations.map((loc) => (
          <Location key={loc.name} location={loc} nav={navigation} />
        ))}
      </View>
      <Pressable
        style={{ ...styles.styledButton, marginTop: 32 }}
        onPress={handleOpenModal}
      >
        <Text style={styles.text}>Clear all</Text>
      </Pressable>
    </ScrollView>
  );
};
