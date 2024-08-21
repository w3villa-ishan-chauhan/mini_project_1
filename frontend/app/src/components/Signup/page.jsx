import React from 'react';
import "./signup.scss";
import { useState } from 'react';
import { sendData } from "../../api/api";
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../api/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/authcontext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { googleLoginHandler } from '../../api/api';

function App() {
    const [formData, setFormData] = useState({
        email: '',
        contact: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();
    const { setContact, setEmail, login } = useAuth();
    const handleChange = (e) => {
        e.preventDefault();

        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Form validation example: Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Password & Confirm Password do not match!")
            return;
        }
        //api integration
        try {
            const response = await sendData(formData);
            console.log("response_signup",response)
            if (response.status_code === 200) {
                setContact(formData.contact)
                setEmail(formData.email)
                toast.success("Verify With OTP")
                navigate('./otp');
            }
            else{
                toast.error("Signup failed")
            }
        }
        catch (error) {
            toast.error("Signup failed")
        }

    }
    const googleLogin = async (response) => {
        try {
            const { credential } = response;
            if (!credential) throw new Error("Google credential not received");
                       
            const result = await googleLoginHandler({ credential });            
            login(result.data.access_token);
            if (result.status === 200) {
                console.log(result.status)
                navigate('./home');

            }
        } catch (error) {
            toast.error("Something went wrong :( !");
        }
    }
    return (
        <body className="signup">

            <div className="container-fluid">
                <div className="wrapper">
                    <form onSubmit={handleSubmit}>
                        <h2>Signup</h2>

                        <div className="input-field">
                            <input type="text" id="email" name="email" onChange={handleChange} value={formData.email} required />
                            <label htmlFor="email">Enter your email</label>
                        </div>
                        <div className="input-field">
                            <input type="tel" id="contact" name="contact" onChange={handleChange} value={formData.contact} required />
                            <label htmlFor="contact">Contact no.</label>
                        </div>

                        <div className="input-field">
                            <input type="password" id="password" name="password" onChange={handleChange} value={formData.password} required />
                            <label htmlFor="password">Enter your password</label>
                        </div>
                        <div className="input-field">
                            <input type="password" id="confirmPassword" onChange={handleChange} value={formData.confirmPassword} name="confirmPassword" required />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </div>

                        <button type="submit">Sign Up</button>
                        <div className="register">
                            <p>Already have an account? <a href="./login">Login</a></p>
                        </div>

                        <GoogleLogin
                            onSuccess={googleLogin}
                            onError={() => toast.error("Google login failed")}

                        />

                    </form>
                </div>

            </div>
        </body>
    );
}

export default App;
