
/**save cookies and urls */
class Session{

	constructor(){
		// super();
		this.cookies = [];
		this.dynamic_url = '';
		this.dynamic_auth_url = '';
		this.credentials = [];

		this.modules = {}; //returned after getModules
	}

	saveModules(modules){
		this.modules = modules;
	}

	getCDCModules(){
		let cdcModule = this.modules.find((elem) => (elem['module_short_desc'] === 'CDC'));
		return cdcModule;
	}

	saveCookies(cookie){
		this.cookies = this.cookies.concat(cookie);
	}

	saveDynamiURL(dynamic_url){
		this.dynamic_url = dynamic_url;
	}

	saveDynamicAuthURL(dynamic_auth_url){
		this.dynamic_auth_url = dynamic_auth_url;
	}

	saveCredentials(credentials){
		this.credentials = credentials;
	}
	
	getCookieSSOToken(){
		let ssoTokenCookie = this.cookies.find((cookie) => cookie.name === 'ssoToken');
		return ssoTokenCookie ? ssoTokenCookie.value : '';
	}

	getCookieString(path = '/IIT_ERP3'){
		
		let cookie_str = '';
		//extract path cookies.
		let path_cookies = [];
		for (let i = 0; i < this.cookies.length; i++) {
			if (this.cookies[i]['path'] === '/' || this.cookies[i]['path'] === path) {
				path_cookies.push(this.cookies[i]);
			}
		}

		if (path_cookies.length < 1) return cookie_str;

		//prepare cookie string.
		for (let i = 0; i < path_cookies.length; i++) {
			cookie_str += path_cookies[i]['name'] + '=' + path_cookies[i]['value'];
			if (i != path_cookies.length - 1) {
				cookie_str += ';';
			}
		}
		// console.log('cookie_str : ', cookie_str);
		return cookie_str;
	}
}

let erpSession = new Session();

module.exports =  erpSession;


// /**_cookies should be an array */
// function getCookieString(cookies, path = '/IIT_ERP3') {

// 	var cookie_str = '';

// 	//extract path cookies.
// 	var path_cookies = [];
// 	for (var i = 0; i < cookies.length; i++) {
// 		if (cookies[i]['path'] === '/' || cookies[i]['path'] === path) {
// 			path_cookies.push(cookies[i]);
// 		}
// 	}

// 	if (path_cookies.length < 1) return cookie_str;

// 	//prepare cookie string.
// 	for (var i = 0; i < path_cookies.length; i++) {
// 		cookie_str += path_cookies[i]['name'] + '=' + path_cookies[i]['value'];
// 		if (i != path_cookies.length - 1) {
// 			cookie_str += ';';
// 		}
// 	}

// 	return cookie_str;
// }