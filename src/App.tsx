import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { LoginPage } from './pages/login';
import { OverviewPage } from './pages/overview';
import { UserListPage } from './pages/user-list';
import { NewUserPage } from './pages/create-new-user';
import { FieldDataVisualizerPage } from './pages/field-datavisualizer';
import { EditUserPage } from './pages/edit-user';
import { StatPage } from './pages/stat';
import { TempMonitoringPage } from './pages/temp-monitoring';
import { AnomalyLogsList } from './pages/anomaly-logs-list';
import {useAuthContext} from "./containers/auth";

const PrivateRoute = ({component: Component, isLoggedIn, ...rest}) => {
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isLoggedIn ?
                <Component {...props} />
                : <Redirect to="/login" />
        )} />
    );
};


function App() {
    const {isLoggedIn} = useAuthContext();
    return (
        <Router>
            <Switch>
                <PrivateRoute
                    path="/"
                    exact={true}
                    component={OverviewPage}
                    isLoggedIn={isLoggedIn}
                />
                <Route
                    path="/login"
                    exact={true}
                    component={LoginPage}
                />
                <PrivateRoute
                    path="/users"
                    exact={true}
                    component={UserListPage}
                    isLoggedIn={isLoggedIn}
                />
                <PrivateRoute
                    path="/users/new"
                    exact={true}
                    component={NewUserPage}
                    isLoggedIn={isLoggedIn}
                />
                <PrivateRoute
                    path="/users/:username"
                    exact={true}
                    component={EditUserPage}
                    isLoggedIn={isLoggedIn}
                />
                <PrivateRoute
                    path="/field-stats"
                    exact={true}
                    component={FieldDataVisualizerPage}
                    isLoggedIn={isLoggedIn}
                />
                <PrivateRoute
                    path="/stat"
                    exact={true}
                    component={StatPage}
                    isLoggedIn={isLoggedIn}
                />
                <PrivateRoute
                    path="/temp-stat"
                    exact={true}
                    component={TempMonitoringPage}
                    isLoggedIn={isLoggedIn}
                />
                <PrivateRoute
                    path="/anomaly-logs"
                    exact={true}
                    component={AnomalyLogsList}
                    isLoggedIn={isLoggedIn}
                />
            </Switch>
        </Router>
    );
}

export default App;
