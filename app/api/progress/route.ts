import { getDb } from '@/db';
import { attempts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { identity,apiError } from '@/lib/api';
export async function GET(request:Request){try{const user=await identity(request);const rows=await getDb().select().from(attempts).where(eq(attempts.userId,user.userId)).orderBy(desc(attempts.createdAt)).limit(2000);return Response.json({attempts:rows.map(r=>({...r,payload:JSON.parse(r.payload)}))},{headers:{'Cache-Control':'no-store'}});}catch(e){return apiError(e);}}
