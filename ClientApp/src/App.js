import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import UserProvider from './components/provider/UserProvider';
import './custom.css';
export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <UserProvider>
                <Layout>
                    <Routes>
                        {AppRoutes.map((route, index) => {
                            const { element, ...rest } = route;
                            return <Route key={index} {...rest} element={element} />;
                        })}
                    </Routes>
                </Layout>
            </UserProvider>
        );
    }
}
