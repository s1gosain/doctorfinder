#Install

```sh
npm install
```

#Run

```sh
run-app.sh <PORT NAME>

//If you run into "permission denied" errors, run the following:
chmod 700 run-app.sh
```
#Commands

In another terminal window, run the command. 
Here are some examples of different commands. 

//Create a doctor
``` sh
curl -XPOST -H ‘Content-Type: application/json’ -d ‘{“name”:”Jane
Doe”}’ http://localhost:3000/doctors
```
//Add a review to existing doctor
``` sh
curl -XPOST -H ‘Content-Type: application/json’ -d `{ "description":
"Jane Doe is a great doctor. Review 1"}`
http://localhost:3000/doctors/1/reviews
```
//Add another review
```sh
curl -XPOST -H ‘Content-Type: application/json’ -d `{ "description":
"Jane Doe is really a great doctor. Review 2"}`
http://localhost:3000/doctors/1/reviews
```
//List all doctors and their reviews
``` sh
curl -XGET -H ‘Content-Type: application/json’
http://localhost:3000/doctors
```

//List a doctor and the review(s)
```sh
curl -XGET -H ‘Content-Type: application/json’
http://localhost:3000/doctors/1
```

//Delete a review from a doctor
```sh
curl -XDELETE -H ‘Content-Type: application/json’
http://localhost:3000/doctors/1/reviews/2
```
//Delete a doctor
```sh
curl -XDELETE -H ‘Content-Type: application/json’
http://localhost:3000/doctors/1
```

#Scalability Issues:
The "on cascade delete" functionality can potentially lead to scalability issues and slow the process down.

Using Postgres is more difficult to scale than noSQL databases, but it is worth the tradeoff for security and reliability.