# CelebrationOS: Multi-Occasion Dynamic Invitation & Celebration Management Platform 🎉💍🪔

A comprehensive, mobile-first, enterprise-grade **Multi-Occasion Invitation & Celebration Management Platform** built with React 19, Vite 8, Tailwind CSS 3.4, React Router 7, SheetJS (XLSX), Lucide Icons, and client-side LocalStorage & IndexedDB persistence.

Empowers hosts, event organizers, and families to create, customize, and manage beautiful online invitations for 18 distinct celebrations, each with its own independent guest registry, unique mobile deduplication, dynamic banquet seating arrangement, and dynamic visual theme engine.

---

## 🌟 Master Features

### 1. 🎊 Multiple Occasion Management (18 Supported Occasions)
Create and manage independent celebration portals for:
1. **Birthday Bash** 🎂
2. **Royal Wedding** 💍
3. **Anniversary Celebration** 🥂
4. **Ring Ceremony & Engagement** ✨
5. **Retirement Gala & Honor** 🏆
6. **Farewell & Bon Voyage** 🌟
7. **Diwali Festival of Lights** 🪔
8. **Holi Color Fest & Milan** 🎨
9. **New Year Party & Countdown** 🎆
10. **Christmas Celebration** 🎄
11. **Eid Celebration & Feast** 🌙
12. **Baby Shower & Blessings** 🍼
13. **Naming Ceremony (Naamkaran)** 👶
14. **Housewarming / Griha Pravesh** 🏡
15. **Graduation Party & Convocation** 🎓
16. **Corporate Gala & Annual Event** 💼
17. **Family Get-Together & Reunion** ❤️
18. **Custom Celebration** 🎉

Admin actions on every celebration:
- **Create New Occasion**: Wizard to select category and launch.
- **Edit Occasion**: Tailored dynamic forms per occasion type.
- **Theme Designer**: Full visual customizer with live simulated preview.
- **Manage Guests**: Isolated guest roster per celebration.
- **Manage Seating**: Banquet tables with capacity guards (toggleable on/off).
- **Preview Live Invitation**: Dedicated responsive public page.
- **Copy Invitation Link**: One-click clipboard share.
- **Duplicate Occasion**: Instant cloning with 1 click.
- **Activate / Deactivate**: Control RSVP acceptance status.
- **Delete Occasion**: Clean deletion with confirmation safeguard.

---

### 2. 🎨 Dynamic Theme Engine & Visual Identities
Each occasion features a complete visual identity transformation:
- **Birthday**: Pink/purple/gold gradients, floating balloons, interactive animated birthday cake with candle blow effect, confetti bursts.
- **Wedding**: Royal crimson red, gold & ivory, floating rose petals, traditional mandap/kalash arch, bride & groom photos, multi-event ceremony schedule.
- **Diwali**: Deep royal purple, night blue, golden diyas with animated flickering flames, marigold flowers, rangoli patterns, and Lakshmi puja timings.
- **Retirement**: Executive navy blue & gold, golden laurels, career journey milestones timeline, appreciation plaque, lifetime achievement badge.
- **Anniversary**: Rose gold & champagne blush, interlocking diamond rings, romantic floating petals, anniversary milestone counter.
- **Baby Shower**: Gentle pastel sky blue & pink, smiling clouds, playful baby rattle/cradle motifs.
- **Holi**: Electric pink, cyan blue & yellow gulal color splash bursts.
- **Housewarming (Griha Pravesh)**: Auspicious terracotta, mango leaf toran, and sacred Kalash.
- **Christmas & New Year**: Falling snowflakes, winter starlight, crimson velvet, and champagne toast.
- **Eid**: Crescent moon, emerald green & gold arabesque, and fanous lanterns.
- **Corporate & Graduation**: Sapphire blue, convocation regalia, academic laurels, and keynote agenda.

---

### 3. 🖌️ Theme Designer (Admin Panel)
- **Predefined Themes Carousel**: Pick from pre-tuned themes per occasion.
- **Color Pickers**: Custom primary accent, secondary tone, and festive highlight/gold.
- **Typography Selector**: Choose between *Playfair Display (Serif)*, *Cinzel (Palatial)*, *Outfit (Clean Sans)*, and *Great Vibes (Cursive)*.
- **Media Customizer**: Upload custom background wallpapers and centerpiece hero art directly from your computer (JPG, PNG, WEBP, max 5 MB).
- **Floating Animations Switcher**: Toggle floating balloons, petals, diyas, and sparkles.
- **Live Simulated Preview**: Real-time view of changes before applying.

---

### 4. 📝 Dynamic Occasion-Specific Forms & Custom Fields
Forms adapt dynamically to the selected celebration category:
- **Birthday**: Person Name, Age / Milestone, Date, Time, Venue, Note.
- **Wedding**: Bride Name, Groom Name, Wedding Date & Time, Venue, Bride & Groom Photos, **Multi-Event Schedule Builder** (Mehendi, Haldi, Sangeet, Muhurat, Reception).
- **Retirement**: Employee Name, Designation, Company, Years of Service, Retirement Date, Venue, **Career Milestones Timeline Builder**.
- **Diwali**: Host Family Name, Puja Muhurat Time, Party Time, Venue, Dress Code, Festive Message.
- **Anniversary**: Couple Names, Milestone (e.g. 25th Silver), Date, Venue.
- **Baby Shower**: Parents' Names, Baby Theme, Date, Venue, Due Date.
- **Custom Fields Builder**: Add custom text and value pairs for any occasion (e.g. Event Hashtag, Parking Instructions, Live Stream Link).

---

### 5. 🌐 Occasion-Specific Public Invitation URLs
Every celebration has its own direct, mobile-first public URL:
- `/invite/birthday/occasion-birthday-1`
- `/invite/wedding/occasion-wedding-2`
- `/invite/diwali/occasion-diwali-3`
- `/invite/retirement/occasion-retirement-4`
- `/invite/anniversary/occasion-anniversary-5`
- `/invite/:id`
- `/` (Loads the active celebration with an "Explore Celebrations" dropdown).

---

### 6. 📱 Strict Unique Mobile Number Validation (Per Occasion)
- Validates 10-digit Indian numbers starting with 6, 7, 8, or 9 (`/^[6-9]\d{9}$/`).
- **Normalized Comparison**: Automatically strips spaces, formatting, and country codes (`+91`, `0`).
- **Occasion-Level Isolation**:
  - A mobile number can register **only once per occasion**.
  - The same mobile number **can register for another different occasion**.
  - If a duplicate is entered:
    > *"This mobile number is already registered. Please contact the administrator if you need to update your registration."*
- Enforced on both public RSVPs and admin manual registrations.

---

### 7. 🪑 Dynamic Banquet Seating Management
- Configured independently per celebration.
- Can be disabled for open festivals or gatherings where table reservations are unnecessary.
- Dynamic seat capacity guards prevent overbooking.
- Automatically releases or reserves seats upon guest RSVP, edit, or deletion.

---

### 8. 📊 Multi-Sheet Excel & JSON Reporting
- **Occasion Excel Report (.xlsx)**: 2 sheets (*Guest List* & *Table Summary*) for that specific occasion.
- **Master Platform Excel Report (.xlsx)**: 2 sheets (*All Occasions Summary* & *All Guests Master Roster* across all celebrations).
- **JSON Portability**: Export all celebrations, individual celebration configs, or all guests. Import guest datasets with automated occasion binding.

### 🎫 Digital Event Pass Generation & Download
- **"Your Event Pass is Ready!" Announcement:** Automatically generated upon RSVP confirmation or manual admin booking.
- **Themed Visual Identity:** The pass design automatically adapts to the occasion theme:
  - 🎈 **Birthday:** Balloons, birthday cake illustration, colorful confetti, purple/pink/amber gradient.
  - 🪔 **Diwali:** Glowing diyas, marigold accents, golden rangoli, royal purple & gold gradients.
  - 🏅 **Retirement:** Executive navy & brushed gold borders, laurel wreath motif, milestone stars.
  - 💍 **Wedding:** Royal crimson & ivory floral paisley filigree, twin rings, mandap motifs.
  - 🌸 **Anniversary / Baby Shower / Holi / Other:** Tailored custom palettes & festive illustrations.
- **Key Information on Pass:**
  - Event Name & Occasion Subtitle
  - Primary Guest Name
  - Masked Mobile Number (e.g. `******3210`)
  - Party Size / Total Members
  - Assigned Seating Table or Open Seating
  - Event Date & Time
  - Venue Name & Full Address
  - Unique Pass ID (e.g. `PASS-2026-0001`)
  - Status: `● VALID`
  - High-Resolution Scannable QR Code (encodes secure verification token without private personal data)
  - Anti-counterfeit serial barcode strip & VIP ticket notches with perforated divider line.
- **Actions:**
  - **Download Event Pass (PNG):** High-res 2.5x retina image generation via `html-to-image`.
  - **Share Pass:** Native Web Share API (file & text) with direct WhatsApp share fallback.
  - **Copy Pass ID:** Instant clipboard copy with animated visual feedback.
  - **Pass Retrieval Portal:** Returning guests can look up and re-download their pass anytime using their mobile number.
  - **Admin Pass Management:** Admins can view, download, or share any registered guest's digital pass straight from the Guest Roster.

---

## 🔑 Demo Credentials

- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `Admin@123` *(with 1-click auto-fill)*

---

## 🚀 How to Run

```bash
# Start development server
npm run dev

# Or build for production
npm run build
```
