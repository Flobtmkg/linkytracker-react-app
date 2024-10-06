import './Card.css'
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import {DateUtil} from "../../../utilities/DateUtil.js";
import 'react-calendar/dist/Calendar.css';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import Switch from '@mui/material/Switch';

const dateUtil = new DateUtil();

const goldScaleRatio = 3.66518;

export function CalendarParamSelectCard({setTargetDate, windowLocked, setWindowLocked, startTimeWindowValue, setStartTimeWindowValue, windowSizeValue, setWindowSizeValue, linearMode, setLinearMode}) {

  const [dateObj, setDateObj] = useState(new Date());
  const [disabledSlider, setDisabledSlider] = useState(true);
  
  function handleCalendarState(changedDate){
    setTargetDate(dateUtil.dateTransform(changedDate));
    setDateObj(changedDate);
  }

  function handleSliderToolTipFormat(value, index){
    return dateUtil.midnightMinOffsetAndJSDateToHourMinTransform(value, dateObj);
  }

  function getScale(value) {
    return Math.round(Math.exp(Math.pow(value,1/goldScaleRatio)));
  }
  function getInverseScale(value) {
    return Math.round(Math.pow(Math.log(value),goldScaleRatio));
  }

  function handleLockedWindowCheck(value){
    setDisabledSlider(value)
    setWindowLocked(value);
  }

  function handleLinearModeCheck(value){
    setLinearMode(value);
  }

  const IOSSwitch = styled((props) => (<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#65C466',
          opacity: 1,
          border: 0,
          ...theme.applyStyles('dark', {
            backgroundColor: '#2ECA45',
          }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
        ...theme.applyStyles('dark', {
          color: theme.palette.grey[600],
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
        ...theme.applyStyles('dark', {
          opacity: 0.3,
        }),
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
      ...theme.applyStyles('dark', {
        backgroundColor: '#39393D',
      }),
    },
  }));

  const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
  const IOSSlider = styled(Slider)(({ theme }) => ({
    color: '#007bff',
    height: 5,
    width: '100%',
    margin: '10px 0 0 0',
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
  

  return (
      <div>
        
        <div className="card cardBox text-bg-dark">
          <h5 className="card-title text-center cardTitleMargin">Date selection</h5>
          <Calendar className="centerHoriz calandarMods" onChange={handleCalendarState} value={dateObj} />
        </div>
        <div className="card cardBox text-bg-dark">
          <h5 className="card-title text-center cardTitleMargin">Current graph window options</h5>
          <div className="flexContainer">
            <p className="card-text summaryContentText hackTextAndSlider"><b>Display mode : </b></p>
            <FormControlLabel className="linearModeToggle lockedTimeWindowLabel" disableTypography={true} control={<IOSSwitch sx={{ m: 1 }} onChange={(event, checked) => handleLinearModeCheck(checked)} checked={linearMode} />} label={linearMode ? "Time linear" : "by points"}/>
          </div>
          <div className="flexContainer">
            <p className="card-text summaryContentText infoWindowSlide"><b>Window start time :</b></p>
            <FormControlLabel disableTypography={true} className="lockWindowAlignedRight lockedTimeWindowLabel" control={<Checkbox icon={<LockOpenOutlinedIcon color="success" />} checkedIcon={<LockIcon color="info" />} onChange={(event, checked) => handleLockedWindowCheck(checked)} checked={windowLocked} />} label="Lock time window to the last data of the selected date" />
          </div>
          <div className="sliderwrapper">
            <IOSSlider className="sliderStartTime" onChangeCommitted={(event, value) => setStartTimeWindowValue(value)} valueLabelFormat={handleSliderToolTipFormat} min={0} max={1439} defaultValue={startTimeWindowValue} valueLabelDisplay={disabledSlider ? "off" : "on"} disabled={disabledSlider} />
            <div className="flexContainer hourLabel">
              <p>00:00</p>
              <p className="alignedTextRight">23:59</p>
            </div>
          </div>
          <div className="flexContainer sliderwrapper">
            <p className="card-text summaryContentText hackTextAndSlider"><b>Window time size (min) : </b></p>
            <IOSSlider className="sliderAdjust" scale={getScale} onChangeCommitted={(event, value) => {setWindowSizeValue(getScale(value))}} min={1} max={1439} defaultValue={getInverseScale(windowSizeValue)} valueLabelDisplay="on" />
          </div>
        </div>
      </div>
  );
};
