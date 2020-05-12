/**
 * app.js : front page of erp.
 */

const Promise = require('promise');
const Axios = require('axios');

/**end points */
const PENDING_JOBS_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getPendingJobCount.htm';
const MODULES_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getModules.htm';
const UNREAD_MESSAGE_COUNT_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getUnreadMailCount.htm';
const MESSAGES_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getMessages.htm';
const TRAINING_PLACEMENT_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/TPStudent.jsp";
const NOTICE_BOARD_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/Notice.jsp";
const ERP_MONITORING_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/ERPMonitoring.htm";
const SHOW_CONTENT_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/ShowContent.jsp";

const USER_AGENT = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0';

const Login = require('./login');
const CDC = require('./cdc');
const erpSession = require('./session');



async function getCDCMesaages(year){

    let id = 1;
    while(true){
        
        await setTimeout(() => {}, 1000);
        let message = await CDC.getMessageContent(year, id);
        console.log(`YEAR : ${year} ID : ${id}`);
        console.log(message);

        id++;
    }
}


Login.loginERP().then(() => {
    
    CDC.initCDC().then(() => {

        getCDCMesaages('2019-2020');
    })
})




















// function getCDCMessages(){
    
//     /**STEP 1 getModules */
//     return new Promise((resolve, reject) => {
//         Axios({
//             url : MODULES_URL, 
//             method : 'POST',
//             headers : {
//                 'Cookie' : erpSession.getCookieString(path='/IIT_ERP3'),
//                 'User-Agent' : USER_AGENT,
//             },
//             proxy : false,

//         }).then((res) => {
//             let modulesData = res.data;
//             erpSession.saveModules(modulesData);
//             resolve();

//         }).catch((err) => {
//             console.error('error in getModules');
//             reject(err);
//         })

//     }).then(() => {

//         /**STEP 2 : TPStudent.jsp */
//         return new Promise((resolve, reject) => {
//             Axios({
//                 url : TRAINING_PLACEMENT_URL,
//                 method : 'post',
//                 data : QueryString.stringify({
//                     ssoToken : erpSession.getCookieSSOToken(),
//                     module_id : '26',
//                     menu_id : '11',
//                 }),
//                 headers : {
//                     'Cookie' : erpSession.getCookieString(path='/TrainingPlacementSSO'),
//                     'User-Agent' : USER_AGENT,
//                 },
//                 proxy : false,
    
//             }).then((res) => {

//                 let _tps_cookies = SetCookie.parse(res);
//                 erpSession.saveCookies(_tps_cookies);
//                 // console.log(res.data);
//                 resolve();
    
//             }).catch((err) => {
//                 console.error('error in getting TPStudent.jsp');
//                 reject(err);
//             })

//         })

//         /** STEP3 : get ERPMonitoring  */
//     }).then(() => {
//         // 
//         console.log(erpSession.cookies);
//         return new Promise((resolve, reject) => {
//             Axios({
//                 url : ERP_MONITORING_URL,
//                 method : 'GET',
//                 params : {
//                     action : 'fetchData',
//                     jqqueryid : '54',
//                     _search : 'false',
//                     nd : '158923827858',
//                     rows : '20',
//                     page : '1',
//                     sidx : '',
//                     sord : 'asc',
//                     totalrows : '50',
//                 },
//                 headers : {
//                     'Cookie' : erpSession.getCookieString(path='/TrainingPlacementSSO'),
//                     'User-Agent' : USER_AGENT,
//                 },
//                 proxy : false, 
    
//             }).then((res) => {
//                 console.log(res.config);
//                 console.log(res.data);
//                 resolve(res);

//             }).catch((err) => {
//                 console.log('error in get ERPMonitoring');
//                 reject(err);
//             })

//         })

//     })
// }





























// Login.loginERP()
//     .then(() => {
//         /**STEP 1  getModules */
//         return new Promise((resolve, reject) => {
//             Axios({
//                 url : MODULES_URL, 
//                 method : 'POST',
//                 headers : {
//                     'Cookie' : erpSession.getCookieString(path='/IIT_ERP3'),
//                     'User-Agent' : USER_AGENT,
//                 },
//                 proxy : false,
    
//             }).then((res) => {
//                 resolve(res.data); //response is a JSON object
    
//             }).catch((err) => {
//                 console.error('error in getModules');
//                 reject(err);
//             })
//         })

//     })
// Login.login_erp()
//     .then((erp_cookies) => {

//         // console.log(erp_cookies);
//         // getModules(erp_cookies);
//         TPStudent(erp_cookies)
//             .then((res) => {
//                 // var _jsessCookie_sso = SetCookie.parse(res);
//                 var tps_cookies = SetCookie.parse(res);
//                 // console.log(tps_cookies);
//                 erp_cookies = erp_cookies.concat(tps_cookies);
                
                
//                 // NoticeBoard(erp_cookies)
//                 //     .then((res)=> {
//                 //         console.log(res.data);


//                 //     })

//                 ERPMonitoring(erp_cookies)
//                     .then((res) => {
//                         console.log(res.data);
//                     })
                
//                 // Show_Content(erp_cookies, '2019-2020', 2065)
//                 //     .then((res) => {
                        
//                 //         console.log(res.data);

//                 //     }).catch((err) => {
//                 //         console.log(err);
//                 //     })

            
//             })
        
//     })
//     .catch((err) => {
//         console.error(err);
//     })