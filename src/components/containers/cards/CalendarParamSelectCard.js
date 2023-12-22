import './Card.css'
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import {dateTransform} from "../../../utilities/DateUtil";
import 'react-calendar/dist/Calendar.css';

export function CalendarParamSelectCard({setTargetDate}) {

  const [dateObj, setDateObj] = useState(new Date());
  
  function handleCalendarState(changedDate){
    setTargetDate(dateTransform(changedDate));
    setDateObj(changedDate);
  }

  
  return (
      <div className="card cardBox text-bg-dark text-center">
        <Calendar className="centerHoriz calandarMods" onChange={handleCalendarState} value={dateObj} />
      </div>
  );
};
