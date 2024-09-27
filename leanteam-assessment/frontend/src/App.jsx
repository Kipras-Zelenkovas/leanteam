import { useEffect } from "react";
import "./App.css";
import { AnimatedRoutes } from "./Routes/AnimatedRoutes";
import { getUserLocal } from "./controllers/users";

function App() {
    useEffect(() => {
        if (localStorage.getItem("id") === null) {
            getUserLocal().then((res) => {
                localStorage.setItem("id", res.data.id);
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("name", res.data.name);
            });
        }
    }, []);

    return (
        <div className="flex flex-wrap w-full h-full overflow-y-hidden">
            <AnimatedRoutes />
        </div>
    );
}

export default App;
