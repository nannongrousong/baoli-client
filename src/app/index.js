import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import 'APP_STYLES/utilities/main.less';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'babel-polyfill';

import Routers from 'APP_ROUTER';
const preRouter = '/app';

class App extends Component {
    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <BrowserRouter basename='/baoli/web'>
                    <Switch>
                        {
                            Routers.map((routerItem, index) => {
                                const { path, component } = routerItem;
                                return <Route
                                    key={index}
                                    path={`${preRouter}${path}`}
                                    component={component} />;
                            })
                        }
                    </Switch>
                </BrowserRouter>
            </LocaleProvider>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('app'));

module.hot && module.hot.accept();