import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { updatedTreesStore } from './models/updated-tree';
import { entireTreeStore } from './models/entire-tree';

const updatedTrees = updatedTreesStore.create();
const entireTree = entireTreeStore.create();

ReactDOM.render(<App updatedTreeStore={updatedTrees} entireTreeStore={entireTree}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
