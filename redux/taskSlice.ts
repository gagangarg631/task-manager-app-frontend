import api from "@/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addTask = createAsyncThunk(
    'task/addTask',
    async ({ title, description }: any, { rejectWithValue }) => {
        try {
            const res = await api.post(`/tasks/add`, { title, description });
            return res.data;
        } catch (error: any) {
            rejectWithValue(error.response?.data?.message);
        }
    }
)

export const updateTask = createAsyncThunk(
    'task/updateTask',
     async ({ _id, title, description }: any, { rejectWithValue }) => {
        try {
            const res = await api.put(`/tasks/${_id}`, { title, description });
            return res.data;
        } catch (error: any) {
            rejectWithValue(error.response?.data?.message);
        }
     }
)

export const deleteTask = createAsyncThunk(
    'task/deleteTask',
    async ({ _id  }: any, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/tasks/delete?_id=${_id}`);
            return res.data;
        } catch (error: any) {
            rejectWithValue(error.response?.data?.message);
        }
    }
)

export const getTaskList = createAsyncThunk(
    'task/getTaskList',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`/tasks/list`);

            return res.data;
        } catch (error: any) {
            rejectWithValue(error.response?.data?.message);
        }
    }
)

export const getTaskById = createAsyncThunk(
    'task/getTaskById',
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/tasks/${id}`);
            return res.data;
        } catch (error: any) {
            rejectWithValue(error.response?.data?.message);
        }
    }
)


export interface Task {
    _id: String;
    title: String;
    description: String;
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    updating: boolean;
    deleting: boolean;
    task: Task | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    updating: false,
    deleting: false,
    task: null
}

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        clearTask(state) {
            state.task = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addTask.pending, (state) => {
            state.updating = true;
        })
        .addCase(addTask.fulfilled, (state, action) => {
            state.updating = false;
        })
        .addCase(updateTask.pending, (state) => {
            state.updating = true;
        })
        .addCase(updateTask.fulfilled, (state) => {
            state.updating = false;
        })
        .addCase(getTaskList.pending, (state) => {
            state.loading = true;
        })
        .addCase(getTaskList.fulfilled, (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
        })
        .addCase(getTaskById.pending, (state) => {
            state.loading = true;
        })
        .addCase(getTaskById.fulfilled, (state, action) => {
            state.loading = false;
            state.task = action.payload
        })
        .addCase(deleteTask.pending, (state) => {
            state.deleting = true;
        })
        .addCase(deleteTask.fulfilled, (state) => {
            state.deleting = false;
        })
    }
})

export const { clearTask } = taskSlice.actions;
export default taskSlice.reducer;