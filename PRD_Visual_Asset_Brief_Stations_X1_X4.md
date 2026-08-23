# PRD Visual Asset Brief: Tablet Interface & Station UI Assets
**Project:** Clash of Unxpadted — Tablet & Station Interface Skins  
**Target Audience:** Visual & UI/UX Design Team  
**Version:** 1.0 (Production Specs)  
**Date:** August 5, 2026  

---

## 1. Overview & Visual Tone

This document details the visual asset requirements for the **Infinix XPAD Tablet Interfaces** across all 4 competition stations (**X1, X2, X3, X4**) and the **Standby/Idle Screen**. 

### Design Guidelines:
* **Style:** High-tech, futuristic esports gaming UI (Infinix Adapto Dark Theme).
* **Color Palette:**
  * **Primary Accent:** Neon Cyber Green (`#39FF14`, `rgba(57, 255, 20, 1.0)`)
  * **Secondary Accent:** Cyber Cyan (`#00E5FF`)
  * **Warning / Error:** Crimson Red (`#FF5449`)
  * **Accent Yellow:** Electric Amber (`#FFC107`)
  * **Background Deep Tone:** Matte Obsidian Dark (`#0A0C10` to `#141822`)
* **Export Standards:**
  * **Buttons & Containers:** PNG with 8-bit Alpha Channel Transparency (or SVG where applicable).
  * **Backgrounds:** JPG / PNG 24-bit high quality.
  * **Resolution:** 2x Retina Ready (optimized for 10.9" to 12.4" Tablet Screens).
  * **State Sets:** Every interactive element requires **Neutral (Default)** and **Clicked / Active** states.

---

## 2. Global & Standby Screen Assets

| Asset Name | Target File Name | Dimension (W × H) | Format | Description & States |
| :--- | :--- | :--- | :--- | :--- |
| **Standby Hero Background** | `BG_Standby_Hero.jpg` | `1920 × 1080 px` | JPG | Full-screen background during Standby/Idle phase. Matte dark obsidian with cyber circuit accents. |
| **Logotype Overlay** | `unxpadted-logotype.png` | `600 × 150 px` | PNG | Transparent brand logo placed at header and standby center. |
| **Station Badge Frame** | `Badge_Station_Frame.png` | `300 × 80 px` | PNG | Border frame for active station badge (`STATION X1`, `STATION X2`, etc.). |
| **Toast Banner Container** | `Toast_Notification_Bg.png` | `480 × 120 px` | PNG | Popup container for real-time gamemaster announcements. |

---

## 3. Station X1: Math Speedrun

### Summary
1v1 fast-paced arithmetic speedrun. Players use a digital keypad to enter numbers and submit answers rapidly.

```
+-------------------------------------------------------------+
|                [ QUESTION BOX (600x200) ]                   |
|                        47 + 58 = ?                          |
+-------------------------------------------------------------+
|                 [ INPUT BOX (400x200) ]                     |
|                           105                               |
+-------------------------------------------------------------+
|  [ 7 ]    [ 8 ]    [ 9 ]    [ DELETE ]                      |
|  [ 4 ]    [ 5 ]    [ 6 ]    [ CLEAR  ]                      |
|  [ 1 ]    [ 2 ]    [ 3 ]    [ SUBMIT ]                      |
|       [ 0 (WIDE) ]       |  [ SKIP (WIDE) ]                 |
+-------------------------------------------------------------+
```

### Visual Assets Specification (Station X1)

| Asset Name | Target File Name | Dimension (W × H) | Format | Description & States |
| :--- | :--- | :--- | :--- | :--- |
| **Question Display Box** | `Adapto_Field Input_600x200_Putih.png` | `600 × 200 px` | PNG | High-contrast white/light translucent container with cyber border. Holds question text. |
| **Answer Input Box** | `Adapto_Field Input_400x200_Hijau.png` | `400 × 200 px` | PNG | Neon green glowing field box for typed digits. |
| **Number Buttons (0–9)** | `Adapto_BUTTON NUMBER_Neutral_[0-9].png`<br>`Adapto_BUTTON NUMBER_Clicked_[0-9].png` | `200 × 200 px` | PNG | Keypad digit buttons (0 through 9).<br>• **Neutral:** Dark matte background.<br>• **Clicked:** Inverted glow & pressed depth. |
| **Delete Button** | `Adapto_BUTTON ICON_Neutral_Delete.png`<br>`Adapto_BUTTON ICON_Clicked_Delete.png` | `200 × 200 px` | PNG | Backspace icon button (deletes 1 digit). |
| **Clear Button** | `Adapto_BUTTON ICON_Neutral_Home.png`<br>`Adapto_BUTTON ICON_Clicked_Home.png` | `200 × 200 px` | PNG | Reset icon button (clears input field). |
| **Submit Button** | `Adapto_BUTTON ACTION_Neutral_Submit.png`<br>`Adapto_BUTTON ACTION_Clicked_Submit.png` | `400 × 200 px` | PNG | Action button for submitting answer. |
| **Skip Button** | `Adapto_BUTTON ACTION_Neutral_Finish.png`<br>`Adapto_BUTTON ACTION_Clicked_Finish.png` | `400 × 200 px` | PNG | Action button for skipping current question. |
| **Reaction: Benar** | `Adapto_REACTION BOARD_Jawaban Benar.png` | `800 × 400 px` | PNG | Full-card overlay popup with green checkmark for correct answers. |
| **Reaction: Salah** | `Adapto_REACTION BOARD_Jawaban Salah.png` | `800 × 400 px` | PNG | Full-card overlay popup with red cross for wrong answers. |

---

## 4. Station X2: Cerdas Cermat (Buzzer Battle)

### Summary
Multiple-choice trivia station. Players hit a central Buzzer to claim answer priority, then select options A, B, C, or D.

### Visual Assets Specification (Station X2)

| Asset Name | Target File Name | Dimension (W × H) | Format | Description & States |
| :--- | :--- | :--- | :--- | :--- |
| **Question Banner Container** | `Adapto_Container_X2_Question.png` | `800 × 300 px` | PNG | Translucent container holding question text. |
| **Buzzer Button: Open** | `Adapto_BUZZER_State_Open.png` | `400 × 400 px` | PNG | **State 1 (Open):** Pulsing neon green glow, clickable state. |
| **Buzzer Button: Pressed** | `Adapto_BUZZER_State_Pressed.png` | `400 × 400 px` | PNG | **State 2 (Pressed):** Depressed active state when team hits first. |
| **Buzzer Button: Locked** | `Adapto_BUZZER_State_Locked.png` | `400 × 400 px` | PNG | **State 3 (Locked):** Dimmed red state when locked out or closed. |
| **Choice Buttons (A, B, C, D)** | `Adapto_BUTTON LETTER_Neutral_[A-D].png`<br>`Adapto_BUTTON LETTER_Clicked_[A-D].png` | `400 × 150 px` | PNG | Multiple choice buttons A, B, C, D.<br>• **Neutral:** Dark tile.<br>• **Clicked:** Highlighted selection. |

---

## 5. Station X3: AI Unsolved Case

### Summary
Forensic investigation station. Teams select a suspect (Dika, Sita, Boni) and type text justification.

### Visual Assets Specification (Station X3)

| Asset Name | Target File Name | Dimension (W × H) | Format | Description & States |
| :--- | :--- | :--- | :--- | :--- |
| **Suspect Card Container** | `Adapto_Card_Suspect_Neutral.png`<br>`Adapto_Card_Suspect_Selected.png` | `300 × 400 px` | PNG | Card container for suspect selector (Dika, Sita, Boni).<br>• **Selected:** Cyber neon green border glow. |
| **Justification Field Box** | `Adapto_Field_Textarea_800x400.png` | `800 × 400 px` | PNG | Large multi-line placeholder container for text justification input. |
| **Submit Case Button** | `Adapto_BUTTON ACTION_Neutral_SubmitCase.png`<br>`Adapto_BUTTON ACTION_Clicked_SubmitCase.png` | `500 × 150 px` | PNG | Action button for submitting forensic report. |

---

## 6. Station X4: Flash Memory Recall

### Summary
Memory recall station. Phase 1 displays media on stage screen; Phase 2 opens step-by-step recall questions on tablet.

### Visual Assets Specification (Station X4)

| Asset Name | Target File Name | Dimension (W × H) | Format | Description & States |
| :--- | :--- | :--- | :--- | :--- |
| **Flashing Phase Banner** | `Adapto_Banner_X4_Flashing.png` | `800 × 250 px` | PNG | Screen banner telling players to watch main stage display. |
| **Recall Question Card** | `Adapto_Card_X4_RecallQuestion.png` | `800 × 300 px` | PNG | Container card for single-question step display. |
| **Choice Tiles (A, B, C, D)** | `Adapto_BUTTON LETTER_Neutral_[A-D].png`<br>`Adapto_BUTTON LETTER_Clicked_[A-D].png` | `400 × 120 px` | PNG | Option selector tiles A, B, C, D. |
| **Navigation Button: PREV** | `Adapto_BUTTON ACTION_Neutral_Prev.png`<br>`Adapto_BUTTON ACTION_Clicked_Prev.png` | `260 × 120 px` | PNG | Step backwards in question list. |
| **Navigation Button: NEXT** | `Adapto_BUTTON ACTION_Neutral_Next.png`<br>`Adapto_BUTTON ACTION_Clicked_Next.png` | `260 × 120 px` | PNG | Step forwards in question list. |
| **Navigation Button: SUBMIT TEST** | `Adapto_BUTTON ACTION_Neutral_SubmitTest.png`<br>`Adapto_BUTTON ACTION_Clicked_SubmitTest.png` | `300 × 120 px` | PNG | Final test submission action button. |

---

## 7. Deliverables Checklist for Visual Team

- [ ] Export all assets in **PNG (24-bit with alpha transparency)** unless marked JPG.
- [ ] Maintain consistent 2x scale for high PPI tablet screens.
- [ ] Store files in the project path: `/PNG ASSET/` (or `/public/png-assets/`).
- [ ] Ensure exact match for `Neutral` and `Clicked` file names so state swapping script operates seamlessly.
