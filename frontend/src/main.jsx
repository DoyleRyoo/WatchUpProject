import "pretendard/dist/web/static/pretendard.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

import { auth } from "./services/firebase";

import { onAuthStateChanged } from "firebase/auth";

import useAuthStore from "./store/authStore";

onAuthStateChanged(
  auth,
  (user) => {
    useAuthStore
      .getState()
      .setUser(user);

    useAuthStore
      .getState()
      .setLoading(false);
  }
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);