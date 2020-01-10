const Axios = require('axios');

const ERP_HOME_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/';

// /**1. make a get call to the home url.*/
// Axios.get(ERP_HOME_URL)
//     .then((res) => {
//         console.log('status : ', res.status);
//         console.log('status text : ', res.statusText);
//         console.log('headers : ', res.headers);
//         console.log('config :', res.config);
//         // console.log();
//     })
//     .catch((err)=>{
//         console.log(err);
//     });

Axios({
    
    method : 'get',
    url : ERP_HOME_URL,
    headers : {
        'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        // 'Accept-Language' : 'en-US,en;q=0.5',
        // 'Accept-Encoding' : 'gzip, deflate, br',
        'Connection' : 'keep-alive',
        'Pragma' : 'no-cache',
        'Upgrade-Insecure-Requests' : '1',
        'User-Agent' : 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0',
    },

}).then((res) => {
    console.log('status : ', res.status);
    console.log('status text : ', res.statusText);
    console.log('headers : ', res.headers);
    console.log('config :', res.config);

}).catch((err) => {
    console.log('error');
    console.log(err);
});