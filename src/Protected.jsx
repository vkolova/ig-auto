import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const Protected = ({ children }) => {
	const isAuthenticated = localStorage.getItem('instagram') && localStorage.getItem('goodreads');
	let location = useLocation();

	return isAuthenticated
		? children
		: <Navigate to='/setup-accounts' state={{ from: location }} replace />;
}

export default Protected;
