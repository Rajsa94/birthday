# Grand Birthday Invitation & Admin Management System 🎂✨

A modern, mobile-first, production-quality Birthday Invitation Web Application with a real-time guest RSVP system, dynamic table seating capacity engine, comprehensive Admin Panel with live birthday event configuration, direct local image upload management, unique mobile deduplication, and multi-sheet Excel export.

Built as a 100% frontend-only web application with React 19, Vite 8, Tailwind CSS 3.4, SheetJS (XLSX), Lucide Icons, LocalStorage, and IndexedDB.

---

## 🌟 Key Features & Capabilities

### 1. ⚙️ Live Birthday Settings Management (No Code Edits Required)
Manage all birthday event information directly from the **Birthday Settings** admin menu without touching source code or JSON files:
- **Birthday Person Name**: Updates everywhere across public invitation, banners, tickets, and footer.
- **Milestone Celebration Title & Tagline**: Custom headlines and subtitles.
- **Invitation Message**: Personalized message from the birthday person to guests.
- **Date & Party Timings**: Separate date picker, party start time, and party end time (e.g. `07:00 PM – 11:30 PM`).
- **Venue & Google Maps Link**: Venue name, complete street address, and one-click navigation URL.
- **Helpline / Contact Number**: Host contact number for guest queries.
- **Theme Color Switcher**: Choose from 5 palettes (*Royal Purple & Pink*, *Festive Rose Glam*, *Golden Jubilee & Champagne*, *Emerald Velvet Royale*, *Midnight Plum Elegance*).
- **Dress Code**: Attire recommendations for guests.
- **Immediate Reflection**: All saved changes persist in `LocalStorage` and instantly reflect on the public page.

### 2. 📸 Local Image Upload Management
Upload actual images directly from your computer with drag-and-drop or file picker:
1. **Birthday Person Profile Photo** (Square portrait with halo glow effect)
2. **Invitation Background Image** (Full-bleed ambient wallpaper with soft overlay)
3. **Birthday Cake Image** (Custom cake photograph or interactive animated SVG)
4. **Celebration Photo Gallery** (Pre-birthday shoots, friendship memories, and milestone moments)
- **Format Support**: JPG, JPEG, PNG, and WEBP.
- **Size Validation**: Maximum 5 MB per image with instant client-side validation.
- **Image Controls**: Live preview before saving, 1-click image replacement, and image removal.
- **High-Capacity Storage**: Base64 data stored safely with IndexedDB support to avoid LocalStorage quota limits.

### 3. 📱 Strict Unique Mobile Number Validation
- Enforces valid 10-digit Indian mobile numbers (`/^[6-9]\d{9}$/`).
- **Normalization Engine**: Automatically strips whitespace, dashes, country code (`+91`), and leading zeros.
- **Deduplication Check**: Ensures a mobile number can register **only once** across the entire guest list.
- **Friendly Duplicate Notice**: If an already registered number is entered in public RSVP or admin registration:
  > *"This mobile number is already registered. Please contact the administrator if you need to update your registration."*
- When editing an existing guest, preserves their registered number while preventing collisions with other guests.

### 4. ➕ Admin Manual Guest Registration ("Add Guest")
- Dedicated Admin sidebar menu **Add Guest** for on-the-spot or VIP registrations:
  - Guest Full Name
  - Mobile Number (with unique validation)
  - Number of Members Attending (1 to 10)
  - Attendance Status (*Attending* or *Not Attending / Declined*)
  - Table Selector with live capacity guards
  - Optional Notes / Dietary Requests
- Automatically recalculates table occupancy, releases or books seats, updates dashboard stats, and immediately adds to the guest list.

### 5. 🪑 Dynamic Seating & Capacity Engine
- Banquet tables with configurable capacities (default 8 seats each).
- Live seat counters: Occupied Seats, Available Seats, and Occupancy Percentage.
- **Capacity Validation**: Automatically disables tables that do not have enough consecutive seats for the guest's party size (e.g. party of 4 cannot select a table with only 2 free seats).
- **Overbooking Prevention**: Fully booked tables are locked and marked with a prominent `FULL` badge.
- Recalculates dynamically upon RSVP confirmation, guest edits, deletions, or table additions.

### 6. 🛡️ Admin Dashboard & Summary Cards
- **Demo Login**:
  - **Username**: `admin`
  - **Password**: `Admin@123`
  - Includes a convenient 1-click autofill button for instant testing.
- **Birthday Settings Summary Card**:
  - Profile photo, Name, Celebration Title, Date, Start–End Timings, Venue, Total Registered Guests, Total Attending Members, and an **"Edit Birthday Details"** shortcut button.
- **7 Summary Metric Cards**:
  1. Total Registered Guests
  2. Total Members Attending
  3. Total Tables
  4. Total Seats
  5. Occupied Seats (with occupancy rate)
  6. Available Seats
  7. Total Guests Not Attending (Declined)
- **Visual Analytics**: Interactive Table Occupancy Breakdown bars and Attendance Status breakdown.
- **Admin Sidebar**:
  1. Dashboard
  2. Birthday Settings
  3. Add Guest
  4. Guest Management
  5. Seating Management
  6. Image Gallery
  7. JSON Backup & Restore
  8. Logout

### 7. 📊 Excel & JSON Data Management
- **Excel (.xlsx) Export**: Generates a 2-sheet workbook:
  - **Sheet 1 ("Guest List")**: Guest ID, Name, Mobile, Party Size, Table, Status, Date, Message.
  - **Sheet 2 ("Table Summary")**: Table Name, Capacity, Occupied, Available, Occupancy Rate, Assigned Guest Names.
- **JSON Export**: One-click download of `birthday-guests.json`, `birthday-tables.json`, and `birthday-details.json`.
- **JSON Import**: Upload external guest JSON with syntax validation and automatic table occupancy recalculation.
- **Reset to Defaults**: Quickly restore original demo seed data at any time.

---

## 🛠️ Technology Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS 3.4**
- **Lucide React** (Icons)
- **React Router 7**
- **SheetJS (xlsx)** (Excel generation)
- **Canvas Confetti** (Celebratory particle effects)
- **IndexedDB & LocalStorage** (Client-side persistence)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Credentials

- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `Admin@123`
