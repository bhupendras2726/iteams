import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Salesmen from "./pages/Salesmen";
import Performance from "./pages/Performance";
import LeaveManagement from "./pages/LeaveManagement";
import Attendance from "./pages/Attendance";


function App() {
    return (
        <BrowserRouter>

            <Sidebar />

            <div>
                <Navbar />

                <main>

                    <Routes>

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/salesmen"
                            element={<Salesmen />}
                        />

                        <Route
                            path="/performance"
                            element={<Performance />}
                        />

                        <Route
                            path="/leave"
                            element={<LeaveManagement />}
                        />

                        <Route
                            path="/attendance"
                            element={<Attendance />}
                        />

                    </Routes>

                </main>

            </div>

        </BrowserRouter>
    );
}

export default App;