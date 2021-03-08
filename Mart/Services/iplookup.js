var get_ip = require('ipware')().get_ip;
var geoip = require('geoip-lite');

module.exports = class IPLookUp{
    ipValidator = async(req,res,next)=>{
        try{
            var ip_info = get_ip(req);
            var geo = geoip.lookup(ip_info.clientIp);
        }catch(err){
            console.log(err)
        }
   
        next();
    }
}