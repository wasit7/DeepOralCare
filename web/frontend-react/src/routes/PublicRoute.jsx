import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, restricted, layout: Layout, ...rest }) => {

    return (
        <Route {...rest} render={props => (
            (restricted) ?
                <Redirect to='/Home' />
                : <Layout {...props} {...rest}>
                    <Component {...props} />
                </Layout>
        )} />
    );
};

export default PublicRoute;
