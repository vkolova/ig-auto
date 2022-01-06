import React from 'react';

import './css/phone.scss';


const Phone = props =>
    <div className='phone'>
        <div className='screen'>
            { props.children }
        </div>
    </div>


export default Phone;
