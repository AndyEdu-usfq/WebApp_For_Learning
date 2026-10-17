import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gradeQuiz,labFeedback,keys} from '../lib/scoring.ts';
import {lessons,levels} from '../lib/curriculum.ts';
test('all lessons have valid answer keys and original practice',()=>{assert.equal(lessons.length,16);for(const l of lessons){assert.equal(keys[l.id].length,l.questions.length);keys[l.id].forEach((k,i)=>assert.ok(l.questions[i].options[k]));assert.equal(l.checklist.length,4);}});
test('grading handles full, partial and invalid responses',()=>{assert.equal(gradeQuiz(['b1-stories'],[0,1,2]).score,100);assert.equal(gradeQuiz(['b1-stories'],[0,0,0]).score,33);assert.throws(()=>gradeQuiz(['b1-stories'],[0]));assert.throws(()=>gradeQuiz(['missing'],[]));assert.throws(()=>gradeQuiz(['b1-stories'],[0,1,5]));});
test('each level assessment has twelve questions and deterministic scores',()=>{for(const level of levels){const ids=lessons.filter(l=>l.level===level).map(l=>l.id);const answers=ids.flatMap(id=>keys[id]);assert.equal(answers.length,12);assert.equal(gradeQuiz(ids,answers).score,100);}});
test('lab checks do not claim language proficiency',()=>{const r=labFeedback('word '.repeat(90),'B1',[true,true,true,true]);assert.equal(r.score,100);assert.ok(r.feedback[2].includes('not a grammar'));assert.equal(labFeedback('word '.repeat(21),'C2',[false,false,false,false]).score,0);assert.throws(()=>labFeedback('short','B1',[]));});
