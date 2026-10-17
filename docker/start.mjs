import {spawn,spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {createServer,request as upstreamRequest} from 'node:http';
import {authorized,validOrigin} from './security.mjs';
const password=process.env.APP_PASSWORD;
const username=process.env.APP_USERNAME||'learner';
if(!password||password.length<16)throw new Error('APP_PASSWORD must contain at least 16 characters.');
const config={name:'fluency-lab-container',main:'./dist/server/index.js',no_bundle:true,find_additional_modules:true,rules:[{type:'ESModule',globs:['**/*.js','**/*.mjs']}],compatibility_date:'2026-05-15',compatibility_flags:['nodejs_compat'],assets:{directory:'./dist/client'},d1_databases:[{binding:'DB',database_name:'fluency-lab',database_id:'00000000-0000-4000-8000-000000000000',migrations_dir:'./drizzle'}]};
writeFileSync('container-wrangler.json',JSON.stringify(config));
const wrangler='./node_modules/wrangler/bin/wrangler.js';
const migration=spawnSync(process.execPath,[wrangler,'d1','migrations','apply','DB','--local','--config','container-wrangler.json','--persist-to','/data'],{stdio:'inherit',env:{...process.env,CI:'true'}});
if(migration.status!==0)process.exit(migration.status||1);
const worker=spawn(process.execPath,[wrangler,'dev','--config','container-wrangler.json','--local','--persist-to','/data','--ip','127.0.0.1','--port','8787','--inspector-port','0'],{stdio:'inherit'});
worker.on('exit',code=>process.exit(code||0));
const server=createServer((req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','SAMEORIGIN');res.setHeader('Permissions-Policy','camera=(), microphone=(self)');
 if(req.url==='/api/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end('{"status":"ok","service":"fluency-lab-gateway"}');return;}
 if(!authorized(req.headers.authorization,username,password)){res.writeHead(401,{'WWW-Authenticate':'Basic realm="FluencyLab", charset="UTF-8"'});res.end('Sign in with your configured FluencyLab credentials.');return;}
 const origin=process.env.PUBLIC_ORIGIN||`http://${req.headers.host}`;
 if(!validOrigin(req.headers.origin,origin)){res.writeHead(403);res.end('Forbidden origin');return;}
 if(req.url?.startsWith('/signin-with-chatgpt')||req.url?.startsWith('/signout-with-chatgpt')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end('<p>This private container uses your configured HTTP credentials. Close the browser session to clear them.</p><a href="/">Return to FluencyLab</a>');return;}
 const headers={...req.headers,host:'127.0.0.1:8787'};
 // Trust only the gateway identity, never identity headers supplied by a client.
 for(const key of Object.keys(headers))if(key.startsWith('oai-')||key.startsWith('x-forwarded-'))delete headers[key];
 delete headers.authorization;
 if(headers.origin)headers.origin='http://127.0.0.1:8787';
 headers['oai-authenticated-user-id']='container-owner';headers['oai-authenticated-user-email']='learner@local.invalid';headers['oai-authenticated-user-full-name']=encodeURIComponent(process.env.APP_DISPLAY_NAME||'Learner');headers['oai-authenticated-user-full-name-encoding']='percent-encoded-utf-8';
 const upstream=upstreamRequest({hostname:'127.0.0.1',port:8787,path:req.url,method:req.method,headers},reply=>{res.writeHead(reply.statusCode||502,{...reply.headers,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});reply.pipe(res);});
 upstream.on('error',()=>{if(!res.headersSent)res.writeHead(503);res.end('The learning service is starting. Try again shortly.');});req.pipe(upstream);
});
server.listen(3000,'0.0.0.0');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close();worker.kill('SIGTERM');setTimeout(()=>process.exit(0),3000).unref();});
