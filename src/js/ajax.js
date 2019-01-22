const ajax=function ajax(url, method='GET', data=null, callback) {
	const xhr=new XMLHttpRequest();
	xhr.open(method, url, true);
	if(callback) {
		xhr.onload=xhr => callback(undefined, xhr);
		xhr.onerror=err => callback(err);
		return xhr.send(data);
	} else {
		return new Promise((ok, ko) => {
			xhr.onload=ok;
			xhr.onerror=ko;
			return xhr.send(data);
		});
	}
};
ajax.get=function get(url, callback) {
	return ajax(url, 'GET', null, callback);
};
ajax.post=function post(url, data, callback) {
	return ajax(url, 'POST', data, callback);
};

ajax.sync=function sync(url, method='GET', data=null) {
	const xhr=new XMLHttpRequest();
	xhr.open(method, url, false);
	xhr.send(data);
	return xhr;
};
ajax.sync.get=function get(url) {
	return ajax.sync(url, 'GET', null);
};


return ajax;
