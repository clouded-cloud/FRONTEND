import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    name: "",
    email : "",
    phone: "",
    isAdmin: false,
    isSuperuser: false,
    avatar: "",
    isAuth: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { _id, name, phone, email, role, isAdmin, isSuperuser } = action.payload;

            if (role) {
                console.warn(
                    "[userSlice] Warning: legacy 'role' string detected in setUser payload. " +
                    "Consider migrating to 'isAdmin' and 'isSuperuser' booleans."
                );
            }

            state._id = _id;
            state.name = name;
            state.phone = phone;
            state.email = email;
            state.avatar = action.payload.avatar || action.payload.profileImage || "";
            state.isAdmin = typeof isAdmin === "boolean" ? isAdmin : false;
            state.isSuperuser = typeof isSuperuser === "boolean" ? isSuperuser : false;
            state.isAuth = true;
        },

        removeUser: (state) => {
            state._id = "";
            state.email = "";
            state.name = "";
            state.phone = "";
            state.isAdmin = false;
            state.isSuperuser = false;
            state.avatar = "";
            state.isAuth = false;
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
