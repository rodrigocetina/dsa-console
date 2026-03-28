import React, { useState } from 'react';

// ==========================================
// DATASETS
// ==========================================

// Matrix 1A: Platform self-reported risk maps
// TikTok rows updated with primary document evidence (2023–2025 SRAs)
const matrix1A = [
  { platform: 'Snapchat', category: 'Art. 34.1(a) Illegal Content', risk: 'Hate speech, illegal products', mitigation: 'Prevalence Testing & 40-day SLAs', status: 'Active' },
  { platform: 'Snapchat', category: 'Art. 34.1(b) Fundamental Rights', risk: 'Dark patterns, privacy', mitigation: 'JIT notices, Ghost Mode', status: 'Fully Implemented' },
  { platform: 'Snapchat', category: 'Art. 34.1(c) Civic Discourse', risk: 'Electoral disinformation', mitigation: 'Architectural Curation (1:1 messaging)', status: 'Active' },
  { platform: 'Snapchat', category: 'Art. 34.1(d) Minors & Health', risk: 'Public exposure, sleep', mitigation: 'Friction & Nudges (10 PM silent notifications)', status: 'Active' },

  // TikTok — enriched from primary 2023–2025 SRAs
  { platform: 'TikTok', category: 'Art. 34.1(a) Severe Illegal (CSAM/Terror)', risk: 'CSAM, Terror, Hate Speech. NCMEC reports: 590 (2022) → 590,376 (2023)', mitigation: 'PhotoDNA + IWF hash lists + Google Content Safety Toolkit. ML removes 86.4% at zero views. Tech Against Terrorism (7 workshops). Monthly NCMEC coordination.', status: 'Active — metric ambiguity unresolved' },
  { platform: 'TikTok', category: 'Art. 34.1(a) IP Infringement', risk: 'IP Infringement via UGC', mitigation: 'CIAPC appointed Trusted Flagger (Mar 2024); dedicated priority queue. AAPA membership. Regulatory engagement: Arcom, AGCOM.', status: 'Active — CIAPC submitted 0 Art. 16 reports to date' },
  { platform: 'TikTok', category: 'Art. 34.1(a) GBV / IBSA', risk: 'Gender-based violence, sextortion, non-consensual intimate imagery', mitigation: 'StopNCII hash-matching. IBSA policy covers real and manipulated media. Sextortion reports: 10,731 (2022) → 26,718 (2023). Futures Without Violence partnership.', status: 'Active' },
  { platform: 'TikTok', category: 'Art. 34.1(b) Fundamental Rights', risk: 'Over-moderation suppressing expression; manipulative interface design', mitigation: 'Appeals systems; UN Human Rights Due Diligence framework; RightsCon participation; expert consultations on expression/hate speech balance.', status: 'Active — Art. 25(1) Negative (dark patterns) in 2024 audit' },
  { platform: 'TikTok', category: 'Art. 34.1(c) Civic Discourse / AIGC', risk: 'Coordinated inauthentic behaviour, election interference, deepfakes', mitigation: '11 IFCN fact-checkers; Election Centres in 27 EU languages; Rapid Response (deployed for Israel-Hamas, Crocus Hall); C2PA AIGC labelling (Q2–Q3 2024); Tech Accord; Community Partner Channel (CoPD); $1M climate initiative (632M+ impressions).', status: 'Active — Art. 34(1) unauditable 2025 (EC proceedings)' },
  { platform: 'TikTok', category: 'Art. 34.1(d) Addictive Design / Recommender', risk: 'FYF rabbit holes, addictive design, engagement-maximising architecture', mitigation: 'Default 60-min screen time; nocturnal takeovers; delayed screen-time warnings; Youth Council (15 teens, 8 countries); Family Pairing; Digital Wellness Lab (Boston Children\'s Hospital).', status: 'Active — Arts. 27(1), 27(3), 38(1) Negative 2024 audit' },
  { platform: 'TikTok', category: 'Art. 34.1(d) Minors / Age Assurance', risk: '2,203,894 underage accounts removed Q1 2023 alone; no established state-of-the-art for age verification', mitigation: 'Neutral registration age gate; automated underage detection; default privacy for under-16s; Microsoft age assurance initiative; WePotect partnership; AEPD, CNIL, Garante regulatory engagement.', status: 'Active — Art. 28(1) unauditable 2025 (EC proceedings)' },

  // Instagram — enriched from primary 2024–2025 SRAs and EY Audit Reports
  { platform: 'Instagram', category: 'Art. 15.1 Transparency Reporting', risk: 'Failure to report moderation categorization, monetization restrictions, complaint basis, accuracy indicators', mitigation: 'Transparency Center; DSA Transparency Reports; Community Standards linked from Terms of Use', status: 'NEGATIVE (2024 & 2025) — persistent non-compliance across two consecutive audit cycles' },
  { platform: 'Instagram', category: 'Art. 23.1 Manifestly Illegal Suspension', risk: 'Repeat violators not warned; suspensions not applied after warnings; unreasonable suspension durations', mitigation: 'Community Standards enforcement; 98%+ proactive detection rates claimed', status: 'NEGATIVE (2025) — bilateral failure: under-enforcement AND over-enforcement simultaneously' },
  { platform: 'Instagram', category: 'Art. 34.1(d) Minors & SSIED', risk: 'SSIED (Suicide, Self-Injury, Eating Disorders) escalated to Tier 3 (2025); Protection of Minors Tier 2→Tier 3', mitigation: 'Restricted Mode; disabled profiled ads for <18; SSIED safe messaging guidelines; 99.4% proactive detection', status: 'Tier 3 residual risk — Art. 28.1 UNAUDITABLE (EC proceedings)' },
  { platform: 'Instagram', category: 'Art. 34.1(c) Civic Discourse', risk: 'Misinformation at Tier 3 residual risk; fact-checker coverage gaps; algorithm amplification', mitigation: 'Third-party fact-checkers; Elections integrity measures; authoritative source amplification', status: 'Active — Arts. 34.1/35.1 UNAUDITABLE (EC proceedings)' },
  { platform: 'Instagram', category: 'Art. 27.1 Recommender Systems', risk: 'Explore feature lacked documentation on non-profiled option; Architecture driving SSIED and body image risk', mitigation: 'Non-profiled RS option available (Art. 38.1); Explore parameters documented; Reels and Feed algorithmic options', status: 'Positive w/ Comments — Arts. 34.1/35.1 (adequacy) UNAUDITABLE' },
  { platform: 'Instagram', category: 'Art. 34.1(b) Fundamental Rights', risk: 'Fundamental Rights Tier 1→Tier 2 (worse); increased false positives from content moderation complexity', mitigation: 'Appeals; YPP-equivalent demonetization rules; human review; Three Lines of Defence model', status: 'Active — Art. 25.1 (dark patterns) UNAUDITABLE (EC proceedings)' },

  { platform: 'Meta', category: 'Art. 34.1(a) Child Safety', risk: 'Child exploitation, account takeovers', mitigation: 'Playbooks & Epsilon Checkpoint', status: 'Active' },
  { platform: 'Meta', category: 'Art. 34.1(b) Fundamental Rights', risk: 'Threats to life/safety', mitigation: 'Quick Promotions (QPs) to escalate threats', status: 'Active' },
  { platform: 'Meta', category: 'Art. 34.1(c) Civic Discourse', risk: 'Election disinformation', mitigation: 'Elections Readiness, War Rooms', status: 'Active' },
  { platform: 'Meta', category: 'Art. 34.1(d) Minors & Health', risk: 'Delayed response to severe reports', mitigation: 'Internal SLAs for Turnaround Times', status: 'Active' },

  { platform: 'X', category: 'Art. 34.1(a) Illegal Content', risk: 'Delayed processing of expert notices', mitigation: 'Trusted Flagger Intake Case Group', status: 'Active' },
  { platform: 'X', category: 'Art. 34.1(b) Fundamental Rights', risk: 'Lack of ad transparency', mitigation: 'Prominent Markings based on user declarations', status: 'Active' },
  { platform: 'X', category: 'Art. 34.1(c) Civic Discourse', risk: 'Disinformation/manipulated media', mitigation: 'Community Notes (crowdsourced context)', status: 'Active' },
  { platform: 'X', category: 'Art. 34.1(d) Minors & Health', risk: 'Exposure to explicit media', mitigation: 'Content Warnings & Age-Gating', status: 'Active' },

  { platform: 'Pinterest', category: 'Art. 16 Notice & Action', risk: 'Spread of illegal content, lack of redress', mitigation: 'User Reporting Pipelines', status: 'Active' },

  { platform: 'YouTube', category: 'Art. 34.1(a) Illegal Content', risk: 'CSAM, terror, hate speech via video', mitigation: 'Automated ML Classifiers & hash-matching', status: 'Active' },
  { platform: 'YouTube', category: 'Art. 34.1(b) Fundamental Rights', risk: 'Over-enforcement, monetization risks', mitigation: 'Appeals & YPP guidelines', status: 'Active' },
  { platform: 'YouTube', category: 'Art. 34.1(c) Civic Discourse', risk: 'Deepfakes, election interference', mitigation: 'The 4 Rs (Remove, Raise, Reduce, Reward) & AI Labels', status: 'Active' },
  { platform: 'YouTube', category: 'Art. 34.1(d) Minors & Health', risk: 'Eating disorders, screen time', mitigation: 'Restricted Mode, disabled autoplay for teens', status: 'Active' },
];

// Matrix 1B: Audit findings
// TikTok rows enriched with 2024 Implementation Report + 2025 Assurance Report findings
const matrix1B = [
  { platform: 'Snapchat', conclusion: 'Positive w/ Comments', criticism: 'Informal governance regarding ToS updates', remediation: 'Centralized process to log materiality' },
  { platform: 'Snapchat', conclusion: 'Positive w/ Comments', criticism: 'Deactivation friction on Android app', remediation: 'Added explicit account deactivation button' },
  { platform: 'Snapchat', conclusion: 'Qualified', criticism: 'Ads Gallery lacked search functionality by Creator Name', remediation: 'Committed to adding search functionality' },

  // TikTok 2024 — from KPMG Audit Implementation Report (Sep 2024)
  { platform: 'TikTok', conclusion: 'Qualified (2024)', criticism: 'GITC Failure: platform-wide inability to evidence IT controls operated effectively across 18 of 37 obligations (Arts. 14, 16, 17, 20, 22, 23, 25, 26, 27, 28, 36, 38, 39)', remediation: 'Auditors bypassed GITC; manually assessed code. KPMG recommends GITC confirmation for entire 2025–2026 evaluation period.' },
  { platform: 'TikTok', conclusion: 'Negative (2024)', criticism: 'Art. 27(1) — Recommender system parameters (FYF) not periodically reviewed for transparency compliance', remediation: 'Periodic review of FYF parameters; strengthen design; implement additional controls. Deadline: 30 June 2025.' },
  { platform: 'TikTok', conclusion: 'Negative (2024)', criticism: 'Art. 27(3) — Option to use recommender system not based on profiling: inadequate controls', remediation: 'Periodic review of profiling opt-out functionality; strengthen design. Deadline: 30 June 2025.' },
  { platform: 'TikTok', conclusion: 'Negative (2024)', criticism: 'Art. 38(1) — Recommender system for minors not based on profiling: inadequate controls', remediation: 'Periodic review of minor profiling opt-out; strengthen design. Deadline: 30 June 2025.' },
  { platform: 'TikTok', conclusion: 'Negative (2024)', criticism: 'Art. 25(1) — Dark patterns: online interfaces not subject to periodic review for deceptive/manipulative design', remediation: 'Implement periodic interface review process. Deadline: 30 June 2025.' },
  { platform: 'TikTok', conclusion: 'Positive / Unverifiable (2024)', criticism: 'Trusted Flaggers: CIAPC appointed Mar 2024 and used as primary IP audit test case; CIAPC has submitted zero Art. 16 DSA reports to date', remediation: 'Maintains dedicated intake queue. Zero-volume mechanism certified as compliant.' },

  // TikTok 2025 — from KPMG Assurance Report (Aug 2025)
  { platform: 'TikTok', conclusion: 'Qualified Negative (2025)', criticism: 'Overall opinion: Qualified Negative. 4 Negative conclusions across 90 Specified Requirements. 6 articles unauditable due to EC proceedings.', remediation: 'See individual article findings below.' },
  { platform: 'TikTok', conclusion: 'Negative (2025)', criticism: 'Art. 16(6) — Moderation actions on user-generated notice intake: issues addressed during period but insufficient evidence of full effectiveness', remediation: 'Strengthen moderation action controls and evidence trail.' },
  { platform: 'TikTok', conclusion: 'Negative (2025)', criticism: 'Art. 20(4) — Documentation retention for complaint-handling: gaps identified across evaluation period', remediation: 'Strengthen documentation retention and audit trail controls.' },
  { platform: 'TikTok', conclusion: 'Negative (2025)', criticism: 'Art. 24(5) — CCL (Commercial Content Library): generic "violation terms" for all rejected/expired ads; duplicate statements of reasons; display active in countries where ads were removed', remediation: 'Fix CCL accuracy: specific SoRs, deduplication, country-display correction.' },
  { platform: 'TikTok', conclusion: 'Negative (2025)', criticism: 'Art. 39(3) — Ad repository completeness and accuracy: persistent failures across evaluation period', remediation: 'Repository-level accuracy improvements required.' },
  { platform: 'TikTok', conclusion: 'UNAUDITABLE (2025)', criticism: 'Arts. 28(1), 34(1), 34(2), 35(1), 39(1), 40(12) — Cannot be assessed due to active EC enforcement proceedings. Includes core SRA obligations and researcher data access.', remediation: 'N/A — pending resolution of EC proceedings.' },

  // Instagram — enriched from EY Audit Reports and Implementation Reports (2024, 2025)
  { platform: 'Instagram', conclusion: 'NEGATIVE (2024 & 2025)', criticism: 'Art. 15.1 — Transparency Reporting (Content Moderation): NEGATIVE in BOTH cycles. 2024: 5 distinct non-compliances (monetization restrictions, business entity breakdown, restriction categorization, violation type/detection method, accuracy indicators). 2025: 3 new non-compliances (account suspension categorization, "other related restrictions" metrics, complaint basis for monetization restrictions).', remediation: '2024 remediation target Q2 2025 not met. Reporting framework restructuring planned Q1 2026. Unique in corpus: only cross-cycle recurring failure on same substantive article.' },
  { platform: 'Instagram', conclusion: 'NEGATIVE (2025)', criticism: 'Art. 23.1 — Manifestly Illegal Content Suspension: bilateral failure. (1) Prior warnings not issued to repeat violators. (2) Service not suspended after prior warning. (3) Suspensions imposed for unreasonable duration. Non-compliance in both directions of the same provision simultaneously.', remediation: 'Q4 2025 dashboard/monitoring planned. Not implemented as of September 2025 report.' },
  { platform: 'Instagram', conclusion: 'NEGATIVE (2025)', criticism: 'Art. 20.4 — Complaint Handling: two appeals of legally classified reporter appeals not processed within 7 days (EY-developed benchmark). Non-discriminatory, diligent, and non-arbitrary handling requirements not met.', remediation: 'Q4 2025 implementation planned. Not yet implemented.' },
  { platform: 'Instagram', conclusion: 'NEGATIVE (2024)', criticism: 'Art. 24.1 — Account Suspensions Reporting: inaccurate reporting of suspensions for manifestly illegal content in DSA Transparency Reports.', remediation: 'Already remediated by October 2024 (3rd Transparency Report).' },
  { platform: 'Instagram', conclusion: 'NEGATIVE (2024)', criticism: 'Art. 39.3 — Ads Library: missing removal reason information; improper disclosure of ad content and payer information.', remediation: 'Already remediated April 26, 2024.' },
  { platform: 'Instagram', conclusion: 'NEGATIVE (2024)', criticism: 'Art. 42.2 — Accuracy by Member State Language: missing accuracy indicators; self-reported miscalculated human reviewer metrics.', remediation: 'Q2 2025 planned. Status unclear in 2025 corpus.' },
  { platform: 'Instagram', conclusion: 'Positive w/ Comments (2025)', criticism: 'Art. 27.1 — Recommender Systems: Instagram Explore system card lacked documentation on non-profiled recommender option (Art. 38.1).', remediation: 'Q3 2025 implementation planned.' },
  { platform: 'Instagram', conclusion: 'Positive w/ Comments (2025)', criticism: 'Art. 14.5 — Terms Summary: Terms lack specific summary of available remedies and redress mechanisms in clear, unambiguous language.', remediation: 'H2 2026. The longest implementation delay in the corpus: 2+ years from initial identification to planned remediation.' },
  { platform: 'Instagram', conclusion: 'Positive w/ Comments (2025)', criticism: 'Art. 12.1 — SPOC: Single Point of Contact form was not responding to users from October 2, 2024 to January 24, 2025 due to broken link (service glitch undetected for ~113 days).', remediation: 'Fixed January 24, 2025. Dashboard with real-time alerting implemented.' },
  { platform: 'Instagram', conclusion: 'UNAUDITABLE (2024 & 2025)', criticism: '14 sub-articles unauditable in both cycles due to EC governmental investigations: Arts. 14.1, 16.1, 16.5, 16.6, 17.1, 20.1, 20.3, 24.5, 25.1, 28.1, 34.1, 34.2, 35.1, 40.12. Includes core SRA (Art. 34.1), mitigation adequacy (Art. 35.1), minor protection (Art. 28.1), dark patterns (Art. 25.1), and researcher access (Art. 40.12).', remediation: 'N/A — pending resolution of EC proceedings. Identical black hole pattern to TikTok.' },

  { platform: 'Meta', conclusion: 'Positive w/ Comments', criticism: 'Missed internal 7-day SLA on 1 of 25 tickets due to surge', remediation: 'Implemented dynamic staffing governance' },
  { platform: 'Meta', conclusion: 'Observation', criticism: 'Undefined regulatory terms (rapidly, undue delay)', remediation: 'Reliance on future guidance' },
  { platform: 'X', conclusion: 'Positive w/ Comments', criticism: 'Help Center mistakenly directed Trusted Flaggers to wrong URL', remediation: 'Updated Help Center URL' },
  { platform: 'X', conclusion: 'Positive / Unverifiable', criticism: 'Trusted Flaggers: Queues built but untested', remediation: 'Maintains queue' },
  { platform: 'Pinterest', conclusion: 'Procedural Flaw', criticism: 'Auditor accepted definition of undue delay for receipt as "when a final decision is made"', remediation: 'None' },
  { platform: 'YouTube', conclusion: '[UNAVAILABLE]', criticism: '[Audit Report Missing from Corpus]', remediation: '[UNAVAILABLE]' },
];

// Thematic synthesis (cross-platform)
const synthesis = [
  { theme: '1. Addictive Design & Minor Safety', platforms: 'Snap/YT: UI friction. TikTok: Algorithmic nudges (Arts. 27(1), 27(3), 38(1) Negative). Meta: ML.', auditor: 'Demand auditable UI toggles and code configs (GITC). TikTok: GITC failure means controls unconfirmed.', ec: 'EC targets core algorithmic rabbit holes; nudges fail to address root architectural cause. TikTok Art. 28(1) under formal proceedings.' },
  { theme: '2. Civic Discourse & Elections', platforms: 'X: Community Notes. YT: 4 Rs. Meta: War Rooms. TikTok: 11 IFCN fact-checkers, Election Centres in 27 languages, C2PA AIGC labels. Snap: Curated feeds.', auditor: 'Verify technical existence of features/teams. TikTok: Art. 34(1) unauditable — civic risk assessment formally unverified in 2025.', ec: 'Warns reactive/crowdsourced tools cannot mathematically outpace algorithmic virality. TikTok 2025 SRA now concedes FYF is a civic risk amplifier.' },
  { theme: '3. Illegal Content Automation', platforms: 'TikTok/YT: Heavy ML classifiers. TikTok: 86.4% at zero views (ambiguous). Meta: Proactive ML.', auditor: 'Test IT controls & reporting pipelines. TikTok: GITC failure across moderation systems; CIAPC Trusted Flagger certified with zero operational volume.', ec: 'Over-reliance on automation risks massive blindspots for novel/contextual harms. CSAM 1,000x jump uninterrogated.' },
  { theme: '4. Redress & "Undue Delay"', platforms: 'Meta: 7-day TAT. Snap: 40-day SLA. Pinterest: Post-decision confirmation. TikTok: Art. 16(6) Negative in 2025.', auditor: "Measure compliance against platforms' own self-defined SLAs. TikTok: CCL transparency failures (Arts. 24(5), 39(3) Negative) mean redress data is inaccurate.", ec: 'Allowing platforms to define "undue delay" subverts the right to an effective remedy. TikTok CCL failures compound redress concerns.' },
  { theme: '5. Fundamental Rights & Dark Patterns', platforms: 'Snap: Ghost Mode. X: Ad markings. YT: Appeals. TikTok: Art. 25(1) Negative (dark patterns) in 2024.', auditor: 'Focus on UI/UX functionality & governance documentation. TikTok: periodic review remedy does not require changing any interface element.', ec: 'Views deceptive design as fundamental rights violations. TikTok: engagement-maximising design is the EC\'s core concern; procedural review misses the point.' },
  { theme: '6. Advertising Transparency & Researcher Access', platforms: 'All: Transitioning to DSA Transparency Database compliance. TikTok: CCL built and active.', auditor: 'Check existence of portals and repositories. TikTok: CCL found inaccurate across two audit cycles (Arts. 24(5), 39(3) Negative; Art. 39(1) unauditable).', ec: 'A compliant grade means the tool was built, not that it effectively serves civil society. TikTok CCL failures and Art. 40(12) EC proceedings create a compound accountability vacuum.' },
];

// Scope vs. Substance Disconnect
// TikTok rows revised with primary document evidence and delta annotations
const disconnect = [
  { platform: 'Snapchat', category: 'Illegal Content', claim: '40-Day SLAs for resolution', auditor: 'Checked if SLA met (Positive)', ec: 'Questions if 40 days aligns with DSA intent of undue delay.' },
  { platform: 'Snapchat', category: 'Fundamental Rights', claim: 'JIT notices and Ghost Mode', auditor: 'Forced hard-coding of deactivation button', ec: 'Views deceptive design as rights violation, not just UI error.' },
  { platform: 'Snapchat', category: 'Civic Discourse', claim: '1:1 messaging minimizes virality', auditor: 'Focused on Ads Gallery', ec: 'Rejected premise curated feeds are immune; issued RFI.' },
  { platform: 'Snapchat', category: 'Minors & Health', claim: 'Warnings before posting', auditor: 'Validated policies exist', ec: 'Questions if friction protects against engagement models.' },

  // TikTok — revised from primary documents
  { platform: 'TikTok', category: 'Severe Illegal Content [REVISED]', claim: 'AI removes 86.4% at zero views; PhotoDNA + IWF hash lists; NCMEC coordination (590,376 reports in 2023)', auditor: 'CIAPC queues Compliant despite zero Art. 16 reports submitted. GITC failure across moderation systems 2024–2025. Art. 34(1) unauditable 2025.', ec: 'Over-reliance on AI creates human review blindspots. CSAM 1,000x metric increase never interrogated for detection vs. prevalence ambiguity. \u0394 Deepened: 2025 SRA unverified; primary test mechanism had zero operational history.' },
  { platform: 'TikTok', category: 'Addictive Design / Recommender [REVISED]', claim: '60-min default screen time; nocturnal takeovers; Youth Council; Family Pairing; Digital Wellness Lab partnership', auditor: 'Arts. 27(1), 27(3), 38(1) all Negative 2024 — recommender systems non-compliant on transparency, profiling opt-outs, minor protection. Remediation: strengthen controls by June 2025.', ec: 'FYF engagement-maximisation objective is the risk-generating mechanism. Controls around the engine do not change what it optimises. \u0394 Audit found recommender non-compliance; framed fix procedurally not architecturally.' },
  { platform: 'TikTok', category: 'Minor Safety / Age Assurance [REVISED]', claim: 'Neutral age gate; automated underage detection; default privacy for under-16s; Microsoft age assurance initiative', auditor: 'Art. 28(1) unauditable 2025 (EC proceedings). Q1 2023: 2,203,894 underage accounts removed post-creation.', ec: 'Active enforcement proceedings. TikTok admits "no established state of the art" for age verification. \u0394 Most serious revision: self-admission + operational data + unauditability + EC proceedings converge.' },
  { platform: 'TikTok', category: 'Civic Discourse / AIGC [REVISED]', claim: '11 IFCN fact-checkers; Election Centres in 27 EU languages; Rapid Response system; C2PA AIGC labels; $1M climate initiative (632M+ impressions)', auditor: 'Arts. 34(1) and 35(1) unauditable 2025. AIGC and Recommender Systems newly introduced as cross-cutting risk amplifiers in 2025 SRA.', ec: 'FYF is a high-velocity civic harm amplifier. Voluntary AIGC labels will not be applied by bad actors; algorithms amplify regardless. \u0394 TikTok 2025 SRA now concedes EC\'s core argument — but assessment is unauditable.' },
  { platform: 'TikTok', category: 'Fundamental Rights / Dark Patterns [REVISED]', claim: 'Appeals systems; UN Human Rights Due Diligence; RightsCon participation; expert consultations', auditor: 'Art. 25(1) Negative 2024 (dark patterns). Art. 20(4) Negative 2025 (documentation retention). Art. 35(1) unauditable 2025. GITC failure affects appeals chains.', ec: 'Engagement-maximising design is systemic manipulation. Periodic self-review remedy does not require changing any interface element. \u0394 Negative finding confirms EC concern at article level; procedural framing does not address architectural argument.' },
  { platform: 'TikTok', category: 'Advertising Transparency / CCL [NEW FINDING]', claim: 'Commercial Content Library active; DSA Transparency Database submissions; Trusted Flagger IP queues', auditor: 'Art. 24(5) Negative 2025: generic violation messages, duplicates, active display in removed-content countries. Art. 39(3) Negative. Art. 39(1) unauditable. Compound failure across two cycles.', ec: 'CCL failures undermine researcher and civil society access to ad targeting data. Art. 40(12) (researcher access) also unauditable. \u0394 New finding — not in original dataset. Compound: inaccurate AND unauditable.' },

  // Instagram — revised from primary documents (2024–2025)
  { platform: 'Instagram', category: 'Transparency Reporting (Art. 15.1) [REVISED]', claim: 'Transparency Center; DSA reports; Community Standards linked from Terms of Use', auditor: 'NEGATIVE (2024 & 2025): missing monetization metrics, categorization, complaint basis, accuracy indicators across two consecutive cycles. Q2 2025 remediation target not met.', ec: 'Art. 15.1 is the verification mechanism for all other compliance claims. Two consecutive NEGATIVE conclusions mean no external actor can validate whether the Integrity Ecosystem actually works. Δ Unique in corpus: only cross-cycle recurring substantive failure.' },
  { platform: 'Instagram', category: 'Manifestly Illegal Suspension (Art. 23.1) [NEW FINDING]', claim: '98%+ proactive detection rates; Community Standards enforcement', auditor: 'NEGATIVE (2025): bilateral failure. No prior warnings issued to repeat violators; no suspension after warnings given; suspensions imposed for unreasonable duration.', ec: 'Bilateral failure (under-enforcement AND over-enforcement simultaneously) indicates absence of principled calibration logic, not resource gap. Δ New from 2025 primary docs. Not in original dataset.' },
  { platform: 'Instagram', category: 'Minors & SSIED (Art. 34.1(d)) [REVISED]', claim: 'Restricted Mode; disabled profiled ads for <18; safe messaging guidelines; 99.4% proactive SSIED detection', auditor: 'Art. 28.1 UNAUDITABLE (EC proceedings). SSIED escalates Tier 2 → Tier 3 in 2025 SRA. Art. 28.2 Positive (no profiled ads to minors).', ec: 'On an image-centric platform, SSIED Tier 3 is the EC\'s core concern. Recommender systems may surface at-risk content before detection acts. Sequencing gap (exposure vs. detection) unaddressed. Δ Tier 3 escalation is 2025 primary doc finding.' },
  { platform: 'Instagram', category: 'Risk Assessment Architecture (Arts. 34.1 & 35.1) [NEW FINDING]', claim: 'ISO 31000:2018; UN Guiding Principles; Integrity GRC Programme; Three Lines of Defence; annual SRA (Year 3)', auditor: 'UNAUDITABLE in both 2024 and 2025. EY cannot form opinion on SRA or mitigation adequacy obligations.', ec: 'The platform\'s entire compliance architecture — whether the Integrity Ecosystem is reasonable, proportionate, and effective — has never been independently verified. Δ Identical pattern to TikTok. Δ Instagram Direct exclusion removes private channel from scope entirely.' },
  { platform: 'Instagram', category: 'Recommender Systems (Art. 27) [REVISED]', claim: 'Non-profiled RS option available; Explore parameters documented; Reels and Feed options; Art. 38.1 compliance', auditor: 'Art. 27.1 Positive with Comments (Explore lacked non-profiled option documentation). Arts. 27.2, 27.3 Positive. Arts. 34.1/35.1 UNAUDITABLE.', ec: 'Surface-level Art. 27 transparency checks do not assess whether recommender architecture drives systemic risk. For SSIED on image-centric platform, the EC\'s question is whether algorithmic amplification precedes harm mitigation. Δ Different from TikTok (not Negative), but same architectural black hole.' },
  { platform: 'Instagram', category: 'User Remedies & Terms (Art. 14.5) [NEW FINDING]', claim: 'Terms of Use; Help Center; Community Standards; appeals processes described in linked pages', auditor: 'Positive with Comments (2025): Terms lack explicit summary of available remedies and redress mechanisms in unambiguous language. Planned remediation: H2 2026.', ec: 'A user\'s ability to understand their rights and recourse is the DSA\'s core user-protection commitment. H2 2026 implementation is a 2+ year delay from the audit period. Δ Longest remediation delay in the corpus.' },

  { platform: 'Meta', category: 'Child Safety', claim: 'Playbooks & Epsilon lockdowns', auditor: 'SPOC Volume pipelines', ec: 'Demands proactive algorithmic demotion over reactive reporting.' },
  { platform: 'Meta', category: 'Fundamental Rights', claim: 'Quick Promotions (QPs)', auditor: 'System Inspection', ec: 'Expects evaluation of entire ad-targeting infrastructure.' },
  { platform: 'Meta', category: 'Civic Discourse', claim: 'Elections Readiness', auditor: 'Turnaround Time (SLA)', ec: 'Reactive SLAs inadequate; algorithms amplify before tickets filed.' },
  { platform: 'Meta', category: 'Minors & Health', claim: 'Internal SLAs', auditor: 'SLA Enforcement/Staffing', ec: 'Passing a lenient self-defined metric does not mean risk is mitigated.' },
  { platform: 'X', category: 'Illegal Content', claim: 'Trusted Flagger priority queues', auditor: 'Typographical Checks (broken Help Center URL)', ec: 'Opened formal proceedings for systemic illegal content failures.' },
  { platform: 'X', category: 'Fundamental Rights', claim: 'UI Transparency for ads', auditor: 'Ad Transparency Checks', ec: 'Formal proceedings target Blue Check system as structural dark pattern.' },
  { platform: 'X', category: 'Civic Discourse', claim: 'Community Notes', auditor: 'Verified feature exists', ec: 'Questions if crowdsourcing outpaces algorithmic virality.' },
  { platform: 'X', category: 'Data Access', claim: 'Compliance with Data Access', auditor: 'Policy Verification', ec: 'Formal proceedings cite shortcomings in researcher access.' },
  { platform: 'Pinterest', category: 'Notice & Action', claim: 'User Reporting Pipelines', auditor: 'Accepted delayed receipt definition', ec: 'Acknowledging complaint after investigation subverts effective remedy.' },
  { platform: 'YouTube', category: 'Illegal Content', claim: 'ML Classifiers & hash-matching', auditor: '[UNAVAILABLE]', ec: 'Warns over-reliance on AI leaves blindspots for novel harms.' },
  { platform: 'YouTube', category: 'Civic Discourse', claim: 'Raise authoritative voices, labels', auditor: '[UNAVAILABLE]', ec: 'Bad actors will not voluntarily label deepfakes; algorithms amplify.' },
  { platform: 'YouTube', category: 'Minors & Health', claim: 'Restricted Mode, Bedtime reminders', auditor: '[UNAVAILABLE]', ec: 'Video recommenders are primary vectors for rabbit hole loops.' },
];

// ==========================================
// AUDIT BENCHMARK FRAMEWORK
// Structured for use as an analysis template across all platforms.
// TikTok: fully populated from primary documents (2023–2025).
// All others: pending primary document review.
// ==========================================
const auditBenchmarks = [
  {
    platform: 'TikTok',
    auditCycles: '3 (2023, 2024, 2025)',
    auditor: 'KPMG Advisory N.V.',
    latestOpinion: 'Qualified Negative (2025)',
    gitcStatus: 'Full Failure — 3 consecutive cycles. Affects 18/37 obligations in 2024. Arts. 16(6), 20(4), 24(5), 39(3) Negative in 2025.',
    recommenderAudited: 'Yes — Negative. Arts. 27(1), 27(3), 38(1) all Negative in 2024. Framing: procedural controls gap, not architectural change.',
    unauditableArticles: '6 in 2025: Arts. 28(1), 34(1), 34(2), 35(1), 39(1), 40(12) — all due to active EC proceedings.',
    metricInterrogation: 'No. 86.4% removal rate accepted without false-negative analysis. CSAM 1,000x jump not interrogated for detection vs. prevalence ambiguity.',
    enforcementStatus: 'Formal EC proceedings (multiple articles: minors, recommender systems, researcher access, advertising transparency)',
    trustedFlaggerValidity: 'CIAPC (IP) certified Compliant — submitted zero Art. 16 reports. Mechanism validated with zero operational history.',
    cclStatus: 'Negative (2025): Arts. 24(5) and 39(3). Generic violation messages; duplicates; display active in removed-content countries.',
    platformSelfRevision: 'Yes — 2025 SRA introduces Recommender Systems and AIGC as explicit cross-cutting risk amplifiers. Absent from 2023 SRA.',
    primaryDocStatus: 'Fully reviewed — 6 documents, ~600 pages (2023–2025)',
    benchmarkNotes: 'Highest-complexity compliance profile in corpus. Formal architecture is sophisticated; substantive risk governance is partially unverifiable. 2025 SRA is the first to concede EC\'s central recommender-systems argument.',
  },
  {
    platform: 'Instagram',
    auditCycles: '2 (2023–24; 2024–25). Year 1 exists but not in reviewed corpus.',
    auditor: 'Ernst & Young LLP (EY)',
    latestOpinion: 'No overall unqualified opinion (2025) — 14 sub-articles unauditable. 3 NEGATIVE individual conclusions (Arts. 15.1 ×3, 20.4, 23.1).',
    gitcStatus: 'Not a recurring GITC failure (unlike TikTok). EY audit methodology differs from KPMG. Audits proceeded on evidence basis.',
    recommenderAudited: 'Partially. Art. 27: surface checks Positive (Art. 27.1 Positive w/ Comments — Explore gap). Arts. 34.1/35.1 (architecture adequacy) UNAUDITABLE both cycles. Recommender contribution to SSIED Tier 3 unassessed.',
    unauditableArticles: '14 in BOTH 2024 and 2025: Arts. 14.1, 16.1, 16.5, 16.6, 17.1, 20.1, 20.3, 24.5, 25.1, 28.1, 34.1, 34.2, 35.1, 40.12 — all EC governmental investigations.',
    metricInterrogation: 'No. 99%+ proactive detection rates accepted without sequencing analysis (detection before or after user exposure). SSIED Tier 3 escalation not cross-referenced with detection metrics.',
    enforcementStatus: 'EC governmental investigations blocking 14 sub-articles including Arts. 34.1, 35.1, 28.1, 25.1. Scope not publicly specified.',
    trustedFlaggerValidity: 'Positive (2025) — Arts. 22.1 and 22.6 compliant. No CIAPC-equivalent zero-volume paradox identified.',
    cclStatus: 'Art. 26.1 Positive w/ Comments (2025): Instagram Profile absent from central ad repository July–Sept 2024, remediated Q3 2024. Art. 39.3 Negative (2024), remediated April 2024.',
    platformSelfRevision: 'Yes — 2025 SRA introduces more granular taxonomy (22 Problem Areas from 19) and explicitly acknowledges SSIED and Fraud/Deception control limitations. SSIED Tier 3 escalation self-reported.',
    primaryDocStatus: 'Fully reviewed — 6 documents (2 SRAs, 2 Audit Reports, 2 Audit Implementation Reports)',
    benchmarkNotes: 'Defining finding: Art. 15.1 NEGATIVE in both 2024 AND 2025 — only cross-cycle recurring substantive failure in corpus. Art. 23.1 bilateral failure (2025) is analytically novel. SSIED Tier 3 on image-centric platform is the EC\'s core concern. Instagram Direct excluded from DSA scope entirely.',
  },
  {
    platform: 'Snapchat',
    auditCycles: '[Pending — documents in folder]',
    auditor: '[Pending]',
    latestOpinion: 'Qualified (from dataset)',
    gitcStatus: '[To be assessed from primary documents]',
    recommenderAudited: 'No — Audit focused on Ads Gallery. Recommender/algorithm not in scope.',
    unauditableArticles: '[To be assessed]',
    metricInterrogation: 'No. 40-day SLA accepted without interrogating DSA intent of "undue delay".',
    enforcementStatus: 'RFI issued by EC on civic discourse / recommender systems',
    trustedFlaggerValidity: '[To be assessed]',
    cclStatus: 'Qualified — Ads Gallery lacked creator name search (committed to fix)',
    platformSelfRevision: '[To be assessed]',
    primaryDocStatus: 'Pending — documents available in folder',
    benchmarkNotes: 'EC RFI on recommender systems is the key signal. Architectural self-assessment (1:1 messaging) was not tested by auditors.',
  },
  {
    platform: 'Meta',
    auditCycles: '[Pending — documents in folder]',
    auditor: '[Pending]',
    latestOpinion: 'Positive w/ Comments (from dataset)',
    gitcStatus: '[To be assessed from primary documents]',
    recommenderAudited: 'No — Audit validated SLA compliance and reporting pipelines. Recommendation algorithm not in scope.',
    unauditableArticles: '[To be assessed]',
    metricInterrogation: 'No. SLA compliance (1 missed of 25) accepted without population-level inference or harm-equivalence validation.',
    enforcementStatus: 'No formal proceedings on record (from dataset)',
    trustedFlaggerValidity: '[To be assessed]',
    cclStatus: '[To be assessed]',
    platformSelfRevision: '[To be assessed]',
    primaryDocStatus: 'Pending — documents available in folder',
    benchmarkNotes: 'Reactive SLA paradigm vs. EC demand for proactive algorithmic demotion is the central tension.',
  },
  {
    platform: 'X',
    auditCycles: '[Pending — documents in folder]',
    auditor: '[Pending]',
    latestOpinion: 'Positive w/ Comments (from dataset)',
    gitcStatus: '[To be assessed from primary documents]',
    recommenderAudited: 'No — Community Notes verified as existing. Algorithmic amplification not in scope.',
    unauditableArticles: '[To be assessed]',
    metricInterrogation: 'No. Typographical fix (broken URL) accepted as primary audit interaction on illegal content article.',
    enforcementStatus: 'Formal EC proceedings (illegal content, Fundamental Rights/Blue Check, researcher data access)',
    trustedFlaggerValidity: 'Queues built but untested at scale',
    cclStatus: '[To be assessed]',
    platformSelfRevision: '[To be assessed]',
    primaryDocStatus: 'Pending — documents available in folder',
    benchmarkNotes: 'Highest gap between audit findings (typographical) and EC posture (formal proceedings). Blue Check system as structural dark pattern is the EC\'s core concern.',
  },
  {
    platform: 'Pinterest',
    auditCycles: '[Pending — documents in folder]',
    auditor: '[Pending]',
    latestOpinion: 'Procedural Flaw (from dataset)',
    gitcStatus: '[To be assessed from primary documents]',
    recommenderAudited: '[To be assessed]',
    unauditableArticles: '[To be assessed]',
    metricInterrogation: 'No. Auditor accepted platform definition of "undue delay" as post-investigation — directly inverting DSA notice-and-action intent.',
    enforcementStatus: 'None on record (from dataset)',
    trustedFlaggerValidity: '[To be assessed]',
    cclStatus: '[To be assessed]',
    platformSelfRevision: '[To be assessed]',
    primaryDocStatus: 'Pending — documents available in folder',
    benchmarkNotes: 'Single highest-severity definitional capture finding in the corpus. Analytically significant despite low enforcement attention.',
  },
  {
    platform: 'YouTube',
    auditCycles: '[Pending — documents in folder]',
    auditor: '[Pending]',
    latestOpinion: '[UNAVAILABLE from dataset]',
    gitcStatus: '[To be assessed from primary documents]',
    recommenderAudited: 'No — Audit data unavailable for Civic Discourse and Minors & Health.',
    unauditableArticles: '[To be assessed]',
    metricInterrogation: '[To be assessed]',
    enforcementStatus: 'None on record (from dataset)',
    trustedFlaggerValidity: '[To be assessed]',
    cclStatus: '[To be assessed]',
    platformSelfRevision: '[To be assessed]',
    primaryDocStatus: 'Pending — documents available in folder',
    benchmarkNotes: 'Largest video platform with least audit scrutiny on record. Recommender system risk for minors and civic discourse is the EC\'s primary concern.',
  },
];

const benchmarkKeys = [
  { key: 'platform', label: 'Platform' },
  { key: 'auditCycles', label: 'Audit Cycles' },
  { key: 'latestOpinion', label: 'Latest Opinion' },
  { key: 'gitcStatus', label: 'GITC Status' },
  { key: 'recommenderAudited', label: 'Recommender Audited?' },
  { key: 'unauditableArticles', label: 'Unauditable Articles' },
  { key: 'metricInterrogation', label: 'Metric Interrogation' },
  { key: 'enforcementStatus', label: 'EC Enforcement' },
  { key: 'trustedFlaggerValidity', label: 'Trusted Flagger Validity' },
  { key: 'cclStatus', label: 'CCL / Ad Transparency' },
  { key: 'platformSelfRevision', label: 'Platform Self-Revision' },
  { key: 'primaryDocStatus', label: 'Primary Docs Status' },
  { key: 'benchmarkNotes', label: 'Benchmark Notes' },
];

// ==========================================
// COMPONENT
// ==========================================
export default function DSAConsole() {
  const [activeTab, setActiveTab] = useState('riskMap');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [benchmarkPlatform, setBenchmarkPlatform] = useState('TikTok');

  const platforms = ['All', 'Snapchat', 'TikTok', 'Instagram', 'Meta', 'X', 'Pinterest', 'YouTube'];

  const tabs = [
    { id: 'riskMap',        label: 'Matrix 1A: Risk Map' },
    { id: 'auditFindings',  label: 'Matrix 1B: Audit Findings' },
    { id: 'synthesis',      label: 'Thematic Synthesis' },
    { id: 'disconnect',     label: 'Scope vs Substance' },
    { id: 'benchmark',      label: '⬛ Audit Benchmarks' },
  ];

  const filterData = (data) => {
    if (platformFilter === 'All') return data;
    return data.filter(item => item.platform === platformFilter);
  };

  const renderHeaders = (keys) => (
    <thead>
      <tr className="bg-slate-100 text-slate-700 uppercase text-xs font-bold border-b-2 border-slate-300 tracking-wider">
        {keys.map(key => (
          <th key={key} className="px-5 py-4 text-left">{key.replace(/([A-Z])/g, ' $1').trim()}</th>
        ))}
      </tr>
    </thead>
  );

  const isTikTokRow = (row) => row.platform === 'TikTok';
  const isInstagramRow = (row) => row.platform === 'Instagram';

  const renderRows = (data, keys) => (
    <tbody className="divide-y divide-slate-200 bg-white">
      {data.map((row, idx) => (
        <tr
          key={idx}
          className={`transition-colors ${
            isTikTokRow(row)
              ? 'bg-pink-50 hover:bg-pink-100 border-l-4 border-pink-400'
              : isInstagramRow(row)
              ? 'bg-purple-50 hover:bg-purple-100 border-l-4 border-purple-400'
              : 'hover:bg-slate-50'
          }`}
        >
          {keys.map(key => (
            <td key={key} className="px-5 py-3 text-sm align-top leading-relaxed text-slate-700">
              {key === 'platform' ? (
                <span className={`font-bold px-2 py-1 rounded text-xs ${
                  row[key] === 'TikTok'
                    ? 'bg-pink-200 text-pink-900'
                    : row[key] === 'Instagram'
                    ? 'bg-purple-200 text-purple-900'
                    : 'bg-slate-100 text-slate-900'
                }`}>{row[key]}</span>
              ) : key === 'conclusion' || key === 'theme' ? (
                <span className={`font-bold px-2 py-1 rounded text-xs ${
                  row[key]?.includes('Negative') || row[key]?.includes('UNAUDITABLE')
                    ? 'bg-red-100 text-red-800'
                    : row[key]?.includes('Qualified')
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-900'
                }`}>{row[key]}</span>
              ) : (
                <span>{row[key]}</span>
              )}
            </td>
          ))}
        </tr>
      ))}
      {data.length === 0 && (
        <tr>
          <td colSpan={keys.length} className="text-center py-12 text-slate-500 italic">
            No data for selected platform in this view.
          </td>
        </tr>
      )}
    </tbody>
  );

  // Benchmark view — vertical card layout for selected platform
  const selectedBenchmark = auditBenchmarks.find(b => b.platform === benchmarkPlatform);
  const isFullyAnalyzed = selectedBenchmark?.primaryDocStatus?.startsWith('Fully');

  const renderBenchmarkCard = () => (
    <div className="p-2">
      {/* Platform selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {auditBenchmarks.map(b => (
          <button
            key={b.platform}
            onClick={() => setBenchmarkPlatform(b.platform)}
            className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
              b.platform === benchmarkPlatform
                ? 'bg-slate-800 text-white border-slate-800'
                : b.platform === 'TikTok' && b.primaryDocStatus?.startsWith('Fully')
                ? 'bg-pink-50 text-pink-900 border-pink-300 hover:bg-pink-100'
                : b.platform === 'Instagram' && b.primaryDocStatus?.startsWith('Fully')
                ? 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {b.platform}
            {b.primaryDocStatus?.startsWith('Fully') && (
              <span className={`ml-2 text-xs text-white px-1.5 py-0.5 rounded-full ${b.platform === 'Instagram' ? 'bg-purple-500' : 'bg-pink-400'}`}>✓ Analyzed</span>
            )}
          </button>
        ))}
      </div>

      {selectedBenchmark && (
        <div className="space-y-3">
          {/* Header */}
          <div className={`rounded-xl p-5 ${isFullyAnalyzed ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-extrabold">{selectedBenchmark.platform}</h2>
                <p className={`text-sm mt-1 ${isFullyAnalyzed ? 'text-slate-300' : 'text-slate-500'}`}>
                  {selectedBenchmark.primaryDocStatus}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  selectedBenchmark.latestOpinion?.includes('Negative')
                    ? 'bg-red-500 text-white'
                    : selectedBenchmark.latestOpinion?.includes('Qualified')
                    ? 'bg-amber-400 text-amber-900'
                    : selectedBenchmark.latestOpinion?.includes('UNAVAILABLE')
                    ? 'bg-slate-400 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                  {selectedBenchmark.latestOpinion}
                </span>
                <p className={`text-xs mt-1 ${isFullyAnalyzed ? 'text-slate-400' : 'text-slate-400'}`}>
                  {selectedBenchmark.auditor} · {selectedBenchmark.auditCycles}
                </p>
              </div>
            </div>
          </div>

          {/* Benchmark dimensions grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'gitcStatus', label: 'GITC Status', icon: '🔧', redFlag: (v) => v?.includes('Failure') || v?.includes('consecutive') },
              { key: 'recommenderAudited', label: 'Recommender Audited?', icon: '⚙️', redFlag: (v) => v?.includes('Negative') || v?.includes('No —') },
              { key: 'unauditableArticles', label: 'Unauditable Articles', icon: '🚫', redFlag: (v) => v && !v.includes('To be') && v !== 'None' },
              { key: 'metricInterrogation', label: 'Metric Interrogation', icon: '📊', redFlag: (v) => v?.startsWith('No') },
              { key: 'enforcementStatus', label: 'EC Enforcement', icon: '⚖️', redFlag: (v) => v?.includes('Formal') },
              { key: 'trustedFlaggerValidity', label: 'Trusted Flagger Validity', icon: '🚩', redFlag: (v) => v?.includes('zero') || v?.includes('untested') },
              { key: 'cclStatus', label: 'CCL / Ad Transparency', icon: '📋', redFlag: (v) => v?.includes('Negative') || v?.includes('Compound') },
              { key: 'platformSelfRevision', label: 'Platform Self-Revision', icon: '🔄', redFlag: (v) => false },
            ].map(dim => {
              const value = selectedBenchmark[dim.key];
              const isPending = value?.includes('To be assessed') || value?.includes('Pending');
              const isRed = dim.redFlag(value) && !isPending;
              return (
                <div
                  key={dim.key}
                  className={`rounded-lg p-4 border-l-4 ${
                    isPending
                      ? 'bg-slate-50 border-slate-300'
                      : isRed
                      ? 'bg-red-50 border-red-400'
                      : 'bg-green-50 border-green-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{dim.icon}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isPending ? 'text-slate-400' : isRed ? 'text-red-700' : 'text-green-700'
                    }`}>{dim.label}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    isPending ? 'text-slate-400 italic' : 'text-slate-700'
                  }`}>{value}</p>
                </div>
              );
            })}
          </div>

          {/* Benchmark notes */}
          <div className="rounded-lg bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">📌 Benchmark Summary</p>
            <p className="text-sm text-slate-700 leading-relaxed">{selectedBenchmark.benchmarkNotes}</p>
          </div>

          {/* EC Enforcement */}
          <div className={`rounded-lg p-4 border-l-4 ${
            selectedBenchmark.enforcementStatus?.includes('Formal')
              ? 'bg-red-50 border-red-500'
              : selectedBenchmark.enforcementStatus?.includes('RFI')
              ? 'bg-amber-50 border-amber-400'
              : 'bg-slate-50 border-slate-300'
          }`}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">⚖️ EC Enforcement Status</p>
            <p className="text-sm text-slate-700">{selectedBenchmark.enforcementStatus}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans">

      {/* Top bar */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shadow-md">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">DSA Compliance Console</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            QDA Analysis of VLOP SRAs & Audits · TikTok primary docs integrated (2023–2025)
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border border-slate-700">
          <label className="text-xs font-semibold text-slate-300">FILTER:</label>
          <select
            className="bg-slate-900 text-white border border-slate-600 rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-200 shadow-sm overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-6 py-3.5 text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === tab.id
                ? tab.id === 'benchmark'
                  ? 'bg-slate-900 text-white border-b-4 border-slate-900'
                  : 'bg-blue-50 border-b-4 border-blue-600 text-blue-800'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border-b-4 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
        {/* TikTok indicator */}
        <div className="ml-auto flex items-center px-4 text-xs text-pink-600 font-semibold border-l border-slate-200">
          <span className="w-2 h-2 rounded-full bg-pink-400 mr-2 animate-pulse"></span>
          TikTok rows updated from primary docs
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'benchmark' ? (
          <div className="p-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="mb-4 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Audit Quality Benchmark Framework</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Standardised dimensions for comparing audit depth and compliance quality across all VLOPs.
                  TikTok is the first fully analysed platform — its profile establishes the benchmark for subsequent analysis.
                </p>
              </div>
              {renderBenchmarkCard()}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                {activeTab === 'riskMap' && (
                  <>
                    {renderHeaders(['platform', 'category', 'risk', 'mitigation', 'status'])}
                    {renderRows(filterData(matrix1A), ['platform', 'category', 'risk', 'mitigation', 'status'])}
                  </>
                )}
                {activeTab === 'auditFindings' && (
                  <>
                    {renderHeaders(['platform', 'conclusion', 'criticism', 'remediation'])}
                    {renderRows(filterData(matrix1B), ['platform', 'conclusion', 'criticism', 'remediation'])}
                  </>
                )}
                {activeTab === 'synthesis' && (
                  <>
                    {renderHeaders(['theme', 'platforms', 'auditor', 'ec'])}
                    {renderRows(synthesis, ['theme', 'platforms', 'auditor', 'ec'])}
                  </>
                )}
                {activeTab === 'disconnect' && (
                  <>
                    {renderHeaders(['platform', 'category', 'claim', 'auditor', 'ec'])}
                    {renderRows(filterData(disconnect), ['platform', 'category', 'claim', 'auditor', 'ec'])}
                  </>
                )}
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
