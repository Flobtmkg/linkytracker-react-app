import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import './Card.css'


export function DeviceParamSelectCard({serverBaseURL, setDeviceId}) {

  const devicesApi = "/api/v1/devices";

  const [deviceOptions, setdeviceOptions] = useState([]);

  const fetchDevices = () => {
    fetch(serverBaseURL + devicesApi)
      .then(response => {return response.json()})
      .then(data => {setdeviceOptions(data)})
      .catch(error => console.error('Error fetching devices data:', error));
  }

  // Only run once
  useEffect(() => {
    fetchDevices()
  }, []);

  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "#F5FFFA" : "#000000",
    })};

  return (
      <div className="card cardBox text-bg-dark text-center">
        <h5 className="card-title">Select a device :</h5>
        <Select options={deviceOptions} styles={customStyles} onChange={(element) => setDeviceId(element.value)} />
      </div>
  );
};
