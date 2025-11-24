import { colors } from "@/shared/style/colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  carouselContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },

  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: RFValue(16),
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    width: 320,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    rowGap: 4,
  },

  modalTitle: {
    fontSize: RFValue(20),
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#A855F7",
    borderRadius: 8,
    padding: 12,
    fontSize: RFValue(16),
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelButton: {
    backgroundColor: "#9CA3AF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },

  confirmButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontSize: RFValue(16),
  },
});
