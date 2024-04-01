import { DeviceParamSelectCard } from '../cards/DeviceParamSelectCard';
import { MainInfoCard } from '../cards/MainInfoCard';
import { CalendarParamSelectCard } from '../cards/CalendarParamSelectCard';
import { LineGraphContainer } from '../graphContainers/LineGraphContainer';
import {dateTransform} from "../../../utilities/DateUtil";
import {getBackendAddress} from "../../../utilities/EnvUtil";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Container.css'


export default function MainGraphGroup() {

    const [targetDate, setTargetDate] = useState(dateTransform(new Date()));
    const [serverBaseURL, setserverBaseURL] = useState(getBackendAddress());
    const [api, setApi] = useState("/api/v1/datapoints/date");
    const [deviceId, setDeviceId] = useState("");

    const [displayMenu, setdisplayMenu] = useState(true);
  
    function handleClickDisplayMenu(){
        setdisplayMenu(!displayMenu);
    }
    
    return (
        <div>
            <div className="buttonRoundContainer" title="Menu" onClick={handleClickDisplayMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="RGBA(255,255,255,0.75)" className="centerLogoImage bi bi-menu-app" viewBox="0 0 16 16">
                    <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h2A1.5 1.5 0 0 1 5 1.5v2A1.5 1.5 0 0 1 3.5 5h-2A1.5 1.5 0 0 1 0 3.5zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/>
                </svg>
                <h5 className="fw-light text-white textMenu">Menu</h5>
            </div>
            <div className={displayMenu ? 'container bigBlock card show' : 'container bigBlock card hide'}>
                <div className="row">
                    <div className="col">
                        <DeviceParamSelectCard serverBaseURL={serverBaseURL} setDeviceId={setDeviceId} />
                        <MainInfoCard serverBaseURL={serverBaseURL} deviceId={deviceId} targetDate={targetDate} />
                    </div>
                    <div className="col">
                        <CalendarParamSelectCard setTargetDate={setTargetDate} />
                    </div>
                </div>
            </div>
            <LineGraphContainer serverBaseURL={serverBaseURL} api={api} deviceId={deviceId} targetDate={targetDate} isMenuDisplayed={displayMenu}/>
        </div>
    );
};
