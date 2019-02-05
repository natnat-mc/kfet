// @depends "ejs"
// @depends "ajax"
const cache=Object.create(null);
ejs.fileLoader=function(path) {
	if(!cache[path]) cache[path]=_G.ajax.sync.get('/views/'+path);
	return cache[path];
};

const preload=function(path) {
	if(!cache[path]) _G.ajax.get('/views/'+path).then(code => cache[path]=code);
};
const invalidate=function(path) {
	if(path) delete cache[path];
	else for(let k in cache) delete cache[k];
};

return {
	preload,
	cache,
	invalidate
};
