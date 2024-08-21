import React from 'react';
import "./login.css";
import { useState } from 'react';
import { loginUser } from '../../api/api';
import { useAuth } from '../../context/authcontext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { googleLoginHandler } from '../../api/api';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function App() {
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth(); // Access the auth context
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });

    }
    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await loginUser(loginFormData);
            // console.log("result",result)
            if (result.access_token) {
                login(result.access_token);

                toast.success("Login Successful")
                navigate('/home');
            }
            else {
                toast.error("Invalid Credentials :( !")
            }

        }
        catch (error) {
            toast.error("Something went wrong :( !")
        }
    }
    
    return (
        <body className="login">

            <div className="container-fluid">
                <div className="wrapper">
                    <form onSubmit={handleSubmit}>
                        <h2>Login</h2>
                        <div className="input-field">
                            <input type="text" id="email" name="email" onChange={handleChange} required />
                            <label htmlFor="email">Enter your email</label>
                        </div>
                        <div className="passwordSection">
                            <div className="input-field">
                                <input type={showPassword ? 'text' : 'password'} id="password" name="password" onChange={handleChange} required />
                                <label htmlFor="password">Enter your password</label>

                            </div>
                            <div className="password-toggle">
                                <input
                                    type="checkbox"
                                    id="showPassword"

                                    onChange={toggleShowPassword}
                                />
                                <label htmlFor="showPassword">Show </label>
                            </div>
                        </div>

                        <button type="submit">Log In</button>
                        <div className="register">
                            <p>Don't have an account? <a href="/">Register</a></p>

                        </div>

                    </form>
                </div>
            </div>
        </body>
    );
}

export default App;
