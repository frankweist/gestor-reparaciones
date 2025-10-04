import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { App } from "./modules/app/App";
import { Remote } from "@core/data";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (url && key)
    Remote.initSupabase(url, key);
createRoot(document.getElementById("root")).render(_jsx(App, {}));
