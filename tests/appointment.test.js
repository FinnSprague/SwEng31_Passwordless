
const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

const {createAppointment, getAppointments} = require("../src/controllers/appointmentController.js");
app.post("/createAppointment", createAppointment);

describe("POST /createAppointment", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Should return Error 401 with no data", async () => {

        const response = await request(app)
        .post("/createAppointment")
        .type("application/json");

        expect(response.status).toBe(400);

    });

    test("Should return Error 409 with conflict", async () => {

        jest.spyOn(conflict, "findOne")
        .mockResolvedValue(true);

        const response = await request(app)
        .post("/createAppointment")
        .query({ 
            patientId : 1 , 
            doctorId : 1 , 
            date : 1 , 
            time : 1 , 
            reason : 'other reason'
        })
        .type("application/json");

        expect(response.status).toBe(409);

    });

});