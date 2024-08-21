// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-sdk/services/geocoding';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./maps.scss"
import { toast } from 'react-toastify';
import { useAuth } from '../../context/authcontext';
import { update_address } from "../../api/api";
import { get_user_details } from "../../api/api";
const mapbox_access_token = process.env.MAP_BOX_KEY;

const Map = ReactMapboxGl({
  accessToken: mapbox_access_token
});

const geocodingClient = MapboxGeocoder({
  accessToken: mapbox_access_token

});

const MapComponent = () => {
  const [formData, setFormData] = useState({
    suggestedAddress: "",
    zip: "",
    houseNumber: ""
  })
  const { token, setAddress, authState, logout } = useAuth();

  const [coordinates, setCoordinates] = useState([-0.481747846041145, 51.3233379650232]); // Initial coordinates
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (token) {
      const fetchUserDetails = async () => {
        try {
          const userData = await get_user_details(token);

          // Set address and other details from userData
          setAddress(userData.residing_address || ""); // Update according to your data structure

          console.log("userData:", userData.data.residing_address);

        } catch (error) {
          console.error("Failed to fetch user details:", error);
          logout();
        }
        finally {
          setLoading(false)
        }
      };
      fetchUserDetails();
    } else {
      localStorage.removeItem("access_token");
    }
  }, [token, loading]);
  // To store address suggestions
  const handleChange = async (e) => {

    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // console.log(formData)
  }
  const handleAddressInput = async (e) => {
    const query = e.target.value;
    // Get address suggestions from the Mapbox Geocoding API
    if (query.length > 0) {
      const response = await geocodingClient.forwardGeocode({
        query,
        autocomplete: true,
        limit: 5
      }).send();

      setSuggestions(response.body.features);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (feature) => {

    setCoordinates(feature.center);
    setFormData({ ...formData, ["suggestedAddress"]: feature.place_name });// Update the coordinates based on the selected suggestion
    setSuggestions([]); // Clear suggestions
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await update_address(formData, token);

      if (response.status === 200) {
        console.log(response.status)
        setLoading(true)
        toast.success("Address updated ");
        window.location.reload()
      }
    }
    catch (error) {
      toast.error("Address update failure !")
    }

  }
  if (loading || !authState.user || !authState.user.data) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="container address-map-container">
      <form action="" onSubmit={handleSubmit} className="address-form">
        <div className="row address-container">
          <div className='col-3'>
            <input
              type="text"
              className='form-control'
              placeholder="Enter address"
              onChange={handleAddressInput}

            />
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ cursor: 'pointer', padding: '5px', backgroundColor: '#f0f0f0', marginBottom: '2px' }}
                >
                  {suggestion.place_name}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-3">
            <input className='form-control' placeholder='House Number' type='text' name="houseNumber" value={formData.houseNumber} onChange={handleChange}></input>
          </div>
          <div className="col-3">
            <input className='form-control' placeholder='Pincode' type='text' name="zip" value={formData.zip} onChange={handleChange}></input>

          </div>
        </div>
        <div className='row map-container'>
          <div className="col-3 px-0">

            <div className="address-info">
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <h2>You Live At<p>{`${authState.user.data.residing_address ? authState.user.data.residing_address : "null"}`}</p></h2>
                )}
              </div>
            </div>

          </div>
          <div className="col-9">
            <Map
              style="mapbox://styles/mapbox/streets-v9"
              containerStyle={{
                height: '250px',
                width: '100%',
                border: '2px solid red'
              }}
              center={coordinates}
            >
              <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                <Feature coordinates={coordinates} />
              </Layer>
            </Map>
          </div>

        </div>
        <button className="btn btn-primary" type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default MapComponent;
