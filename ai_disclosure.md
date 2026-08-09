# DOC // AI_USAGE_DISCLOSURE

> **PROJECT:** checkInmate
> **AUTHOR:** James Napier (polygonstew)
> **AI ASSISTANT:** Google Gemini

## 1. Statement of Disclosure
This document serves as a formal declaration that artificial intelligence (Google Gemini) was utilized as an educational resource, pair-programmer, and technical guide during the engineering of the `checkInmate` full-stack booking application.

## 2. Scope of AI Assistance
All core application logic, feature requirements, and architectural workflows were conceptualized and directed by the human author. The AI assistant was leveraged to accelerate development and bridge knowledge gaps in the following specific areas:

* **Syntax Translation & ORM:** Translating fundamental MySQL database concepts into C# Entity Framework Core object-relational mapping syntax.
* **Backend Scaffolding:** Generating standard boilerplate for the ASP.NET Core Web API, including `InmateController.cs` RESTful routing and `Program.cs` service registration.
* **Frontend Connectivity:** Assisting with the asynchronous JavaScript `fetch()` logic required to wire the custom HTML/CSS GUI to the backend endpoints.
* **Test Automation Setup:** Providing the structural boilerplate and environmental configuration for the xUnit integration testing suite utilizing `WebApplicationFactory`.
* **Debugging & Diagnostics:** Analyzing compiler errors, diagnosing JSON payload mismatches (e.g., ISO 8601 date formatting), and explaining C# architectural best practices.

## 3. Human Authorship & Oversight
While AI provided code snippets and structural recommendations, the human developer maintained absolute authority over the project pipeline. The developer:
* Designed the modular architectural concept and the thematic Department of Corrections implementation.
* Engineered the dual-input UI philosophy, conceptualizing and styling the hybrid GUI / interactive terminal override.
* Verified, modified, and manually integrated all generated code to ensure strict alignment with the pre-existing multi-line engine requirements and project parameters.
* Executed all host environment configurations, CLI commands, and deployment operations.