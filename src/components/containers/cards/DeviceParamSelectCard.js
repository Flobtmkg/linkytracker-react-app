import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import './Card.css'

// event source definiton
let eventSource = new EventSource("");

var cachedDevices = new Map();

export function DeviceParamSelectCard({serverBaseURL, setDeviceId}) {

  const devicesApi = "/api/v1/devices";

  const [deviceOptions, setdeviceOptions] = useState([]);

  // Configure a fresh new eventSource with new API path target
  function eventSourceConfig(fullPath){
    eventSource.close();
    eventSource = new EventSource(fullPath);
    eventSource.onerror = (event) => console.log('Error fetching devices data:', event);
    // When SSE data is recieved...
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(!cachedDevices.has(data.value)){
        cachedDevices.set(data.value, data)
        setdeviceOptions(Array.from(cachedDevices.values()));
      }
    }
}

  // Only run once 
  useEffect(() => {
    eventSourceConfig(serverBaseURL + devicesApi)
  }, []);

  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "#F5FFFA" : "#000000",
    })};

  return (
      <div className="card cardBox text-bg-dark ">
        <h5 className="card-title text-center cardTitleMargin">Device selection</h5>
        <Select className="text-center" options={deviceOptions} placeholder="Select a device ID" styles={customStyles} onChange={(element) => setDeviceId(element.value)} />
      </div>
  );
};
