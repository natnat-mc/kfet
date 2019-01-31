const ajax=function ajax(url, method='GET', data=null, callback) {
	const xhr=new XMLHttpRequest();
	xhr.open(method, url, true);
	if(typeof data=='object') {
		data=JSON.stringify(data);
		xhr.setRequestHeader('Content-Type', 'application/json');
	}
	if(callback) {
		xhr.onload=_ => callback(undefined, xhr);
		xhr.onerror=err => callback(err);
		return xhr.send(data);
	} else {
		return new Promise((ok, ko) => {
			xhr.onload=() => {
				if(xhr.status>=200 && xhr.status<300) ok(xhr);
				else ko(xhr);
			};
			xhr.onerror=ko;
			return xhr.send(data);
		});
	}
};
ajax.get=function get(url, callback) {
	return ajax(url, 'GET', null, callback).then(a => a.responseText);
};
ajax.post=function post(url, data, callback) {
	return ajax(url, 'POST', data, callback).then(a => a.responseText);
};

ajax.sync=function sync(url, method='GET', data=null) {
	const xhr=new XMLHttpRequest();
	xhr.open(method, url, false);
	xhr.send(data);
	return xhr;
};
ajax.sync.get=function get(url) {
	return ajax.sync(url, 'GET', null).responseText;
};


return ajax;
