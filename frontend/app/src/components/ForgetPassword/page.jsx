import React from 'react';
import "./forget.css";

function App() {
    return (
        <div className="container-fluid">
            <div className="wrapper">
                <form action="#">
                    <h2>Reset Password </h2>
                    <div className="input-field">
                        <input type="tel" id="contact" name="contact" required />
                        <label htmlFor="contact">Contact no.</label>
                    </div>
                    <div className="input-field">
                        <input type="text" id="email" name="email" required />
                        <label htmlFor="email">Enter your email</label>
                    </div>

                    <button type="submit">Reset My Password</button>

                </form>
            </div>

        </div>
    );
}

export default App;