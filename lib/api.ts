import { getChatGPTUser } from '@/app/chatgpt-auth';
export async function identity(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)throw new Error('Forbidden origin');
 const user=await getChatGPTUser();
 if(!user)throw new Error('Sign in to save your progress.');
 return user;
}
export function apiError(error:unknown){const message=error instanceof Error?error.message:'Unable to process request';const status=message.includes('Sign in')?401:message==='Forbidden origin'?403:400;return Response.json({error:message},{status});}
