import ButtonV2 from "@/components/ButtonV2";
import { ThemedView } from "@/components/ThemedView";
import { AppDispatch, RootState } from "@/redux/store";
import { addTask, clearTask, deleteTask, getTaskById, updateTask } from "@/redux/taskSlice";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from "@/context/SnackbarProvider";
import { router, useLocalSearchParams } from "expo-router";
import CustomHeader from "@/components/CustomHeader";
import { useEffect } from "react";

const schema = z.object({
    title: z.string().nonempty({ message: 'Title is required' }),
    description: z.string().nonempty({ message: 'Description is required' }),
});

type FormData = z.infer<typeof schema>;

const defaultValues = {
    title: '',
    description: ''
}

export default function TaskForm() {
    const { _id } = useLocalSearchParams();
    const { task, loading, updating, deleting } = useSelector((state: RootState) => state.task);
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: (task?.title ?? '') as string,
            description: (task?.description ?? '') as string
        }
    });

    const dispatch = useDispatch<AppDispatch>();
    const { showSnackbar } = useSnackbar();

    const onSubmit = (data: FormData) => {
        let action = addTask;
        if (_id) {
            action = updateTask
        }
        dispatch(action({ ...data, _id })).unwrap()
            .then(() => {
                router.back();
            })
            .catch((error) => {
                showSnackbar(error);
            })
    }

    const deleteItem = () => {
        dispatch(deleteTask({ _id })).unwrap()
            .then(() => {
                router.back();
            })
            .catch((error) => {
                showSnackbar(error);
            })
    }

    useEffect(() => {
        if (_id) {
            dispatch(clearTask());
            dispatch(getTaskById(_id as string));
        }
    }, [_id]);

    useEffect(() => {
        if (task) {
            reset(task as FormData);
        }
    }, [task])

    useEffect(() => {
        dispatch(clearTask());
        reset(defaultValues);
    }, []);

    return (
        <ThemedView style={{ flex: 1 }}>
            <CustomHeader showBack />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollView}
                        keyboardShouldPersistTaps="handled"
                    >
                        {!loading && <View style={styles.form}>
                            <View>
                                <Controller
                                    control={control}
                                    name="title"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput 
                                            placeholder="Enter title"
                                            value={value} 
                                            onChangeText={onChange} 
                                        />
                                    )}
                                />
                                {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}
                            </View>

                            <View>
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Enter task here..."
                                            multiline
                                            style={styles.details}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                                {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}
                            </View>

                            <ButtonV2 
                                loading={updating} 
                                onPress={handleSubmit(onSubmit)}
                            >
                                { _id ? 'Update' : 'Submit' }
                            </ButtonV2>

                            {_id && (
                                <ButtonV2 loading={deleting} style={styles.deleteButton} onPress={deleteItem}>
                                    Delete Task
                                </ButtonV2>
                            )}
                        </View>}

                        {loading && <ActivityIndicator size={50} />}
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    details: {
        minHeight: 200,
        maxHeight: Dimensions.get('screen').height - 400
    },
    error: {
        color: 'red',
        marginTop: 6
    },
    deleteButton: {
        backgroundColor: 'red',
        marginTop: 20,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        gap: 20
    }
});
