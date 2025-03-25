import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AppDispatch, RootState } from "@/redux/store";
import { deleteTask, getTaskList } from "@/redux/taskSlice";
import { router, useFocusEffect } from "expo-router";
import { RefreshControl, StyleSheet, Text } from "react-native";
import { ActivityIndicator, Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "@/context/SnackbarProvider";

export default function Home () {
  const dispatch = useDispatch<AppDispatch>();
  const { showSnackbar } = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  const { tasks = [] } = useSelector((state: RootState) => state.task);
    
    const goToDetails = (item: any) => {
      router.push({
        pathname: ('/(tasks)/taskform'),
        params: { _id: item._id }
      })
    }

    const fetchTasks = () => {
      dispatch(getTaskList());
    }

    const deleteItem = (item: any) => {
      setDeleting(prev => ({
        ...prev,
        [item._id]: true
      }))
      dispatch(deleteTask({ _id: item._id })).unwrap()
      .then(fetchTasks)
      .catch((error) => {
        showSnackbar(error);
      })
    }

    useFocusEffect(
      useCallback(() => {
        fetchTasks();
      }, [dispatch])
    );

    useEffect(() => {
      fetchTasks();
    }, [])

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            showHeader
            headerProps={{ showPlus: true }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />
            }
        >
          <ThemedView style={styles.titleContainer}>
              {(tasks ?? []).map((item, index) => (
              <Card key={index} onPress={() => goToDetails(item)} style={{ width: "100%", cursor: 'pointer' }}>
                  <Card.Title title={item.title} subtitle={item.description} />
                  <Card.Actions>
                    {deleting[item._id as string] ? (
                      <ActivityIndicator size={20} />
                    ) : (
                      <MaterialIcons onPress={() => deleteItem(item)} size={30} name="delete" />
                    )}
                  </Card.Actions>
              </Card>
              ))}
          </ThemedView>
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'center',
        gap: 20,
        flex: 1,
    }
})