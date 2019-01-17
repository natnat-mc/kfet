const fs=require('fs');

const regex={
	dep: /^\s*\/\/\s*@dep(?:ends?)?\s+(["'])([^"]+)\1;?\s*$/img,
	empty: /\n\s*\n/g,
	name: /(\w+)/
};

class Script {
	constructor(name, map) {
		this.name=name;
		this.content=fs.readFileSync('src/js/'+name, 'utf8');
		this.deps=[];
		this.map=map;
		
		while(1) {
			let match=regex.dep.exec(this.content);
			if(!match) break;
			if(match[2]!=name) this.deps.push(match[2]);
		};
		regex.dep.lastIndex=0;
	}
}

class ScriptMap {
	constructor() {
		this.list=[];
		this.map=Object.create(null);
	}
	
	add(script) {
		if(typeof(script)=='string') {
			script=new Script(script, this);
		}
		if(!script instanceof Script) {
			throw new TypeError("script is not a Script or string");
		}
		this.list.push(script);
		this.map[script.name]=script;
	}
	
	resolve() {
		let list=[];
		let avail=this.list;
		
		let allDeps=[];
		avail.forEach(script => {
			script.deps.forEach(dep => {
				if(!allDeps.includes(dep)) allDeps.push(dep);
				if(!(dep in this.map)) throw new Error(dep+" doesn't seem to exist but is found as a dependency in "+script.name);
			});
		});
		
		let remList=[];
		let addScript=function(script) {
			list.push(script);
			remList.push(script);
			avail.forEach(sc => {
				let idx=sc.deps.indexOf(script.name);
				if(idx!=-1) sc.deps.splice(idx, 1);
			});
		};
		
		while(avail.length) {
			avail.forEach(script => {
				if(script.deps.length==0) addScript(script);
			});
			remList.forEach(rem => {
				let idx=avail.indexOf(rem);
				if(idx!=-1) avail.splice(idx, 1);
			});
			remList=[];
		}
		
		return list;
	}
}

// read all scripts and resolve deps
const map=new ScriptMap();
fs.readdirSync('src/js').forEach(file => map.add(file));
let scripts=map.resolve();

// write the combined scripts
let fd=fs.openSync('static/res/script.js', 'w');
fs.writeSync(fd, 'const _G={}; window._G=_G;');
scripts.forEach(script => {
	if(!script.content) return;
	fs.writeSync(fd, '\n// '+script.name+'\n');
	fs.writeSync(fd, '_G.'+regex.name.exec(script.name)[1]+'=(() => {\n');
	fs.writeSync(fd, script.content.replace(regex.empty, '\n').trim());
	fs.writeSync(fd, '\n})();\n');
});
fs.closeSync(fd);
