# Mackenize Math Club Problem Bank Backend

This stores the problem data and users in a database (data.db) and handles network requests to send and update data.

## Usage

**Start Server:** run `node .` in the command prompt (of course, make sure to install npm and install everything)

**Register Users:** install sqlite3 and edit data.db directly
1. `sqlite3 data.db`
2. `INSERT INTO OneTimeCodes (code, used) VALUES ([your code], 0)`
3. Use the inserted OneTimeCode to register a user

## Request & Response Formats

To begin, we will define some common objects - these will occur often in requests and responses in this server, so it helps to have them here as a reference (to prevent redundancy)

|name|format|
|---|---|
|Problem|{<br>**id**: integer<br>**author**: integer id of author<br>**title**: string<br>**statement**: string<br>**solution**: string<br>**problem_tags**: list of integral problem id tags<br> **contest_tags**: list of integral contest id tags<br>}|

Furthermore, some resources require authentication. To do so, send a POST request to `/login` and store the JWT token. To access protected resources, add a field in the header named `Authorization` with the value of the token. The token will expire after an hour. 

And now the documentation for the urls:

|url|Request Format|Requires Authentication|Response Format|
|---|---|---|---|
|/api/problem/get/:id (GET)|replace `:id` with the integral id of the problem|yes|Exactly the format of a *Problem* (reference above table)|
|/api/problemTags (GET)||no|[<br>{**id**: tag id, **name**: tag name},<br>{**id**: tag id, **name**: tag name},<br>...<br>]|
|/api/contestTags (GET)||no|[<br>{**id**: tag id, **name**: tag name},<br>{**id**: tag id, **name**: tag name},<br>...<br>]|
|/api/problem/create (POST)|A *Problem* but without an **id**|yes|If successful, {**id**: problem id}|
|/api/problem/alter (POST)|A *Problem*|yes|Nothing|
|/api/problem/delete/:id (POST)|Replace `:id` with the integral id of the problem|yes|a success message|
|/login (POST)|{**username**: string, **password**: string}|no|A string - the JWT token used to make future requests|
|/signup (POST)|The following fields (all as strings): **firstName**, **lastName**, **username**, **password**, **oneTimeCode**|no|a success message|
|/problems (GET)||yes|[<br>{**id**: problem id, **title**: problem title}<br>{**id**: problem id, **title**: problem title}<br>...<br>]
