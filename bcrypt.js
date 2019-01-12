const bcrypt=require('bcrypt');
const str="azazazaza";
const rounds=8;
const salt=bcrypt.genSaltSync(rounds);
const hash=bcrypt.hashSync(str, salt);
const eq=bcrypt.compareSync(hash, hash);
console.log(str, rounds, salt, hash, eq, hash.length, process.version);
