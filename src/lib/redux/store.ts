// lib/redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { WebsiteSetupResponse } from "./features/website/types";
// Import your reducers
import cartReducer from "./features/cart/slice";
import compareReducer from "./features/compare/slice";
import websiteReducer from "./features/website/slice";
import wishlistReducer from "./features/wishlist/slice";
import homepageReducer from "./features/homepage/slice";
// Combine reducers first
const rootReducer = combineReducers({
  cart: cartReducer,
  compare: compareReducer,
  website: websiteReducer,
  wishlist: wishlistReducer,
  homepage: homepageReducer,
});


// const resettableRootReducer = (state: any, action: any) => {
//   if (action.type === "RESET_STATE") {
//     // This will reset all reducers to their initial state
//     return rootReducer(undefined, action);
//   }
//   return rootReducer(state, action);
// };
// Persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "wishlist"], // Only persist these reducers
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});




export async function getWebsiteData(): Promise<WebsiteSetupResponse | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/website-setup`
    );
    if (!response.ok) throw new Error("Failed to fetch website setup");
    return response.json();
  } catch (error) {
    console.log("Error fetching website data:", error);
    return null;
  }
}

export const persistor = persistStore(store);
export const resetState = () => ({ type: "RESET_STATE" });
// Infer the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
