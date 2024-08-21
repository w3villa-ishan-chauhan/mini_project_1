import React from "react";
import axios from "axios";
import axiosInstance from "./apiInstance";
import API_PATH from "./apiPath";
import { cookies } from "next/headers";

export const sendData = async (formData) => {
  try {
    const response = await axiosInstance.post(API_PATH.SIGNUP, formData);
    console.log(response);
    return response.data;
  } catch (error) {
    return "Signup failed";
  }
};
//endpoint will be at different file
export const loginUser = async (formData) => {
  try {
    const response = await axiosInstance.post(API_PATH.LOGIN, formData);
    console.log("rds",response.data);
    return response.data;
    
  } catch (error) {
    return "Login Failed";
  } //token has to be stored in global context i.e useContext ,context folder
};

export const verifyOtp = async (formData) => {
  try {
    console.log("func formdata", formData);

    const response = await axiosInstance.post(API_PATH.VERIFY_OTP, formData);
    return response.data;
    console.log("otp verification send!");
  } catch (error) {
    return "OTP Verification Failed";
  }
};

export const googleLoginHandler = async (formData) => {
  try {
    const response = await axiosInstance.post(API_PATH.GOOGLE_LOGIN, formData);
    return response;
  } catch (error) {
    return "Google Login Failed";
  }
};

export const get_user_details = async (token) => {
  try {
    const response = await axiosInstance.get(API_PATH.GET_USER, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return "Error Occurred while fetching user data";
  }
};

export const set_profile = async (formData, token) => {
  try {
    const response = await axiosInstance.post(API_PATH.SET_PROFILE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("profilepic", response.data);
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error("Error Occurred while uploading profile image:", error);
    throw error; // Rethrow the error if you want to handle it later
  }
};

export const update_address = async (formData, token) => {
  try {
    const response = await axiosInstance.post(
      API_PATH.UPDATE_ADDRESS,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error Occurred while uploading profile image:", error);
  }
};

export const payment_intent = async (formData) => {
  try {
    console.log("pay_amount",formData)
    const response = await axiosInstance.post(
      API_PATH.PAYMENT_INTENT,
      formData
    );
    return response;
  } catch (error) {
    console.error("Error Occurred while uploading profile image:", error);
  }
};
