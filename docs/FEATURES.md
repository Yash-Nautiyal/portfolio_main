# Feature registry

Treat this as a test list. Re-check the items a change could touch, and run the whole list at every phase end. Never bring back anything under "Removed on purpose".

## Home window (phase 1)
- [ ] Boot: `flutter run` terminal shows for about 1.6s. A click or any key skips it.
- [ ] After boot, the cards stagger in (70ms apart) and the phone drops on its strap with an overshoot.
- [ ] Toolbar: traffic lights, `lib/main.dart` path and Pixel 8 chip. Restart replays the boot.
- [ ] Toolbar tools are live (phase 4; see below).
- [ ] Intro: the "!" waves once after boot and again when you hover the heading. The Flutter chip is tinted. (Phase 3 made the chips draggable; see below.)
- [ ] Device card: "Greater Noida, IN" (from `config.about.location`), live IST clock, seeded street map, pulsing dot.
- [ ] CTA: see phase 3. A modifier click still follows the real link (`/contact` or the resume).
- [ ] Honeycomb: 2-3-2 hex grid. On hover, a cell grows and shows its label. (Phase 3: every cell, including the Flutter centre, opens on the phone.)
- [ ] Latest builds: three projects from `data/projects.tsx`. A "Career" subsection lists one row per job from `data/career.ts` (phase 3.5).
- [ ] Hanging phone: drag the stage, strap or frame to swing it around the strap anchor (the screen has its own gestures). On release it keeps its velocity, then settles.
- [ ] Phone tilts towards the pointer in 3D, and a glass sheen follows the tilt and swing.
- [ ] A slow idle sway runs while nobody touches the phone.
- [ ] The phone's size tracks the stage height (container query units), so the whole device always fits.
- [ ] Lock screen: live IST time and date, status bar, a notification with the current job ("Flutter Developer at AppX"), "Swipe up to open" hint.
- [ ] `prefers-reduced-motion`: no drop, no sway and no card animation, and the boot shortens to 200ms.

## Phone OS (phase 2)
- [ ] Unlock: swiping up past 18% of the screen height unlocks. A shorter drag springs back. A plain tap, Enter or Space also unlocks.
- [ ] Home screen: clock, date and "Building at <current company>" glance. The app grid is EmployeeOS, 2DOO, NewsFeed, Career and About me; icons stagger in.
- [ ] Dock: Message, GitHub, LinkedIn, Google Play, Resume. Each opens its screen on the phone (phase 3).
- [ ] Tapping a build icon (or a builds row) shows the `Installing <x>.apk…` toast, then the phone swings and the app opens.
- [ ] App: about 0.75s splash (app colour and icon), then a full-screen screenshot pager. Touch scrolls natively; a mouse drags to page; arrow keys work when focused. Dots track the page.
- [ ] App action chips: Case study (`/projects/[id]`), Google Play (2DOO only), Source.
- [ ] About me app: from `config.about` (the CV): role, location, overview, education, languages, state management. No phone number.
- [ ] The home bar returns to the home screen, and Escape works as Android back (app or About goes to home).
- [ ] Builds rows: hovering or focusing leans the phone towards the list. The running app's row shows a green "Running" chip.
- [ ] Restart resets the phone to the lock screen.

## Cards drive the phone (phase 3)
- [ ] Skill chips (Flutter, Dart, Supabase, Firebase, PostgreSQL, Android) are Draggables. After 6px of drag, a ghost chip follows the pointer and the source chip fades.
- [ ] While a chip is dragged, the phone gets a faint Flutter-blue ring. Hovering over the stage makes the ring bright and the caption says "drop the skill on the phone".
- [ ] Dropping on the stage opens the Skill screen: logo, description from `SKILLS`, the builds that use it (tap one to run it), and "Used at work: <companies>" for every job that lists it. A drop anywhere else springs the ghost back.
- [ ] Clicking a chip, or pressing Enter or Space on it, also opens the Skill screen.
- [ ] Honeycomb cells fly their icon in an arc into the phone screen (560ms WAAPI clone). The phone swings on arrival and the screen opens: GitHub, LinkedIn, Compose (Email), Store (Play), CV (Resume), Home (All builds), Flutter skill (centre).
- [ ] GitHub screen: real avatar (github.com/<user>.png), the three repos from `projects.tsx`, "Open GitHub profile".
- [ ] LinkedIn screen: banner, YN avatar, "<title> at <company>" from the current job, Greater Noida, India, "View profile".
- [ ] Store screen: 2DOO listing with icon, developer, category, Install (the real Play link), four screenshot thumbnails.
- [ ] Resume screen: Google Drive `/preview` iframe of the real CV, plus "Open or download".
- [ ] Contact me kicks the phone towards the visitor and opens Compose (name, email, message). Validation runs inline before sending.
- [ ] Compose posts to `/api/contact`. On success: home screen, "Message sent" banner drops in, the phone kicks, `navigator.vibrate`, and the banner leaves after 3.4s. API errors show inline.
- [ ] CV button flies into the phone and opens the Resume screen.
- [ ] Every new screen has a top bar back arrow. The home bar and Escape also go home.
- [ ] Light screens (About, Compose, LinkedIn, Store) switch the status bar and home bar to dark ink.

## Work pass and career (phase 3.5)
- [ ] Data comes from the CV (`Jake_s_Resume__Anonymous_-3.pdf`): AppX (Jul 2026 – now) and F13 Technologies (Jan 2025 – Jul 2026), in `experience.ts`. Stats and colours live in `data/career.ts`.
- [ ] A second, blue lanyard strap with a metal clip holds a work ID pass behind and to the left of the phone (21°). It has its own pendulum physics and sways idly.
- [ ] Knock: the phone and the pass can't pass through each other. Swinging the phone into the pass shoves it, with velocity transfer.
- [ ] Drag the pass strap to swing the pass on its own. Tap the pass (no drag) to bring it forward.
- [ ] Forward: see "Physics v2" (carried round, then hangs in front). The phone opens the Career screen. The pass shows its front first, then turns to its back after 0.9s.
- [ ] Pass front: frosted holder with a clip slot, job-coloured insert, company, Employee or Alumni, YN monogram, name, title, dates, barcode. Back: three impact stats from the CV, plus skill chips.
- [ ] Tapping the pass while it's forward flips it. Tapping the phone (anywhere, screen included), Escape, or leaving the Career screen sends the pass back. There is no "Back to phone" button.
- [ ] Career screen on the phone: AppX and F13 tabs (switching swaps the pass insert, which slides in), title, company, span, CV bullets with highlight keywords in bold, and education.
- [ ] Entry points: job rows in the builds card (green "Showing" chip while that job is forward; clicking again hides it), the Career icon on the home screen, and tapping the pass.
- [ ] The caption changes to "Work pass…" while the pass is forward.

## Real 3D scene (phase 3.7, replaces the CSS-3D phone and pass)
- [ ] The stage renders in WebGL (React Three Fiber 9.8.1, drei 10.7.9, three 0.186.1), lazy-loaded with `next/dynamic` (`ssr: false`). World units equal CSS px (camera distance is solved from the stage height).
- [ ] Phone model: extruded rounded slab (glass caps, metal frame), rounded black bezel, punch-hole, two side buttons, USB-C, back camera island (extruded) with 2 lenses (metal ring, barrel, glass dome) and flash, plus an extruded Flutter logo and "BUILT WITH FLUTTER" (troika text).
- [ ] The live phone screen is a normal React portal (HangingPhone owns the host div), placed in 3D by three's CSS3DRenderer on a layer under the canvas (z 5; canvas z 10, pointer-events none). A rounded mesh writes alpha 0 where the screen is, so meshes in front (the pass) still cover it. The screen hides while the phone shows its back. It survives Fast Refresh and Restart (drei Html's separate root didn't: the screen vanished). The portal renders only after hydration.
- [ ] Pass holder copies the reference "Digital Pass": a smoky charcoal plastic frame (extruded, window and oval slot cut as reverse-wound holes) with a thick border and a deeper top band, clear glare windows, a black plastic hook with a metal loop through the slot, and a dark strap. Content inside is the original work ID. Front: job colour, company, Employee/Alumni, YN, name strip, title, dates, barcode. Back: "<JOB> · IMPACT", 3 stats, skills. Inserts use unlit materials (lit ones went black inside the holder). Darker card (2026-10-14): front insert at 62% of the job colour, back at 30%, near-black opaque frame, faint window glare. 3D text uses DM Sans woff from `/public/fonts`.
- [ ] Lighting: ambient, 2 directionals, and an Environment built from Lightformers (no HDR download).
- [ ] The pass hangs at z = -42 behind the phone, eases back to -128 while the phone is turned (so the far edge never cuts it), and comes to +46 (scale 1.04) when forward.
- [ ] Gestures, the same model as before: one listener set on the stage, and bodies found by raycast (userData `hit` tags). Body = Y spin; strap or empty stage = swing; tap = select. An invisible 44x36 px margin box around the phone gives a grab area, because the screen fills the front.
- [ ] Physics constants unchanged from 3.6 (THROW 0.72, swing cap 230°/s, spin 0.55°/px, cap 720°/s, friction 2.4, settle below 140°/s, knock, kicks ×0.8).
- [ ] Hover cursor: grab over a body, ew-resize over a strap (`data-hover` on the stage).
- [ ] Skill drop target: the live screen gets a Flutter-blue inner glow (ready, then brighter when over).
- [ ] Restart keeps the WebGL scene mounted and re-keys only the card columns. The drop effect resets the physics and replays the fall. Remounting the scene broke drei's Html root.
- [ ] No lighting or z flicker: the camera's near/far is 200/6000 (it was 1/10000, too coarse for layers px apart). Card layers are 0.25–0.9 px apart, the phone bezel is +0.3 over the body cap, and the frame and tint layers are opaque, so no transparent sorting.
- [ ] Dev-only `window.__hp` exposes the sim for headless tests.

## Physics v2: two pendulums on one ring (2026-10-14)
- [ ] Each body is a real gravity pendulum about the shared ring: θ'' = -(g/L)·sin θ - c·θ' with g = 6200 px/s² and c = 0.85/s. Each has its own length and mass (phone 2, pass 0.6), so each has its own rhythm. They are separate entities.
- [ ] Side by side, they collide: contact at a 24° angular gap, with mass-weighted position correction and an impulse (restitution 0.3). At rest they lean on each other (phone about -5°, pass about +19°) and knock when swung. Dragging one body (via strap or stage) shoves the other.
- [ ] Nothing freezes. A tapped or forward body still hangs under gravity, and a faint breeze torque keeps both alive at rest.
- [ ] Carry, like a hand moving it round. Tapping the pass holds it out to the side (hand spring toward phone + 46°), and once it clears the phone's edge (or after 0.9s) it swaps depth layer: pass +14, phone -6. It's then let go and hangs in front, centred, and flips to its back. Tapping the phone (or Esc) carries it back the same way, and contact re-engages softly.
- [ ] After a carry, the hand lowers the pass to where it hangs (eased guide, fades over 1.2s) instead of dropping it from the side. No big swing, about 1° overshoot.
- [ ] While the pass is turned (spun, coasting or mid-flip) behind the phone, it backs off to z -128 so its edge never cuts the phone screen. Same as when the phone spins.
- [ ] While the pass hangs in front, dragging the phone swings it (no Y spin), so its edge can't come through the pass. A tap still puts the pass back. A phone still turning when the pass comes forward backs off to z -128 until it settles.
- [ ] Putting the pass back no longer sends the phone home; the Career screen stays readable.
- [ ] While the pass hangs in front (it covers the phone's Career tabs), a job switcher sits on the stage under it (AppX / F13 with job-colour dot and dates). Switching swaps the insert and the pass stays in front. The builds card's Career rows also switch jobs.
- [ ] Pass back: 3 stats (spacing 46, value 26) plus up to 4 skills, so nothing overlaps. The full list is on the phone.
- [ ] Spin and twist unchanged (coast plus settle to a face; the pass face syncs its flip state).

## One object, keyring hinge, side pose (2026-10-15)
- [ ] Dragging the phone (frame or margin) or the pass rotates the whole lanyard as one 3D object: the straps, phone and pass. Horizontal drag = yaw (0.55°/px), vertical drag = pitch (±22°). On release it coasts, then settles facing front. Strap, ring or empty stage = swing that body.
- [ ] Hang point: one shared point 10px above the stage top (out of view). Two separate straps drop from it: black to the phone ring, dark grey to the pass hook. The whole-lanyard rotation pivots there.
- [ ] The pass's own turn is only its face (tap flips it). There's no per-body drag spin.
- [ ] Pass forward: it hangs in front, resting against the phone's left side at a 38° gap with an even-ish split (front contact masses 1.3:1; phone about -17°, pass about +20°) and scaled 0.92, so the phone's career text is readable beside it. The job switcher still covers the tabs region.
- [ ] Contact applies in both layers (not while the hand holds the pass out).
- [ ] No crossing (traced: 0 risky frames over carry forward/back, tap-flip, job switch and a mid-carry spin):
  - A pass that has to turn over first moves clear in depth (+110 in front, -128 behind). The turn only starts when it is more than 60px from the phone in depth or past its edge, then it comes back.
  - The layer swap during a carry waits for the pass to clear the phone's edge (2.5s fallback, was 0.9s).
  - Pointer tilt is applied to the whole lanyard, not to each body. Swing twist on the pass is capped at 3°.
- [ ] Depth layers are tight (about 20px apart, just over the phone plus pass thickness): side by side, phone +6 / pass -14; pass forward, pass +14 / phone -6. Turned side-on, no hollow gap shows between them (it was 82px).

## Flutter dev tools (phase 4, 2026-10-15)
- [ ] ⚡ Hot reload (button or `r`): cycles 4 colour themes via CSS variables (wallpaper `--wp-*`, stage glow `--glow-*`). Phone and pass state are untouched. A quick flash plays and the toast shows Flutter's line: "Reloaded 1 of 642 libraries in Nms (compile, reload, reassemble)".
- [ ] Restart (button or `R`): hot restart, replays the boot (unchanged).
- [ ] Debug paint (button or `p`, `aria-pressed`): every `[data-widget]` gets a cyan outline and a name tag (AppBar, Column, Row, Wrap, ListView, MaterialApp; Stack in pink). Card padding is tinted.
- [ ] Slow (`aria-pressed`): Flutter's timeDilation 5. Every document animation/transition runs at playbackRate 0.2 (re-applied every 150ms for new ones) and the 3D physics time scale is 0.2. The toast shows "timeDilation = 5.0" / "1.0".
- [ ] Device menu (toolbar chip ▾, role menu with menuitemradio; closes on outside click or Esc). The toolbar is z 60 and not clipped, so the menu sits above the cards and the 3D stage: Pixel 8 / iPhone 15 / Pixel Tablet. The lanyard spins (900°/s) and the model swaps 110ms in, while edge-on. Toast: "Connected to … Syncing files…".
- [ ] Device models: Pixel = punch hole, camera bar, 2.12 aspect. iPhone = Dynamic Island, square 3-lens module (top-left from the back), 2.06 aspect, rounder corners, lighter frame. Tablet = wider body (0.4h, aspect 1.42), thin, camera in the bezel, a single rear lens, smaller back logo.
- [ ] The live screen resizes per device (screen w/h/radius from `dimsFor`), and the UI type scale `--pw` stays phone-sized. `.os[data-device]` tweaks: iOS status bar bold with island spacing; tablet uses a 6-column app grid and tighter top padding.
- [ ] The contact gap and carry clearance scale with device width (`gapScale`). The pass itself stays the same size on every device (width = 0.9 × the phone's base width).
- [ ] The device menu opens with a standard dropdown animation: fade plus scale 0.96 from the top-right, 140ms ease-out.
- [ ] Shortcuts are ignored while typing (input, textarea, contenteditable) or with modifier keys.

## Removed on purpose
- Photo-and-handle card front (tried 2026-10-14). The user wanted only the reference's holder UI; the original content stays.
- drei `Html` for the screen (2026-10-14). Its separate React root broke on remount; replaced by a CSS3DRenderer portal.
- CSS-3D phone and pass (data-three toggling, CSS edges and camera bump). Replaced by the WebGL models on 2026-10-14 because the user said the 3D model wasn't up to the mark.
- Spring-to-pose swing (fixed rest angles, PHONE_ASIDE/PASS_FRONT targets) on 2026-10-14. The tapped body went stiff ("stagnant") while the other swung; replaced by gravity pendulums plus contact.
- Visible keyring hinge with neck strap (2026-10-15). The user didn't like it; replaced by two straps from a point above the stage.
- Per-body Y spins for the phone and pass (2026-10-15). The user asked for both to rotate as one 3D object.
- Pass centred in front of the phone (2026-10-15). It hid the phone; it now rests to the side.
- Phone "come forward" on tap (tried 2026-10-14). The user wanted the original behaviour: tapping the phone only sends the pass back.
- "Back to phone" button (2026-10-14). Tapping the phone does it.
