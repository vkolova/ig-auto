import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import axios from 'axios';

axios.defaults.headers = {
    'goodreads': localStorage.getItem('goodreads'),
    'instagram': localStorage.getItem('instagram'),
}

import './css/index-styles.scss';
import './css/home.scss';


import CurrentlyReading from './CurrentlyReading';
import SetupAccounts from './SetupAccounts';
import Protected from './Protected';

const Home = () => <React.Fragment>
    <br /><br /><br />
    <div className='services'>
        <Link className='service' to='/currently-reading'>currently reading</Link>
        <Link className='service' to='/monthly-wrap-up'>monthly wrap up</Link>
    </div>
</React.Fragment>

const Application = () =>
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/setup-accounts' element={<SetupAccounts />} />
            <Route
                path='/currently-reading'
                element={
                    <Protected>
                        <CurrentlyReading />
                    </Protected>
                }
            />
        </Routes>
    </BrowserRouter>;


ReactDOM.render(
    <Application/>,
    document.getElementById('root')
);