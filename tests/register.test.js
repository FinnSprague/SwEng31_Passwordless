
const request = require("supertest");
const express = require("express");

//TODO: implement Unit testing using Jest. 

const app = express();
app.use(express.json());

const { authentication, register, verifyRegistration , getPasskeyStatus } = require("../src/controllers/authController.js");
app.get("/authentication", authentication);
app.get("/register", register);
app.post("/verifyRegistration", verifyRegistration);
app.get("/getPasskeyStatus", getPasskeyStatus);

const User = require('../src/models/users.js');

describe("GET /register", () => {
    beforeEach(() => { 
        jest.clearAllMocks();
    });

    test("Should return Error 400", async() => {
        const response = await request(app)
        .get("/register")
        .type("application/json");

        expect(response.status).toBe(400);
    });

    test("Empty Email to return Error 400", async() => { 
        const response = await request(app)
        .get("/register")
        .query({email : ""})
        .type("application/json");

        expect(response.status).toBe(400);
    });
});

describe("GET /getPasskeyStatus", () => { 

    beforeEach(() => { 
        jest.clearAllMocks();
    });

    test("Should return error 400 with invalid email", async() => { 
        const response = await request(app)
        .get("/getPasskeyStatus")
        .query({email : " "})
        .type("application/json");

        expect(response.status).toBe(400);
    });

    test("Should return error 404 when user not found by email", async () => {
        // Mock the DB call so it returns null => user not found
        jest.spyOn(User, "findOne").mockResolvedValue(null);

        const response = await request(app)
            .get("/getPasskeyStatus")
            // Provide an email that the controller uses to look up the user
            .query({ email: "test@test.com" })
            .type("application/json");

        // Now check the result
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "No passkey found" });
    });
});


describe("/authentication", () => {

    beforeEach(() => { 
        jest.clearAllMocks();
    });

    test("Should return error 400 on missing email", async() => {
        const response = await request(app)
        .get("/authentication")
        .query({ email : "" })
        .type("application/json");

        expect(response.status).toBe(400);
    });

    test("Should return error 404 on invalid ID", async() => {

        jest.spyOn(User, "findOne").mockResolvedValue(null);

        const response = await request(app)
        .get("/authentication")
        .query({ email : "test@test.com" })
        .type("application/json");

        expect(response.status).toBe(404);

    });

});