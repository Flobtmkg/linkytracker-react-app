import { DeviceParamSelectCard } from '../cards/DeviceParamSelectCard';
import { MainInfoCard } from '../cards/MainInfoCard';
import { CalendarParamSelectCard } from '../cards/CalendarParamSelectCard';
import { LineGraphContainer } from '../graphContainers/LineGraphContainer';
import {DateUtil} from "../../../utilities/DateUtil.js";
import {getBackendAddress} from "../../../utilities/EnvUtil";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Container.css'

const dateUtil = new DateUtil();

export default function MainGraphGroup() {

    const [targetDate, setTargetDate] = useState(dateUtil.dateTransform(new Date()));
    const [serverBaseURL, setserverBaseURL] = useState(getBackendAddress());
    const [api, setApi] = useState("/api/v1/datapoints/date");
    const [deviceId, setDeviceId] = useState("");

    const [displayMenu, setdisplayMenu] = useState(true);

    const [windowLocked, setWindowLocked] = useState(true);
    const [startTimeWindowValue, setStartTimeWindowValue] = useState(getCurentTimeForDefaultValue());
    const [windowSizeValue, setWindowSizeValue] = useState(15);
    const [linearMode, setLinearMode] = useState(true);
    const [offsetTimeZone, setOffsetTimeZone] = useState(0);
  
    function handleClickDisplayMenu(){
        setdisplayMenu(!displayMenu);
    }
    function getCurentTimeForDefaultValue(){
        return dateUtil.minutesTimeDiffOfSameDayJSDate(new Date());
    }
    
    return (
        <div>
            <div className="buttonRoundContainer buttonPointer" onClick={handleClickDisplayMenu} title="Menu">
                <svg onClick={handleClickDisplayMenu} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="RGBA(255,255,255,0.75)" className="centerLogoImage bi bi-menu-app buttonPointer" viewBox="0 0 16 16">
                    <path className="buttonPointer" onClick={handleClickDisplayMenu} d="M0 1.5A1.5 1.5 0 0 1 1.5 0h2A1.5 1.5 0 0 1 5 1.5v2A1.5 1.5 0 0 1 3.5 5h-2A1.5 1.5 0 0 1 0 3.5zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/>
                </svg>
                <h5 className="fw-light text-white textMenu">Menu</h5>
            </div>
            <div className={displayMenu ? 'container bigBlock card show' : 'container bigBlock card hide'}>
                <div className="row">
                    <div className="col">
                        <DeviceParamSelectCard
                            serverBaseURL={serverBaseURL}
                            setDeviceId={setDeviceId} />
                        <MainInfoCard 
                            serverBaseURL={serverBaseURL}
                            deviceId={deviceId}
                            targetDate={targetDate}
                            setWindowSizeValue={setWindowSizeValue}
                            setOffsetTimeZone={setOffsetTimeZone} />
                    </div>
                    <div className="col">
                        <CalendarParamSelectCard 
                            setTargetDate={setTargetDate}
                            windowLocked={windowLocked}
                            setWindowLocked={setWindowLocked}
                            startTimeWindowValue={startTimeWindowValue}
                            setStartTimeWindowValue={setStartTimeWindowValue}
                            windowSizeValue={windowSizeValue}
                            setWindowSizeValue={setWindowSizeValue}
                            linearMode={linearMode}
                            setLinearMode={setLinearMode} />
                    </div>
                </div>
            </div>
            <LineGraphContainer
                serverBaseURL={serverBaseURL}
                api={api}
                deviceId={deviceId}
                targetDate={targetDate}
                windowLocked={windowLocked}
                startTimeWindowValue={startTimeWindowValue}
                isMenuDisplayed={displayMenu}
                windowSizeValue={windowSizeValue}
                linearMode={linearMode}
                offsetTimeZone={offsetTimeZone} />
        </div>
    );
};
