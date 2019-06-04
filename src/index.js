import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Components/Home.js'
import * as serviceWorker from './serviceWorker';
import { Container } from "semantic-ui-react";

const App = ({ children }) => (
  <Container style={{ margin: '3px 10px' }}>
    {children}
  </Container>
);

ReactDOM.render(
  <App>
    <Home />
  </App>,
  document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
