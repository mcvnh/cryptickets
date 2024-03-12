drop table if exists ignores;
create table if not exists ignores (id integer primary key autoincrement, channel_id text, slug text)