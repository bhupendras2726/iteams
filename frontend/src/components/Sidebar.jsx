import { Link } from "react-router-dom";


function Sidebar() {
    return (
        <div>

            <h2>iTeams</h2>

            <nav>

                <ul>

                    <li>
                        <Link to="/">
                            Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link to="/salesmen">
                            Salesmen
                        </Link>
                    </li>

                    <li>
                        <Link to="/performance">
                            Performance
                        </Link>
                    </li>

                    <li>
                        <Link to="/leave">
                            Leave Management
                        </Link>
                    </li>

                    <li>
                        <Link to="/attendance">
                            Attendance
                        </Link>
                    </li>
                    <li>
                        <Link to="/sales-prediction">
                            Sales Prediction
                        </Link>
                    </li>

                </ul>

            </nav>

        </div>
    );
}

export default Sidebar;