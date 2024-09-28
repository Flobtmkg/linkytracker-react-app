
import { ResponsiveLine } from '@nivo/line'
import React, { useState, useEffect } from 'react';
import {DateUtil} from "../../../utilities/DateUtil.js";
import { parse, subMinutes, isAfter, addMinutes } from "date-fns";
import './LineGraphContainer.css'
import { isBefore } from 'date-fns/isBefore';


const dateUtil = new DateUtil();

// Watt to hour kwh projection
const HOUR_PROJ = 1000;
// Watt to day kwh projection
const DAY_PROJ = 41.666666;
// Watt to year kwh projection
const YEAR_PROJ = 8.76;

// number format relative to locale
const nbrFormat = new Intl.NumberFormat();

// If we show the last reading text
let showLastReadings = false;

let lastValue = {
    wattage : 0,
    time : " -"
};

// Current window electricity usage
let windowElecUsage = 0;

// graph data Map storage
// map structure : {data.x, {data.x, data.y}}}
let dataGraphMapCache = new Map();

// event source definiton
let eventSource = new EventSource("");

// Custom graph toolTip
const customTooltip = ({point}) => {
    const isFirstHalf = point.index < (dataGraphMapCache.size / 2);
    return (
        <div style = {{
           position: 'absolute!important',
           left: isFirstHalf ? 150 : -150}} className='toolTipBox card cardBoxOpacity0 text-bg-dark' >
            <div><b>Average power : </b>{nbrFormat.format((point.data.y).toFixed(2))} Watt</div>
            <div><b>Time : </b>{point.data.x == ("" || null || undefined) ? " -" : point.data.x}</div>
            <div className="smallText">
                <p></p>
                <div><b>Hour usage projection : </b>{nbrFormat.format((point.data.y/HOUR_PROJ).toFixed(3))} kwh</div>
                <div><b>Day usage projection : </b>{nbrFormat.format((point.data.y/DAY_PROJ).toFixed(3))} kwh</div>
                <div><b>year usage projection : </b>{nbrFormat.format((point.data.y*YEAR_PROJ).toFixed(3))} kwh</div>
            </div>
        </div>
    );
};


export function LineGraphContainer({ serverBaseURL, api, deviceId, targetDate, windowLocked, startTimeWindowValue, isMenuDisplayed, windowSizeValue}) {

    // A call to setDataGraph trigger the re-render
    // dataGraph is an array of graph series
    const [dataGraph, setDataGraph] = useState([]);

    const [dataRecieved, setDataRecieved] = useState([0]);

    const [arrayWindowLimit, setArrayWindowLimit] = useState(["",""]);
    
    // useEffect hook on path elements, if it changes we empty the dataGraphMapCache and create a new eventSource whith the new API target
    useEffect(() => {
        const path = serverBaseURL + api;
        let params = "?";
        if(deviceId != null && deviceId != ""){
            params = params + "deviceId=" + deviceId + "&"
        }
        if(targetDate != null && targetDate != ""){
            params = params + "date=" + targetDate
        }
        eventSource.close();
        emptyCacheData();
        populateGraph();
        eventSourceConfig(path + params);
    }, [serverBaseURL, api, deviceId, targetDate]);

    useEffect(() => {
        populateGraph();
    }, [windowLocked, startTimeWindowValue, windowSizeValue]);

    // We cannot call populateGraph() from eventsource context because the states are not up to date
    // We need to update the graph throw a hook, so it gets all the state right when React managed the hook queue.
    // So the eventsource onMessage changes the "dataRecieved" state and this useEffect gets triggered and call populateGraph().
    useEffect(() => {
        populateGraph();
    }, [dataRecieved]);

    // Show last readings when menu is not displayed
    showLastReadings = !isMenuDisplayed;

    // Configure a fresh new eventSource with new API path target
    function eventSourceConfig(fullPath){
        eventSource = new EventSource(fullPath);
        eventSource.onerror = (event) => console.log('error', event);
        // When SSE data is recieved...
        eventSource.onmessage = (event) => {
            const dataPointMessageObject = JSON.parse(event.data);
            // Add to the Map of datas if necessary
            if(!dataGraphMapCache.has(dataPointMessageObject.x)){
                dataGraphMapCache.set(dataPointMessageObject.x, dataPointMessageObject);
                setDataRecieved(Math.random());
            }
        }
    }


    // Change the DataGraph state with dataGraphMapCache values
    function emptyCacheData(){
        dataGraphMapCache = new Map();
        dataGraphMapCache.set(null, {x : null, y : 0});
    }


    // filter cache data to display the target time window
    function filterDataToDisplay(){

        const dataArray = Array.from(dataGraphMapCache.values());
        let displayArray = [];
        displayArray[0] = {x:null,y:0};

        const selectedDate = dateUtil.inverseDateTransform(targetDate);
        // There is always at least one value of {x:null,y:0}
        if(dataArray.length > 1){
            if(windowLocked){
                let timeReached = false;
                let indexReached = 0;

                // As it is sorted by chronological order if we reach the condition all other elements are ok
                const startOfWindowDate = subMinutes(parse(dataArray[dataArray.length - 1].x, dateUtil.getDTODateFormat(), selectedDate), windowSizeValue);
                for ( let i=0 ; timeReached==false && i < dataArray.length ; i++){
                    if(null != dataArray[i].x){
                        const arrayCurrentDate = parse(dataArray[i].x, dateUtil.getDTODateFormat(), selectedDate);
                        if(isAfter(arrayCurrentDate, startOfWindowDate)){
                            // last values regarding window time
                            timeReached = true;
                            indexReached = i;
                        }
                    }   
                }
                // Return elements from the array
                displayArray = dataArray.filter((value, index, array) => {return index >= indexReached});
                
            } else {

                // If a time window is provided
                // As it is sorted by chronological order if we reach the condition all other elements are ok
                const dateMinutesToMidnightStartWindow = dateUtil.midnightMinOffsetAndJSDateToCustomDatetimeTransform(startTimeWindowValue, selectedDate);
                const startOfWindowDate = parse(dateMinutesToMidnightStartWindow, dateUtil.getDTODateFormat(), selectedDate);
                const endOfWindowDate = addMinutes(parse(dateMinutesToMidnightStartWindow, dateUtil.getDTODateFormat(), selectedDate), windowSizeValue);
                // Return elements from the array
                displayArray = dataArray.filter((value, index, array) => {
                    if(null == value.x){
                        return false;
                    }
                    const arrayCurrentDate = parse(value.x, dateUtil.getDTODateFormat(), selectedDate);
                    return isAfter(arrayCurrentDate, startOfWindowDate) && isBefore(arrayCurrentDate, endOfWindowDate);
                });
            }
        }

        // calculate current window electricity usage in kwh and store time start / time end of the data window to display
        if(displayArray.length == 0 || (displayArray.length == 1 && displayArray[0].x == null)){
            windowElecUsage = 0;
            setArrayWindowLimit(["",""])
        } else {
            windowElecUsage = displayArray.length/1000;
            setArrayWindowLimit([null == displayArray[0].x ? displayArray[1].x : displayArray[0].x, displayArray[displayArray.length - 1].x]);
        }
        
        // Add the {null,0} point if necessary to normalize the graph
        if(undefined == displayArray[0] || null != displayArray[0].x){
            displayArray.unshift({x:null,y:0});
        }
        return displayArray;
    }

    

    // Change the DataGraph state with dataGraphMapCache values
    function populateGraph(){
        // Storing last value
        const cachedlastTime = Array.from(dataGraphMapCache.values()).at(dataGraphMapCache.size - 1).x;
        lastValue = {
            wattage : nbrFormat.format((Array.from(dataGraphMapCache.values()).at(dataGraphMapCache.size - 1).y).toFixed(2)),
            time : cachedlastTime == ("" || null || undefined) ? " -" : cachedlastTime
        };

        // create expected object for the ResponsiveLine graph
        const tmpSerieObjectGraph = {
            id : "device : " + deviceId,
            data : filterDataToDisplay(),
            color : "hsl(208, 70%, 50%)"
        }

        // Applying tmpSerieObjectGraph as an array with one value because we only manage one curve by now
        setDataGraph([tmpSerieObjectGraph]);
    }


    // make sure parent container have a defined height when using
    // responsive component, otherwise height will be 0 and
    // no chart will be rendered.
    // website examples showcase many properties,
    // you'll often use just a few of them.
    
    return (
        <div className="lineGraphBox">
            <div  className={showLastReadings == true ? "show" : "hide"} >
                <h6 className="lastReadingsText lastReadingsTextAdjustment text-white">Total electricity usage for the current window : <b>{nbrFormat.format((windowElecUsage).toFixed(4))} kwh</b></h6>
                <h6 className="lastReadingsText text-white">Last average wattage reading at the selected date : <b>{lastValue.wattage} W</b></h6>
                <p className="lastReadingsText text-white"><i>{lastValue.time}</i></p>
            </div>
            <ResponsiveLine
                data={dataGraph}
                margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
                colors={{ scheme: 'nivo' }}
                curve='stepBefore'
                enableArea={true}
                areaOpacity={0.05}
                xScale={{ 
                    type: 'point'
                }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 50,
                    tickRotation: -90,
                    legend: 'Chronological order',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Watts',
                    legendOffset: -45,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableGridX={false}
                useMesh={true}
                enableSlices={false}
                tooltip={customTooltip}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'row',
                        justify: false,
                        translateX: -230,
                        translateY: 45,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 200,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, 0.5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
            <div className="graphTimeFooterContainer">
                <p className="leftFooter">{arrayWindowLimit[0]}</p>
                <p className="rightFooter">{arrayWindowLimit[1]}</p>
            </div>
            
        </div>
    )
}