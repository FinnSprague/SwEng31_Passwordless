
const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

const { generateMagicLink , handleMagicLink } = require("../src/controllers/magicKeyController.js");

app.get("/generateMagicLink", generateMagicLink);
app.get("/handleMagicLink", handleMagicLink); 

describe("GET /generateMagicLink", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Should return an error 400", async() => { 

        const res = await request(app)
        .get("/generateMagicLink")
        .type("application/json");
        
        expect(res.status).toBe(400);
    });

});