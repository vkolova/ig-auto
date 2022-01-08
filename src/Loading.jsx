import React from 'react';

import './css/loading.scss';

const Loading = () =>
    <div className='loading-wrapper'>
        <div className='lds-grid'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <h6 className='lds-text'>loading</h6>
    </div>;

export default Loading;