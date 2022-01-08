import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

import './css/setup-accounts.scss';

Object.defineProperty(Array.prototype, 'last', {
    get : function() {
        return this[this.length - 1];
    }
});

const SetupAccounts = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [state, setState] = useState({ instagram: null, goodreads: null });
    const from = location.state?.from?.pathname || '/';

    const onChange = event => {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    const submit = () => {
        const goodreads = state.goodreads.split('/').last.split('-')[0];
        const instagram = state.instagram.split('/')[3];
        localStorage.setItem('goodreads', goodreads);
        localStorage.setItem('instagram', instagram);

        axios.defaults.headers = { goodreads, instagram };
        navigate(from, { replace: true });
    };

    return <div className='setup'>
        <h2>{'> setup accounts'}</h2>

        <br/>

        <input
            type='url'
            name='goodreads'
            placeholder='Goodreads Account URL'
            onChange={onChange}
            autoComplete='true'
        />
        <input
            type='url'
            name='instagram'
            placeholder='Instagram Account URL'
            onChange={onChange}
            autoComplete='true'
        />

        <br/>

        <div
            className='btn btn--submit'
            onClick={submit}
        >continue</div>
    </div>;
};

export default SetupAccounts;
