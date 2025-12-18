// vite-project/src/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';

// Get the base URL from the environment variable we set
const API_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Registering...');
        try {
            // Call the working backend endpoint
            const response = await axios.post(`${API_URL}/users/register`, formData);
            setMessage(`Success: ${response.data.message}`);
            
            // Optionally redirect or log in the user here
            console.log(response.data); 
        } catch (error) {
            setMessage(`Error: ${error.response.data.error || 'Registration failed.'}`);
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>User Registration</h2>
            <input name="username" type="text" placeholder="Username" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>
            <p>{message}</p>
        </form>
    );
};

export default Register;