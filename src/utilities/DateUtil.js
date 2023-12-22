
// Date format utility JS Date() to "yyyy-MM-dd" format
export function dateTransform(changedDate){
    var dateString = changedDate.getFullYear() + "-" + ("0" + (changedDate.getMonth()+1)).slice(-2) + "-" + ("0" + changedDate.getDate()).slice(-2);
    return dateString;
}