import { getDb } from '@/db';
import { attempts } from '@/db/schema';
import { lessons, levels } from '@/lib/curriculum';
import { gradeQuiz,labFeedback } from '@/lib/scoring';
import { identity,apiError } from '@/lib/api';
export async function POST(request:Request){
 try{
 const user=await identity(request);
 if(Number(request.headers.get('content-length')||0)>30000)return Response.json({error:'Response is too large'},{status:413});
 const raw=await request.text();if(raw.length>30000)return Response.json({error:'Response is too large'},{status:413});
 const body=JSON.parse(raw);let result;let lessonId=body.lessonId;
 if(body.kind==='assessment'){
 if(!levels.includes(body.level))throw new Error('Choose a valid level');
 lessonId=body.level;result=gradeQuiz(lessons.filter(l=>l.level===body.level).map(l=>l.id),body.answers);
 }else{
 const lesson=lessons.find(l=>l.id===lessonId);if(!lesson)throw new Error('Lesson not found');
 if(body.kind==='quiz')result=gradeQuiz([lesson.id],body.answers);
 else if(body.kind==='lab'){
 if(typeof body.text!=='string'||body.text.length>10000||!Array.isArray(body.checks)||body.checks.length!==4||body.checks.some((c:unknown)=>typeof c!=='boolean'))throw new Error('Invalid practice response');
 result=labFeedback(body.text,lesson.level,body.checks);
 }else if(body.kind==='lesson')result={score:100};
 else throw new Error('Invalid activity type');
 }
 const id=crypto.randomUUID();const createdAt=new Date().toISOString();
 await getDb().insert(attempts).values({id,userId:user.userId,lessonId,kind:body.kind,score:result.score,payload:JSON.stringify({result,...(body.kind==='lab'?{text:body.text,checks:body.checks}:{})}),createdAt});
 return Response.json({...result,id,createdAt});
 }catch(e){console.error('Attempt failed', e instanceof Error?e.message:'unknown');return apiError(e);}
}
