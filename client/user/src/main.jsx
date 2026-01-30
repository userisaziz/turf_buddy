import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: false }).catch(() => { });
}
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "react-hot-toast";

import { setupListeners } from "@reduxjs/toolkit/query";

setupListeners(store.dispatch);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster position="bottom-center" duration={500} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
