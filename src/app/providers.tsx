// app/providers.tsx
"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/lib/redux/store";
import { fetchHomepageData } from "@/lib/redux/features/homepage/thunks";
import { useEffect } from "react";


export function ReduxProvider({
  children,
  initialWebsiteData,
  initialHomepageData,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialHomepageData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialWebsiteData?: any;
}) {
  // Initialize store with server data if provided
 useEffect(() => {
   if (initialWebsiteData) {
     store.dispatch({
       type: "website/fetchSetup/fulfilled",
       payload: initialWebsiteData,
     });
   }

   if (initialHomepageData) {
     store.dispatch(
       fetchHomepageData.fulfilled(initialHomepageData, "", undefined)
     );
   }
 }, [initialWebsiteData, initialHomepageData]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
