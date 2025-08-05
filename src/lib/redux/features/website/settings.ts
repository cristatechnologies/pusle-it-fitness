// features/website/settings.ts
import { store } from "../../store";
// import { WebsiteSetupResponse } from "./types";

// export function settings() {
//   const state = store.getState();
//   return state.website.data?.setting || {};
// }

// Alternative version that throws if settings aren't loaded
export function settings() {
  const state = store.getState();
  if (!state.website.data?.setting) {
    throw new Error("Website settings not loaded yet");
  }
  return state.website.data.setting;
}
