// Server-only answer keys: never imported by client components.
export const keys:Record<string,number[]>={
'b1-stories':[0,1,2],'b1-plans':[1,2,1],'b1-listening':[1,0,2],'b1-email':[1,2,0],
'b2-opinions':[1,2,1],'b2-conditionals':[1,2,2],'b2-meetings':[2,1,1],'b2-reports':[1,1,2],
'c1-nuance':[2,1,0],'c1-negotiation':[1,1,2],'c1-synthesis':[1,1,0],'c1-proposals':[2,1,1],
'c2-register':[1,1,1],'c2-rhetoric':[1,0,1],'c2-debate':[1,1,2],'c2-capstone':[1,1,2]};
export function gradeQuiz(ids:string[],answers:number[]){
 const expected=ids.flatMap(id=>keys[id]??[]);
 if(expected.length===0||answers.length!==expected.length||answers.some(a=>!Number.isInteger(a)||a<0||a>3))throw new Error('Please answer every question.');
 return {score:Math.round(100*expected.filter((a,i)=>a===answers[i]).length/expected.length),correct:expected,results:expected.map((a,i)=>a===answers[i])};
}
export function labFeedback(text:string,level:string,checks:boolean[]){
 const words=text.trim().split(/\s+/).filter(Boolean).length;
 const min=level==='B1'?80:level==='B2'?140:level==='C1'?200:250;
 const max=level==='B1'?120:level==='B2'?180:level==='C1'?250:300;
 if(words<20)throw new Error('Write at least 20 words before submitting.');
 const count=checks.filter(Boolean).length;
 return {score:Math.round(((words>=min&&words<=max?1:0)+count)/5*100),words,min,max,
 feedback:[words<min?`Develop your response towards ${min}–${max} words.`:words>max?`Edit for concision: aim for ${min}–${max} words.`:'Your response meets the target length.',`${count}/4 task criteria self-checked. Compare your response with the model and revise.`, 'This is a task-completion check, not a grammar, pronunciation or CEFR assessment.']};
}
