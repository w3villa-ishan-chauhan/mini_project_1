import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { payment_intent } from "../../api/api";
import { useAuth } from '../../context/authcontext';
import "./payment.scss"
import { use } from 'bcrypt/promises';

const Payment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const { token } = useAuth()

    // Create PaymentIntent when the component mounts
    useEffect(() => {
        const initializePayment = async () => {
            try {
                const clientSecret = await payment_intent({
                    amount_pay: 500
                  });  // amount in cents
                setClientSecret(clientSecret.data.clientSecret);
                console.log("clientSecret", clientSecret)
            } catch (error) {
                setError("Failed to initialize payment. Please try again later.");
            }
        };

        initializePayment();
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });
        console.log(payload)

        if (payload.error) {
            setError(`Payment failed: ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
            // Upgrade user access level here or handle in webhook
        }
    };

    return (
        <form id="payment-form" className=" col-6" onSubmit={handleSubmit}>
            <div className="payment-form">
                <CardElement className="card-details" id="card-element" />
                <button className="btn btn-primary" disabled={processing || !stripe || !elements} id="submit">
                    {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
                </button>
                {error && <div className="card-error" role="alert">{error}</div>}
                {succeeded && <p>Payment succeeded!</p>}
            </div>

        </form>
    );
};

export default Payment;
