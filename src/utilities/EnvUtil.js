const ENV = process.env.NODE_ENV;
const VERSION = process.env.APP_MANIFEST.version

const ENV_DEV="development";

const DEV_SERVER_HOST="localhost";
const DEV_SERVER_PROTOCOLE="http";
const DEV_SERVER_PORT="8080";

var isInfoPrinted = false;


export function getVersionEnv(){
    return VERSION;
}


export function getHostEnv(){
    if(ENV == ENV_DEV){
       return DEV_SERVER_HOST;
    }
    return window.location.hostname;
}


export function getProtocoleEnv(){
    if(ENV == ENV_DEV){
        return DEV_SERVER_PROTOCOLE;
    }
    return window.location.protocol.slice(0,-1);
}

export function getPortEnv(){
    if(ENV == ENV_DEV){
        return DEV_SERVER_PORT;
    }
    return window.location.port;
}

export function getBackendAddress(){
    var address = getProtocoleEnv() + "://" + getHostEnv();
    if(getPortEnv() !== ""){
        address = address + ":" + getPortEnv();
    }
    if(!isInfoPrinted){
        console.log("frontend version : " + VERSION);
        console.log("backend address resolved at : " + address);
        isInfoPrinted=true;
    }
    return address;
}