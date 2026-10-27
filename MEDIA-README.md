# /media — Videography & Video Editing Portfolio Guide

Welcome to the `/media` page (`media.html`). This document details all 23 uploaded local video productions in `content/Media/`, their technical specifications, and the interactive HTML5 playback system.

---

## 1. Overview & Architecture

The `/media` section operates with zero framework overhead (vanilla HTML5, CSS3, JavaScript):
- **Direct HTML5 Playback**: Instead of third-party iframes, cards play high-quality local `.mp4` video files directly with full native video controls.
- **Original Instagram References**: Videos produced for Instagram retain an `"Open on Instagram ↗"` link to the original publication.
- **Technical Specs HUD**: Every card extracts and displays technical metrics (resolution, fps, size, duration, bitrate).
- **100% Portfolio Isolation**: Scoped under `body.media-page`. All existing portfolio files remain completely untouched.

---

## 2. All 23 Uploaded Video Productions & Metrics

| # | Video File | Resolution | FPS | Duration | File Size | Title / Category | Format |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| **01** | `APS NMC Media Team Official Showcase.mp4` | 720×1280 | 30 FPS | 0:39 | 6.95 MB | APS NMC Media Team Official Showcase | **★ Featured Reel** |
| **02** | `RCM.mp4` | 1080×1920 | 60 FPS | 0:44 | 87.27 MB | RCM Cinematic Commercial Showcase | FHD 60FPS Vertical |
| **03** | `APS NMC MUN VII Official Aftermovie Teaser.mp4` | 720×1280 | 30 FPS | 0:45 | 5.21 MB | APS NMC MUN VII Official Aftermovie Teaser | Vertical Reel |
| **04** | `Investiture cermony.mp4` | 720×1280 | 30 FPS | 0:44 | 8.18 MB | Student Council Investiture Ceremony | Vertical Reel |
| **05** | `Awards Ceremony.mp4` | 720×1280 | 30 FPS | 0:52 | 23.55 MB | Sports and Awakener Award Ceremony | Vertical Reel |
| **06** | `Delegate Atmosphere & High-Stakes Pacing.mp4` | 720×1280 | 30 FPS | 0:24 | 7.96 MB | APS MUN VII — Delegate Atmosphere & Pacing Reel | Vertical Reel |
| **07** | `Sound Design & Kinetic Rhythm Teaser.mp4` | 720×1280 | 30 FPS | 0:18 | 5.16 MB | APS MUN VII — Sound Design & Kinetic Teaser | Vertical Reel |
| **08** | `High-Energy Event Montage & Transitions.mp4` | 720×1280 | 30 FPS | 0:25 | 3.94 MB | APS MUN VII — High-Energy Event Montage | Vertical Reel |
| **09** | `Visual Storytelling & Conference Anthem.mp4` | 720×1280 | 30 FPS | 0:21 | 3.12 MB | APS MUN VII — Visual Storytelling & Conference Anthem | Vertical Reel |
| **10** | `Official Closing Ceremony & Awards Reel.mp4` | 720×1280 | 30 FPS | 0:16 | 2.77 MB | APS MUN VII — Closing Ceremony & Awards Reel | Vertical Reel |
| **11** | `Delegate Life & Unfiltered Moments.mp4` | 720×1280 | 30 FPS | 0:15 | 2.48 MB | APS MUN VII — Delegate Life & Unfiltered BTS | Vertical Reel |
| **12** | `General Assembly Grand Finale Montage.mp4` | 720×1280 | 30 FPS | 0:13 | 2.52 MB | APS MUN VII — General Assembly Grand Finale | Vertical Reel |
| **13** | `Diplomacy in Motion.mp4` | 720×1280 | 30 FPS | 0:14 | 1.57 MB | APS MUN VII — Diplomacy in Motion (Committee Reveal) | Vertical Reel |
| **14** | `Crisis Committee Drama & Sound Staging.mp4` | 720×1280 | 30 FPS | 0:10 | 1.57 MB | APS MUN VII — Crisis Committee Drama & Suspense | Vertical Reel |
| **15** | `He Said yes.mp4` | 720×1280 | 30 FPS | 0:11 | 1.97 MB | He Said Yes — Cinematic Proposal Story | Vertical Reel |
| **16** | `UNSC Committe video.mp4` | 480×640 | 30 FPS | 1:00 | 2.59 MB | APS MUN VII — UNSC Committee Debate | Vertical Reel |
| **17** | `Leadership & Creative Direction Anthem.mp4` | 1276×718 | 30 FPS | 0:47 | 9.08 MB | Leadership & Creative Direction Anthem (16:9) | **★ Featured Widescreen** |
| **18** | `teaserrr for Elysium South.mp4` | 2560×1440 | 120 FPS | 0:24 | 36.14 MB | Elysium South Ultra-Cinematic Teaser (2K 120 FPS) | Widescreen 16:9 |
| **19** | `NMC Press Event Highlights & Campus Storytelling.mp4` | 1276×718 | 30 FPS | 0:26 | 3.50 MB | NMC Press Event Highlights & Campus Storytelling | Widescreen 16:9 |
| **20** | `Opening Ceremony Grand Sequence.mp4` | 1276×720 | 30 FPS | 0:21 | 4.62 MB | Opening Ceremony Grand Sequence | Widescreen 16:9 |
| **21** | `Parlimentary Style Debates.mp4` | 1280×712 | 30 FPS | 0:34 | 6.87 MB | Parliamentary Style Debate Highlights | Widescreen 16:9 |
| **22** | `FootBall tournament.mp4` | 1280×712 | 30 FPS | 0:13 | 4.51 MB | Championship Football Tournament Final | Widescreen 16:9 |
| **23** | `Mun video.mp4` | 1276×718 | 30 FPS | 0:22 | 2.22 MB | APS NMC MUN VII — Grand Conference Widescreen Film | Widescreen 16:9 |

---

## 3. High-Resolution Poster Thumbnails & Playback Mechanics

- **High-Res Poster Frames**: Extracted directly from keyframes of all 23 `.mp4` video files using `ffmpeg` and saved in `content/Media/thumbnails/`.
- **Hardware-Accelerated Zoom**: Thumbnails render via `<img class="media-card-thumb-img">` with a translucent cinematic dark vignette gradient overlay, smoothly zooming `scale(1.06)` on card hover.
- **Hero Viewfinder Frame**: Features the high-contrast poster of `APS NMC Media Team Official Showcase.mp4` under the camera crosshair and HUD.
- **Click to Play**: Clicking any card smoothly transitions to native HTML5 `<video controls autoplay playsinline>` with the poster frame configured for instant buffering playback.
- **Featured Widescreen**: The long-form section features `Leadership & Creative Direction Anthem.mp4` with its matching widescreen poster.
