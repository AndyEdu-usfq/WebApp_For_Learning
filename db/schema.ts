import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const attempts = sqliteTable('attempts', {
 id: text('id').primaryKey(), userId: text('user_id').notNull(), lessonId: text('lesson_id').notNull(),
 kind: text('kind').notNull(), score: integer('score').notNull(), payload: text('payload').notNull(), createdAt: text('created_at').notNull(),
}, t=>[index('attempts_user_created_idx').on(t.userId,t.createdAt)]);
