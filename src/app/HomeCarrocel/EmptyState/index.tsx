import Icon from "@react-native-vector-icons/fontawesome";
import { Pressable, Text, View } from "react-native";

interface EmptyStateProps {
  onAdminPress: () => void;
}

export function EmptyState({ onAdminPress }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Icon name="image" size={64} color="#ccc" />
      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          color: "#666",
          textAlign: "center",
        }}
      >
        Nenhuma mídia disponível
      </Text>
      <Text
        style={{
          marginTop: 10,
          fontSize: 14,
          color: "#999",
          textAlign: "center",
        }}
      >
        Adicione fotos ou vídeos na tela de administração
      </Text>
      <Pressable
        onPress={onAdminPress}
        style={{
          marginTop: 20,
          backgroundColor: "purple",
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Ir para Admin
        </Text>
      </Pressable>
    </View>
  );
}
