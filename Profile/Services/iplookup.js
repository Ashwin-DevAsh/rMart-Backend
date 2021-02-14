var get_ip = require('ipware')().get_ip;
var geoip = require('geoip-lite');

module.exports = class IPLookUp{
    ipValidator = async(req,res,next)=>{
        try{
            var ip_info = get_ip(req);
            console.log("Client ip = "+ip_info.clientIp);
            var geo = geoip.lookup(ip_info.clientIp);
            console.log("Geo Info = ",geo)
        }catch(err){
            console.log(err)
        }
   
        next();
    }
}