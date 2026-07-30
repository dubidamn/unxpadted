const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new PptxGenJS();

// Layout Configuration (Widescreen 16:9 -> 13.33" x 7.5")
pptx.layout = 'LAYOUT_16x9';
pptx.title = 'Clash of Unxpadted - Design System & Content PRD';
pptx.author = 'Antigravity AI';
pptx.company = 'Infinix Mobility x Ruangguru';

// Theme Colors
const COLOR_BG = '080808';
const COLOR_SURFACE = '121212';
const COLOR_CARD = '181818';
const COLOR_BORDER = '2A2A2A';
const COLOR_PRIMARY = '39FF14'; // Neon Green
const COLOR_CYAN = '00E5FF';    // Team X Cyan
const COLOR_CRIMSON = 'FF3B30'; // Team Y Crimson
const COLOR_PURPLE = 'A855F7';  // GM Purple
const COLOR_WHITE = 'FFFFFF';
const COLOR_TEXT_MUTED = 'A3A3A3';

const FONT_TITLE = 'Arial';
const FONT_BODY = 'Helvetica';

// Helper function to add standard slide background & header with strict margins
function createBaseSlide(titleText, categoryBadge = 'PRODUCT REQUIREMENT DOCUMENT') {
  const slide = pptx.addSlide();
  
  // Background
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: COLOR_BG }
  });

  // Top Neon Accent Line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: COLOR_PRIMARY }
  });

  // Category Badge
  slide.addText(categoryBadge.toUpperCase(), {
    x: 0.6, y: 0.35, w: 8.0, h: 0.25,
    fontSize: 9, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE
  });

  // Slide Title
  slide.addText(titleText, {
    x: 0.6, y: 0.6, w: 12.1, h: 0.5,
    fontSize: 22, bold: true, color: COLOR_WHITE, fontFace: FONT_TITLE
  });

  // Bottom Footer Line & Text
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 6.8, w: 12.13, h: 0.02,
    fill: { color: COLOR_BORDER }
  });

  slide.addText('Infinix XPAD 30 Pro × Ruangguru  |  Clash of Unxpadted Design System PRD', {
    x: 0.6, y: 6.9, w: 12.13, h: 0.3,
    fontSize: 9, color: COLOR_TEXT_MUTED, fontFace: FONT_BODY
  });

  return slide;
}

// -------------------------------------------------------------
// SLIDE 1: Title Slide
// -------------------------------------------------------------
const slide1 = pptx.addSlide();
slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLOR_BG } });
slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: COLOR_PRIMARY } });

slide1.addText('CLASH OF UNXPADTED', {
  x: 0.8, y: 1.5, w: 11, h: 0.3,
  fontSize: 13, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE
});

slide1.addText('Design System & Content PRD', {
  x: 0.8, y: 1.9, w: 11, h: 0.8,
  fontSize: 36, bold: true, color: COLOR_WHITE, fontFace: FONT_TITLE
});

slide1.addText('Technical & Visual Requirements for Graphic Designers and Game Content Writers', {
  x: 0.8, y: 2.8, w: 11, h: 0.4,
  fontSize: 15, color: COLOR_TEXT_MUTED, fontFace: FONT_BODY
});

// Card specs overview on title slide
slide1.addShape(pptx.ShapeType.rect, {
  x: 0.8, y: 3.6, w: 11.7, h: 3.0,
  fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 }
});

slide1.addText('PLATFORM & HARDWARE SPECIFICATIONS', {
  x: 1.1, y: 3.9, w: 11.0, h: 0.3,
  fontSize: 12, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE
});

slide1.addText('• Hardware Focus: Infinix XPAD 30 Pro (11" 2K Display, 90Hz Refresh Rate, Dual Speakers)\n• Target Audience: "Slash Gen" Students (18–25) — Hybrid Competition (Academic x Esports)\n• Design Philosophy: Dark Mode Neon High-Contrast UI optimized for outdoor esports arena lighting\n• Content Standard: Universal CSV data structures with live WebSockets sync across all devices', {
  x: 1.1, y: 4.4, w: 11.1, h: 2.0,
  fontSize: 11, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 18
});

// -------------------------------------------------------------
// SLIDE 2: Executive Overview & Product Vision
// -------------------------------------------------------------
const slide2 = createBaseSlide('Executive Overview & Product Vision', 'PRODUCT STRATEGY');

// Card 1: Core Concept
slide2.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide2.addText('🎮 Core Product Concept', { x: 0.9, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE });
slide2.addText('• Hybrid Tournament Platform:\n  Combines Esports speed with Academic challenge (Ruangguru).\n\n• Multi-screen Real-time Sync:\n  Node.js + Socket.IO server orchestrating Stage Display, Gamemaster Panel, and Player Tablets.\n\n• Zero-Latency Touch UI:\n  Built for instant touch response on XPAD 30 Pro tablets.\n\n• High-Contrast Cyber Aesthetic:\n  Designed specifically for outdoor arena sunlight visibility.', {
  x: 0.9, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16
});

// Card 2: Dual Role Target Guidelines
slide2.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide2.addText('🎯 Dual Stakeholder Guidelines', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_CYAN, fontFace: FONT_TITLE });
slide2.addText('🎨 FOR GRAPHIC DESIGNERS:\n- Standardized SVG & PNG asset specs.\n- Strict color tokens & 2K display DPI scaling.\n- Touch feedback states (Idle, Hover, Active, Shockwave).\n\n📝 FOR GAME CONTENT WRITERS:\n- Universal CSV formatting rules & syntax delimiters.\n- Precise character counts for 4 game stations.\n- Automated validation & live GM import rules.', {
  x: 7.1, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16
});

// -------------------------------------------------------------
// SLIDE 3: Design System — Color Tokens & Palette
// -------------------------------------------------------------
const slide3 = createBaseSlide('Design System — Color Tokens & Palette', 'VISUAL DESIGN SYSTEM');

const colors = [
  { name: 'PRIMARY NEON', hex: '#39FF14', rgb: 'RGB(57, 255, 20)', usage: 'Stage Score, Accents, Active Headers', colorHex: '39FF14' },
  { name: 'TEAM X CYAN', hex: '#00E5FF', rgb: 'RGB(0, 229, 255)', usage: 'Team X Tablet, Blue Buzzer, Progress', colorHex: '00E5FF' },
  { name: 'TEAM Y CRIMSON', hex: '#FF3B30', rgb: 'RGB(255, 59, 48)', usage: 'Team Y Tablet, Red Buzzer, Wrong Alert', colorHex: 'FF3B30' },
  { name: 'GM PURPLE', hex: '#A855F7', rgb: 'RGB(168, 85, 247)', usage: 'Gamemaster Controls & Master Admin', colorHex: 'A855F7' }
];

colors.forEach((c, idx) => {
  const xPos = 0.6 + (idx * 3.1);
  slide3.addShape(pptx.ShapeType.rect, { x: xPos, y: 1.3, w: 2.8, h: 1.4, fill: { color: c.colorHex } });
  slide3.addShape(pptx.ShapeType.rect, { x: xPos, y: 2.8, w: 2.8, h: 3.8, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
  
  slide3.addText(c.name, { x: xPos + 0.2, y: 3.0, w: 2.4, h: 0.3, fontSize: 12, bold: true, color: COLOR_WHITE, fontFace: FONT_TITLE });
  slide3.addText(`Hex: ${c.hex}\n${c.rgb}`, { x: xPos + 0.2, y: 3.4, w: 2.4, h: 0.5, fontSize: 10, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE });
  slide3.addText(`Usage Rule:\n${c.usage}`, { x: xPos + 0.2, y: 4.1, w: 2.4, h: 2.2, fontSize: 9.5, color: COLOR_TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 14 });
});

// -------------------------------------------------------------
// SLIDE 4: Typography & Layout Aspect Ratios
// -------------------------------------------------------------
const slide4 = createBaseSlide('Typography & Resolution Hierarchy', 'VISUAL DESIGN SYSTEM');

// Left Column: Typography
slide4.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide4.addText('🔤 Typography Tokens', { x: 0.9, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE });

slide4.addText('DISPLAY / HEADLINE FONT:', { x: 0.9, y: 2.0, w: 5.3, h: 0.25, fontSize: 9.5, bold: true, color: COLOR_TEXT_MUTED, fontFace: FONT_TITLE });
slide4.addText('InfinixDisplay / Outfit / Space Grotesk', { x: 0.9, y: 2.25, w: 5.3, h: 0.4, fontSize: 14, bold: true, color: COLOR_WHITE, fontFace: FONT_TITLE });

slide4.addText('BODY & UI FONT:', { x: 0.9, y: 2.8, w: 5.3, h: 0.25, fontSize: 9.5, bold: true, color: COLOR_TEXT_MUTED, fontFace: FONT_TITLE });
slide4.addText('Aktiv Grotesk Ex / Inter', { x: 0.9, y: 3.05, w: 5.3, h: 0.4, fontSize: 13, bold: true, color: COLOR_WHITE, fontFace: FONT_BODY });

slide4.addText('RULES FOR DESIGNERS:\n• Headings must be uppercase for Station Titles.\n• Numbers in Math/Score UI must use tabular monospaced digits to prevent width jumping.', { x: 0.9, y: 3.7, w: 5.3, h: 2.7, fontSize: 10, color: COLOR_TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 16 });

// Right Column: Resolution & Aspect Ratios
slide4.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide4.addText('📐 Resolution & Viewport Target', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_CYAN, fontFace: FONT_TITLE });
slide4.addText('📺 MAIN STAGE DISPLAY:\n• Resolution: 1920 x 1080 (16:9 Aspect Ratio)\n• Viewing Distance: High visibility from 15 meters.\n\n📱 PLAYER TABLET VIEW (XPAD 30 Pro):\n• Resolution: 2560 x 1600 (16:10 Aspect Ratio)\n• Orientation: Landscape default.\n• Touch Target Minimum: 48px x 48px for finger taps.', { x: 7.1, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// -------------------------------------------------------------
// SLIDE 5: Graphic Specs — Keypad & Controls
// -------------------------------------------------------------
const slide5 = createBaseSlide('Graphic Specs — Numpad & Controls', 'FOR GRAPHIC DESIGNERS');

// Left Box: SVG & Key Dimensions
slide5.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide5.addText('⌨️ Vector SVG & Key Dimensions', { x: 0.9, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE });
slide5.addText('• Vector SVG Standard:\n  Use stroke-width: 2.2px for icons.\n  Icons: Clear (Trash), Backspace (Eraser), Enter (Checkmark), Skip (Fast-Forward Chevron).\n\n• Key Button Dimensions:\n  Base Button Height 56px, Grid Gap 10px.\n  Corner Radius: 8px bevel / rounded corners.\n\n• Icon Format:\n  Inline SVG for zero load time and clean resolution scaling.', { x: 0.9, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// Right Box: Interactive Touch States
slide5.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide5.addText('✨ Touch Interactive States & Glow', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_CYAN, fontFace: FONT_TITLE });
slide5.addText('• Idle State:\n  Fill #141414, Border #262626, Shadow 0 4px 12px rgba(0,0,0,0.5).\n\n• Active / Pressed State:\n  transform: scale(0.96), Border #39FF14, Box-Shadow 0 0 15px rgba(57,255,20,0.4).\n\n• Skip Button:\n  High contrast warning yellow border (#FFCC00) with solid black text.', { x: 7.1, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// -------------------------------------------------------------
// SLIDE 6: Graphic Specs — Arcade Buzzer & Choice Cards
// -------------------------------------------------------------
const slide6 = createBaseSlide('Graphic Specs — Arcade Buzzer & Choice Cards', 'FOR GRAPHIC DESIGNERS');

// Left Box: Arcade Buzzer
slide6.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide6.addText('🔴 Esports Arcade Buzzer Spec', { x: 0.9, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_CYAN, fontFace: FONT_TITLE });
slide6.addText('• Circular Shape: 220px x 220px diameter.\n• Radial Gradient Fill: Center #00E5FF to Edge #007AFF.\n• Outer Rim: 4px solid white metallic ring.\n• Pulsing Glow: CSS keyframe animation @keyframes ripplePulse (0 0 30px rgba(0,229,255,0.6)).\n• Depressed Feedback: Scale to 0.92 on touch with instant haptic audio sound.', { x: 0.9, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// Right Box: Choice Cards
slide6.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide6.addText('🃏 Cybertech Choice Cards [A, B, C, D]', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE });
slide6.addText('• Card Container: Dark glass #141414, 1.5px border #262626.\n• Option Badges: Letter badges A, B, C, D in bold primary green background (#39FF14) with dark text.\n• Selected State: Solid neon green border + 20px box-shadow glow.\n• Disabled State: 40% opacity with lock icon when lockout is active.', { x: 7.1, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// -------------------------------------------------------------
// SLIDE 7: Content Architecture & CSV Rules
// -------------------------------------------------------------
const slide7 = createBaseSlide('Content Architecture & CSV Rules', 'FOR GAME CONTENT WRITERS');

// Left Box: CSV Encoding & Syntax
slide7.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide7.addText('📄 CSV Encoding & Escaping Rules', { x: 0.9, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE });
slide7.addText('• File Encoding:\n  MUST be saved as UTF-8 (Without BOM).\n\n• Escape Quotes & Commas:\n  Wrap text containing commas or special math symbols in double quotes: "47 + 58 = ?"\n\n• Case Sensitivity:\n  Station IDs (X1, X2, X3, X4) and correct answers (A, B, C, D) must be UPPERCASE.', { x: 0.9, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// Right Box: Pipe Delimiter & Auto-Sync
slide7.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide7.addText('🔗 Option Delimiters & Auto-Sync', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_CYAN, fontFace: FONT_TITLE });
slide7.addText('• Pipe Delimiter for Multiple Choice:\n  Separate options using vertical pipe `|` without spaces around pipe:\n  A. 16 Agustus|B. 17 Agustus|C. 18 Agustus|D. 19 Agustus\n\n• Automated Live Import:\n  Uploading CSV automatically sets currentStation and turns stationVisibility ON across all tablets and stage displays live.', { x: 7.1, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// -------------------------------------------------------------
// SLIDE 8: Station X1 & X2 Content Writing Rules
// -------------------------------------------------------------
const slide8 = createBaseSlide('Station X1 & X2 Content Requirements', 'FOR GAME CONTENT WRITERS');

// X1 Box
slide8.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide8.addText('⚡ Station X1: Math Speedrun', { x: 0.9, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE });
slide8.addText('CSV Template: sample_x1_questions.csv\n\nHeaders:\nstation_id, question_text, choices, correct_answer, points, time_limit_sec\n\nWriting Guidelines:\n• Target Count: 20 to 30 math problems.\n• Question Format: Clear arithmetic expressions (e.g. 245 + 179 = ?).\n• Correct Answer: Exact integer or decimal string (e.g. 424).\n• Choices Column: Leave empty (numpad input used).', { x: 0.9, y: 2.0, w: 5.3, h: 4.4, fontSize: 10, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 14 });

// X2 Box
slide8.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide8.addText('🧠 Station X2: Cerdas Cermat', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_CYAN, fontFace: FONT_TITLE });
slide8.addText('CSV Template: sample_x2_questions.csv\n\nHeaders:\nstation_id, question_text, choices, correct_answer, points, time_limit_sec\n\nWriting Guidelines:\n• Target Count: 15 multiple choice questions.\n• Question Max Length: Max 120 characters.\n• Choices Format: Exactly 4 choices separated by `|` (e.g. A. Choice|B. Choice|C. Choice|D. Choice).\n• Correct Answer: Single uppercase letter A, B, C, or D.', { x: 7.1, y: 2.0, w: 5.3, h: 4.4, fontSize: 10, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 14 });

// -------------------------------------------------------------
// SLIDE 9: Station X3 & X4 Content Writing Rules
// -------------------------------------------------------------
const slide9 = createBaseSlide('Station X3 & X4 Content Requirements', 'FOR GAME CONTENT WRITERS');

// X3 Box
slide9.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide9.addText('🔍 Station X3: AI Unsolved Case', { x: 0.9, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_PURPLE, fontFace: FONT_TITLE });
slide9.addText('CSV Template: sample_x3_questions.csv\n\nHeaders:\nstation_id, title, location, time, incident, expected_suspect, expected_reason\n\nWriting Guidelines:\n• Incident Narrative: Max 200 characters describing the mystery.\n• Expected Suspect: Suspect ID (e.g. dika, sita, boni).\n• Expected Reason: Key clue bullet points for GM manual grading.', { x: 0.9, y: 2.0, w: 5.3, h: 4.4, fontSize: 10, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 14 });

// X4 Box
slide9.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide9.addText('📸 Station X4: Flash Memory', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_CRIMSON, fontFace: FONT_TITLE });
slide9.addText('CSV Template: sample_x4_questions.csv\n\nHeaders:\nstation_id, question_text, choices, correct_answer\n\nWriting Guidelines:\n• Target Count: 9 recall questions corresponding to media shown.\n• Question Focus: Specific visual details (colors, counts, sequence).\n• Correct Answer: Single letter (A, B, C, D).', { x: 7.1, y: 2.0, w: 5.3, h: 4.4, fontSize: 10, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 14 });

// -------------------------------------------------------------
// SLIDE 10: Handoff & Delivery Workflow
// -------------------------------------------------------------
const slide10 = createBaseSlide('Handoff & Delivery Workflow', 'TEAM WORKFLOW');

// Left Box: Designer & Writer Deliverables
slide10.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide10.addText('📁 Designer & Writer Deliverables', { x: 0.9, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_PRIMARY, fontFace: FONT_TITLE });
slide10.addText('1. Graphic Designer Deliverables:\n   • Export SVG vectors to `public/assets/ui/` (icons, badges, bezel frames).\n   • Verify key button active states match high contrast neon dark mode.\n\n2. Game Content Writer Deliverables:\n   • Save formatted question files in `sample_question/` directory.\n   • Test CSV import directly via Gamemaster Control Panel (`/gm.html`).', { x: 0.9, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// Right Box: Live Event Verification Protocol
slide10.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.3, w: 5.9, h: 5.3, fill: { color: COLOR_CARD }, line: { color: COLOR_BORDER, width: 1 } });
slide10.addText('🧪 Live Event Test Protocol', { x: 7.1, y: 1.5, w: 5.3, h: 0.4, fontSize: 15, bold: true, color: COLOR_CYAN, fontFace: FONT_TITLE });
slide10.addText('1. Multiview Test:\n   Use `/multiview.html` to verify all 4 screens update simultaneously in real time.\n\n2. Audio Sync Check:\n   Confirm correct & wrong haptic audio plays on tablet submit.\n\n3. Render Production Verification:\n   Verify URL `https://unxpadted.onrender.com` updates live upon CSV upload.', { x: 7.1, y: 2.0, w: 5.3, h: 4.4, fontSize: 10.5, color: COLOR_WHITE, fontFace: FONT_BODY, lineSpacing: 16 });

// Save Presentation
const outputFileName = 'PRD_Design_System_and_Content_Guidelines.pptx';
const localOutputPath = path.join(__dirname, outputFileName);
const artifactDirPath = '/Users/budiantopt/.gemini/antigravity-cli/brain/4195d454-c5ac-46b9-ba0d-2c973323ee4f';
const artifactOutputPath = path.join(artifactDirPath, outputFileName);

pptx.writeFile({ fileName: localOutputPath }).then(() => {
  console.log(`Successfully generated PPTX at: ${localOutputPath}`);
  
  if (fs.existsSync(artifactDirPath)) {
    fs.copyFileSync(localOutputPath, artifactOutputPath);
    console.log(`Successfully copied PPTX to artifacts at: ${artifactOutputPath}`);
  }
}).catch(err => {
  console.error('Error generating PPTX:', err);
});
