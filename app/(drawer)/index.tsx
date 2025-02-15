import LocationForm from "@/components/LocationForm";
import { Location } from "@/types/interfaces";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Page = () => {
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const locations = await db.getAllAsync<Location>(`SELECT * FROM locations`);
    setLocations(locations);
    console.log("🚀 ~ loadLocations ~ locations:", locations);
  };

  const addLocation = async (name: string) => {
    await db.runAsync("INSERT INTO locations (name) VALUES (?)", name);
    loadLocations();
  };

  return (
    <View style={styles.container}>
      <LocationForm onSubmit={addLocation} />
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
