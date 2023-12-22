import React, { useState, useEffect } from 'react';
import './Card.css'

export function MainInfoCard({serverBaseURL, deviceId, targetDate}) {

  const deviceRecentActivityApi = "/api/v1/device/recent/activity";

  const [recentActivite, setRecentActivite] = useState("");

  const fetchRecentActivity = () => {
    fetch(serverBaseURL + deviceRecentActivityApi + "?" + "deviceId=" + deviceId)
      .then(response => {return response.text()})
      .then(data => {setRecentActivite(data)})
      .catch(error => console.error('Error fetching data from device recent activity Api :', error));
  }

  // Only run once
  useEffect(() => {
    fetchRecentActivity()
  }, [deviceId]);


  return (
      <div className="card cardBox text-bg-dark">
        <h5 className="card-title text-center">Summary :</h5>
        <p className="card-text"><b>Selected date : </b><small><i>{(targetDate != null && targetDate != "") ? targetDate : "---"}</i></small>
          <br/><b>Selected device : </b><small><i>{(deviceId != null && deviceId != "") ? deviceId : "---"}</i></small>
          <br/><b>Device active : </b>
          <small>
            <i className={recentActivite === "false" ? "text-warning" : ""}>
              {(recentActivite != null && recentActivite != "") ? recentActivite : "---"}
            </i>
          </small>
        </p>
      </div>
  );
};
