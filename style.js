import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  regalGreen: "#115500",

  text: { color: "#fff", fontSize: 18 },
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
    height: "35%",
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

  overlay: {
    position: "absolute",
    bottom: 1,
    right: 1,
    borderRadius: 5,
    padding: 8,
    display: "flex",
    flexDirection: "column",
    rowGap: 4,
  },

  styledButton: {
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#115500",
  },

  locList: {
    display: "flex",
    flexDirection: "column",
    rowGap: 8,
  },
  locItem: {
    display: "flex",
    flexDirection: "row",
    columnGap: 4,
    // width: "100%",
  },
});
