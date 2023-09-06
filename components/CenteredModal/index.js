import { View, Modal, Text, StyleSheet, Pressable } from "react-native";
import globalStyle from "../../style";

const CenteredModal = ({ visible, onClose, action, actionText, title }) => {
  return (
    <Modal
      transparent
      backgroundColor="#000"
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <Text style={{ ...globalStyle.text, color: "#000" }}>{title}</Text>
          <Pressable style={globalStyle.styledButton} onPress={action}>
            <Text style={globalStyle.text}>{actionText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    display: "flex",
    rowGap: 12,
    color: "#000",
    minWidth: 300, // Set your desired minimum width
    minHeight: 200, // Set your desired minimum height
    backgroundColor: "#ccc",
    padding: 20,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: "black", // For shadow on iOS
    shadowOpacity: 0.5, // For shadow on iOS
    shadowOffset: { width: 0, height: 2 }, // For shadow on iOS
  },
});

export default CenteredModal;
