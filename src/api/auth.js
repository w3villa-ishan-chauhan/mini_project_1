import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Ensure correct path

const API_URL = "http://127.0.0.1:8000";

export const fetchProtectedData = async () => {
    const { token } = useAuth(); // Get token from context
    try {
        const response = await axios.get(`${API_URL}/protected-route`, {
            headers: {
                Authorization: `Bearer ${token}` // Attach token in headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching protected data:", error);
        throw new Error("Error fetching data.");
    }
};
