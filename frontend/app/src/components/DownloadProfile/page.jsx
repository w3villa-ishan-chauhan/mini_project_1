import React from "react";
import jsPDF from 'jspdf';

const DownloadProfile = (userData) => {

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('User Profile', 10, 10);

    // Add user data
    doc.setFontSize(12);

    doc.text(`Email: ${userData.email}`, 10, 40);
    doc.text(`Contact: ${userData.contact}`, 10, 50);
    doc.text(`Address: ${userData.residing_address}`, 10, 60);

    // Add more data as needed

    // Save the PDF
    doc.save('user-profile.pdf');
};

export default DownloadProfile;