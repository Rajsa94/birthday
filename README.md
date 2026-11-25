# Grand Birthday Invitation & Guest Management System 🎂✨

A modern, mobile-first, production-quality Birthday Invitation Web Application with a real-time guest RSVP system, dynamic table seating capacity engine, and a comprehensive Admin Dashboard.

Built as a frontend-only web application with React, Vite, Tailwind CSS, SheetJS (XLSX), Lucide Icons, and LocalStorage persistence.

---

## 🌟 Key Features

### 1. 💌 Public Birthday Invitation Page
- **Festive Aesthetic**: Shimmering gradients in royal purple, celebratory pink, warm gold, soft cream, and dark velvet.
- **Dynamic Floating Atmosphere**: Floating balloons with strings, animated confetti sparkles, and festive backdrop lighting.
- **Interactive Birthday Cake**: Custom-crafted SVG birthday cake illustration with glowing candles, flickering flame animations, and interactive "blow candles & make a wish" trigger!
- **Milestone Showcase**: High-res framed portrait of the birthday person with a glowing halo and Silver Jubilee badge.
- **Live Countdown Timer**: Real-time counter for Days, Hours, Minutes, and Seconds until the party.
- **Event Information Cards**: Date & time, banquet venue, dress code, live seating availability counter, and direct Google Maps navigation link.
- **Action Buttons**: 
  - **"I'll Attend"** (Opens interactive RSVP modal with live table selection)
  - **"Sorry, I Can't Attend"** (Allows polite decline with a custom birthday greeting)

### 2. 🪑 Dynamic Seating & Capacity Engine
- Initialized with 5 banquet tables with configurable capacities (default 8 seats each).
- Live seat counters: Occupied Seats, Available Seats, and Occupancy Percentage.
- **Capacity Validation**: Automatically disables tables that do not have enough consecutive seats for the guest's party size (e.g. party of 4 cannot select a table with only 2 free seats).
- **Overbooking Prevention**: Fully booked tables are locked and marked with a prominent `FULL` badge.
- Recalculates dynamically upon RSVP confirmation, guest record edits, deletions, or new table additions.

### 3. 🛡️ Admin Portal & Dashboard
- **Demo Login**:
  - **Username**: `admin`
  - **Password**: `Admin@123`
  - Includes a convenient 1-click autofill button for instant testing.
- **7 Summary Metric Cards**:
  1. Total Registered Guests
  2. Total Members Attending
  3. Total Tables
  4. Total Seats
  5. Occupied Seats
  6. Available Seats
  7. Total Guests Not Attending (Declined)
- **Visual Analytics**: Interactive Table Occupancy Breakdown bars and Attendance Status breakdown.
- **Guest Management Table**:
  - Columns: Guest ID, Guest Name, Mobile Number, Total Members, Table Number, Attendance Status, Registration Date, Actions.
  - Search by guest name or mobile number.
  - Filter by attendance status (All, Attending, Declined).
  - Filter by table number (All, Table 1, Table 2, ...).
  - Multi-column sorting (by Name, ID, Date, Members, Table).
  - Pagination with customizable page sizes.
  - View details modal, Edit modal (with dynamic table availability check), and Delete (with seat recalculation).
- **Seating Management**:
  - Visual cards for all tables showing occupancy, available seats, seat bubble map, and assigned guest rosters.
  - Real-time inline capacity adjustments.
  - Ability to add new banquet tables on the fly.

### 4. 📊 Excel & JSON Data Management
- **Excel (.xlsx) Export**: Generates a 2-sheet workbook:
  - **Sheet 1 ("Guest List")**: Guest ID, Name, Mobile, Party Size, Table, Status, Date, Message.
  - **Sheet 2 ("Table Summary")**: Table Name, Capacity, Occupied, Available, Occupancy Rate, Assigned Guest Names.
- **JSON Export**: One-click download of `guests.json` and `tables.json`.
- **JSON Import**: Upload external guest JSON with syntax validation and automatic table occupancy recalculation.
- **LocalStorage Persistence**: All reservations, seat bookings, and edits persist safely across browser refreshes.
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

## 📂 Project Structure

```
src/
├── assets/                  # Icons and static assets
├── components/
│   ├── BirthdayCake.jsx     # Animated interactive cake with candle blow effect
│   ├── Countdown.jsx        # Live party countdown timer
│   ├── DashboardCard.jsx    # Metric analytics cards
│   ├── FloatingDecorations.jsx # Floating balloons, stars, and atmospheric orbs
│   ├── Footer.jsx           # Elegant footer with venue details & helpline
│   ├── GuestModal.jsx       # Add / Edit guest modal with table validation
│   ├── GuestTable.jsx       # Responsive guest table with search, filter, sort, paginate
│   ├── Navbar.jsx           # Top header with confetti celebration button
│   ├── RSVPModal.jsx        # Guest booking modal & entry pass generation
│   ├── SeatingCards.jsx     # Visual banquet tables with assigned guest roster
│   └── TableSelector.jsx    # Dynamic seating selector with capacity guards
├── data/
│   ├── birthday.json        # Birthday person, event dates, venue metadata
│   ├── guests.json          # Seed guest registration records
│   └── tables.json          # Seed banquet table seating records
├── pages/
│   ├── AdminDashboard.jsx   # Full admin portal with overview, guests, seating, data
│   ├── AdminLogin.jsx       # Admin login with demo credentials
│   └── Invitation.jsx       # Public landing page with invitation & live table preview
├── utils/
│   ├── excelExport.js       # SheetJS 2-sheet workbook generator
│   ├── jsonExport.js        # JSON file exporter & validator
│   ├── seating.js           # Seating capacity engine & occupancy recalculator
│   └── storage.js           # LocalStorage persistence & reset handlers
├── App.jsx                  # Main router and centralized state management
├── index.css                # Tailwind directives & glassmorphic styles
└── main.jsx                 # Vite application entry point
```

---

## 🔑 Demo Credentials

- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `Admin@123`
