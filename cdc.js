/**
 * cdc.js : handles getting cdc noticeboard cookies 
 */

const Promise = require('promise');
const Axios = require('axios');
const SetCookie = require('set-cookie-parser');
const QueryString = require('query-string');

/**end points */
const MODULES_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getModules.htm';
const TRAINING_PLACEMENT_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/TPStudent.jsp";
const NOTICE_BOARD_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/Notice.jsp";
const ERP_MONITORING_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/ERPMonitoring.htm";
const SHOW_CONTENT_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/ShowContent.jsp";

const USER_AGENT = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0';

const erpSession = require('./session');


exports.initCDC = function(){

    /**STEP 1 getModules */
    return new Promise((resolve, reject) => {
        Axios({
            url : MODULES_URL, 
            method : 'POST',
            headers : {
                'Cookie' : erpSession.getCookieString(path='/IIT_ERP3'),
                'User-Agent' : USER_AGENT,
            },
            proxy : false,

        }).then((res) => {
            let modulesData = res.data;
            erpSession.saveModules(modulesData);
            resolve();

        }).catch((err) => {
            console.error('error in getModules');
            reject(err);
        })

    }).then(() => {

        /**STEP 2 : TPStudent.jsp */
        return new Promise((resolve, reject) => {
            Axios({
                url : TRAINING_PLACEMENT_URL,
                method : 'post',
                data : QueryString.stringify({
                    ssoToken : erpSession.getCookieSSOToken(),
                    module_id : '26',
                    menu_id : '11',
                }),
                headers : {
                    'Cookie' : erpSession.getCookieString(path='/TrainingPlacementSSO'),
                    'User-Agent' : USER_AGENT,
                },
                proxy : false,
    
            }).then((res) => {

                let _tps_cookies = SetCookie.parse(res);
                erpSession.saveCookies(_tps_cookies);
                // console.log(res.data);
                resolve();
    
            }).catch((err) => {
                console.error('error in getting TPStudent.jsp');
                reject(err);
            })

        })

        /** STEP3 : get ERPMonitoring  */
    }).then(() => {
        // 
        console.log(erpSession.cookies);
        return new Promise((resolve, reject) => {
            Axios({
                url : ERP_MONITORING_URL,
                method : 'GET',
                params : {
                    action : 'fetchData',
                    jqqueryid : '54',
                    _search : 'false',
                    nd : '158923827858',
                    rows : '20',
                    page : '1',
                    sidx : '',
                    sord : 'asc',
                    totalrows : '50',
                },
                headers : {
                    'Cookie' : erpSession.getCookieString(path='/TrainingPlacementSSO'),
                    'User-Agent' : USER_AGENT,
                },
                proxy : false, 
    
            }).then((res) => {
                console.log(res.config);
                console.log(res.data);
                resolve(res);

            }).catch((err) => {
                console.log('error in get ERPMonitoring');
                reject(err);
            })

        })

    }).catch((err) => {
        console.log(err);
        reject(err);
    })
}

/**
 * @Param {year} : 
 * @param {id} : the index of the message. 
 */
exports.getMessageContent = function(year, id){

    return new Promise((resolve, reject) => {
        Axios({
            url : SHOW_CONTENT_URL, 
            method : 'GET',
            params : {
                year : year,
                id : id,
            },
            headers :{
                'Cookie' : erpSession.getCookieString(path='/TrainingPlacementSSO'),
                'User-Agent' : USER_AGENT,
            },
            proxy : false,

        }).then((res) => {

            // console.log(res);
            let message = res.data;
            resolve(message);

        }).catch((err) => {

            console.log(err);
            reject(err);
        })
    })
}


