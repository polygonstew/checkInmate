# Inmate Intake and Booking System (Capstone Project)

## Project Purpose
This repository contains the final Capstone project for the Code:You software development program. It is a comprehensive system designed to handle the intake, booking, and management of inmate records for a hypothetical correctional facility. 

The solution demonstrates full-stack capabilities, separating a robust backend API from a streamlined client interface, all validated by an automated testing suite.

## Architecture
This single repository contains three distinct projects:
1. **checkInmate (API)**: A C# ASP.NET Web API handling the core business logic and in-memory data storage.
2. **checkInmate.Client**: A lightweight consumer application used by intake officers to interact with the API (Create, Read, Update, and Delete records).
3. **checkInmate.Tests**: An automated testing suite ensuring the reliability of the application's execution paths.

## Setup and Execution
To build and run this application locally on your machine, follow these steps:

1. Clone this repository.
2. Open a terminal and navigate to the root directory.
3. To start the backend API, navigate to the API folder and run:
   `dotnet run`
4. The API will typically be hosted at `http://localhost:5197`.
5. Open a second terminal window. Navigate to the Client folder and run the client application.
6. To execute the test suite, navigate to the Tests folder and run:
   `dotnet test`

## Project Retrospective
*(To be completed upon project conclusion)*
* What I learned from this project and the course overall.

## Future Roadmap
*(To be completed upon project conclusion)*
* If I had more time, the features I would add or modify.

*Note: The documentation and structure of this repository were developed with the assistance of an AI co-pilot.*