import Workspace from '@/components/workspace';
import {getChatGPTUser} from './chatgpt-auth';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getChatGPTUser();return <Workspace name={user?.fullName?.split(' ')[0]||'Learner'} signedIn={!!user}/>;}
