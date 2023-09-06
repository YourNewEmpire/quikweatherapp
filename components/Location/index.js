import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { remove, setCurrent } from "../../redux/reducers/locations";
import { useState } from "react";
import globalStyle from "../../style";
import CenteredModal from "../CenteredModal";
const Location = ({ location, nav }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const toggleModal = () => {
    setVisible(!visible);
  };
  const handleCloseModal = () => {
    setVisible(false);
  };
  const handleAction = () => {
    dispatch(remove(location));
  };

  return (
    <View style={globalStyle.locItem}>
      <Pressable
        style={{ ...globalStyle.styledButton, flex: 5 }}
        onPress={() => {
          nav.navigate("Home");
          dispatch(setCurrent(location.data));
        }}
      >
        <Text style={{ ...globalStyle.text, fontWeight: 700 }}>
          {location.name}
        </Text>
      </Pressable>
      <Pressable
        style={{
          ...globalStyle.styledButton,
          flex: 1,
        }}
        onPress={() => toggleModal()}
      >
        <Text style={{ ...globalStyle.text, fontWeight: 700 }}>
          <MaterialIcons name="remove-circle" size={18} color="white" />
        </Text>
      </Pressable>
      <CenteredModal
        visible={visible}
        title={`Remove ${location.name} from list.`}
        actionText="Confirm & Remove"
        action={handleAction}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default Location;
