import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Link,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Task } from "@/types/interfaces";
import TaskListItem from "@/components/TaskListItem";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [locationName, setLocationName] = useState<string>("");

  const loadLocationData = async () => {
    const [location] = await db.getAllAsync<{ name: string }>(
      `SELECT * FROM locations WHERE id = ?`,
      [Number(id)]
    );
    if (location) {
      setLocationName(location.name);
    }

    const tasks = await db.getAllAsync<Task>(
      `SELECT * FROM tasks WHERE locationId = ?`,
      [Number(id)]
    );
    setTasks(tasks);
  };

  useFocusEffect(
    useCallback(() => {
      loadLocationData();
    }, [db, id])
  );
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: locationName || "Tasks" }} />
      <FlatList
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Tasks Found!</Text>
        }
        data={tasks}
        renderItem={({ item }) => <TaskListItem task={item} />}
      />
      <Link href={`/location/${id}/new-task`} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    right: 20,
    backgroundColor: "#F2A310",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#888",
  },
});
