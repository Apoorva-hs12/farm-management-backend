# Gokulam: Smart Farm Management Application
## Project Report & Final Documentation

### 1. Project Abstract
**Gokulam** is a high-performance, responsive web application designed to empower small-scale dairy and poultry farmers with digital record-keeping tools. The application transitioned from a static prototype to a full-stack solution with a Node.js/Express backend and a persistent SQLite database. It features secure authentication, livestock management, milk production tracking, financial monitoring, and health record management.

### 2. Introduction
In the evolving landscape of agriculture, data-driven decision-making is often limited to large corporate farms. Gokulam bridges this gap by providing a mobile-first, easy-to-use interface for local farmers. The application is built with a focus on modern aesthetics (glassmorphism, vibrant palettes) and local language support (Kannada/English).

### 3. Problem Statement
Manual record-keeping in traditional farming leads to:
- Loss of historical production data.
- Difficulty in tracking animal health cycles (vaccinations, calving).
- Lack of clarity in monthly financial profit/loss.
- Inability to monitor performance trends efficiently.

### 4. Objectives
- Develop a secure platform for farmers to register and manage their profiles.
- Enable real-time tracking of daily milk yields per animal.
- Provide a centralized repository for livestock health and veterinary history.
- Implement financial tracking for expenses like feed, medical, and labor.
- Deliver an intuitive dashboard for immediate operational insights.

### 5. Technology Stack
- **Frontend**: Vanilla JavaScript (ES Modules), HTML5, CSS3 (Modern UI/UX).
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (via `sqlite3` and `better-sqlite3` compatible async driver).
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs for secure hashing.
- **Tools**: `npm` for dependency management, local HTTP servers for dev.

---

### 6. System Features & Implementation

#### A. Secure Authentication
Farmers can register with their name, farm details, and phone number. The backend ensures phone numbers are unique and passwords are never stored in plain text.

![Login Page](file:///C:/Users/Apoorva%20H%20S/.gemini/antigravity/brain/09887306-ef0d-4ec0-8875-682761426f92/login_page_1774681385386.png)
*Figure 1: Premium Login Interface with Language Toggle*

#### B. Dynamic Dashboard
The dashboard provides a real-time summary of today's production, earnings, and critical health alerts. Data is fetched dynamically from the backend upon login.

![Dashboard](file:///C:/Users/Apoorva%20H%20S/.gemini/antigravity/brain/09887306-ef0d-4ec0-8875-682761426f92/dashboard_page_1774681438255.png)
*Figure 2: Operational Dashboard showing live stats and activity*

#### C. Livestock & Production Tracking
Users can add new animals (cows/buffaloes) and log morning/evening milk collection. The state persists in the database, allowing for accurate weekly/monthly reporting.

![Livestock Updated](file:///C:/Users/Apoorva%20H%20S/.gemini/antigravity/brain/09887306-ef0d-4ec0-8875-682761426f92/livestock_list_updated_1774681494758.png)
*Figure 3: Livestock Management with individual milk collection tracking*

#### D. Finance & Health Management
Integrated modules for tracking monthly expenses and maintaining a digital history of veterinary visits and vaccinations.

| Module | Description | Status |
| :--- | :--- | :--- |
| **Finance** | Track feed, medicine, and labor costs. | ✅ Integrated |
| **Health** | Store vaccination dates and vet descriptions. | ✅ Integrated |
| **Reporting** | Generate performance trend lines. | ✅ Integrated |

![Settings Page](file:///C:/Users/Apoorva%20H%20S/.gemini/antigravity/brain/09887306-ef0d-4ec0-8875-682761426f92/settings_page_1774681520577.png)
*Figure 4: User Settings and Farm Profile Management*

---

### 7. Results & Conclusion
The project successfully delivers a robust, full-stack application that handles complex data interactions while maintaining a simple user experience. The integration of a real backend ensures that farmers' data is safe and accessible across sessions. Gokulam represents a significant step towards digitizing traditional agrarian systems.
