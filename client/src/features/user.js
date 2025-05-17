import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { ADD_AGENT_API, LOGIN_API, UPLOAD_DATA_API } from "../utils/api"


export const loginUser = createAsyncThunk("loginUser.posts", async (data, { rejectWithValue }) => {
    try {
      
        const resp = await axios.post(LOGIN_API, data);
        if (resp?.data.success) {
            sessionStorage.setItem("token", resp.data.token)
            sessionStorage.setItem("user", JSON.stringify(resp.data.user))
        }
        return resp?.data
    } catch (error) {
        console.log(error);
        return rejectWithValue(error?.response?.data?.message)

    }
})

export const addNewAgent = createAsyncThunk("addNewAgent.posts", async (data, { rejectWithValue }) => {
    try {
        const token = sessionStorage.getItem("token");
        const resp = await axios.post(ADD_AGENT_API, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return resp?.data
    } catch (error) {
        console.log(error);
        return rejectWithValue(error?.response?.data?.message)
    }
})

export const uploadList = createAsyncThunk("uploadList.posts", async (data, { rejectWithValue }) => {
    try {
        const token = sessionStorage.getItem("token");
        console.log(data);
        
        const resp = await axios.post(UPLOAD_DATA_API, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return resp?.data
    } catch (error) {
        console.log(error);
        return rejectWithValue(error?.response?.data?.message)
    }
})

const initialState = {
    user: sessionStorage.getItem("user") !== "undefined" ? JSON.parse(sessionStorage.getItem("user")) : null,
    token: sessionStorage.getItem("token") !== "undefined" ? sessionStorage.getItem("token") : null,
    status: "idle",
    error: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSliceUser: (state, { payload }) => {
            state.user = payload ? payload : JSON.parse(sessionStorage.getItem("user"))
        },
        setSliceStatus: (state, { payload }) => {
            state.status = payload
        },
        setSliceError: (state, { payload }) => {
            state.error = payload
        },
        clearSlice: (state) => {
            state.user = null
            state.token = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(addNewAgent.pending, (state) => {
                state.status = "loading"
            })
            .addCase(addNewAgent.fulfilled, (state) => {
                state.status = "success"
            })
            .addCase(addNewAgent.rejected, (state, { payload }) => {
                state.status = "error"
                state.error = payload
            })
            .addCase(loginUser.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.status = "success"
                state.token = payload.token
                state.user = payload.user
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.status = "error"
                state.error = payload
            })
            .addCase(uploadList.pending, (state) => {
                state.status = "loading"
            })
            .addCase(uploadList.fulfilled, (state, { payload }) => {
                state.status = "success"
            })
            .addCase(uploadList.rejected, (state, { payload }) => {
                state.status = "error"
                state.error = payload
            })
    }
})

export const { setSliceError, setSliceStatus, setSliceUser, clearSlice } = userSlice.actions
export default userSlice.reducer