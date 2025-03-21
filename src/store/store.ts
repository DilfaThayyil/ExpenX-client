import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createUserSlice } from "./userSlice";

const Store = create(devtools(
    createUserSlice,
    { name: "UserStore" } 
  ))

export default Store