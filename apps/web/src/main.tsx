import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { App } from "./modules/app/App";
import { Remote } from "@core/data";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
if (url && key) Remote.initSupabase(url, key);

createRoot(document.getElementById("root")!).render(<App />);
