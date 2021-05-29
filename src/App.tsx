import React from 'react';
import './App.css';
import { LoginPage } from './pages/login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { OverviewPage } from './pages/overview';
import { UserListPage } from './pages/user-list';
import { NewUserPage } from './pages/create-new-user';
import FieldDataVisualizerPage from './pages/field-datavisualizer/field-datavisualizer_page';
import { EditUserPage } from './pages/edit-user';
import { StatPage } from './pages/stat';
import { TempMonitoringPage } from './pages/temp-monitoring';
import { AnomalyLogsList } from './pages/anomaly-logs-list';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact={true} component={OverviewPage} />
                <Route path="/login" exact={true} component={LoginPage} />
                <Route path="/users" exact={true} component={UserListPage} />
                <Route path="/users/new" exact={true} component={NewUserPage} />
                <Route path="/users/:username" exact={true} component={EditUserPage} />
                <Route
                    path='/field-stats'
                    exact={true}
                    component={FieldDataVisualizerPage}
                />
                <Route path="/stat" exact={true} component={StatPage} />
                <Route path="/temp-stat" exact={true} component={TempMonitoringPage} />
                <Route path="/anomaly-logs" exact={true} component={AnomalyLogsList} />
            </Switch>
        </Router>
    );
}

export default App;
