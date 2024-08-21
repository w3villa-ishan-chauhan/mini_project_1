const API_URL = "http://127.0.0.1:8000";

const API_PATH={
    SIGNUP:`${API_URL}/api/signup`,
    LOGIN:`${API_URL}/api/login`,
    VERIFY_OTP:`${API_URL}/api/verify-otp`,
    GOOGLE_LOGIN:`${API_URL}/api/google-login`,
    GET_USER:`${API_URL}/api/get_user`,
    SET_PROFILE:`${API_URL}/api/set_profile`,
    UPDATE_ADDRESS:`${API_URL}/api/update_address`,
    PAYMENT_INTENT:`${API_URL}/api/payment_intent`

    //api with params .ie id 
}

export default API_PATH;