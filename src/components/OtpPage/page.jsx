import React from 'react';
import "../../global.scss";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyOtp } from '../../api/api';
import { useAuth } from '../../context/authcontext';

function App() {
    const [otp, setOtp] = useState('')
    const navigate = useNavigate();
    const [formData, setFormData] = useState({

        contact: '',
        otp: '',
        email_otp:''

    });
    const { contactNumber , email} = useAuth();
    console.log("useAuth", useAuth())
    console.log("contact", contactNumber)

    const handleOtp = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
    }

    const enteredOtp = async (e) => {
        e.preventDefault()
        try {
            const reqData = { ...formData, ["contact"]: contactNumber , ["email"]:email }
            const response = await verifyOtp(reqData);
            if (response.status == "200") {
                navigate('/home')
            }

        }
        catch (error) {
            return toast.error("Something Wrong :(")
        }
    }
    return (
        <body className="otp">

            <div class="wrapper">
                <form onSubmit={enteredOtp}>
                    <h2>OTP Verification</h2>

                    <div id="otpSection" >
                        <div class="input-field">
                            <input type="text" id="otp" name="otp" value={formData.otp} onChange={handleOtp} required />
                            <label for="otp">Enter OTP</label>
                        </div>
                        <div class="input-field">
                            <input type="text" id="email_otp" name="email_otp" value={formData.emaill_otp} onChange={handleOtp} required />
                            <label for="email_otp">Enter OTP</label>
                        </div>
                        <button type="submit" id="verifyOTP" >Verify OTP</button>
                    </div>

                    <div class="register">
                        <p>Already have an account? <a href="./login">Login</a></p>
                    </div>
                </form>
            </div>
        </body>
    )
};
export default App;