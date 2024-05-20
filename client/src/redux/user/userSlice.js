import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentuser:null,
    error:null,
    loading:false,
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{

        signInStart:(state) => {
            state.loading = true;
        },
        signInSuccess:(state,action) => {
            state.currentuser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        updateStart:(state) => {
            state.loading = true;
        },
        updateFailure:(state,action) => {
            state.error = action.payload;
            state.loading  = false;
        },
        updateSuccess:(state,action) => {
            state.currentuser = action.payload;
            state.loading = false;
            state.error = null;        
        },
        deleteSuccess:(state)=>{
            state.currentuser = null;
            state.loading = false;
            state.error = null;
        },
        deleteStart:(state)=>{
            state.loading = true;
        },
        deleteFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        outSuccess:(state)=>{
            state.currentuser = null;
            state.loading = false;
            state.error = null;
        },
        outStart:(state)=>{
            state.loading = true;
        },
        outFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        }

        
               
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateFailure,
    updateStart,
    updateSuccess,
    deleteStart,
    deleteFailure,
    deleteSuccess,
    outSuccess,
    outStart,
    outFailure
} = userSlice.actions;

export default  userSlice.reducer;