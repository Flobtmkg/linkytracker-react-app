
import { ResponsiveLine } from '@nivo/line'
import React, { useState, useEffect } from 'react';
import './LineGraphContainer.css'

// graph data Map storage
let dataGraphMapCache = new Map();

// event source definiton
let eventSource = new EventSource("");

// Custom graph toolTip
const CustomTooltip = ({point}) => {
    const isFirstHalf = point.index < (dataGraphMapCache.size / 2);
    return (
        <div style = {{
           position: 'absolute!important',
           left: isFirstHalf ? 150 : -150}} className='toolTipBox card cardBox text-bg-dark' >
            <div><b>{point.serieId} : </b>{point.data.y}</div>
            <div><b>Time : </b>{point.data.x}</div>
        </div>
      );
  };

export function LineGraphContainer({ serverBaseURL, api, deviceId, targetDate }) {

    // Hook definiton a call to setDataGraph trigger the re-render
    // dataGraph is an array of graph series
    const [dataGraph, setDataGraph] = useState([]);
    
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
                populateGraph();
            }
        }
    }


    // Change the DataGraph state with dataGraphMapCache values
    function emptyCacheData(){
        dataGraphMapCache = new Map();
        dataGraphMapCache.set(null, {x : null, y : 0});
    }


    // Change the DataGraph state with dataGraphMapCache values
    function populateGraph(){
        // create expected object for the ResponsiveLine graph
        const tmpSerieObjectGraph = {
            id : "Average electricity usage KW/h/m",
            color : "hsl(208, 70%, 50%)",
            data : Array.from(dataGraphMapCache.values())
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
            <ResponsiveLine
                data={dataGraph}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
                    legend: 'Kilowatt-hour / min',
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
                tooltip={CustomTooltip}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'row',
                        justify: false,
                        translateX: 20,
                        translateY: 36,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 200,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
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
        </div>
    )
}