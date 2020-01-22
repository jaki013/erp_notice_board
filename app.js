/**
 * app.js : front page of erp.
 */

const http = require('http');
const https = require('https');
const Promise = require('promise');
const Axios = require('axios');
const SetCookie = require('set-cookie-parser');
const QueryString = require('query-string');
const ReadLineSync = require('readline-sync');

const Login = require('./login');

/**end points */
const PENDING_JOBS_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getPendingJobCount.htm';
const MODULES_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getModules.htm';
const UNREAD_MESSAGE_COUNT_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getUnreadMailCount.htm';
const MESSAGES_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/getMessages.htm';
const TRAINING_PLACEMENT_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/TPStudent.jsp";
const NOTICE_BOARD_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/Notice.jsp";
const ERP_MONITORING_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/ERPMonitoring.htm?action=fetchData&jqqueryid=54";
const SHOW_CONTENT_URL = "https://erp.iitkgp.ac.in/TrainingPlacementSSO/ShowContent.jsp";

/**_cookies should be an array */
function getCookieString(cookies, path = '/IIT_ERP3') {

	var cookie_str = '';

	//extract path cookies.
	var path_cookies = [];
	for (var i = 0; i < cookies.length; i++) {
		if (cookies[i]['path'] === '/' || cookies[i]['path'] === path) {
			path_cookies.push(cookies[i]);
		}
	}

	if (path_cookies.length < 1) return cookie_str;

	//prepare cookie string.
	for (var i = 0; i < path_cookies.length; i++) {
		cookie_str += path_cookies[i]['name'] + '=' + path_cookies[i]['value'];
		if (i != path_cookies.length - 1) {
			cookie_str += ';';
		}
	}

	return cookie_str;
}

/**1. a routine to get number of unread mails. */
function getUnreadMailCount(erp_cookies){

    return new Promise((resolve, reject) => {
        Axios({
            url : UNREAD_MESSAGE_COUNT_URL,
            method : 'POST',
            headers : {
                'Cookie' : getCookieString(erp_cookies, path='/IIT_ERP3'),
            },
            proxy : false,

        }).then((res) => {
            // log_req_res(res);
            console.log('#Unread Mail Count : ', res.data);
        }).catch((err) => {
            console.error(err);
        })
    })
}

/**2. a routine to get modules */
function getModules(erp_cookies){

    return new Promise((resolve, reject) => {
        Axios({
            url : MODULES_URL, 
            method : 'POST',
            headers : {
                'Cookie' : getCookieString(erp_cookies, path='/IIT_ERP3'),
            },
            proxy : false,

        }).then((res) => {
            console.log(res.data);

        }).catch((err) => {
            console.log(err);
        })

    })
}

/**3. routine to post on /TrainingPlacementSSO */
function TPStudent(erp_cookies){
    return new Promise((resolve, reject) => {
        Axios({
            url : TRAINING_PLACEMENT_URL,
            method : 'post',
            headers : {
                'Cookie' : getCookieString(erp_cookies, path='/TrainingPlacementSSO')
            },
            proxy : false,

        }).then((res) => {
            resolve(res);

        }).catch((err) => {
            reject(err);
        })
    })
}

function NoticeBoard(erp_cookies){
    return new Promise((resolve, reject) => {
        Axios({
            url : NOTICE_BOARD_URL,
            method : 'get',
            headers : {
                'Cookie' : getCookieString(erp_cookies, path='/TrainingPlacementSSO')
            },
            proxy : false,

        }).then((res) => {
            resolve(res);

        }).catch((err) => {
            reject(err);
        })
    })
}

function ERPMonitoring(erp_cookies){
    return new Promise((resolve, reject) => {
        Axios({
            url : ERP_MONITORING_URL,
            method : 'get',
            headers : {
                'Cookie' : getCookieString(erp_cookies, path='/TrainingPlacementSSO')
            },
            proxy : false, 

        }).then((res) => {
            resolve(res);

        }).catch((err) => {
            reject(err);
        })
    })
}

function Show_Content(erp_cookies, year, id){
    return new Promise((resolve, reject) => {
        Axios({
            // url : SHOW_CONTENT_URL +'?' + 'year=' + year.toString() + '&' + 'id=' + id.toString(),
            url : SHOW_CONTENT_URL, 
            method : 'get',
            params : {
                year : year,
                id : id,
            },
            headers :{
                'Cookie' : getCookieString(erp_cookies, path='/TrainingPlacementSSO'),
            },
            proxy : false,

        }).then((res) => {
            console.log(res);
            resolve(res);

        }).catch((err) => {
            reject(err);
        })
    })
}
/**log request, response */
function log_req_res(res) {

	console.log('\n\n');
	console.log(res.request._header);
	console.log(res.status, res.statusText);
	console.log(res.headers);
	console.log('\n\n');
}

Login.login_erp()
    .then((erp_cookies) => {

        // console.log(erp_cookies);
        // getModules(erp_cookies);
        TPStudent(erp_cookies)
            .then((res) => {
                // var _jsessCookie_sso = SetCookie.parse(res);
                var tps_cookies = SetCookie.parse(res);
                // console.log(tps_cookies);
                erp_cookies = erp_cookies.concat(tps_cookies);
                
                
                // NoticeBoard(erp_cookies)
                //     .then((res)=> {
                //         console.log(res.data);


                //     })

                // ERPMonitoring(erp_cookies)
                //     .then((res) => {
                //         console.log(res.data);
                //     })
                
                Show_Content(erp_cookies, '2019-2020', 2065)
                    .then((res) => {
                        
                        console.log(res.data);

                    }).catch((err) => {
                        console.log(err);
                    })

            
            })
        
    })
    .catch((err) => {
        console.error(err);
    })