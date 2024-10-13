import React, { useState, useEffect } from 'react';
import {getVersionEnv} from "../../../utilities/EnvUtil";
import './Card.css'
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';

const goldScaleRatio = 3.66518;

export function MainInfoCard({serverBaseURL, deviceId, targetDate, setWindowSizeValue, setOffsetTimeZone}) {

  const deviceRecentActivityApi = "/api/v1/device/recent/activity";
  const serverConfigApi = "/api/v1/config";
  
  const [defaultWindowSize, setDefaultWindowSize] = useState(15);
  const [recentActivite, setRecentActivite] = useState("");
  const [offsetDataFilter, setoffsetDataFilter] = useState(0);
  const [defaultOffsetTimeZone, setDefaultOffsetTimeZone] = useState(0);
  const [controlsLocked, setControlsLocked] = useState(true);
  const [serverAppVersion, setServerAppVersion] = useState("");

  function getScale(value) {
    return Math.round(Math.exp(Math.pow(value,1/goldScaleRatio)));
  }
  function getInverseScale(value) {
    return Math.round(Math.pow(Math.log(value),goldScaleRatio));
  }
  
  const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
  const IOSSlider = styled(Slider)(({ theme }) => ({
    color: '#007bff',
    height: 5,
    width: '100%',
    margin: '0 0 0 10px',
    padding: '23px 0 0 0',
    '& .MuiSlider-thumb': {
      height: 20,
      width: 20,
      backgroundColor: '#fff',
      boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
      '&:focus, &:hover, &.Mui-active': {
        boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: iOSBoxShadow,
        },
      },
      '&:before': {
        boxShadow:
          '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
      },
    },
    '& .MuiSlider-valueLabel': {
      fontSize: 12,
      fontWeight: 'normal',
      top: -6,
      backgroundColor: 'unset',
      color: theme.palette.text.primary,
      '&::before': {
        display: 'none',
      },
      '& *': {
        background: 'transparent',
        color: '#fff',
      },
    },
    '& .MuiSlider-track': {
      border: 'none',
      height: 5,
    },
    '& .MuiSlider-rail': {
      opacity: 0.5,
      boxShadow: 'inset 0px 0px 4px -2px #000',
      backgroundColor: '#d0d0d0',
    },
  }));

  const fetchRecentActivity = () => {
    fetch(serverBaseURL + deviceRecentActivityApi + "?" + "deviceId=" + deviceId)
      .then(response => {return response.text()})
      .then(data => {setRecentActivite(data)})
      .catch(error => console.error('Error fetching data from device recent activity Api :', error));
  }

  const fetchServerConfig = () => {
    fetch(serverBaseURL + serverConfigApi)
      .then(response => {return response.json()})
      .then(data => {
        setServerAppVersion(data.backendVersion)
        setoffsetDataFilter(data.dataFilter);
        setDefaultWindowSize(data.defaultTimeWindow)
        setWindowSizeValue(data.defaultTimeWindow)
        setOffsetTimeZone(data.defaultTimeZoneOffset)
        setDefaultOffsetTimeZone(data.defaultTimeZoneOffset)
      })
      .catch(error => console.error('Error fetching data from server config Api :', error));
  }

  const postOffsetFilterValueConfig = (value) => {
    const pathOffsetFilter = "/dataFilter/";
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(serverBaseURL + serverConfigApi + pathOffsetFilter + value, requestOptions)
      .catch(error => console.error('Error posting data to server dataFilter Api :', error));
    setoffsetDataFilter(value);
  }

  const postDefaultOffsetTimeZoneConfig = (value) => {
    const pathTimeZoneOffset = "/timeZoneOffset/";
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(serverBaseURL + serverConfigApi + pathTimeZoneOffset + value, requestOptions)
      .catch(error => console.error('Error posting data to server timeZoneOffset Api :', error));
      setDefaultOffsetTimeZone(value);
  }

  const postDefaultTimeWindowSizeValueConfig = (value) => {
    const pathDefaultTimeWindow = "/defaultTimeWindow/";
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(serverBaseURL + serverConfigApi + pathDefaultTimeWindow + value, requestOptions)
      .catch(error => console.error('Error posting data to server defaultTimeWindow Apis :', error));
    setDefaultWindowSize(value);
  }


  function isToday(strActivity){
    if(strActivity !== ""){
      const dateActivity = new Date(strActivity);
      const today = new Date();
      if(dateActivity.getFullYear() == today.getFullYear()
        && dateActivity.getMonth() == today.getMonth()
        && dateActivity.getDate() == today.getDate()) {

          return true;
      }
    }
    return false;
  }


  // Only run once
  useEffect(() => {
    fetchRecentActivity(),
    fetchServerConfig()
  }, [deviceId]);

  return (
    <div>
      <div className="card cardBox text-bg-dark">
        <h5 className="card-title text-center cardTitleMargin">Summary</h5>
        <p className="card-text summaryContentText"><b>Selected date : </b><small><i>{(targetDate != null && targetDate != "") ? targetDate : "---"}</i></small></p>
        <p className="card-text summaryContentText"><b>Selected device : </b><small><i>{(deviceId != null && deviceId != "") ? deviceId : "---"}</i></small></p>
        <p className="card-text summaryContentText"><b>Device activity : </b>
          <small>
            <i className={!isToday(recentActivite) ? recentActivite != "" ? "warning-text" : "" : "ok-text"}>
              {(recentActivite != "") ? isToday(recentActivite) ? "Active" : "Inactive -> last data " + recentActivite : "---"}
            </i>
          </small>
        </p>
        <p className="card-text summaryContentText"><b>User interface application version : </b><small><i>{getVersionEnv()}</i></small></p>
        <p className="card-text summaryContentText"><b>Server application version : </b><small><i>{serverAppVersion}</i></small></p>
      </div>
      <div className="card cardBox text-bg-dark">
      <p className="alignedTextRight additionalLabel">* default parameters relative to UI requires a page reload</p>
        <FormControlLabel disableTypography={true} className="serverControls cardTitleMargin" control={<Checkbox icon={<LockOpenOutlinedIcon color="success" />} checkedIcon={<LockIcon color="warning" />} onChange={(event, checked) => setControlsLocked(checked)} checked={controlsLocked} />} label="Default parameters *" />
        <div className="flexContainer sliderwrapper"><p className="card-text summaryContentText hackTextAndSlider"><b>Device input offset filter (ms) : </b></p><IOSSlider onChangeCommitted={(event, value) => postOffsetFilterValueConfig(value)}  min={5} max={300} defaultValue={offsetDataFilter} valueLabelDisplay="on" disabled={controlsLocked} /></div>
        <div className="flexContainer sliderwrapper"><p className="card-text summaryContentText hackTextAndSlider"><b>Default startup window size (min) : </b></p><IOSSlider scale={getScale} onChangeCommitted={(event, value) => postDefaultTimeWindowSizeValueConfig(getScale(value))}  min={1} max={1439} defaultValue={getInverseScale(defaultWindowSize)} valueLabelDisplay="on" disabled={controlsLocked} /></div>
        <div className="flexContainer sliderwrapper"><p className="card-text summaryContentText hackTextAndSlider"><b>Data time zone offset (hour) : </b></p><IOSSlider  min={-12} max={12} defaultValue={defaultOffsetTimeZone} onChangeCommitted={(event, value) => postDefaultOffsetTimeZoneConfig(value)} valueLabelDisplay="on" disabled={controlsLocked} /></div>
      </div>
    </div>
  );
};
