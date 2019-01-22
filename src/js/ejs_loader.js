// @depends ejs
// @depends ajax
ejs.fileLoader=function(path) {
	return _G.ajax.sync.get('/views/'+path).responseText;
};
