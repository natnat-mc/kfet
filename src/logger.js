const log=require('log');
const emitter=require('log/writer-utils/emitter');
const levels=require('log/levels');
const printf=require('printf');
const fs=require('fs');

let fd;
module.exports=function(filename, mode) {
	if(fd) throw new Error("Already open");
	
	fd=fs.openSync(filename, 'a', mode || 0o755);
	
	let minLvl=process.env.LOG_LEVEL || 'notice';
	if(typeof minLvl=='string') minLvl=levels.indexOf(minLvl);
	if(minLvl<0) minLvl=0;
	
	emitter.on('log', msg => {
		if(msg.logger.levelIndex>=minLvl) {
			let now=new Date();
			let txt=printf.apply(null, [
				"%02d/%02d/%d %02d:%02d:%02d %s %s %s\n",
				now.getDate(),
				now.getMonth()+1,
				now.getFullYear(),
				now.getHours(),
				now.getMinutes(),
				now.getSeconds(),
				msg.logger.level.toUpperCase(),
				msg.logger.namespace,
				printf.apply(null, msg.messageTokens)
			]);
			fs.writeSync(fd, txt);
		}
	});
	
	process.on('exit', () => fs.closeSync(fd));
};
