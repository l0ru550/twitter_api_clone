CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "age" int NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "created_at" timestamp NOT NULL,
  "update_at" timestamp,
  "delete_at" timestamp
);

CREATE TABLE "follower" (
  "id" SERIAL PRIMARY KEY,
  "follower_id" int NOT NULL,
  "following_id" int NOT NULL,
  "created_at" timestamp NOT NULL,
  "update_at" timestamp,
  "delete_at" timestamp
);

CREATE TABLE "tweet" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "text" varchar NOT NULL,
  "photo" varchar,
  "created_at" timestamp NOT NULL,
  "update_at" timestamp,
  "delete_at" timestamp
);

CREATE TABLE "comment" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "tweet_id" int NOT NULL,
  "text" varchar NOT NULL,
  "photo" varchar,
  "created_at" timestamp NOT NULL,
  "update_at" timestamp,
  "delete_at" timestamp
);

ALTER TABLE "follower" ADD FOREIGN KEY ("follower_id") REFERENCES "users" ("id");

ALTER TABLE "follower" ADD FOREIGN KEY ("following_id") REFERENCES "users" ("id");

ALTER TABLE "tweet" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comment" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comment" ADD FOREIGN KEY ("tweet_id") REFERENCES "tweet" ("id");
