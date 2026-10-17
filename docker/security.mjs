import {timingSafeEqual,createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(value).digest();
export function authorized(header,user,password){
 if(!password||!header?.startsWith('Basic '))return false;
 try{const decoded=Buffer.from(header.slice(6),'base64').toString('utf8');return timingSafeEqual(hash(decoded),hash(`${user}:${password}`));}catch{return false;}
}
export function validOrigin(origin,expected){return !origin||origin===expected;}
