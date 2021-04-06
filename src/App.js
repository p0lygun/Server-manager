
import React from "react";
import { HashRouter, useLocation, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import './App.css';
import './fade.css';

import Views from "./views";
import Main from "./views/Main";
import { createHashHistory } from 'history';
import { Sidebar, PageContainer, PageColumn } from "./components";


export const history = createHashHistory();

export const APP_VERSION = "0.2.0-prev1";

function ViewportHolder(props) {
    return (
        <div className="App">{props.children}</div>
    );
}   

function App() {

    let location = useLocation();

    return (
        <div className="App">
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route>
                        <Sidebar />
                        <TransitionGroup component={PageContainer}>
                            <CSSTransition key={location.key} classNames="fade" timeout={200}>
                                <PageColumn>
                                    <Views />
                                </PageColumn>
                            </CSSTransition>
                        </TransitionGroup>
                    </Route>
                </Switch>
            </HashRouter>
        </div>
    );
}

export default App;

