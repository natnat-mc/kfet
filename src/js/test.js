// @depends ejs_loader
// @depends ejs
// @depends api

( async () => {
	await Promise.all(['dbList.ejs', 'dbFields.ejs', 'dbValues.ejs'].map(_G.ejs_loader.preload));
	let tableList=await _G.api.get('/db/tables/list');
	
	{
		let code=await ejs.renderFile('dbList.ejs', {list: tableList});
		document.body.innerHTML+=code;
	}
	
	let tables=Object.create(null);
	for(let table of tableList) {
		tables[table]={
			fields: await _G.api.get('/db/tables/:table/fields', {table})
		};
	}
	
	console.log(tables);
})();
