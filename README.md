# ChannammaChums (RCUHub) 🎓
### Dedicated Semester Examination Resource Platform for Rani Channamma University (RCU) Belagavi

A production-ready, ultra-clean, minimalist pure white web platform designed exclusively for students of **Rani Channamma University (RCU), Belagavi** across **BCA, B.Com, B.Sc, and BBA** covering **All 6 Semesters**.

---

## ✨ Features

1. **Ultra-Clean Minimalist Pure White Theme**:
   - Pure white background (`#FFFFFF`), whisper-thin borders (`#E5E7EB`), and charcoal typography (`#111827`) for maximum focus and reading comfort.
   - 100% mobile, tablet, and desktop responsive fluid grid layout.

2. **Cute Fighting Cats Animation (Pure CSS Keyframes & SVG)**:
   - Interactive cartoon boxing match featuring **Mittens** (The Tuxedo Boxer) vs. **Whiskers** (The Calico Challenger).
   - Playful paw jabs, ducking guards, tail wiggles, comic dust puffs, and sparkle hits.
   - Click either cat to trigger interactive high-speed sparring combos!

3. **Authentication & Session Persistence**:
   - Collects **Student Name** and **UUCMS Registration Number** (Karnataka State Unified University & College Management System).
   - Instant 1-click **Quick Demo Login** for testing.
   - Session stored in `localStorage` with easy switch/logout controls.

4. **Comprehensive RCU NEP Curriculum Database**:
   - **4 Undergrad Programs**: BCA, B.Com, B.Sc, BBA.
   - **All 6 Semesters** (1st Sem to 6th Sem) with core subjects mapped to RCU NEP blueprints.
   - **This Year's Expected Questions**: Categorized into Section A (2 Marks), Section B (5 Marks), and Section C (10 Marks).
   - **Professor's Logic & Proof**: Expandable insight card explaining why each specific question is predicted based on past question frequency, syllabus blueprints, and marking rubrics.
   - **Last-Minute Revision Notes**: Bulleted high-yield conceptual summaries and memory mnemonics for rapid pre-exam reading.
   - **Last 5 Years Question Papers (2025, 2024, 2023, 2022, 2021)**: Interactive download cards with a built-in link customizer to easily paste direct Google Drive links.

5. **Study Prep Tracker & Productivity Tools**:
   - Interactive "Mark as Mastered" checkboxes that automatically calculate and update your subject prep progress.
   - 1-click "Copy Revision Notes" formatted for WhatsApp / Telegram study groups.
   - Clean, paper-optimized print stylesheet (`Ctrl + P` / "Print Notes") to print physical cheat sheets.
   - Direct links to official RCU portals: **UUCMS Portal**, **RCUB Exam Time-Table**, and **RCUB Results**.

---

## 🚀 How to Run

Simply open `index.html` in any modern web browser:

```bash
# Option 1: Direct File Open
Double-click index.html or open via Chrome, Edge, Safari, Firefox.

# Option 2: Local HTTP Server (Python)
python -m http.server 8080
# Then visit: http://localhost:8080
```

---

## 📁 File Structure

- `index.html`: Semantic HTML5 layout, Tailwind CSS configuration, Lucide/SVG icons, and responsive components.
- `styles.css`: Pure CSS styles, custom scrollbar, print styles, and keyframes for the cute fighting cats arena.
- `database.js`: Comprehensive nested JSON database of all 4 courses, all 6 semesters, subjects, questions, professor's proofs, notes, and past paper links.
- `app.js`: State management, session handling, search filtering, mastered progress tracking, and Google Drive link manager.

