import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
const Page = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>ID {id}</Text>
    </View>
  );
};

export default Page;
