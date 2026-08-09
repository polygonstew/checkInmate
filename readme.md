# DOC // checkInmate_OS

> **SYSTEM STATUS:** ONLINE  
> **BUILD:** 1.0.0 (Check In Mate - August 2026)  
> **[ACCESS RAW DEV LOG](devlog.md)**

checkInmate is a full-stack, RESTful API and terminal-driven booking engine. Designed with a modular architecture, it handles complete CRUD (Create, Read, Update, Delete) operations through a C# backend, visually represented by a brutalist, UNIX-style web interface. 

While currently themed for a Department of Corrections intake loop, the underlying data structure functions as a scalable blueprint for any time-and-slot check-in system (e.g., hospitality, event management, or ticketing).

---

## Core Architecture

* **Backend:** ASP.NET Core Web API (.NET 10.0)
* **Data Access:** Entity Framework Core (In-Memory Database)
* **Frontend:** Vanilla HTML5 / CSS3 / JavaScript (Zero-dependency)
* **Testing:** xUnit Integration Testing (`WebApplicationFactory`)
* **API Documentation:** Scalar

---

## System Interface

The user interface operates on a dual-input philosophy:
1. **Standard GUI:** Form-based intake loops and click-to-release buttons for standard users.
2. **Terminal Override:** An active, JavaScript-driven command-line console docked at the bottom of the screen. Power users can issue direct server requests (e.g., `fetch`, `clear`) and view parsed JSON response logs in real-time.

---

## Execution Commands

Ensure the .NET 10.0 SDK is installed on your host machine.

### Boot Sequence
Navigate to the primary API directory and initialize the server:
```bash
cd checkInmate
dotnet run
```

## ⚖️ System Compliance & AI Disclosure

This capstone project was developed with the assistance of artificial intelligence for educational acceleration and technical scaffolding. For full transparency regarding AI usage, scope, and human authorship, please initialize the disclosure document:

> **[ACCESS AI USAGE DISCLOSURE](ai_disclosure.md)**