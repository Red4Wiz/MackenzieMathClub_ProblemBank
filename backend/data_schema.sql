CREATE TABLE IF NOT EXISTS "user"
(
[Id] integer primary key autoincrement not null,
[FirstName] nvarchar(160) not null,
[LastName] nvarchar(160) not null,
[Username] nvarchar(160) not null,
[Password] nvarchar(160) not null
);
CREATE TABLE sqlite_sequence(name,seq);
