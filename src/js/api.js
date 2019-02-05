// @depends "ajax"

const api={};

api.getURL=(base, params, qs={}) => {
	let url='/api'+base.replace(/:([^/]+)/g, (_, k) => params[k]);
	let q=[];
	for(let k in qs) q.push(encodeURIComponent(k)+'='+encodeURIComponent(qs[k]));
	if(q.length) url+='?'+q;
	return url;
};
api.get=(base, params, qs) => {
	return _G.ajax.get(api.getURL(base, params, qs)).then(JSON.parse);
};
api.post=(base, params, data) => {
	return _G.ajax.post(api.getURL(base, params), data).then(JSON.parse);
};

return api;
