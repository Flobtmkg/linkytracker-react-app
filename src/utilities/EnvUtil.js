export function getHostEnv(){
    if(typeof LINKY_SERVER_HOST !== 'undefined'){
        var host=LINKY_SERVER_HOST;
        if(host!=null && host!=""){
            return host;
        }
    }
    return "localhost";
}


export function getProtocoleEnv(){
    if(typeof LINKY_SERVER_PROTOCOLE !== 'undefined'){
        var protocole=LINKY_SERVER_PROTOCOLE;
        if(protocole==="https"){
            return "https";
        }
    }
    return "http";
}

export function getPortEnv(){
    if(typeof LINKY_SERVER_PORT !== 'undefined'){
        var port=LINKY_SERVER_PORT;
        if(port!=null && port!=""){
            return Number.parseInt(port).toString() !== "NaN" ? Number.parseInt(port).toString() : "8080";
        }
    }
    return "8080";
}

export function getBackendAddress(){
    var address = getProtocoleEnv() + "://" + getHostEnv() + ":" + getPortEnv();
    console.log("backend address resolved at : " + address);
    return address;
}