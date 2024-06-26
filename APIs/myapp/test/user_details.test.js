// test/users/detail.test.js
const db = require("../model/index.js");

const { expect } = require("expect");
const request = require("supertest");
const app = require("../app.js");

before(function (done) {
  db.sequelize
    .sync()
    .then(() => {
      console.log("Sequelize models synced for testing\n");
      done();
    })
    .catch(done);
});

beforeEach(function (done) {
  console.log("\nlet's start the test : ");
  done();
});

afterEach(function (done) {
  console.log("---let's end the test---\n");
  done();
});

describe("register a user which is already registered", function () {
  let user_token;

  it("should register a user which is already registered on post ", function (done) {
    const req_data = {
      name: "insu",
      email_id: "insub@gmail.com",
      password: "passSDd123",
    };

    request(app)
      .post(`/users/detail/register`)
      .send(req_data)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        if (res.body.message !== "Already registerd email_id") {
          return done(new Error("registeration is not successfull"));
        }
        done();
      });
  });

  it("welcome page (403-error)", function (done) {
    request(app)
      .get("/users/detail/welcome")
      .set("Authorization", `Bearer ${user_token}`)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        const result = res.body;
        if (result.message !== "Token is not valid") {
          return done(new Error("error"));
        }

        done();
      });
  });
});

describe("register a user", function () {
  let user_token;

  it("should register a user on post ", function (done) {
    const req_data = {
      name: "insu",
      email_id: "inbaloveeesuba@gmail.com",
      password: "passSDd123",
    };

    request(app)
      .post(`/users/detail/register`)
      .send(req_data)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        if (res.body.message !== "registered successfully") {
          return done(new Error("registeration is not successfull"));
        } else {
          user_token = res.body.token;
        }
        done();
      });
  });

  it("welcome page", function (done) {
    request(app)
      .get("/users/detail/welcome")
      .set("Authorization", `Bearer ${user_token}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        const result = res.body;
        if (
          (!result.user_id ||
            !result.first_name ||
            !result.last_name ||
            !result.email_id) &&
          (!result.name || !result.message)
        ) {
          return done(new Error("error"));
        }

        done();
      });
  });
});

describe("login a user", function () {
  let user_token;

  it("should login a user on post ", function (done) {
    const req_data = {
      email_id: "insub@gmail.com",
      password: "passSDd123",
    };

    request(app)
      .post(`/users/detail/login`)
      .send(req_data)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        if (res.body.message !== "logged in successfully") {
          return done(new Error("logging is not successfull"));
        }
        user_token = res.body.token;
        done();
      });
  });

  it("welcome page - login", function (done) {
    request(app)
      .get("/users/detail/welcome")
      .set("Authorization", `Bearer ${user_token}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        const result = res.body;
        if (
          (!result.user_id ||
            !result.first_name ||
            !result.last_name ||
            !result.email_id) &&
          (!result.name || !result.message)
        ) {
          return done(new Error("error"));
        }

        done();
      });
  });

  it("welcome page - (401-error)", function (done) {
    request(app)
      .get("/users/detail/welcome")
      //.set('Authorization', `Bearer ${}`)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        const result = res.body;
        if (result.message !== "Token not provided") {
          return done(new Error("error"));
        }

        done();
      });
  });
});

describe("user get all Tests", function () {
  it("should return an array of users on GET ", function (done) {
    request(app)
      .get("/users/detail/get-allusers")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!Array.isArray(res.body)) {
          return done(new Error("Response body is not an array"));
        }
        for (const result of res.body) {
          if (
            !result.user_id ||
            !result.first_name ||
            !result.last_name ||
            !result.email_id ||
            !result.user_address
          ) {
            return done(new Error("Response body is not an array"));
          }
        }
        done();
      });
  });
});

describe("user get by id Tests", function () {
  it("should return a user on GET ", function (done) {
    const id = 1;
    request(app)
      .get(`/users/detail/get-user-by-id/${id}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        if (res.body.user_id !== id) {
          return done(
            new Error("User ID in response does not match requested ID")
          );
        }

        const result = res.body;
        if (
          !result.user_id ||
          !result.first_name ||
          !result.last_name ||
          !result.email_id ||
          !result.user_address
        ) {
          return done(new Error("Response body is not an array"));
        }
        done();
      });
  });
});

describe("CURD FOR a user", function () {
  let id;
  //creating
  it("should create a user on post ", function (done) {
    const req_data = {
      first_name: "insu",
      last_name: "zzz",
      email_id: "insuba@gmail.com",
      address: {
        address1: "1659 ewsb",
        address2: "f colon,villapuram",
        city: "Madurai",
        state: "Tamil nadu",
        country: "India",
      },
    };
    request(app)
      .post(`/users/detail/insert-user`)
      .send(req_data)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        const result = res.body;
        if (
          !result.user_id ||
          !result.first_name ||
          !result.last_name ||
          !result.email_id ||
          !result.user_address
        ) {
          return done(new Error("Response body is not an object"));
        }

        id = result.user_id;

        done();
      });
  });

  //getting by ID
  it("should return a user on GET ", function (done) {
    request(app)
      .get(`/users/detail/get-user-by-id/${id}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        if (res.body.user_id !== id) {
          return done(
            new Error("User ID in response does not match requested ID")
          );
        }

        const result = res.body;
        if (
          !result.user_id ||
          !result.first_name ||
          !result.last_name ||
          !result.email_id ||
          !result.user_address
        ) {
          return done(new Error("Response body is not an array"));
        }
        done();
      });
  });

  //updating
  it("should update a user on put ", function (done) {
    const id = 1;
    const req_data = {
      first_name: "hai",
      last_name: "zzz",
      email_id: "aa@gmail.com",
      address: {
        address1: "1659 ewsb",
        address2: "tnhb colon,villapuram",
        city: "Madurai",
        state: "f nadu",
        country: "India",
      },
    };
    request(app)
      .put(`/users/detail/update-user/${id}`)
      .send(req_data)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        const result = res.body.updated_user;
        if (
          !result.user_id ||
          !result.first_name ||
          !result.last_name ||
          !result.email_id ||
          !result.user_address
        ) {
          return done(new Error("updation is not successfull"));
        }

        done();
      });
  });

  //deleting
  it("should delete the user by id DELETE", function (done) {
    request(app)
      .delete(`/users/detail/delete-user-by-id/${id}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        if (res.body.message !== "deleted successfully") {
          return done(new Error("deletion is not successfull"));
        }

        done();
      });
  });

  //deleting
  it("should delete the user by id (404-error) DELETE", function (done) {
    request(app)
      .delete(`/users/detail/delete-user-by-id/${id}`)
      .expect(404)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        if (res.body.message !== "user not found") {
          return done(new Error("deletion is not successfull"));
        }

        done();
      });
  });

  //getting by ID
  it("should return a user (404-error) on GET ", function (done) {
    request(app)
      .get(`/users/detail/get-user-by-id/${id}`)
      .expect(404)
      .end(function (err, res) {
        if (err) return done(res.body || err);

        if (!res.body || typeof res.body !== "object") {
          return done(new Error("Response body is not an object"));
        }

        if (res.body.message !== "user is not found") {
          return done(new Error("error"));
        }

        done();
      });
  });
});
