CREATE TABLE Permissions(
   id INTEGER PRIMARY KEY,
   rank varchar(20) not null unique
);
INSERT INTO Permissions (rank) values (1, 'admin'), (2, 'exec');

CREATE TABLE Users (
   id INTEGER PRIMARY KEY NOT NULL,
   username NVARCHAR(100) UNIQUE NOT NULL,
   firstname NVARCHAR(160) NOT NULL,
   lastname NVARCHAR(160) NOT NULL,
   password NVARCHAR(1000) NOT NULL,
   permission INTEGER NOT NULL DEFAULT 2,
   salt NVARCHAR(1000) NOT NULL,
   FOREIGN KEY (permission) REFERENCES Permissions(id)
);

CREATE TABLE ProblemTags(
   id INTEGER PRIMARY KEY NOT NULL,
   name NVARCHAR(255) NOT NULL
);

CREATE TABLE ContestTags(
   id INTEGER PRIMARY KEY NOT NULL,
   name NVARCHAR(255) NOT NULL
);

CREATE TABLE Problems(
   id INTEGER PRIMARY KEY NOT NULL,
   author INTEGER,
   title NVARCHAR(255) NOT NULL,
   statement NVARCHAR(8000),
   solution NVARCHAR(8000),
   FOREIGN KEY (author) REFERENCES Users(id)
);

CREATE TABLE Problem_to_ProblemTag(
   id INTEGER PRIMARY KEY NOT NULL,
   problem_id INTEGER,
   tag_id INTEGER,
   FOREIGN KEY (problem_id) REFERENCES Problems(id) ON DELETE CASCADE,
   FOREIGN KEY (tag_id) REFERENCES ProblemTags(id) ON DELETE CASCADE
);

CREATE TABLE Problem_to_ContestTag(
   id INTEGER PRIMARY KEY NOT NULL,
   problem_id INTEGER,
   tag_id INTEGER,
   FOREIGN KEY (problem_id) REFERENCES Problems(id) ON DELETE CASCADE,
   FOREIGN KEY (tag_id) REFERENCES ProblemTags(id) ON DELETE CASCADE
);

CREATE TABLE OneTimeCodes (
  id INTEGER PRIMARY KEY NOT NULL,
  code NVARCHAR(50) UNIQUE NOT NULL,
  used INTEGER DEFAULT 0,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);