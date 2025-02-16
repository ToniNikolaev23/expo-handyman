import { Image, StyleSheet, Text, View } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Location } from "@/types/interfaces";
import logo from "@/assets/images/logo.png";

const LOGO_IMAGE = Image.resolveAssetSource(logo).uri;

// const db = SQLite.openDatabaseSync("reports.db");

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const isDrawerOpen = useDrawerStatus() === "open";
  const pathName = usePathname();

  useEffect(() => {
    if (isDrawerOpen) {
      loadLocations();
    }
  }, [isDrawerOpen]);

  const loadLocations = async () => {
    const locations = await db.getAllAsync<Location>(`SELECT * FROM locations`);
    setLocations(locations);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <Image source={{ uri: LOGO_IMAGE }} style={styles.logo} />
        <View style={styles.locationsContainer}>
          <DrawerItemList {...props} />
          <Text style={styles.title}>Locations</Text>
          {locations.map((location) => {
            const isActive = pathName === `/location/${location.id}`;
            return (
              <DrawerItem
                key={location.id}
                label={location.name}
                onPress={() => router.push(`/location/${location.id}`)}
                focused={isActive}
                activeTintColor="#F2A310"
                inactiveTintColor="#000"
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          paddingBottom: 20 + bottom,
          borderTopWidth: 1,
          borderTopColor: "#dde3fe",
          padding: 16,
        }}
      >
        <Text>Copyright Galaxies 2024</Text>
      </View>
    </View>
  );
};

const Layout = () => {
  //   useDrizzleStudio(db);
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "#F2A310",
          headerTintColor: "#000",
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Manage Locations" }} />
        <Drawer.Screen
          name="location"
          options={{
            title: "Location",
            drawerItemStyle: {
              display: "none",
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default Layout;

const styles = StyleSheet.create({
  logo: { width: 100, height: 100, alignSelf: "center" },
  locationsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    padding: 16,
    paddingTop: 24,
    color: "#a6a6a6",
  },
});
