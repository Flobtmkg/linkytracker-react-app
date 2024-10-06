
// Expected format : HH'h' mm'min' ss's' SSS'ms' '('yyyy-MM-dd')'
const DTODateFormatRegex = /^([0-9]{2})h\s([0-9]{2})min\s([0-9]{2})s\s([0-9]{3})ms\s\(([0-9]{4})-([0-9]{2})-([0-9]{2})\)$/;
const DTODateFormat = "HH'h' mm'min' ss's' SSS'ms' '('yyyy-MM-dd')'";
const classicalLocalDateFormatRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

// Milliseconds per min
const MIN_TO_MILLIS = 60000;

export class DateUtil {

    DateUtil(){

    }

    getDTODateFormat(){
        return DTODateFormat;
    }


    // Date format utility JS Date() to "yyyy-MM-dd" format
    dateTransform(changedDate){
        var dateString = changedDate.getFullYear() + "-" + ("0" + (changedDate.getMonth()+1)).slice(-2) + "-" + ("0" + changedDate.getDate()).slice(-2);
        return dateString;
    }

    // Date format utility JS Date() to "yyyy-MM-dd" format
    inverseDateTransform(dateStr){
        const regexResult1 = classicalLocalDateFormatRegex.exec(dateStr);
        const year = parseInt(regexResult1[1], 10);
        const month = parseInt(regexResult1[2], 10);
        const day = parseInt(regexResult1[3], 10);

        return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    // Minutes offset to midnight to epochMillis
    midnightMinOffsetAndJSDateToMillisTimestampTransform(minutesOffset, jsBaseDate){
        return jsBaseDate.getTime() + (minutesOffset * MIN_TO_MILLIS);
    }

    // Minutes offset to midnight to "HH'h' mm'min' format
    midnightMinOffsetAndJSDateToHourMinTransform(minutesOffset, jsBaseDate){
        var hours = Math.trunc(minutesOffset / 60);
        var minutes = minutesOffset - hours*60;
        var dateString = ("0" + hours).slice(-2) + "h " + ("0" + minutes).slice(-2) + "min ";
        return dateString;
    }

    // Transforms epochMillis to "HH'h' mm'min' ss's' SSS'ms' '('yyyy-MM-dd')'" format
    millisTimestampToFormatedDateTransform(milisTimestamp){
        const dateFromMilis = new Date(milisTimestamp);
        var strDate = this.dateTransform(dateFromMilis);
        var dateString = ("0" + dateFromMilis.getHours()).slice(-2) + "h " + ("0" + dateFromMilis.getMinutes()).slice(-2) + "min " + ("0" + dateFromMilis.getSeconds()).slice(-2) + "s " + ("00" + dateFromMilis.getMilliseconds()).slice(-3) + "ms" + " (" + strDate + ")";
        return dateString;
    }

    // Diff of Minutes offset to midnight
    minutesTimeDiffOfSameDayJSDate(jsBaseDate1, jsBaseDate2){

        if(jsBaseDate2 == undefined || jsBaseDate2 == null){
            jsBaseDate2 = new Date();
            jsBaseDate2.setHours(0);
            jsBaseDate2.setMinutes(0);
        }
        const minutes1 = jsBaseDate1.getHours() * 60 + jsBaseDate1.getMinutes();
        const minutes2 = jsBaseDate2.getHours() * 60 + jsBaseDate2.getMinutes();

        if(minutes2 > minutes1){
            return minutes2 - minutes1;
        }
        return minutes1 - minutes2;
    }
}

