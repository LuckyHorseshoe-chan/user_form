import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface field {
    name: string
    value: string
}
interface extra {
    index: number
    value: string
}
export interface FormState {
    data: field[];
}

const initialState: FormState = {
    data: [
        { name: 'firstName', value: ''},
        { name: 'lastName', value: ''},
        { name: 'patronymic', value: ''},
        { name: 'email', value: ''},
        { name: 'phone', value: ''},
        { name: 'address', value: ''}
    ]
}

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setFirstName: (state, action: PayloadAction<string>) => {
            state.data[0].value = action.payload;
        },
        setLastName: (state, action: PayloadAction<string>) => {
            state.data[1].value = action.payload;
        },
        setPatronymic: (state, action: PayloadAction<string>) => {
            state.data[2].value = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.data[3].value = action.payload;
        },
        setPhone: (state, action: PayloadAction<string>) => {
            state.data[4].value = action.payload;
        },
        setAddress: (state, action: PayloadAction<string>) => {
            state.data[5].value = action.payload;
        },
        addField: (state) => {
            state.data = [...state.data, {name: "Название", value: ""}] ;
        },
        removeField: (state, action: PayloadAction<number>) => {
            if (action.payload > 5) state.data.splice(action.payload, 1);
        },
        setExtraFieldName: (state, action: PayloadAction<extra>) => {
            state.data[action.payload.index].name = action.payload.value;
        },
        setExtraFieldValue: (state, action: PayloadAction<extra>) => {
            state.data[action.payload.index].value = action.payload.value;
        }
    }
});

export const { 
    setFirstName, setLastName, setPatronymic, setEmail, setPhone, 
    setAddress, addField, removeField, setExtraFieldName, setExtraFieldValue } = formSlice.actions;

export const selectForm = (state: RootState) => state.form.data;

export default formSlice.reducer;