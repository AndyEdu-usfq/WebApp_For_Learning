import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authorized,validOrigin} from '../docker/security.mjs';
test('container authentication denies missing and incorrect credentials',()=>{assert.equal(authorized(undefined,'user','long-password-value'),false);assert.equal(authorized('Bearer token','user','long-password-value'),false);assert.equal(authorized('Basic '+Buffer.from('user:wrong').toString('base64'),'user','long-password-value'),false);assert.equal(authorized('Basic '+Buffer.from('user:long-password-value').toString('base64'),'user','long-password-value'),true);});
test('container blocks cross-origin requests',()=>{assert.equal(validOrigin('https://evil.example','https://learn.example'),false);assert.equal(validOrigin('https://learn.example','https://learn.example'),true);assert.equal(validOrigin(undefined,'https://learn.example'),true);});
