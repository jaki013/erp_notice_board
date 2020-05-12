/**
 * login.js :: handles authentication and login functionality of erp.
 */
const Promise = require('promise');
const Axios = require('axios');
const SetCookie = require('set-cookie-parser');
const QueryString = require('query-string');
const ReadLineSync = require('readline-sync');

const BASE_URL = 'https://erp.iitkgp.ac.in';
const HOME_URL = 'https://erp.iitkgp.ac.in/IIT_ERP3/';
const SECURITY_QUESTION_URL = 'https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm';
const AUTH_URL = 'https://erp.iitkgp.ac.in/SSOAdministration/auth.htm';
const SUCCESS_URL = 'https://erp.iitkgp.ac.in/SSOAdministration/success.htm';


const USER_AGENT = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0';

const erpSession = require('./session');

exports.loginERP = function(){

	return new Promise((resolve, reject) => {

		/**STEP 1: GET /IIT_ERP3 for dynamic_url */
		Axios({
			url : HOME_URL, 
			method : 'GET',
			maxRedirects : 0,
			validateStatus : (status) => (status >= 200 && status < 400),
			headers : {
				'User-Agent' : USER_AGENT,
			},
			proxy : false,

		}).then((res) => {

			//save cookies
			let  _jsessCookie_erp3 = SetCookie.parse(res);
			erpSession.saveCookies(_jsessCookie_erp3);
			// erp_cookies = erp_cookies.concat(_jsessCookie_erp3);
			
			let dynamic_url = res.headers.location;
			erpSession.saveDynamiURL(dynamic_url);

			resolve(dynamic_url);

		}).catch((err) => {

			console.error('error in STEP 1 : ** GET /IIT_ERP3 **');
			reject(err);
		})

	}).then((dynamic_url) => {

		/**STEP 2: redirect to dynamic_url */
		return new Promise((resolve, reject) => {
			Axios({
				url : dynamic_url,
				method : 'GET',
				maxRedirects : 0,
				validateStatus : (status) => (status >= 200 && status < 400),
				headers : {
					'User-Agent' : USER_AGENT,
				},
				proxy: false,
	
			}).then((res) => {
	
				//save cookies
				let _jsessCookie_sso = SetCookie.parse(res);
				erpSession.saveCookies(_jsessCookie_sso);
				// erp_cookies = erp_cookies.concat(_jsessCookie_sso);
	
				var user_id = ReadLineSync.question('roll_number?_'); //get roll number
				resolve(user_id);

			}).catch((err) => {

				console.error('error in STEP 2 : ** redirecting to dynamic url ** ');
				reject(err);
			})
		})
		
	}).then((user_id) => {

		/**STEP 3 : get security question and read password and answer */
		return new Promise((resolve, reject) => {
			Axios({
				url: SECURITY_QUESTION_URL,
				method: 'POST',
				data: QueryString.stringify({
					user_id: user_id,
				}),
				headers: {
					'Cookie': erpSession.getCookieString(path = '/SSOAdministration'),
					'User-Agent' : USER_AGENT,
				},
				proxy: false,
	
			}).then((res) => {
	
				let security_question = res.data;
				
				let password = ReadLineSync.question('password?_', { hideEchoBack: true }); //get password
				let answer = ReadLineSync.question(security_question + '?_', { hideEchoBack: true }); //get security question answer
				erpSession.saveCredentials([user_id, password, answer]);
				resolve([user_id, password, answer]);

			}).catch((err) => {

				console.error('error in STEP 3 : ** getting security question ** ');
				reject(err);
			})
		})

	}).then((credentials) => {

		let user_id = credentials[0];
		let password = credentials[1];
		let answer = credentials[2];

		/**STEP 4 : POST to /SSOAdministration/auth.htm */
		return new Promise((resolve, reject) => {
			Axios({
				url: AUTH_URL,
				method: 'POST',
				data: QueryString.stringify({
					user_id: user_id,
					password: password,
					answer: answer,
					sessionToken: QueryString.parseUrl(erpSession.dynamic_url).query.sessionToken,
					requestedUrl: QueryString.parseUrl(erpSession.dynamic_url).query.requestedUrl,
				}),
				headers: {
					'Cookie': erpSession.getCookieString(path = '/SSOAdministration'),
					'User-Agent' : USER_AGENT,
				},
				maxRedirects: 0,
				validateStatus: (status) => (status >= 200 && status < 400),
				proxy: false,
			
			}).then((res) => {
				resolve();

			}).catch((err) => {

				console.error('error in STEP 4 ** posting credentials to /SSOAdminstration/auth.htm ** ');
				reject(err);
			})
		})
					
	}).then(() => {

		/**STEP 5 : GET /SSOAdministration/success.htm */
		return new Promise((resolve, reject) => {
			Axios({
				url: SUCCESS_URL,
				method: 'GET',
				headers: {
					'Cookie': erpSession.getCookieString(path = '/SSOAdministration'),
					'Referer': erpSession.dynamic_url,
					'User-Agent': USER_AGENT,
				},
				maxRedirects: 0,
				validateStatus: (status) => (status >= 200 && status < 400),
				proxy: false,
	
			}).then((res) => {

				let _ssoTokenCookie = SetCookie.parse(res);
				erpSession.saveCookies(_ssoTokenCookie);
				// erp_cookies = erp_cookies.concat(_ssoTokenCookie);

				let dynamic_auth_url = res.headers.location;
				erpSession.saveDynamicAuthURL(dynamic_auth_url);
				resolve(dynamic_auth_url);

			}).catch((err) => {

				console.error('error in STEP 5 ** getting dynamic_auth _url ** ');
				reject(err);
			})
		})
		
	}).then((dynamic_auth_url) => {

		/**STEP 6 : redirect to dynamic auth url */
		return new Promise((resolve, reject) => {
			Axios({
				url: dynamic_auth_url,
				method: 'GET',
				headers: {
					'Cookie': erpSession.getCookieString(path = '/IIT_ERP3'),
					'User-Agent' : USER_AGENT,
				},
				maxRedirects: 0,
				proxy: false,
	
			}).then((res) => {
				// log_req_res(res);
	
				var _jsIDCookie = SetCookie.parse(res);
				erpSession.saveCookies(_jsIDCookie);
				resolve();

			}).catch((err) => {

				console.error('error in STEP 6 ** redirecting to dynamic_auth_url **');
				reject(err);
			})
		})	

	}).catch((err) => {
		console.error(err);
		reject(err);
	})
}
