import React from 'react';
import { Route, Switch } from 'react-router-dom';
import IndexHome from '../components/home/IndexHome';

export default function router({ store, history }) {
    return (
        <Switch>
            <Route exact path="/" component={IndexHome} />
        </Switch>
    );
}
