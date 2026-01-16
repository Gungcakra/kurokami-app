import { Modal, View, Text, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import Ionicons from "@expo/vector-icons/Ionicons";
const Alert = ({ showAlert, setShowAlert }) => {
  return (
    <View>
      <Modal
        visible={showAlert.show}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAlert({ ...showAlert, show: false })}
      >
        <View
          className="flex-1 justify-center items-center px-10"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <Animatable.View
            animation="zoomIn"
            duration={300}
            className="w-full bg-zinc-900 border border-white/10 rounded-[32px] p-6 items-center"
            style={{ backgroundColor: "#18181B" }}
          >
            {/* Icon Dinamis berdasarkan tipe */}
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                showAlert.type === "success"
                  ? "bg-green-500/10"
                  : "bg-red-500/10"
              }`}
            >
              <Ionicons
                name={
                  showAlert.type === "success"
                    ? "checkmark-circle"
                    : "alert-circle"
                }
                size={40}
                color={showAlert.type === "success" ? "#22C55E" : "#EF4444"}
              />
            </View>

            <Text className="text-white text-xl font-black mb-2 text-center">
              {showAlert.title}
            </Text>

            <Text className="text-zinc-400 text-center font-medium leading-5 mb-6">
              {showAlert.message}
            </Text>

            <TouchableOpacity
              onPress={() => setShowAlert({ ...showAlert, show: false })}
              activeOpacity={0.8}
              className="w-full bg-red-600 py-4 rounded-2xl items-center"
              style={{
                backgroundColor:
                  showAlert.type === "success" ? "#EF4444" : "#3F3F46",
              }}
            >
              <Text className="text-white font-black uppercase tracking-widest">
                Mengerti
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

export default Alert;
