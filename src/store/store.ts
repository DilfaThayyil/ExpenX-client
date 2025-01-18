import { create } from "zustand";
import { createUserSlice } from "./userSlice";

const Store = create(createUserSlice)

export default Store