import { Redirect } from "expo-router";
import { View } from "react-native";
import useAuthStore from "@/store/authStore";

const Index = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <View>
      {isAuthenticated ? (
        <Redirect href="/(tabs)/home" />
      ) : (
        <Redirect href="/login" />
      )}
    </View>
  );
};

export default Index;