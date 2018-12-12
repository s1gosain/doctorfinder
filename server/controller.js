const client = require('./database.js');

module.exports = {
  makeDr: (req, res, next) => {
    client.query({
      text: `INSERT INTO doctors 
        (name) VALUES ($1);`,
      values: [req.body.name],
    },
    (err, res) => {
     if (err) console.error(err);
     next();
    })
  },

  makeRev: (req, res, next) => {
    client.query({
      text: `INSERT INTO reviews
          (doctor_id, description)
          VALUES ($1, $2);`,
      values: [req.body.doctor_id, req.body.description],
    },
    (err, res) => {
      if (err) console.error(err);
      next();
    })
  },

  getDrs: (req, res, next) => {
    //create master array within which all doctor objects will be placed
    let masterArr = [];
    client.query({
      text: `SELECT doctors.name, reviews.id, doctors.id, reviews.description 
            FROM doctors 
            LEFT JOIN reviews 
            ON doctors.id = reviews.doctor_id;`
    },
    (err, data) => {
      //id (below) refers to doctor id
      //problem: can't access review id here because "id" property on doctors has exactly same name
      //chose to access doctors.id instead of reviews.doctor_id in case doctor had no reviews (in which case reviews.doctor_id would be null)
      let drId = 0;
      let counter = -1;
      for (let i = 0; i < data.rows.length; i+=1) {
        //if new dr
        if (data.rows[i]["id"] != drId) {
          let drObj = {};
          //fill drObj with name and (doctor) id properties
          drObj.name = data.rows[i]["name"];
          drObj.id = data.rows[i]["id"];
          //add review array
          let revArray = [];
          drObj.reviews = revArray;
          //add review objects
          if (data.rows[i]["description"] != null) {
            delete data.rows[i]["name"];
            data.rows[i].doctor_id = data.rows[i]["id"];
            delete data.rows[i]["id"];
            //transform original object into reviews object;
            drObj["reviews"].push(data.rows[i]);
          }
           //reset value of id to the doctor id we just created an object for
            drId = drObj["id"];
           //don't add review object if description is null (i.e. there's no review) so do nothing
            //push to array
          masterArr.push(drObj);
           counter ++;
        }
        //if another review for same doctor
        else {
          //has to have a description (i.e. it's another review because doctor id is same) so no need to check for null description
          delete data.rows[i]["name"];
           //transform id property to be more clearly the doctor id (again, we're missing review id)
          data.rows[i].doctor_id = data.rows[i]["id"];
          delete data.rows[i]["id"];
          //push this to already-existant drObj review array
          masterArr[counter]["reviews"].push(data.rows[i]);
         }
      }
      res.json(masterArr);
    })
    },

  getDr: (req, res) => {
    let obj = {"id": req.params.id};
    let arr = [];
    client.query({
      text: `SELECT doctors.name, reviews.id, reviews.doctor_id, reviews.description
            FROM doctors 
            LEFT JOIN reviews
            ON doctors.id = reviews.doctor_id
            WHERE doctors.id = $1;`,
      values: [req.params.id]
    },
    (err, data) => {
      //if doctor has reviews
      if (data.rows[0]["id"] != null) {
        obj.name = data.rows[0]["name"];
        data.rows.forEach((x) => delete x.name);
        obj.reviews = data.rows;
      }
      //if no reviews yet
      else {
        obj.name = data.rows[0]["name"];
        obj.reviews = "null";
      }
     res.json(obj);
    });
  },

  getRev: (req, res) => {
    client.query({
      text: `SELECT * 
            FROM reviews
            INNER JOIN doctors
            ON reviews.doctor_id = doctors.id
            WHERE reviews.doctor_id = $1
            AND reviews.id = $2;`,
      values: [req.params.id, req.params.rev_id]
    },
    (err, data) => {
      let totalObj = data.rows[0];
      //make parent object
      let docObj = {};
      totalObj["id"] = req.params.rev_id;
      //give parent object id and name properties
      docObj.id = req.params.id;
      docObj.name = totalObj["name"];
      //get rid of name from original, want in parent only
      delete totalObj["name"];
      totalObj.doctor = docObj;
      res.json(totalObj);
    })
  },

  getRevs: (req, res) => {
    client.query({
      text: `SELECT * 
            FROM reviews
            INNER JOIN doctors
            ON reviews.doctor_id = doctors.id
            WHERE reviews.doctor_id = $1;`,
      values: [req.params.id]
    },
    (err, data) => {
      let bigArr = data.rows;
      bigArr.forEach((x) => {
        //create new parent object every time
        let docs = {};
        docs.id = x["doctor_id"];
        docs.name = x["name"];
        delete x["name"];
        x.doctor = docs;
      })
      res.json(bigArr);
    })
  },

  deleteRev: (req, res, next) => {
    client.query({
      text: `DELETE FROM reviews
            WHERE reviews.id = $1;`,
      values: [req.params.rev_id]
    },
    (err, res) => {
      if (err) console.error(err);
      next();
    })
  },

  deleteDr: (req, res, next) => {
    client.query({
      text: `DELETE FROM doctors
            WHERE doctors.id = $1`,
      values: [req.params.id]
    },
    (err, res) => {
      if (err) console.error(err);
      next();
    })
  },

  alterReviews: (req, res, next) => {
    client.query({
      text: `ALTER TABLE reviews
            DROP CONSTRAINT reviews_fk0;`
    },
    (err, res) => {
      if (err) console.error(err);
      next();
    })
  },

  addCascade: (req, res, next) => {
    client.query({
      text: `ALTER TABLE reviews
          ADD CONSTRAINT reviews_fk0
          FOREIGN KEY ("doctor_id")
          REFERENCES "doctors"("id")
          ON DELETE CASCADE;`
    },
    (err, res) => {
      if (err) console.error(err);
      next();
    })
  }
}
