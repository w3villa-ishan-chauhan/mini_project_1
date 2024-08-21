import React from 'react'
import "./HomePage.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import 'normalize.css';
import { useEffect, useState } from "react";
import { get_user_details } from "../../api/api";
import ProfileImage from "../ProfileImage/page";
import { useAuth } from '../../context/authcontext';
import MapComponent from '../Maps/page';
import DownloadProfile from '../DownloadProfile/page';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Payment from "../Payment/page";
const stripePromise = loadStripe("pk_test_51Ppk40RqwFYz4iEaqBH5h3sjogwy441itySkuKfrytH3K2PtZOgW5tWIZZuKj5enfKQQMV5Ux9qxMfYS9JPVgUiV00WMOdeWli");
console.log("stripePromise ",stripePromise )

function HomePage() {
    const { authState, token, logout, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState('');

    console.log('Token updated:', token);
    useEffect(() => {
        if (token) {
            console.log('Token updated:', token);
            localStorage.setItem("access_token", token);
            const fetchUserDetails = async () => {
                try {
                    const userData = await get_user_details(token);
                    setUser({ user: userData });
                    setProfileImageUrl("true");

                    console.log("userData:", userData);
                    console.log("profileImgurl:", profileImageUrl);

                } catch (error) {
                    console.error("Failed to fetch user details:", error);
                    logout();
                }
                finally {
                    setLoading(false); // Set loading to false after fetching or error
                }
            };
            fetchUserDetails();
        } else {
            localStorage.removeItem("access_token");
        }

    }, [token]);
    // const email = authState.user?.data.email || 'No email available';
    const handleLogout = () => {
        logout();
    }
    const handleDownload = () => {
        console.log("ad", authState.user.data)
        DownloadProfile(authState.user.data)
    }
    console.log(authState)
    return (
        <body className="home">

            <section className='home' >
                <div className="text-center">
                    <div id="slide" className="hide">
                        <div className="dashboard">
                            <div className="profile-column container-fluid">
                                <div className="row row-top justify-content-center">
                                    <div className=" col profile m-2">
                                        <div>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : (
                                                <img src={`${authState.user.data.profile_image}`}></img>
                                            )}
                                        </div>
                                        {profileImageUrl &&
                                            <div className="profileImage">
                                                <ProfileImage />
                                            </div>}
                                    </div>
                                </div>

                                <div className="row row-bottom justify-content-center">

                                    <button className="logoutButton" onClick={handleLogout}>Logout</button>

                                </div>
                            </div>
                            <div className="responsive-container container-fluid">
                                <div className="middlebar container-fluid">
                                    <div className="row mt-2 header-section">
                                        <div className="col-2 pt-md-4 hamburger">
                                            <div id="nav-icon1" className="slide">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xl-8">
                                            <form className="d-flex" role="search">
                                                <i className="fa fa-search"></i>
                                                <input
                                                    className="form-control border-0 me-1"
                                                    type="search"
                                                    placeholder="..."
                                                    aria-label="Search"
                                                />
                                                <button className="filter-button" type="submit">
                                                    Filters<i className="fa fa-angle-down"></i>
                                                </button>
                                                <button className="filter-button-mobile" type="submit">
                                                    <i className="fa fa-angle-down"></i>
                                                </button>
                                            </form>
                                        </div>
                                        <div className="col-4 notification">
                                            <button
                                                type="button"
                                                className="btn btn-primary notification-button"
                                                onClick={handleDownload}
                                            >
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row send-money">
                                        <div className="row send-money-heading">
                                            <p className="h6">Address and Location</p>
                                        </div>
                                        <div className="address-section">
                                            <MapComponent />
                                        </div>

                                    </div>
                                    <div className="row payment-container ms-1">
                                        <div className="row send-money-heading">
                                            <p className="h6">Upgrade Your Plan</p>
                                        </div>
                                        <div className="row payment-section">
                                            <Elements stripe={stripePromise}>
                                                <Payment />
                                            </Elements>
                                        </div>

                                    </div>

                                </div>
                                <div className="rightbar container-fluid">
                                    <div>
                                        <div className="heading mt-4">
                                            {loading ? (
                                                <p>Loading...</p> // Fixed the closing tag
                                            ) : (
                                                <p className="h6">Hello, {authState.user.data.email}</p>
                                            )}

                                            <p className="small-grey">Welcome to the pocket dashboard</p>
                                        </div>

                                        <p className="mt-4 h6">My Cards</p>
                                        <div className="my-cards mt-2 right-div">
                                            <div className="creditImg">
                                                <img
                                                    className="img"
                                                    src="https://pngimg.com/d/credit_card_PNG135.png"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="p-4">

                                            </div>
                                        </div>

                                        <p className="mt-4 h6">Recent Transactions</p>

                                        <div className="row mt-3 left">
                                            <div className="col-2">
                                                <i className="fa fa-pinterest-p cricle transaction-icon"></i>
                                            </div>
                                            <div className="col-5">
                                                <p className="paypal">PayPal</p>
                                                <p className="small-grey">July 10, 2023</p>
                                            </div>
                                            <div className="col-5">
                                                <p className="increment">+$296.23</p>
                                            </div>
                                        </div>
                                        <div className="row mt-3 left">
                                            <div className="col-2">
                                                <i className="fa fa-pinterest-p cricle transaction-icon"></i>
                                            </div>
                                            <div className="col-5">
                                                <p className="paypal">PayPal</p>
                                                <p className="small-grey">July 10, 2023</p>
                                            </div>
                                            <div className="col-5">
                                                <p className="increment">+$296.23</p>
                                            </div>
                                        </div>
                                        <div className="row mt-3 left">
                                            <div className="col-2">
                                                <i className="fa fa-pinterest-p cricle transaction-icon"></i>
                                            </div>
                                            <div className="col-5">
                                                <p className="paypal">PayPal</p>
                                                <p className="small-grey">July 10, 2023</p>
                                            </div>
                                            <div className="col-5">
                                                <p className="increment">+$296.23</p>
                                            </div>
                                        </div>
                                        <div className="row mt-3 left">
                                            <div className="col-2">
                                                <i className="fa fa-pinterest-p cricle transaction-icon"></i>
                                            </div>
                                            <div className="col-5">
                                                <p className="paypal">PayPal</p>
                                                <p className="small-grey">July 10, 2023</p>
                                            </div>
                                            <div className="col-5">
                                                <p className="increment">+$296.23</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </body>

    );
}
export default HomePage;