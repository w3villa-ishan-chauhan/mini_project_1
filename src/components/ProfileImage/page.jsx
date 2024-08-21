import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authcontext';
import { toast } from 'react-toastify';
import "./profileImage.scss"
import { set_profile } from "../../api/api"

const ProfileUpload = () => {
  const [file, setFile] = useState(null);
  const { token } = useAuth();

  const handleFileChange = (e) => {

    setFile(e.target.files[0]);

    toast.success("File");

  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await set_profile(formData, token)
      console.log("profile_res", response)
      if (response) {

        toast.success("Profile image uploaded successfully");
        window.location.reload()
      }
    } catch (error) {
      toast.error("Error uploading profile image");
    }
  };

  return (
    <div className='profile-picture'>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ProfileUpload;
