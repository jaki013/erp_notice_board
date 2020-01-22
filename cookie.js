/**_cookies should be an array */
exports.getCookieString = function(cookies, path = '/IIT_ERP3') {

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