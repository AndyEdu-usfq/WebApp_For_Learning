CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`kind` text NOT NULL,
	`score` integer NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL
);
