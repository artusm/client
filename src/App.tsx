import React from 'react';
import './App.css';
import {LoginPage} from "./pages/login";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {OverviewPage} from "./pages/overview";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" component={OverviewPage} />
                <Route path="/login" component={LoginPage} />
            </Switch>
        </Router>
    );
}

export default App;
