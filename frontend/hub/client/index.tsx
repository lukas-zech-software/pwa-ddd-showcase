import * as React from 'react';
import { render } from 'react-dom';
import { HubApp } from './HubApp';

const root = document.createElement('div');
document.body.appendChild(root);
render(<HubApp/>, root);
