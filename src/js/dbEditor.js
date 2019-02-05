// @depends "ejs_loader"
// @depends "ejs"
// @depends "api"

if(location.pathname!='/dbEditor') return;

const main=document.querySelector('main');

let drawTable, _update, _delete, _insert;
let tName, fields, lines, canEdit;

_update=async function(line) {
	let o={};
	let elems=line.querySelectorAll('.value');
	let updFields={};
	for(let i=0; i<elems.length; i++) {
		let name=fields[i].name;
		let type=fields[i].type.toLowerCase();
		let value=elems[i].innerText;
		if(type=='string') {
			o[name]=value;
		} else {
			o[name]=+value;
		}
		
		let input=document.createElement('input');
		input.setAttribute('type', 'text');
		input.setAttribute('value', value);
		
		while(elems[i].lastChild) {
			elems[i].removeChild(elems[i].lastChild);
		}
		elems[i].appendChild(input);
		updFields[name]={input, type};
	}
	line.querySelectorAll('a').forEach(a => a.parentElement.removeChild(a));
	let a=document.createElement('a');
	a.innerText='done';
	a.addEventListener('click', async () => {
		let s={};
		for(let k in updFields) {
			let {type, input}=updFields[k];
			s[k]=type=='string'?input.value:+input.value;
		}
		await _G.api.post('/db/tables/:name/update', {name: tName}, {set: s, where: o});
		await drawTable(tName);
	});
	line.querySelector('td:last-child').appendChild(a);
};
_delete=async function(line) {
	let o={};
	let elems=line.querySelectorAll('.value');
	for(let i=0; i<elems.length; i++) {
		let name=fields[i].name;
		let type=fields[i].type.toLowerCase();
		let value=elems[i].innerText;
		if(type=='string') {
			o[name]=value;
		} else {
			o[name]=+value;
		}
	}
	await _G.api.post('/db/tables/:name/delete', {name: tName}, o);
	await drawTable(tName);
};
_insert=async function(list) {
	let o={};
	list.forEach(elem => {
		let name=elem.dataset.field;
		let type=fields.find(a => a.name==name).type.toLowerCase();
		let value=elem.value;
		if(type=='string') {
			o[name]=value;
		} else {
			o[name]=+value;
		}
	});
	await _G.api.post('/db/tables/:name/insert', {name: tName}, o);
	await drawTable(tName);
};

drawTable=async function(name) {
	tName=name;
	
	fields=await _G.api.get('/db/tables/:name/fields', {name});
	lines=await _G.api.get('/db/tables/:name/select', {name});
	canEdit=!fields.find(f => f.type.toLowerCase()=='blob' || f.type.toLowerCase()=='date');
	
	let code=await ejs.renderFile('dbValues.ejs', {fields, lines, name, canEdit});
	document.querySelector('#dbValues').outerHTML=code;
	
	if(canEdit) {
		document.querySelector('#dbValues').querySelectorAll('tbody tr').forEach(line => {
			line.querySelector('.delete').addEventListener('click', _delete.bind(null, line));
			line.querySelector('.update').addEventListener('click', _update.bind(null, line));
		});
		let ist=document.querySelector('#dbValues').querySelector('tfoot tr .insert');
		ist.addEventListener('click', _insert.bind(null, ist.parentElement.parentElement.querySelectorAll('input')));
	}
};

( async () => {
	await Promise.all(['dbList.ejs', 'dbValues.ejs'].map(_G.ejs_loader.preload));
	let tableList=await _G.api.get('/db/tables/list');
	
	let code=await ejs.renderFile('dbList.ejs', {list: tableList});
	main.innerHTML+=code;
	main.appendChild(document.createElement('div')).setAttribute('id', 'dbValues');
	
	document.querySelectorAll('#dbList li').forEach(async elem => {
		let name=elem.innerText;
		elem.addEventListener('click', drawTable.bind(null, name));
	});
})();
