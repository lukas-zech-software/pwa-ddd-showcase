import * as React from 'react';
import { render } from 'react-dom';
import 'reflect-metadata';
import { App } from './App';

const root = document.createElement('div');
document.body.appendChild(root);
render(<App/>, root);
