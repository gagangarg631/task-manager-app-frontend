import api from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface User {
    id: String;
    name: String;
    email: String;
    token: String;
}

interface LoginPayload {
    email: String;
    password: String;
}

interface SignupPayload {
    name: String;
    email: String;
    password: String;
}

interface SignUpResponse {
    id: String;
}

export const login = createAsyncThunk<User, LoginPayload>(
    'user/login', 
    async ({ email, password } , { rejectWithValue }) => {
    try {
        const result = await api.post(`users/login`, { email, password });
        return result.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
    }
} )

export const signUp = createAsyncThunk<SignUpResponse, SignupPayload>(
    'user/signup',
    async ({ name, email, password }, { rejectWithValue }) => {
    try {
        const res = await api.post(`users/signup`, { name, email, password });
        return res.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message)
    }
})

interface AuthState {
    user: User | null;
    token: String | null;
    loading: boolean;
    error: String | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

  
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            AsyncStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.loading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.token = action.payload.token;
            AsyncStorage.setItem('token', action.payload.token as string);
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(signUp.pending, (state) => {
            state.loading = true;
        })
        .addCase(signUp.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(signUp.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const { logout } = userSlice.actions;
export default userSlice.reducer;