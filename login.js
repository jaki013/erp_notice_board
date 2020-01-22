/*
	login.js :: handles authentication and login functionality.
*/

const http = require('http');
const https = require('https');
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

/**log request, response */
function log_req_res(res) {

	console.log('\n\n');
	console.log(res.request._header);
	``
	console.log(res.status, res.statusText);
	console.log(res.headers);
	console.log('\n\n');
}

var erp_cookies = [];

exports.login_erp = function () {

	return new Promise((resolve, reject) => {

		/**STEP 1 : request to home_url /IIT_ERP3 */
		Axios({
			url: HOME_URL,
			method: 'GET',
			maxRedirects: 0,
			validateStatus: function (status) {
				return status >= 200 && status < 400
			},
			proxy: false,

		}).then((res) => {

			var _jsessCookie_erp3 = SetCookie.parse(res);
			erp_cookies = erp_cookies.concat(_jsessCookie_erp3);
			// console.log(erp_cookies);

			var dynamic_url = res.headers.location;
			// console.log(dynamic_url);
			// var parsed = QueryString.parseUrl(dynamic_url);
			// console.log(parsed);

			/**STEP 2 : redirect to dynamic url */
			Axios({
				url: dynamic_url,
				method: 'GET',
				maxRedirects: 0,
				validateStatus: function (status) {
					return status >= 200 && status < 400
				},
				proxy: false,

			}).then((res) => {

				// log_req_res(res);
				var _jsessCookie_sso = SetCookie.parse(res);
				erp_cookies = erp_cookies.concat(_jsessCookie_sso);
				// console.log(erp_cookies);

				//get user_id i.e roll number.
				var user_id = ReadLineSync.question('roll_number?_');

				/**STEP 3 : POST to /SSOAdministration/getSecurityQues.htm */
				Axios({
					url: SECURITY_QUESTION_URL,
					method: 'POST',
					data: QueryString.stringify({
						user_id: user_id,
					}),
					headers: {
						'Cookie': getCookieString(erp_cookies, path = '/SSOAdministration'),
					},
					proxy: false,

				}).then((res) => {

					// log_req_res(res);

					var security_question = res.data;
					// console.log(security_question);

					var password = ReadLineSync.question('password?_', {
						hideEchoBack: true
					});
					var answer = ReadLineSync.question(security_question + '?_', {
						hideEchoBack: true
					});




					/**STEP 4 : POST to /SSOAdministration/auth.htm */
					Axios({
						url: AUTH_URL,
						method: 'POST',
						data: QueryString.stringify({
							user_id: user_id,
							password: password,
							answer: answer,
							sessionToken: QueryString.parseUrl(dynamic_url).query.sessionToken,
							requestedUrl: QueryString.parseUrl(dynamic_url).query.requestedUrl,
						}),
						headers: {
							'Cookie': getCookieString(erp_cookies, path = '/SSOAdministration'),
						},
						maxRedirects: 0,
						validateStatus: function (status) {
							return status >= 200 && status < 400
						},
						proxy: false,

					}).then((res) => {

						// log_req_res(res);

						/**STEP 5 : GET /SSOAdministration/success.htm */
						Axios({
							url: SUCCESS_URL,
							method: 'GET',
							headers: {
								'Cookie': getCookieString(erp_cookies, path = '/SSOAdministration'),
								'Referer': dynamic_url,
								'User-Agent': USER_AGENT,
							},
							maxRedirects: 0,
							validateStatus: function (status) {
								return status >= 200 && status < 400
							},
							proxy: false,

						}).then((res) => {

							// log_req_res(res);
							var _ssoTokenCookie = SetCookie.parse(res);
							erp_cookies = erp_cookies.concat(_ssoTokenCookie);

							var dynamic_auth_url = res.headers.location;

							/**STEP 6 : redirect to dynamic auth url */
							Axios({
								url: dynamic_auth_url,
								method: 'GET',
								headers: {
									'Cookie': getCookieString(erp_cookies, path = '/IIT_ERP3'),
								},
								maxRedirects: 0,
								proxy: false,

							}).then((res) => {
								// log_req_res(res);

								var _jsIDCookie = SetCookie.parse(res);
								erp_cookies = erp_cookies.concat(_jsIDCookie);

								resolve(erp_cookies);

							}).catch((err) => {
								console.error(err);
							})

						}).catch((err) => {
							console.error(err);
						})

					}).catch((err) => {
						console.error(err);
					})

				}).catch((err) => {
					console.error(err);
				})

			}).catch((err) => {
				console.error(err);
			})

		}).catch((err) => {
			console.error(err);
		})

	});
}