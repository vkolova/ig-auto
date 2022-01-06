import React from 'react';
import ReactDOM from 'react-dom';

import Phone from './Phone';


import './css/index-styles.scss';

import { Simple } from './CurrentlyReading';


ReactDOM.render(
    <Phone>
        <Simple
            aspectRatio={'9x16'}
            backgroundColor={'#fff'}
            title={{
                font: 'Sinthya',
                transform: 'unset',
                size: 30
            }}
            cover={{
                size: 'md',
                borderRadius: 10
            }}
            credit={{
                show: true,
                username: 'irresistible.reads'
            }}
        />
    </Phone>,
    document.getElementById('root')
);