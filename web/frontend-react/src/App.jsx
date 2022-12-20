import React from 'react';
import Routes from './routes/Routes';
import { BrowserRouter, Switch } from 'react-router-dom';
import { nanoid } from 'nanoid';
import PublicRoute from './routes/PublicRoute';

function App() {
    return (
        <BrowserRouter>
            <Switch>
            {
                    Routes.filter(route => route.role === 0).map((route) => {
                        return (
                            <PublicRoute
                                key={nanoid()}
                                exact
                                component={route.component}
                                layout={route.layout}
                                restricted={route.restricted}
                                {...route}
                            />
                        );
                    })
                }
            </Switch>
        </BrowserRouter>
    )
}

export default App