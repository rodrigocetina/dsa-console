import React, { useState } from 'react';

// ==========================================
// DATASETS
// ==========================================

// Matrix 1A: Platform self-reported risk maps
// TikTok rows updated with primary document evidence (2023–2025 SRAs)
const matrix1A = [
  // Snapchat — enriched from primary 2023–2025 SRAs (Y1, Y2, Y3) and EY Audit Reports (Y1: Qualified Negative; Y2: Positive Unqualified)
  { platform: 'Snapchat', category: 'Art. 34.1(a) Illegal Content — CSEAI, Hate Speech, Fraud', risk: 'CSEAI (Level 1, Extremely Low PVP ≤0.049%): specialized double-review; 322 min median turnaround. Hate Speech (Level 3, Extremely Low): 36 min median turnaround. Fraud/Spam (Level 3, Extremely Low, Y3). All Y3 risk conclusions unchanged from Y2. Protect Children study (2024): Snapchat ranked last (10%) among platforms for CSAM prevalence.', mitigation: 'PVP sampling of Public Stories (random statistically-valid sample). CSEAI double-review process (322 min median). Hash-matching (NCMEC coordination). Spotlight pre-moderation (100% of Spotlight content reviewed before distribution). Ephemerality and no resharing as structural mitigation. 40-day SLA for illegal content resolution.', status: 'Y2 Audit (EY): Positive (Unqualified) — first clean audit opinion in VLOP corpus. No EC proceedings. Art. 39.1 (Ads Gallery search) partially remediated: Negative B.6 → implemented Oct 2024, confirmed Y2.' },
  { platform: 'Snapchat', category: 'Art. 34.1(b) Fundamental Rights — Dark Patterns & Privacy', risk: 'Android deactivation: no explicit deactivation button (dark pattern identified by EY Y1). ToS materiality: informal governance for tracking changes. Privacy: Ghost Mode (location), JIT consent notices. Y1 Audit qualified on Art. 11.3 (account deactivation process equivalent obligation). Art. 25.1 formally audited — no ongoing EC proceedings.', mitigation: 'Explicit account deactivation button added to Android (Aug 23, 2024). Account deletion confirmation email added (Jul 1, 2024). Centralized process to log ToS materiality decisions (Jul 1, 2024). JIT consent notices for sensitive permissions. Ghost Mode (location sharing). No dark patterns finding sustained post-Y1 remediation.', status: 'Y1 Audit: Qualified Negative (single Art. 11.3 finding, remediated during examination period). Y2 Audit: Positive Unqualified — remediation confirmed. No EC proceedings on Art. 25.1 (unlike TikTok, Meta, X).' },
  { platform: 'Snapchat', category: 'Art. 34.1(c) Civic Discourse & Recommender Systems', risk: 'Electoral disinformation risk (Level 3, Extremely Low PVP across all 3 cycles). EC RFI issued on recommender systems and curated feeds — Snap\'s architectural claim (1:1 messaging as virality mitigation) not independently tested by auditors. Harmful False Information: Level 3, Extremely Low (unchanged Y1→Y3). No recommender systems audited under Arts. 27.3/38.1 in Y1; Y2 B.1 recommendation covers algorithmic documentation (Arts. 27.3/38.1/35.1).', mitigation: 'No open feed (core structural design choice). Bi-directional friending (both parties must consent). Discover: curated by human editors + pre-selected media partners. No FYF-equivalent algorithmic feed. Spotlight pre-moderation prevents viral spread of borderline content. No political advertising. Y2 recommendation B.1: enhanced algorithmic documentation → March 30, 2026.', status: 'Active — EC RFI on recommender systems issued. Architectural claim (1:1 messaging reduces civic risk) untested by auditors. Arts. 27.3/38.1/35.1 covered by Y2 recommendation B.1 (March 2026). No formal proceedings.' },
  { platform: 'Snapchat', category: 'Art. 34.1(d) Minors & Health', risk: 'Y3 critical development: Snap introduced 16-17 year-old Public Profile posting options in Y3 — triggered new Art. 34 critical impact assessment (highest-stakes design change across the SRA period). Harassment/Bullying: Extremely Low (improved from Very Low in Y2). Self-Harm: Extremely Low, Level 2. Art. 28 obligations covered by Y2 B.1 recommendation (Arts. 28.1/28.2 documentation).', mitigation: '10 PM silent notifications (sleep protection). Friction before posting to Public Stories. Age-gating features for minors. Y3 critical impact assessment for 16-17yo Public Profile policy. Y2 B.1 recommendation: document minor protection measures under Arts. 28.1/28.2 → March 30, 2026. No profiling-based ads for minors. Ghost Mode available to all users including minors.', status: 'Active — Y3 16-17yo Public Profile posting introduces new Art. 34 compliance dimension not present in Y1 or Y2. Arts. 28.1/28.2 documentation gap identified in Y2 (recommendation B.1, deadline March 30, 2026). No EC proceedings on Art. 28.' },

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

  // Facebook — enriched from primary 2024–2025 SRAs and EY Audit Reports
  { platform: 'Facebook', category: 'Art. 15.1 Transparency Reporting', risk: 'Failure to report per-VLOP moderation metrics; consolidated Facebook+Instagram data violates individual-platform reporting obligation across two cycles', mitigation: 'Transparency Center; DSA Transparency Reports; Community Standards linked from Terms of Use', status: 'NEGATIVE (2024 & 2025) — persistent cross-cycle failure; Meta corporate-level non-compliance mirroring Instagram' },
  { platform: 'Facebook', category: 'Art. 38.1 Dating Recommender Systems', risk: 'Facebook Dating users had no non-profiling recommender option for 6+ months; algorithmic dating recommendations operated without DSA-compliant alternative', mitigation: 'Non-profiling RS option eventually implemented; Dating recommender documentation revised post-audit', status: 'NEGATIVE (2024) — 6+ month absence of legally required non-profiling option on high-intimacy feature' },
  { platform: 'Facebook', category: 'Art. 26.2 Commercial Content Labels (Reels)', risk: '~90% of Facebook Reels on Android missing commercial disclosure labels for ~9 months; technical implementation gap on primary short-video product', mitigation: 'Label deployment completed by 2025 audit cycle; Android implementation fix confirmed', status: 'NEGATIVE (2025) — 9-month labeling failure affecting majority of Reels impressions on Android' },
  { platform: 'Facebook', category: 'Art. 34.1(d) Protection of Minors', risk: 'Protection of Minors at Tier 3 residual risk (2025 SRA); same Tier 3 classification as Instagram — confirmed Meta-wide pattern; Teen Account system deployed but not yet validated', mitigation: 'Teen Accounts (default restricted settings); disabled profiled ads for <18; age assurance; parental supervision tools', status: 'Tier 3 residual risk — Arts. 34.1/35.1/28.1 UNAUDITABLE (EC proceedings)' },
  { platform: 'Facebook', category: 'Art. 34.1(c) Civic Discourse / AIGC', risk: 'Election integrity risks; AI-generated content labeling gaps; algorithmic amplification of disinformation; Arts. 34.1/35.1 formally unverified', mitigation: 'Elections Readiness; War Rooms; 11 IFCN fact-checkers; C2PA AI content labels; Community Notes piloting; HSC Commitments', status: 'Active — Arts. 34.1/35.1 UNAUDITABLE (EC proceedings)' },
  { platform: 'Facebook', category: 'Art. 20.4 Complaint Handling', risk: 'Appeals not processed within 7-day benchmark; non-discriminatory, diligent, non-arbitrary handling requirements not met', mitigation: 'Internal complaint pipelines; appeals dashboard; Q4 2025 implementation planned', status: 'NEGATIVE (2025) — same bilateral complaint-handling failure pattern as Instagram' },


  // X — enriched from primary 2023–2025 SRAs (Y1: 2023, Y2: 2024, Y3: 2025) and Audit Reports (FTI 2024, BDO 2025)
  { platform: 'X', category: 'Art. 34.1(a) Terrorist Content [TIER 1 Y3]', risk: 'Terrorist content escalated from Tier 3 (Y2) to TIER 1 (Y3) — highest risk designation; most dramatic self-escalation across all 6 VLOPs. Y3 drivers: Gaza conflict, GenAI threat vectors. Inherent: Critical (likely × very high severity). Control strength: defined (not managed).', mitigation: 'ML classifiers for automated detection; Trusted Flagger Intake Group (Arts. 16.5/16.6 UNAUDITABLE — EC proceedings); hash-matching for CSAM; Tech Against Terrorism cooperation. FoSnR (Freedom of Speech Not Reach): reach-reduction as primary enforcement mechanism. Art. 35.1 (mitigation adequacy) UNAUDITABLE — EC proceedings.', status: 'TIER 1 — HIGH RESIDUAL RISK (Y3). Tier 3 → Tier 1 escalation. EC proceedings on Arts. 34.1, 34.2, 35.1: foundational adequacy of SRA and mitigations unverifiable.' },
  { platform: 'X', category: 'Art. 34.1(a) Illegal Hate Speech [TIER 2 Y3]', risk: 'Hate speech escalated from Tier 3 (Y2) to TIER 2 (Y3). Y3: almost certain probability × high severity → Critical inherent risk. Control strength: managed.', mitigation: 'Hateful Conduct policy; Illegal Hate Speech Code of Conduct (joined 20 Jan 2025; BDO audit: Positive for Jan–Jun 2025); proactive and reactive enforcement; FoSnR reach-reduction; training for EU language-specific edge cases. No political ads in EU.', status: 'TIER 2 — MEDIUM RESIDUAL RISK (Y3). Tier 3 → Tier 2 escalation. Code of Conduct compliance confirmed Positive by BDO.' },
  { platform: 'X', category: 'Art. 34.1(a) CSAM [TIER 3 Y3]', risk: 'Y3: likely-to-almost-certain probability × high severity → High inherent risk. Y1 residual score: Medium (12.5/25). Stable at Tier 3 across Y2 and Y3. Control strength: managed.', mitigation: 'Hash-matching (NCMEC coordination); PhotoDNA equivalents; dedicated intake pipelines. Trusted Flagger obligations (Arts. 16.5/16.6) UNAUDITABLE — EC proceedings.', status: 'TIER 3 — LOW RESIDUAL RISK (maintained Y2→Y3). Art. 16.5 (trusted flaggers) never received Positive conclusion in any cycle.' },
  { platform: 'X', category: 'Art. 34.1(a) GBV / NCN [TIER 2 Y3]', risk: 'Y3: High inherent risk (likely × high severity). Scope: physical, psychological, economic, informational. NCN (non-consensual nudity): not-remediable. Remediability: possibly remediable to not-remediable. Scale: low to moderate.', mitigation: 'Abuse and Harassment policy; Hateful Conduct policy; NCN policy; Violent Content / Adult Content policies; block/mute/filter safety features; StopNCII partnership (added Y3, tooling integration); proactive and reactive enforcement; incident response protocols. CRITICAL GAP: No proactive NCN enforcement — control strength assessed as DEFINED (not managed) due to this gap.', status: 'TIER 2 — MEDIUM RESIDUAL RISK (maintained Y2→Y3). NCN proactive enforcement gap explicitly noted. StopNCII integration added but does not close proactive detection gap.' },
  { platform: 'X', category: 'Art. 34.1(b) Fundamental Rights / Dark Patterns', risk: 'Art. 25.1 dark patterns: FTI NEGATIVE Y2; EC formal proceedings opened Y3 → No Conclusion. Freedom of expression assessed Tier 3 (almost certain × low → medium inherent, managed controls). FoSnR as both primary mitigation and regulatory risk. Personal data: High inherent, managed, Tier 3.', mitigation: 'Art. 26.1 ad labelling (clear \'Ad\' mark): Positive Y3. Art. 26.2 commercial content (#ad hashtag): Positive Y3. Art. 26.3 no GDPR Art. 9 special-category targeting for ads: Positive Y3. Freedom of expression: FoSnR reach-reduction (not removal) as foundational mechanism.', status: 'Art. 25.1 UNAUDITABLE (EC proceedings) — FTI Negative Y2 unresolved. Ad transparency (Arts. 26.1–26.3) all Positive Y3. Art. 35.1 adequacy of FoSnR mitigations: UNAUDITABLE.' },
  { platform: 'X', category: 'Art. 34.1(c) Civic Discourse & Elections [TIER 2 — improved]', risk: 'Y3: Medium inherent risk (possible × high severity). Residual risk DECREASED Y2→Y3 within Tier 2 — attributed to Civic Integrity policy activation and external stakeholder collaboration. Public security: High inherent, Tier 2. Three documented EU crisis events: Solingen (Aug 2024), Italy hateful hashtag (Sep 2024), Mannheim car ramming (Mar 2025).', mitigation: 'Civic Integrity policy (Aug 2023). No political ads in EU (all years). Community Notes in all EU member states; 25% of global ratings from EU users. Proactive EEAS/EC/European Parliament engagement. NATO information-sharing cooperation. Global Witness confirmed X rejected all submitted disinformation test ads. Synthetic/Manipulated Media policy under evaluation for improvement. Art. 36.1: Positive with comments (crisis protocols documented; no formal EC crisis decision triggered during period).', status: 'TIER 2 — MEDIUM RESIDUAL RISK, improved Y2→Y3. Arts. 34.1/35.1 (SRA quality and mitigation adequacy) UNAUDITABLE — EC proceedings. Improvement confirmed by platform but not independently verifiable.' },
  { platform: 'X', category: 'Art. 34.1(d) Protection of Minors [TIER 3]', risk: 'Y3: 381,592 self-declared EU minor MAU (0.6% of 94M average); 11% of EU users without attributed age (~10.3M accounts). Medium inherent risk (possible × high severity). Managed controls. Y2: 0.98% minors; 6.3% without age.', mitigation: 'Users under 13 automatically offboarded. Users under 18: no profiling-based advertisements; age-inappropriate content restricted. Art. 28.1: BDO Y3 Positive (was FTI Negative Y2 — genuine remediation). Art. 28.2/28.3 (no profiling-based ads for minors): Positive Y3. Art. 25.1 (dark patterns — interface design): UNAUDITABLE (EC proceedings). Age attribution: voluntary self-declaration only; no age verification.', status: 'TIER 3 — LOW RESIDUAL RISK. Art. 28.1 REMEDIATED Y3 (Positive). Critical gap: 11% undeclared-age EU users (~10.3M) for whom Art. 28 protections may not apply. Art. 25.1 dark patterns UNAUDITABLE.' },
  { platform: 'X', category: 'Art. 34.1(d) Public Health / Mental Wellbeing [TIER 3]', risk: 'Y3: Medium inherent risk (possible × high severity). Defined controls. Stable Tier 3 across Y2 and Y3.', mitigation: 'Suicide and Self-Harm policy (under evaluation for further improvement Y3). ML models for self-harm/suicide detection — iterative improvement planned. Safe messaging guidelines. Incident response protocols. Art. 35(1)(b): evaluating proportionality of enforcement; standardising enforcement frameworks.', status: 'TIER 3 — LOW RESIDUAL RISK (stable). Art. 35.1 (mitigation adequacy) UNAUDITABLE — EC proceedings.' },

  { platform: 'Pinterest', category: 'Art. 16 Notice & Action', risk: 'Spread of illegal content, lack of redress', mitigation: 'User Reporting Pipelines', status: 'Active' },

  // YouTube — enriched from primary 2023–2025 SRAs and EY GIL Audit Implementation Reports
  { platform: 'YouTube', category: 'Art. 34.1(a) Illegal Content — CSAM & Terror', risk: 'CSAM; Terror; Hate Speech. VVR Q1 2025: ~0.1% (54.67% removed before first view; 27.28% at 1–10 views). Q1 2025: 192,000 videos and 7M comments removed for hate speech. CSAI Match (proprietary CSAM tool, licensed free to industry). GIFCT founding member (2.2M hashes, 36 companies).', mitigation: 'Automated ML classifiers (96% proactive detection Q1 2025 vs. 95% Q2 2024; 99%+ for comments). CSAI Match + hash-matching. GIFCT hash-sharing. Priority Flagger Program (300+ gov/NGO partners, 0.62% of removed videos Q1 2025). Three-Strike System with optional training pathway (2024).', status: 'Active — VVR stable ~0.1%; Arts. 22.1 & HSC 2.2 NEGATIVE (Trusted Flaggers, remediated Mar 2025)' },
  { platform: 'YouTube', category: 'Art. 34.1(b) Fundamental Rights — Over-Enforcement & Expression', risk: 'Over-moderation suppressing legitimate expression; monetization/demonetization risks for creators; egregious harm standard creates borderline content zone where harmful-but-non-violating content is unreachable; notice mechanism gaps for users without channels', mitigation: 'Three-Strike System with optional training pathway (2024); appeals mechanisms; EDSA exception (Educational, Documentary, Scientific, Artistic); YPP monetization guidelines; Art. 16.1 notice mechanism via Help Center webform for channelless users', status: 'Active — Art. 25(1) Positive w/ Comments (Year 1 & 2); Art. 16.1 Positive w/ Comments (Year 2); no dark patterns NEGATIVE' },
  { platform: 'YouTube', category: 'Art. 34.1(c) Civic Discourse / AIGC / Elections', risk: 'Misleading information elevated residual risk (all 3 SRA cycles); Civic Discourse elevated residual risk (all 3 cycles); deepfakes; election interference; algorithmic amplification of borderline civic content; no voluntary AIGC labeling by bad actors', mitigation: 'The 4 Rs framework (Remove, Raise, Reduce, Reward); SynthID watermarks on all Veo-generated content; mandatory GenAI labeling tool (pre-2024 EU elections); AI Privacy Complaint Process; information panels (Wikipedia, health authorities, UN); Breaking News Shelf (42 countries, 16 EU MS); voter suppression / impersonation / hate speech / incitement policies', status: 'Active — Civic Discourse elevated residual risk all 3 cycles; Arts. 34.1/35.1 AUDITED (Positive w/ Comments, unlike TikTok/Meta)' },
  { platform: 'YouTube', category: 'Art. 34.1(d) Minors / Addictive Design / GenAI', risk: 'Addictive behavior elevated residual risk (2023 & 2024 SRAs — "state of research remains unsettled" per YouTube); SSIED and body image risks for minors; algorithmic rabbit holes on video-native platform; min livestream age previously 13', mitigation: 'YouTube Kids (separate app); Supervised Experience for tweens; Family Center hub (2025); min livestream age raised 13→16 (2025); autoplay off by default for under-18s; disabled profiled ads to minors; expanded March 2025 safeguards (financial advice, delinquency, body image comparisons); likeness management technology; Dream Screen / Dream Track with disclosure', status: 'Active — Addictive behavior elevated 2023–2024 (not flagged 2025); Art. 28.x AUDITED (no NEGATIVE); no EC proceedings unlike TikTok/Meta' },
];

// Matrix 1B: Audit findings
// TikTok rows enriched with 2024 Implementation Report + 2025 Assurance Report findings
const matrix1B = [
  // Snapchat — Y1 Audit (EY, ISAE 3000, Aug 2024): Qualified Negative. Y2 Audit (EY, Aug 2025): Positive Unqualified (first in VLOP corpus).
  { platform: 'Snapchat', conclusion: 'Qualified Negative (Y1 — 2024)', criticism: 'Art. 11.3 equivalent — Account Deactivation Process (Android): Snap\'s Android app lacked an explicit account deactivation button. Users seeking to deactivate (not delete) their account had to navigate a multi-step process that did not surface the option at the expected interface point. EY found this constituted a misleading design element equivalent to a dark pattern obligation. Single finding that triggered Qualified status; all other articles received Positive or Positive with Comments.', remediation: 'Explicit account deactivation button added to Android app (Aug 23, 2024). Account deletion confirmation email process added (Jul 1, 2024). Remediated during the Y1 examination period — EY confirmed resolution before report publication. Finding does not recur in Y2 audit.' },
  { platform: 'Snapchat', conclusion: 'Positive w/ Comments — 7 Recommendations (Y1 — 2024)', criticism: 'B.1 Art. 14.2: ToS materiality documentation — informal governance for deciding when ToS changes are "material" and must be notified to users; no centralized audit trail. B.2 Art. 15.1: Transparency Report disclosures — missing or incomplete moderation metric breakdowns. B.3 Art. 24.2: Retain AMAR (Advertising Monitoring and Review) documentation per cycle. B.4 Art. 25.1: Android deactivation (same as qualified finding above, addressed separately as recommendation). B.5 Art. 34.1: Feature-to-SRA pipeline — new product features (including GenAI tools) not systematically routed through SRA update process. B.6 Art. 39.1: Ads Gallery search — no search by Creator Name functionality available. B.7 Art. 42.2: Transparency Report per-EU-language accuracy indicators missing.', remediation: 'B.1: Centralized ToS materiality log → Jul 1, 2024. B.2/B.7: Enhanced Transparency Report → Oct 25, 2024. B.3: AMAR documentation retained → Jul 2024. B.4: See Qualified finding above. B.5: Feature-to-SRA pipeline + GenAI → Jul 1 and Aug 26, 2024. B.6: Ads Gallery Creator Name search → planned Q4 2024/Q1 2025 (confirmed implemented Oct 2024 in Y2 EY review). All 7 recommendations fully addressed.' },
  { platform: 'Snapchat', conclusion: 'Positive Unqualified (Y2 — 2025) — First in VLOP Corpus', criticism: 'B.1 Arts. 14.4/27.3/28.1/28.2/35.1/38.1: Enhance algorithmic transparency documentation — EY identified that Snap\'s documentation of recommender systems and minor protection measures (Discover feed curation, Spotlight algorithm, minor-specific restrictions) did not fully document the controls operated under these articles. Covers: Terms & Conditions transparency (Art. 14.4), recommender opt-out documentation (Art. 27.3), minor safety measures (Arts. 28.1/28.2), mitigation proportionality (Art. 35.1), and non-profiling recommender option (Art. 38.1). B.2 Art. 39.1: Ads Gallery search by Creator Name — inherited from Y1 B.6, now confirmed implemented Oct 2024.', remediation: 'B.1: Enhanced documentation of algorithmic architecture and minor protection controls → deadline March 30, 2026. B.2 Art. 39.1: Implemented October 2024 — EY confirmed during Y2 examination period. No outstanding NEGATIVE findings. Y2 also covers Illegal Hate Speech Code of Conduct (Jan 20–Jun 30, 2025 period). C.1 CoC Commitment 2.1: Bona fide statements mechanism for hate speech reporting → implemented Feb 2025 (EY confirmed).' },

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

  // Facebook — enriched from EY Audit Reports and Implementation Reports (2024, 2025)
  { platform: 'Facebook', conclusion: 'NEGATIVE (2024 & 2025)', criticism: 'Art. 15.1 — Transparency Reporting: NEGATIVE in BOTH cycles. 2024: 5 distinct non-compliances including consolidated Facebook+Instagram metrics (violates per-VLOP requirement), monetization restriction categorization, violation type/detection method, accuracy indicators. 2025: 3 new non-compliances (account suspension categorization, "other related restrictions" metrics, complaint basis for monetization restrictions). Meta corporate-level failure — identical structural pattern to Instagram.', remediation: '2024 remediation targets partially met by 2025 cycle. Reporting framework restructuring planned Q1 2026. Consolidated metrics issue requires disaggregation across Meta VLOP entities.' },
  { platform: 'Facebook', conclusion: 'NEGATIVE (2024)', criticism: 'Art. 38.1 — Recommender System (Facebook Dating): no non-profiling recommender option available to Facebook Dating users for 6+ months. Dating feature operates as intimacy-context recommender; absence of DSA-compliant alternative more serious than equivalent Explore gap on Instagram.', remediation: 'Non-profiling option implemented during evaluation period. Positive conclusion reached in 2025 audit cycle after fix confirmed.' },
  { platform: 'Facebook', conclusion: 'NEGATIVE (2024)', criticism: 'Art. 24.1 — Account Suspensions Reporting: inaccurate reporting of suspensions for manifestly illegal content in DSA Transparency Reports. Same finding as Instagram 2024.', remediation: 'Already remediated by October 2024 (3rd Transparency Report).' },
  { platform: 'Facebook', conclusion: 'NEGATIVE (2024)', criticism: 'Art. 39.3 — Ads Repository: missing removal reason information; improper disclosure of ad content and payer information. Affects researcher and civil society access to advertising data.', remediation: 'Already remediated April 26, 2024.' },
  { platform: 'Facebook', conclusion: 'NEGATIVE (2024)', criticism: 'Art. 42.2 — Accuracy by Member State Language: missing accuracy indicators; self-reported miscalculated human reviewer metrics. Same finding as Instagram 2024.', remediation: 'Q2 2025 planned. Status unclear in 2025 corpus.' },
  { platform: 'Facebook', conclusion: 'NEGATIVE (2025)', criticism: 'Art. 20.4 — Complaint Handling: appeals of legally classified reporter appeals not processed within 7 days (EY-developed benchmark). Non-discriminatory, diligent, non-arbitrary handling requirements not met. Mirrors Instagram 2025 NEGATIVE on same article.', remediation: 'Q4 2025 implementation planned. Not yet implemented as of September 2025 audit.' },
  { platform: 'Facebook', conclusion: 'NEGATIVE (2025)', criticism: 'Art. 26.2 — Commercial Content Labels (Reels Android): ~90% of Facebook Reels on Android missing required commercial disclosure labels for approximately 9 months. Primary short-video format. Technical implementation gap on the dominant mobile OS for the platform.', remediation: 'Label deployment completed and confirmed by 2025 audit cycle end.' },
  { platform: 'Facebook', conclusion: 'Observation (2024 & 2025)', criticism: 'Arts. 18.1 & 22.1 — Definitional Refusals: Meta formally declined to define "promptly" (Art. 18.1, notice-to-authorities reporting) and "undue delay" (Art. 22.1, complaint handling) as measurable benchmarks. Unique in corpus — not a capability gap but a deliberate regulatory posture.', remediation: 'Reliance on future regulatory guidance stated as justification. No commitment to self-define benchmarks.' },
  { platform: 'Facebook', conclusion: 'UNAUDITABLE (2024 & 2025)', criticism: '14 sub-articles unauditable in both cycles due to EC governmental investigations: Arts. 14.1, 16.1, 16.5, 16.6, 17.1, 20.1, 20.3, 24.5, 25.1, 28.1, 34.1, 34.2, 35.1, 40.12. PLUS HSC Commitments 2.1 & 2.2 (Facebook-specific addition). Includes core SRA (Art. 34.1), mitigation adequacy (Art. 35.1), minor protection (Art. 28.1), dark patterns (Art. 25.1), researcher access (Art. 40.12).', remediation: 'N/A — pending resolution of EC proceedings. Identical structural black hole to TikTok and Instagram.' },

  // X — enriched from FTI Consulting Y2 Audit (Aug 2024) + BDO LLP Y3 Audit (Sep 2025) + Implementation Reports
  // Y2: FTI NEGATIVE (8 Negative + 2 No Conclusion). Y3: BDO NEGATIVE Qualified (10 No Conclusion — all EC proceedings; 0 substantive Negative).
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024)', criticism: 'Art. 15.1 — Transparency reporting: missing Arts. 15.1(d) (basis for complaints) and 15.1(e) (automation safeguards information) from DSA Transparency Report. Core transparency reporting content obligation not met.', remediation: 'X planned to add missing elements to next Transparency Report (Q4 2024). Confirmed Positive in BDO Y3 2025 — fully remediated.' },
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024) [REFUSED REMEDIATION]', criticism: 'Art. 16.3 — Notice processing: user notifications on content moderation decisions. X issued a formal statement that it "remains at Commission\'s disposal" — explicit deferral without timeline or commitment to fix.', remediation: 'Reversed: BDO Y3 2025 concluded Positive. X implemented user notification compliance without explanation of what changed after prior refusal.' },
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024) → EC PROCEEDINGS (Y3)', criticism: 'Art. 25.1 — Dark patterns: interface design elements found to constitute deceptive/manipulative design prohibited under DSA. FTI finding unresolved. EC subsequently opened formal proceedings on Art. 25.1 (29 Aug 2025).', remediation: 'No resolution confirmed. BDO Y3: No Conclusion (EC proceedings prevent assessment). Status unresolved across both audit cycles.' },
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024)', criticism: 'Art. 27.2 — Recommender systems: main parameters must explain why specific information is suggested. X\'s documentation insufficient — users not adequately informed of the reasons behind content prioritisation in the For You feed.', remediation: 'Fully remediated. BDO Y3: Positive. Documentation updated to explain criteria determining content suggestion and relative importance of parameters.' },
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024)', criticism: 'Art. 28.1 — Minor safety: appropriate and proportionate measures to ensure high level of privacy, safety, and security for minors. Gaps identified across user protection architecture for users under 18.', remediation: 'Fully remediated. BDO Y3: Positive. Users under 13 automatically offboarded; users under 18 restricted from profiling-based ads; age-inappropriate content restricted. BDO confirmed no profiling-based ads served to identified minors.' },
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024) → EC PROCEEDINGS (Y3)', criticism: 'Art. 34.2 — SRA methodology: systemic risk assessment methodology found inadequate under Art. 34 standards. Foundation of DSA VLOP compliance — Negative here undermines validity of all downstream risk assessments and mitigation claims.', remediation: 'BDO Y3: No Conclusion — EC formal proceedings prevent independent assessment of whether methodology was improved. Unresolved.' },
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024) → EC PROCEEDINGS (Y3)', criticism: 'Art. 35.1 — Risk mitigation measures: FoSnR (Freedom of Speech Not Reach) architecture found by FTI to be insufficient to meet "reasonable, proportionate and effective" standard. Core compliance question about X\'s entire mitigation philosophy.', remediation: 'BDO Y3: No Conclusion — EC formal proceedings. The fundamental question of whether FoSnR satisfies Art. 35.1 remains unresolved by independent assessment.' },
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024)', criticism: 'Art. 42.2 — DSA Transparency Reports: missing breakdown of human resources dedicated to content moderation by each applicable official language of EU member states; missing accuracy indicators per language. Required for verifying EU-language moderation capacity.', remediation: 'Fully remediated. BDO Y3: Positive. X included per-EU-language human resources and accuracy indicators in subsequent Transparency Reports.' },
  { platform: 'X', conclusion: 'No Conclusion (Y2 2024) → Positive (Y3 2025)', criticism: 'Art. 34.3 — SRA document preservation: supporting SRA documents must be preserved for at least 3 years. Could not be assessed in Y2 (insufficient evidence period).', remediation: 'Positive in BDO Y3. BDO confirmed documented procedure to preserve risk assessments for 3+ years. Only No Conclusion → Positive progression in X audit corpus.' },
  { platform: 'X', conclusion: 'NEGATIVE (Y2 2024) → Positive (Y3 2025)', criticism: 'Art. 38.1 — Non-profiling recommender option: X must provide at least one recommender system option not based on profiling. Y2: unclear evidence of compliant implementation. Y3: BDO confirmed For You (algorithmic/profiling) and Following (chronological/non-profiling) tabs as fully compliant dual-option system.', remediation: 'Fully remediated. BDO Y3: Positive. For You and Following tabs confirmed accessible directly from the Home timeline interface.' },
  { platform: 'X', conclusion: 'No Conclusion — EC PROCEEDINGS (Y3 2025)', criticism: 'Arts. 16.5, 16.6 (trusted flagger obligations and counter-notices), 34.1 (SRA quality/scope), 39.1–39.3 (ad repository), 40.12 (researcher data access) — all under EC formal proceedings opened 29 August 2025. Art. 16.5 was also No Conclusion in Y2 (FTI). These 10 sub-Articles include the most structurally significant DSA obligations.', remediation: 'BDO explicitly stated: "Absent the below mentioned 10 sub-Articles… the overall conclusion would have been Positive with comments." XIUC notes BDO\'s qualification is "beyond XIUC\'s control" and asserts it has controls for all 10 articles pending EC proceedings resolution.' },
  { platform: 'X', conclusion: 'Positive w/ Comments (Y2 2024)', criticism: 'Art. 14.4 — Terms & Conditions enforcement: inconsistent application of T&C enforcement rules for verified (checkmark) accounts and high-follower accounts relative to ordinary accounts. Evidence of power-user treatment privilege.', remediation: 'Positive in BDO Y3 — inconsistency remediated without explanation of architectural change. Analytically significant for platform-endorsed amplification dynamics.' },
  { platform: 'X', conclusion: 'Positive (Y3 2025)', criticism: 'Illegal Hate Speech Code of Conduct (Art. 45 DSA) — X signed 20 January 2025. BDO audited compliance for period 20 Jan – 30 Jun 2025. Assessment: KPIs and qualitative/quantitative hate speech moderation information documented and implemented.', remediation: 'Positive conclusion. BDO confirmed public Rules/Help-Centre policies prohibit illegal hate speech; documented mechanism exists for user notification of significant Code changes. Positive — no recommendations.' },
  { platform: 'Pinterest', conclusion: 'Procedural Flaw', criticism: 'Auditor accepted definition of undue delay for receipt as "when a final decision is made"', remediation: 'None' },
  { platform: 'YouTube', conclusion: 'NEGATIVE (Year 1 — 2024)', criticism: 'Art. 24(1) — Transparency Reporting: Transparency Report did not include suspensions for manifestly unfounded complaints on a per-VLOP basis. GIL reported aggregate data across all 4 VLOPs rather than disaggregated per-service figures as required. Structural gap in accountability architecture.', remediation: 'Remediated in February 2025 Transparency Report. Per-VLOP suspension data now included. Confirmed by Year 2 audit.' },
  { platform: 'YouTube', conclusion: 'NEGATIVE (Year 1 — 2024)', criticism: 'Art. 24(5) — Statement of Reasons (SOR) Timeliness: 14% of SORs not submitted to DSA Transparency Database within the 4-day benchmark. Root cause: technical error in reporting pipeline. Affected YouTube specifically.', remediation: 'Auto-remediated by technical fix. No manual remediation steps required. Year 2 audit found no recurrence.' },
  { platform: 'YouTube', conclusion: 'NEGATIVE (Year 2 — 2025)', criticism: 'Art. 14.6 — Terms & Conditions in EU Languages: Terms of Service not available in all 24 EU official languages. Of 33 in-scope terms, 24 deficient across multiple languages. Basic transparency obligation unmet across the EU language space.', remediation: 'YouTube committed to phased remediation. Specific timeline not confirmed in Year 2 audit implementation report.' },
  { platform: 'YouTube', conclusion: 'NEGATIVE (Year 2 — 2025)', criticism: 'Art. 22.1 — Trusted Flagger Processing: 3 out of 10 sampled Trusted Flagger notices not processed without undue delay. Infrastructure gap in TF prioritisation queue. Finding linked to same infrastructure failure as HSC Commitment 2.2 (hate speech TF notices also affected).', remediation: 'Updated internal guidance and escalation processes. Implemented March 2025, confirmed by YouTube.' },
  { platform: 'YouTube', conclusion: 'NEGATIVE (Year 2 — 2025 / HSC)', criticism: 'EU Hate Speech Code Commitment 2.2 — Trusted Flagger Hate Speech Notices: 2 Trusted Flagger notices alleging illegal hate speech not processed without undue delay. Same infrastructure failure as Art. 22.1 — dual-capture finding: single systemic gap triggers both DSA and HSC NEGATIVEs simultaneously. Unique in corpus.', remediation: 'Updated internal guidance and escalation processes. Implemented March 2025. YouTube is the ONLY GIL service subject to HSC obligations (integrated into DSA framework 20 Jan 2025).' },
  { platform: 'YouTube', conclusion: 'Positive w/ Comments (Year 2 — 2025 / HSC)', criticism: 'Art. 16.1 & HSC Commitment 2.1 — Notice Mechanism Accessibility: In-product notice dropdown inoperable for (a) signed-out users and (b) signed-in users without a YouTube channel. Primary reporting path defaults to Help Center webform — a secondary, higher-friction mechanism. Channelless users face structural access barrier.', remediation: 'YouTube to determine remediation approach and timeline by 31 December 2025. Not yet implemented as of audit close.' },
  { platform: 'YouTube', conclusion: 'Positive w/ Comments (Years 1 & 2 — AUDITED)', criticism: 'Arts. 34.1, 34.2, 35.1 — SRA Obligations Independently Verified: UNIQUE IN CORPUS. Unlike TikTok and all Meta platforms where these core articles are unauditable due to EC proceedings, YouTube\'s risk assessment (Art. 34.1), risk factor evaluation (Art. 34.2), and mitigation adequacy (Art. 35.1) were independently audited by EY in both Year 1 and Year 2. Recommendations covered: scoring rationale documentation, off-cycle SRA template, risk statement wording, mitigation tracking, factor evaluation at risk statement level.', remediation: 'Year 2 Recs 1 (scoring rationale) and 3 (risk statement wording) implemented Aug 2025. Rec 2 (off-cycle template) by Feb 2026. Art. 42.2 (Positive w/ Comments): adapt per-MS-language reporting by 27 Feb 2026.' },
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
  // Snapchat — enriched from primary documents (Y1, Y2, Y3 SRAs; Y1 and Y2 Audit and Implementation Reports)
  { platform: 'Snapchat', category: 'Illegal Content — PVP Scale & SLA Framing', claim: 'Three-tier relative likelihood scale: Low (PVP 0.5–1.5%), Very Low (PVP 0.05–0.49%), Extremely Low (PVP ≤0.049%). All 9 primary risk categories at Extremely Low or Very Low in Y3. 40-day SLA for illegal content resolution. CSEAI double-review (322 min median turnaround). Protect Children (2024): ranked last among platforms for CSAM prevalence (10%).', auditor: 'PVP scale accepted as compliant metric. 40-day SLA for resolution accepted as satisfying "undue delay" Art. 17.1 standard. CSEAI specialized process not interrogated for false-negative rate. No audit of hash-matching infrastructure. Y2: Positive Unqualified — cleanest opinion in VLOP corpus. EY did not independently validate PVP sampling methodology.', ec: 'PVP scale measures relative likelihood within Snap\'s own risk universe only — not absolute prevalence benchmarks against other platforms. 40-day SLA for illegal content substantially exceeds the "without undue delay" standard in Art. 17 DSA. EC RFI issued. Protect Children (2024) finding contradicts CSEAI Extremely Low self-assessment — but uses a different measurement methodology (researcher-submitted content detection vs. Snap\'s own PVP random sampling). Disconnect: EY accepted relative-scale metrics at face value; EC\'s concern is whether the scale conceals absolute scale harms. Δ Unique in corpus: Positive Unqualified opinion does not require EC to accept platform metrics as independently verified.' },
  { platform: 'Snapchat', category: 'Fundamental Rights — Dark Patterns Remediation', claim: 'JIT consent notices (location, camera). Ghost Mode for location privacy. No dark patterns identified by platform. Android deactivation issue identified by EY and remediated. ToS materiality governance formalized.', auditor: 'Y1: EY identified Android deactivation gap as Qualified Negative finding (Art. 11.3 equivalent). Forced explicit deactivation button. ToS materiality governance deficiency identified as recommendation B.1 — addressed with centralized log. Y2: No dark pattern findings. Positive Unqualified. Art. 25.1 audited in both cycles — Positive.', ec: 'Deceptive design (Art. 25.1) treated by EC as a systemic fundamental rights violation, not a UI error correctable by adding a button. Y2 Positive Unqualified on Art. 25.1 is analytically significant: Snap is the ONLY VLOP in corpus where Art. 25.1 (dark patterns) received a Positive opinion without EC proceedings blocking the assessment. This is a structural differentiator from TikTok (Negative 2024), X (Negative Y2 → EC proceedings), and Meta (unauditable — EC proceedings). Disconnect: EY\'s scope check confirms button exists; EC\'s interest is whether ephemerality and notification design create engagement compulsion beyond explicit dark patterns.' },
  { platform: 'Snapchat', category: 'Civic Discourse — Architecture as Mitigation', claim: '1:1 messaging design eliminates open-feed virality (no resharing, no public feed, bi-directional friending). Discover curated by editors and media partners (not algorithmic feed). Spotlight pre-moderated before distribution. These architectural properties claimed as structural Art. 35 mitigations for civic discourse risks. Harmful False Information: Extremely Low, Level 3 (unchanged Y1→Y3).', auditor: 'EY focused audit scope on Ads Gallery search functionality (Art. 39.1) and ToS/Transparency obligations. Recommender systems for Discover and Spotlight not independently tested in Y1. Y2 B.1 recommendation covers algorithmic documentation for Arts. 27.3/38.1 — documentation gap, not substantive assessment of effectiveness.', ec: 'EC issued RFI on recommender systems — explicitly challenging Snap\'s premise that curated/editorial feeds are inherently immune to civic discourse risks. Discover and Spotlight both involve algorithmic or editorial curation operating at scale; the absence of a user-configurable algorithmic feed does not eliminate curation risk. Y2 B.1 recommendation acknowledges that algorithmic documentation was insufficient. Disconnect: Architecture-as-mitigation is Snap\'s central Art. 35 argument; neither EY (audit scope) nor EC (RFI issued, not yet enforcement) has directly verified or refuted the causal chain between ephemerality and reduced civic harm.' },
  { platform: 'Snapchat', category: 'Minors & Health — Y3 Critical Design Change', claim: 'Art. 28 measures: age-gating, minor-specific restrictions, 10 PM silent notifications. Harassment/Bullying improved to Extremely Low in Y3 (was Very Low in Y2). Self-Harm: Extremely Low across all cycles. Y3 introduced 16-17 year-old Public Profile posting options — new feature assessed via Art. 34 critical impact analysis (highest-stakes design change of SRA period).', auditor: 'Y1/Y2: Arts. 28.1/28.2 policy existence validated. Y2 B.1 recommendation: enhance documentation of minor protection measures under Arts. 28.1/28.2 → March 30, 2026. EY did not independently test effectiveness of 10 PM notification limits or friction mechanisms. No NEGATIVE on Art. 28 in either cycle. Y3 16-17yo Public Profile change: critical impact assessment conducted by Snap — not independently audited.', ec: 'Y3 16-17yo Public Profile change is the most significant Art. 34(2)(b) critical design trigger in Snap\'s three-year SRA record — introducing a new public-facing surface for a minor age cohort. Y2 B.1 recommendation on minor documentation (March 2026) is not yet fulfilled; Y3 critical change was introduced before the documentation deadline. Disconnect: Friction (warnings before posting) and notification limits address behavioral risk at the margin; EC\'s concern — consistent with its positions on TikTok and Meta — is whether the underlying engagement architecture can be made structurally protective for minors, not just policy-restricted.' },

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

  // Facebook — revised from primary documents (2024–2025)
  { platform: 'Facebook', category: 'Transparency Reporting (Art. 15.1) [REVISED]', claim: 'Transparency Center; DSA Transparency Reports; Community Standards linked from Terms of Use', auditor: 'NEGATIVE (2024 & 2025): consolidated Facebook+Instagram metrics violate per-VLOP requirement; missing monetization metrics, categorization, complaint basis, accuracy indicators across two consecutive cycles.', ec: 'Art. 15.1 failure disables all external verification of Facebook\'s compliance. The consolidated-metrics approach means neither Facebook\'s nor Instagram\'s risk profile is independently readable. Δ Meta corporate-level failure — structural, not platform-specific.' },
  { platform: 'Facebook', category: 'Dating Recommender (Art. 38.1) [NEW FINDING]', claim: 'Facebook Dating uses recommender systems; non-profiling option eventually implemented', auditor: 'NEGATIVE (2024): no non-profiling recommender option for 6+ months on Facebook Dating. Positive (2025): option implemented and confirmed by audit.', ec: 'A high-intimacy context (dating matching) operating without DSA-required non-profiling option for 6 months is more serious than equivalent failures on discovery features. Δ Only explicit recommender NEGATIVE on intimacy-context feature in corpus.' },
  { platform: 'Facebook', category: 'Reels Commercial Labels (Art. 26.2) [NEW FINDING]', claim: 'Commercial content labeling for Reels; creator disclosure requirements implemented', auditor: 'NEGATIVE (2025): ~90% of Reels on Android missing commercial labels for ~9 months. Technical implementation failure on dominant mobile OS for primary short-video product.', ec: 'Commercial content transparency is a core user-protection DSA obligation. A 9-month failure affecting ~90% of Android impressions (majority of mobile market) is a systemic gap, not an isolated glitch. Δ Largest disclosure failure by user-exposure volume in primary document corpus.' },
  { platform: 'Facebook', category: 'Protection of Minors (Art. 34.1(d)) [REVISED]', claim: 'Teen Accounts (default restricted settings); disabled profiled ads for <18; age assurance; parental supervision tools; SSIED safe messaging guidelines', auditor: 'Arts. 28.1, 34.1, 35.1 UNAUDITABLE (EC proceedings). Protection of Minors at Tier 3 (2025 SRA) — same classification as Instagram.', ec: 'Teen Account mitigations are architectural defaults, not architectural redesigns. Tier 3 on a social graph platform means the EC\'s core concern — algorithmic exposure to harmful content — remains unverified. Δ Tier 3 confirms Meta-wide pattern, not platform-specific remediation.' },
  { platform: 'Facebook', category: 'Risk Assessment Architecture (Arts. 34.1 & 35.1) [NEW FINDING]', claim: 'ISO 31000:2018; UN Guiding Principles; Integrity GRC Programme; Three Lines of Defence; annual SRA (Year 3 in 2025)', auditor: 'UNAUDITABLE in both 2024 and 2025. EY cannot form opinion on SRA or mitigation adequacy for core DSA obligations.', ec: 'Facebook\'s entire compliance architecture — whether the Integrity Ecosystem is reasonable, proportionate, and effective — has never been independently verified. HSC Commitments 2.1 & 2.2 also unauditable (Facebook-specific addition to Instagram pattern). Δ Same structural black hole as TikTok and Instagram.' },
  { platform: 'Facebook', category: 'Definitional Refusals (Arts. 18.1 & 22.1) [NEW FINDING]', claim: '"Promptly" and "undue delay" defined through legal process and regulatory guidance; internal SLAs as operational benchmarks', auditor: 'Observation (2024 & 2025): Meta formally declined to define "promptly" (notice to authorities) and "undue delay" (complaint handling) as measurable thresholds. Auditors noted as observation, not Negative.', ec: 'Definitional capture: the platform controls the metric against which compliance is measured. A refusal to self-define benchmarks is more corrosive than a missed deadline, as it makes all subsequent SLA-based audit conclusions unfalsifiable. Δ Analytically unique: not a capability gap but a deliberate regulatory posture.' },
  // X — enriched from primary 2023–2025 SRAs and FTI/BDO Audit Reports
  { platform: 'X', category: 'SRA Quality & Mitigation Adequacy (Arts. 34/35)', claim: 'Y3 SRA: 13 risk assessments using probability × severity × control matrices. Tier-based prioritisation. FoSnR (Freedom of Speech Not Reach) as primary Art. 35(1) mitigation. Terrorist content self-escalated to Tier 1 (highest priority). Hate speech escalated to Tier 2.', auditor: 'Y2 FTI: NEGATIVE on Arts. 34.2 (SRA methodology) and 35.1 (FoSnR mitigations insufficient). Y3 BDO: No Conclusion on Arts. 34.1 and 34.2 — EC proceedings prevent assessment. Art. 35.1: No Conclusion — FoSnR adequacy unanswerable while proceedings run.', ec: 'EC formal proceedings on Arts. 34.1, 34.2, 35.1 (opened 29 Aug 2025): The Commission contests the adequacy of the very foundation the auditors were assessing. Compliance chain paradox: BDO confirms procedural improvement but cannot verify structural architecture. FoSnR as legal compliance strategy is the central unresolved regulatory question.' },
  { platform: 'X', category: 'Illegal Content — Trusted Flaggers & Notices (Arts. 16.5/16.6)', claim: 'Y3 SRA: dedicated Trusted Flagger Intake Case Group; Art. 16.3 (user notifications on decisions) fully remediated from FTI Negative to BDO Positive. Notice processing (Arts. 16.1–16.4) all Positive Y3. Hourly batch submission to Commission database (Art. 24.5 Positive).', auditor: 'Y2 FTI: No Conclusion on Art. 16.5 (trusted flagger obligations). Y3 BDO: No Conclusion on Arts. 16.5 and 16.6 — EC proceedings. Trusted flagger framework has NEVER received a Positive audit conclusion in any cycle. Non-trusted-flagger notice chain: fully Positive Y3.', ec: 'EC formal proceedings on Arts. 16.5 and 16.6: trusted flagger priority processing and counter-notice obligations under active investigation. Art. 16.3 reversal (refused remediation in Y2 → Positive in Y3) analytically unexplained — X initially stated it "remains at Commission\'s disposal" before reversing.' },
  { platform: 'X', category: 'Fundamental Rights & Dark Patterns (Art. 25.1)', claim: 'Y3 SRA: freedom of expression Tier 3 (managed); ad transparency (Arts. 26.1–26.3) all Positive — \'Ad\' labels, #ad hashtag declarations, no GDPR Art. 9 special-category ad targeting. Y3 Blue Check / verification system redesigned.', auditor: 'Y2 FTI: NEGATIVE on Art. 25.1 (dark patterns — interface design deceptive/manipulative elements confirmed). Y3 BDO: No Conclusion on Art. 25.1 (EC proceedings prevent assessment). Art. 14.4 Y2 finding: inconsistent T&C enforcement for verified/high-follower accounts → Positive Y3.', ec: 'EC formal proceedings on Art. 25.1 (dark patterns): the Commission\'s concern is structural and ongoing — not resolved by BDO\'s inability to assess. Two consecutive audit cycles without Positive on Art. 25.1. EC proceedings confirm this is a regulatory priority, not an auditor\'s judgment call.' },
  { platform: 'X', category: 'Civic Discourse & Elections (Arts. 34.1(c)/35.1)', claim: 'Civic Integrity policy (Aug 2023). No political ads in EU. Community Notes: all EU member states, 25% of global ratings from EU. NATO/EEAS/EP engagement. Global Witness confirmed X rejected all disinformation test ads. Y3 SRA: residual risk in Tier 2 explicitly decreased vs. Y2.', auditor: 'Y2 FTI: Positive on recommender transparency (Arts. 27.1, 27.3) with Negative on Art. 27.2 (parameter reasons). Y3 BDO: Arts. 27.1, 27.2, 27.3 all Positive (27.2 fully remediated). Art. 36.1 Positive with comments (crisis protocols documented; no formal EC crisis decision triggered). Community Notes audited only for existence, not effectiveness.', ec: 'EC formal proceedings on Arts. 34.1/34.2/35.1: the adequacy of X\'s entire risk assessment and mitigation architecture for elections cannot be independently validated. Community Notes effectiveness as a systemic risk mitigation for elections is unverified by any independent body.' },
  { platform: 'X', category: 'Researcher Data Access & Ad Repository (Arts. 40.12, 39.1–39.3)', claim: 'Y3 SRA: Ad repository not discussed as platform claim. Compliance with Art. 40 researcher access documented in internal procedures.', auditor: 'Y3 BDO: Arts. 39.1–39.3 (ad repository — public, machine-readable) and Art. 40.12 (researcher data access): all No Conclusion due to EC formal proceedings. BDO could not inspect either mechanism.', ec: 'EC formal proceedings on Arts. 39.1–39.3 and 40.12: the structural transparency mechanisms for civil society (ad repository) and academic research (data access) are both under active regulatory challenge. For the DSA Systemic Risk Observatory research programme: Art. 40.12 proceedings structurally block independent verification of X\'s self-assessed risk metrics, including the terrorist content Tier 1 escalation.' },
  { platform: 'Pinterest', category: 'Notice & Action', claim: 'User Reporting Pipelines', auditor: 'Accepted delayed receipt definition', ec: 'Acknowledging complaint after investigation subverts effective remedy.' },
  // YouTube — revised from primary documents (GIL Audit Implementation Reports, Year 1 & Year 2)
  { platform: 'YouTube', category: 'Illegal Content & Trusted Flaggers [REVISED]', claim: 'VVR ~0.1% stable; 96% proactive ML detection Q1 2025; CSAI Match (CSAM tool licensed free to industry); GIFCT founding member (2.2M hashes, 36 companies); Priority Flagger Program (300+ gov/NGO partners)', auditor: 'Art. 22.1 NEGATIVE (Year 2): 3/10 sampled TF notices not processed without undue delay. HSC Commitment 2.2 NEGATIVE (Year 2): same infrastructure failure triggers DSA + hate speech code NEGATIVEs simultaneously — dual-capture finding unique in corpus. Art. 14.6 NEGATIVE (Year 2): 24/33 terms deficient across EU languages.', ec: 'Over-reliance on automation leaves blindspots for novel and contextual harms. TF infrastructure failure is analytically significant: unlike TikTok (CIAPC certified with zero volume), YouTube\'s TF queues operated but failed on timeliness — a different failure mode. Δ No standalone YouTube audit report exists; findings extracted from GIL combined Audit Implementation Reports.' },
  { platform: 'YouTube', category: 'Civic Discourse & AIGC [REVISED]', claim: 'The 4 Rs framework (Remove, Raise, Reduce, Reward); SynthID watermarks on all Veo-generated content; mandatory GenAI labeling tool (pre-2024 EU elections); information panels (Wikipedia, health authorities, UN); Breaking News Shelf (42 countries, 16 EU MS); voter suppression / impersonation policies', auditor: 'Arts. 34.1, 34.2, 35.1 — AUDITED in both Year 1 and Year 2 (Positive w/ Comments). UNIQUE IN CORPUS: unlike TikTok and all Meta platforms, YouTube\'s SRA and mitigation adequacy were independently verified. Civic Discourse remains elevated residual risk across all 3 SRA cycles (2023, 2024, 2025).', ec: 'Bad actors will not voluntarily apply AIGC labels; algorithms amplify regardless of labeling. The 4 Rs are a curatorial architecture — EC\'s concern is whether the recommender engine itself can be reconfigured to de-prioritise civic harm vectors. Δ YouTube\'s SRA auditability is the corpus-wide outlier: EC cannot make the unverifiability argument it does against TikTok and Meta.' },
  { platform: 'YouTube', category: 'Minors & Addictive Design [REVISED]', claim: 'YouTube Kids (separate app); Supervised Experience for tweens; Family Center hub (2025); min livestream age raised 13→16 (2025); autoplay off by default for under-18s; disabled profiled ads to minors; expanded March 2025 safeguards (financial advice, delinquency, body image); likeness management technology', auditor: 'Addictive behavior elevated residual risk in 2023 and 2024 SRAs ("state of research remains unsettled" per YouTube). Downgraded from elevated in 2025 SRA. Art. 28.x provisions audited — no NEGATIVE conclusion. No EC proceedings (unlike TikTok Art. 28.1 and Meta Arts. 28.1).', ec: 'Video-native platform recommenders are primary vectors for rabbit-hole loops. Min livestream age increase and autoplay defaults are UI friction, not architectural change. EC\'s concern on an engagement-maximisation engine is whether the default reward function can be altered. Δ Absence of EC proceedings makes YouTube the cleanest minor-protection profile among video-category VLOPs.' },
  { platform: 'YouTube', category: 'Notice Mechanism Access & Terms [REVISED]', claim: 'In-product notice dropdown for illegal content reporting; Help Center webform as alternative path; Terms of Service linked from platform surfaces; compliance with Art. 14.1 service descriptions', auditor: 'Art. 16.1 & HSC Commitment 2.1 Positive w/ Comments (Year 2): in-product dropdown inoperable for signed-out users and signed-in users without a channel — primary path unavailable to large user segment. Art. 14.6 NEGATIVE (Year 2): 24/33 terms not in all 24 EU official languages. Remediation by 31 Dec 2025 (Art. 16.1) and phased TBC (Art. 14.6).', ec: 'Effective notice-and-action requires accessible primary mechanisms. Channelless users face structural access barrier to the principal complaint pathway. H2 2026 implementation window for terms is a multi-year gap. Δ Unlike Meta\'s deliberate definitional refusals, YouTube\'s failures are capability/implementation gaps — different regulatory posture.' },
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
    platform: 'Facebook',
    auditCycles: '2 (2023–24; 2024–25). Year 1 exists but not in reviewed corpus.',
    auditor: 'Ernst & Young LLP (EY)',
    latestOpinion: 'No overall unqualified opinion (2025) — 14 sub-articles + HSC Commitments 2.1/2.2 unauditable. NEGATIVEs: Arts. 15.1 (2024 & 2025), 38.1 Dating (2024), 24.1 (2024), 39.3 (2024), 42.2 (2024), 20.4 (2025), 26.2 Reels Android (2025).',
    gitcStatus: 'Not a recurring GITC failure (unlike TikTok). EY audit methodology differs from KPMG. Audits proceeded on evidence basis.',
    recommenderAudited: 'Yes — Negative. Art. 38.1 NEGATIVE (2024): Facebook Dating had no non-profiling option for 6+ months. Positive in 2025 after fix. Arts. 34.1/35.1 (architecture adequacy) UNAUDITABLE both cycles. Dating context makes this the most serious recommender finding in corpus.',
    unauditableArticles: '14 in both 2024 and 2025 (same as Instagram) PLUS HSC Commitments 2.1 & 2.2 (Facebook-specific): Arts. 14.1, 16.1, 16.5, 16.6, 17.1, 20.1, 20.3, 24.5, 25.1, 28.1, 34.1, 34.2, 35.1, 40.12 — all EC governmental investigations.',
    metricInterrogation: 'No. Consolidated Facebook+Instagram metrics accepted without per-VLOP disaggregation despite NEGATIVE Art. 15.1 finding. Definitional refusals ("promptly", "undue delay") not interrogated as compliance circumvention.',
    enforcementStatus: 'EC governmental investigations blocking 14 sub-articles including Arts. 34.1, 35.1, 28.1, 25.1. Parallel with Instagram — same scope, articles, and blocking logic. HSC Commitments 2.1/2.2 additionally blocked (Facebook-specific).',
    trustedFlaggerValidity: 'Positive (2025) — Arts. 22.1 and 22.6 compliant. No CIAPC-equivalent zero-volume paradox identified.',
    cclStatus: 'Art. 39.3 NEGATIVE (2024): missing removal reason info, remediated April 2024. Art. 26.2 NEGATIVE (2025): Reels Android commercial labels missing ~9 months (~90% of impressions). Art. 42.2 NEGATIVE (2024): missing accuracy indicators.',
    platformSelfRevision: 'Yes — 2025 SRA acknowledges Protection of Minors Tier 3. Teen Account introduced as primary mitigation. Definitional refusals ("promptly", "undue delay") represent a reverse-revision: explicit resistance to self-benchmarking on compliance timelines.',
    primaryDocStatus: 'Fully reviewed — 6 documents (2 SRAs, 2 Audit Reports, 2 Audit Implementation Reports)',
    benchmarkNotes: 'Defining findings: (1) Art. 15.1 NEGATIVE both cycles — Meta corporate-level failure mirroring Instagram. (2) Art. 38.1 NEGATIVE: Facebook Dating had no DSA-compliant non-profiling option for 6+ months — most serious recommender finding on intimacy context in corpus. (3) Art. 26.2 NEGATIVE: Reels Android ~90% missing labels for ~9 months — largest disclosure failure by exposure volume. (4) Definitional refusals: Meta formally declined to define "promptly" and "undue delay" — only deliberate regulatory benchmarking refusal in corpus. Protection of Minors Tier 3 confirms Meta-wide pattern.',
  },
  {
    platform: 'Snapchat',
    auditCycles: '3 SRAs (Y1: Aug 2023, Y2: 2024, Y3: Aug 2025) + 2 audit cycles: Y1 EY (Aug 2024, ISAE 3000 Revised); Y2 EY (Aug 2025, ISAE 3000 Revised). Y2 also covers Illegal Hate Speech Code of Conduct (Jan 20–Jun 30, 2025). Legal entity: Snap Inc. (US) via Snap Group Limited (UK subsidiary for EU operations). EU MAU: 91.2M (Y1) → 92.4M (Y2) → 93.7M (Y3).',
    auditor: 'Ernst & Young LLP (Los Angeles, CA). Both Y1 and Y2 audits by same firm — provides cross-cycle consistency. ISAE 3000 (Revised) attestation standard. Y1 and Y2 EY audit reports are the only two VLOP audit engagements with consecutive ISAE 3000 audit cycles by the same Big Four firm using attestation-based methodology.',
    latestOpinion: 'Y1 (2024): Qualified Negative — single finding (Art. 11.3 equivalent, account deactivation process on Android). Remediated during examination period. Y2 (2025): Positive Unqualified — first clean audit opinion in the entire VLOP corpus. No NEGATIVE conclusions; 2 recommendations (B.1 Art. 39.1 confirmed implemented; B.1 algorithmic documentation → March 2026). Y2 also covers CoC: C.1 Commitment 2.1 confirmed implemented Feb 2025.',
    gitcStatus: 'No GITC framework failure identified in either cycle (unlike TikTok KPMG GITC failure across 3 cycles). EY attestation methodology does not apply the GITC control-layer framework used by KPMG. Attestation-based approach tests the reasonableness of management\'s compliance assertions rather than underlying IT control effectiveness. Snap\'s IT infrastructure not directly tested for control design or operating effectiveness — a methodological distinction from KPMG approach that limits comparability with TikTok audit conclusions.',
    recommenderAudited: 'Partially — Y1: Recommender systems for Discover and Spotlight not independently assessed; audit focused on Art. 39.1 (Ads Gallery), transparency obligations, and dark patterns. Y2 B.1 recommendation identifies documentation gaps across Arts. 27.3 (recommender opt-out), 38.1 (non-profiling option), 35.1 (mitigation proportionality), and 28.1/28.2 (minor protection) — not a NEGATIVE finding, but a documentation insufficiency. Recommender architecture effectiveness (Discover editorial curation, Spotlight pre-moderation) has not been independently verified as an Art. 35 mitigation. EC RFI on recommender systems signals external scepticism about the architectural-as-mitigation argument.',
    unauditableArticles: 'ZERO unauditable articles in either Y1 or Y2 — analytically unique across the entire VLOP corpus. No EC formal proceedings have been opened against Snap as of August 2025. Arts. 34.1, 34.2, 35.1 (SRA quality and mitigation adequacy) were audited in both cycles — unlike TikTok (EC proceedings), Meta platforms (EC proceedings), and X (EC proceedings). Art. 28.1 (minor protection) audited — unlike TikTok (EC proceedings) and Meta (EC proceedings). Art. 25.1 (dark patterns) audited — unlike TikTok (Negative 2024), X (Negative + EC proceedings), and Meta (EC proceedings). Full compliance chain (Arts. 34→35→37) verifiable.',
    metricInterrogation: 'Limited. PVP (Policy Violating Prevalence) scale accepted as relative metric — EY did not independently validate sampling methodology or test whether Extremely Low PVP thresholds are comparable to other platforms\' absolute prevalence rates. 40-day SLA for illegal content resolution accepted as satisfying "undue delay" standard without explicit Arts. 17/20 benchmark comparison. VVR (Violative View Rate) introduced in Y3 but not audited (Y3 is SRA only, no Y3 audit report yet). Protect Children study (2024) finding — Snapchat ranked last (10% detection rate for CSAM) — not cross-referenced with Snap\'s own CSEAI Extremely Low PVP self-assessment in either audit cycle.',
    enforcementStatus: 'No EC formal proceedings as of August 2025 — the only VLOP in corpus with a fully clean regulatory slate. EC RFI (Request for Information) issued on recommender systems and curated feeds — this is an information-gathering step, not a formal investigation or enforcement action. RFI signals EC interest in Snap\'s architectural-as-mitigation argument (1:1 messaging, no open feed). DSA Art. 34(2)(b) critical impact assessment triggered by Y3 16-17yo Public Profile posting feature — compliance with EC design change notification procedures under review.',
    trustedFlaggerValidity: 'No specific Trusted Flagger audit finding in either cycle. Art. 22.1 (TF processing obligations) not flagged as a compliance concern in Y1 or Y2 — unlike YouTube (NEGATIVE Y2 on Art. 22.1) and TikTok (GITC failure affecting moderation systems). No CIAPC-equivalent zero-volume certification paradox identified. Arts. 16.5 and 16.6 (TF obligations) not subject to EC proceedings — unlike TikTok and X (both have No Conclusion on these articles due to EC proceedings). Trusted Flagger framework appears compliant in both cycles, though EY\'s attestation methodology does not independently verify TF operational volume or prioritisation queue performance.',
    cclStatus: 'Y1 Art. 39.1 recommendation (B.6): Ads Gallery lacked search by Creator Name — identified and committed to fix. Y2: EY confirmed Creator Name search implemented October 2024 (recommendation closed). Art. 39.1 moved from Positive w/ Comments (Y1) to Positive (Y2). No Art. 39.3 (repository completeness) NEGATIVE in either cycle — unlike TikTok (Negative 2025), Facebook (Negative 2024), Instagram (Negative 2024), and X (No Conclusion). Snap\'s Ads Repository received the cleanest CCL/Ads Gallery compliance record across all reviewed VLOPs.',
    platformSelfRevision: 'Yes — notable across 3 SRA cycles. Y2 additions: VVR (Violative View Rate) added as second metric responsive to civil society feedback (CSOs noted PVP alone insufficient). Y3 additions: explicit Art. 34(2) risk factor sub-sections for each harm category (responding to EC transparency expectations); VVR data integrated throughout. Y3 risk conclusions: explicitly stated NO CHANGES from Y2 across all categories. Only change: Harassment/Bullying improved from Very Low (Y2) to Extremely Low (Y3) — a positive self-revision, not a deterioration. No categories escalated from Y2 to Y3 (in contrast to X: terrorist content Tier 3→Tier 1; Instagram: SSIED Tier 2→Tier 3). Snap is the only VLOP in corpus with no upward risk escalations between Y2 and Y3.',
    primaryDocStatus: 'Fully reviewed — 7 documents: Y1 SRA (Aug 2023, 200+ pp); Y2 SRA (2024, 60+ pp reviewed); Y3 SRA (Aug 2025, 20+ pp reviewed + Cat 1 tables); Y1 Audit Report (Aug 2024, 20 pp); Y2 Audit Package (Aug 2025, 20+ pp); Y1 Audit Implementation Report (Aug 2024, 11 pp, all reviewed); Y2 Audit Implementation Report (2025, 5 pp, all reviewed).',
    benchmarkNotes: 'Defining characteristic: Snapchat is the only VLOP in the 6-platform corpus with (1) a Positive Unqualified audit opinion (Y2), (2) zero unauditable articles across both audit cycles, (3) no EC formal proceedings, and (4) no upward risk escalations from Y2 to Y3. This constitutes the only fully verifiable DSA compliance chain (Arts. 34→35→37) in the corpus. Critical analytical distinctions: (a) Positive Unqualified does not equal absence of risk — EY\'s attestation accepts platform assertions; EC\'s RFI signals scepticism about architecture-as-mitigation argument; (b) PVP scale is relative, not absolute — Protect Children (2024) finding contradicts CSEAI Extremely Low self-assessment using different methodology; (c) Y2 B.1 recommendation (algorithmic documentation → March 2026) reveals that recommender architecture is underdocumented, not independently verified; (d) Y3 16-17yo Public Profile posting change is the most significant Art. 34 critical design trigger in 3-year SRA history — introduced before B.1 documentation deadline.',
  },
  {
    platform: 'X',
    auditCycles: '3 SRAs (Y1: 2023, Y2: 2024, Y3: 2025) + 2 audit cycles: Y2 FTI Consulting (Aug 2024); Y3 BDO LLP (Sep 2025). Legal entity: TIUC (Y1–Y2) → XIUC from 1 April 2025.',
    auditor: 'Y2: FTI Consulting (period mid-2023 to 27 Aug 2024). Y3: BDO LLP London (period 24 Aug 2024 – 30 Jun 2025; signed 1 Sep 2025). Auditor changed between cycles — BDO is entirely new firm, satisfying Art. 37 rotation.',
    latestOpinion: 'NEGATIVE (Qualified) — BDO Y3 2025. Basis: 10 sub-Articles under EC formal proceedings (opened 29 Aug 2025) → No Conclusion: Arts. 16.5, 16.6, 25.1, 34.1, 34.2, 35.1, 39.1–39.3, 40.12. BDO explicitly states: "Absent the below mentioned 10 sub-Articles… the overall conclusion would have been Positive with comments." Y2 FTI 2024: NEGATIVE (substantive) — 8 Negative conclusions: Arts. 15.1, 16.3, 25.1, 27.2, 28.1, 34.2, 35.1, 42.2. All 8 remediated by Y3.',
    gitcStatus: 'Not applicable — FTI and BDO methodology differs from KPMG. No recurring GITC framework failure. Both audits proceeded on evidence/control testing and substantive basis without systemic IT controls breakdown. Unlike TikTok, X did not face a recurring GITC finding.',
    recommenderAudited: 'Yes — fully audited Y3; major improvement. Y2 FTI: NEGATIVE on Art. 27.2 (parameter transparency — why content is suggested — insufficient). Y3 BDO: POSITIVE on Arts. 27.1, 27.2, 27.3 AND Art. 38.1 (non-profiling option). BDO confirmed "For You" (algorithmic) and "Following" (chronological, non-profiling) tabs fully functional and accessible. Arts. 34.1/35.1 (adequacy of risk mitigation architecture) UNAUDITABLE due to EC proceedings — the question of whether FoSnR as a recommender philosophy satisfies Art. 35 remains unresolved.',
    unauditableArticles: '10 sub-Articles under EC formal proceedings (Y3): Arts. 16.5 (trusted flagger obligations), 16.6 (counter-notices), 25.1 (dark patterns), 34.1 (SRA quality/scope), 34.2 (SRA methodology — was also NEGATIVE in Y2), 35.1 (risk mitigations — was also NEGATIVE in Y2), 39.1, 39.2, 39.3 (ad repository), 40.12 (researcher data access). Y2: Arts. 16.5 and 34.3 received No Conclusion. Art. 34.3 upgraded to Positive in Y3 — unique case of No Conclusion → Positive progression.',
    metricInterrogation: 'No systematic metric interrogation in either audit cycle. Y2 FTI: 8 Negative conclusions identified substantive gaps but did not interrogate quantitative claims (e.g., FoSnR effectiveness metrics, Community Notes reach-reduction data). Y3 BDO: No recommendations made — zero Negative conclusions outside EC proceedings. Minor protection: 381,592 self-declared EU minor MAU (0.6%); 11% without age attributed; BDO accepted documented controls without interrogating the 10.3M undeclared-age user population for whom minor protections may not apply.',
    enforcementStatus: 'EC formal proceedings opened 29 August 2025 on 10 sub-Articles: 16.5, 16.6, 25.1, 34.1, 34.2, 35.1, 39.1–39.3, 40.12. Arts. 34.1/34.2 (SRA quality) and 35.1 (risk mitigations) are the structural core of VLOP compliance — proceedings here create the "compliance chain paradox": BDO confirms procedural improvement but cannot assess foundational architecture. Art. 25.1 dark patterns finding: FTI Negative (Y2) → EC proceedings (Y3) — no resolution path visible. Art. 40.12 (researcher access) blocking independent academic verification of X\'s risk metrics.',
    trustedFlaggerValidity: 'Y2 FTI: Art. 16.5 (trusted flagger obligations) received No Conclusion — could not be assessed. Y3 BDO: Art. 16.5 AND Art. 16.6 (counter-notices) received No Conclusion due to EC formal proceedings. Trust flagger framework has never received a Positive conclusion in any audit cycle. Art. 16.1–16.4 (general notice processing) all Positive in Y3 — genuine improvement on the non-trusted-flagger notice chain.',
    cclStatus: 'Art. 39.1–39.3 (ad repository) under EC formal proceedings in Y3 — No Conclusion. BDO could not assess ad repository obligations. Art. 26.1 (ad labelling), Art. 26.2 (commercial communications declaration via #ad hashtags), Art. 26.3 (no GDPR Art. 9 special category profiling for ads) all Positive Y3. X confirmed: no advertisers can target EU users based on special categories of personal data (race, political opinions, religious beliefs, sexual orientation). No political advertising permitted in EU across all three years.',
    platformSelfRevision: 'Yes — substantial and analytically significant. (1) Terrorist content: Tier 3 (Y2) → Tier 1 (Y3) — most dramatic self-escalation in the corpus across all 6 VLOPs. X attributes to Gaza conflict and GenAI threat vectors. (2) Illegal hate speech: Tier 3 (Y2) → Tier 2 (Y3). (3) Civic discourse/elections residual risk explicitly decreased within Tier 2 (Y2→Y3). (4) GBV maintained Tier 2 but self-noted NCN proactive enforcement gap. (5) X joined Illegal Hate Speech Code of Conduct (20 Jan 2025) — audited Positive by BDO. No definitional refusals on "undue delay" or "promptly" unlike Meta.',
    primaryDocStatus: 'Fully reviewed — 7 documents: Y1 SRA (2023, 88pp), Y2 SRA (2024, 76pp), Y3 SRA (2025, 67pp), Y2 FTI Audit Report (27 Aug 2024, 350pp), Y2 Audit Implementation Report (27 Sep 2024), Y3 BDO Audit Report (1 Sep 2025, 86pp), Y3 BDO Audit Implementation Report (2025, 13pp)',
    benchmarkNotes: 'COMPLIANCE CHAIN PARADOX: X shows highest Y2→Y3 remediation rate in corpus (7/8 Negative conclusions resolved) yet faces most structurally targeted EC proceedings (Arts. 34.1, 34.2, 35.1 — the SRA and mitigation foundation). FoSnR philosophy is the defining compliance tension: FTI found Art. 35.1 insufficient; BDO cannot assess it. Freedom of Speech Not Reach (FoSnR) as both the platform\'s primary mitigation claim AND its principal regulatory risk is analytically unique in the VLOP corpus. Community Notes (25% global ratings from EU) is unaudited as an effectiveness mechanism — auditors confirmed existence only. Art. 14.4 Y2 finding (inconsistent T&C enforcement for verified/high-follower accounts) was remediated in Y3 without explanation of how.',
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
    auditCycles: '2 DSA cycles (Year 1: Aug 2023–May 2024; Year 2: Jun 2024–May 2025) + 1 HSC cycle (YouTube only: Jan–May 2025). Note: No standalone YouTube audit report — findings embedded in GIL combined Audit Implementation Reports.',
    auditor: 'Ernst & Young LLP (EY) — single combined GIL engagement covering 4 VLOPs (YouTube, Maps, Play, Shopping) + 1 VLOSE (Search)',
    latestOpinion: 'Positive w/ Comments (overall Year 2) — 5 NEGATIVE individual conclusions across 2 cycles: Art. 24(1) NEGATIVE Year 1 (remediated); Art. 24(5) NEGATIVE Year 1 (auto-remediated); Art. 14.6 NEGATIVE Year 2; Art. 22.1 NEGATIVE Year 2 (remediated Mar 2025); HSC Commitment 2.2 NEGATIVE Year 2 (remediated Mar 2025).',
    gitcStatus: 'Not applicable — EY (not KPMG) methodology. No recurring GITC failure. Audits proceeded on evidence basis across both cycles without systemic IT controls breakdown.',
    recommenderAudited: 'Partially. Arts. 34.1, 34.2, 35.1 AUDITED (Positive w/ Comments) in BOTH Year 1 and Year 2 — unique in corpus. TikTok and all Meta platforms have these articles as unauditable due to EC proceedings. Recommender architecture contribution to Civic Discourse and Addictive Behavior risks assessed within the audited SRA framework.',
    unauditableArticles: 'None reported as unauditable due to EC proceedings (unlike TikTok and Meta). Some obligations listed as non-auditable in scope tables but without the same EC-proceedings blocking rationale. Section D of both Audit Implementation Reports lists non-auditable obligations by article.',
    metricInterrogation: 'Partial. VVR (~0.1%) and proactive detection rates (96%) accepted without sequencing analysis. EY Year 2 audited SRA scoring rationale and recommended documentation improvements (Positive w/ Comments). Art. 24(5) 14% SOR lateness interrogated — root cause identified as technical error.',
    enforcementStatus: 'None confirmed — no formal EC proceedings against YouTube/GIL. EC has issued RFIs and indicated concerns about recommender systems and minor safety but no proceedings equivalent to TikTok (Art. 28.1) or Meta (14 articles blocked).',
    trustedFlaggerValidity: 'NEGATIVE (Year 2): 3/10 sampled TF notices not processed without undue delay. HSC Commitment 2.2 NEGATIVE: same infrastructure failure — dual-capture (DSA Art. 22.1 + EU Hate Speech Code Commitment 2.2 both triggered by identical systemic gap). Remediated March 2025. Unlike TikTok (CIAPC certified with zero operational volume), YouTube\'s TF queues operated — failure was on timeliness, not existence.',
    cclStatus: 'Art. 26.2 Positive w/ Comments (Year 1 & 2): recommendations to expand Studio Mobile App for commercial declarations on YouTube Videos. Art. 42.2 Positive w/ Comments (Year 2): adapt Transparency Report accuracy indicators by member state language by 27 Feb 2026. No NEGATIVE on ad transparency.',
    platformSelfRevision: 'Yes — 2025 SRA: Addictive behavior downgraded from elevated residual risk (was elevated in 2023 and 2024 SRAs; "state of research remains unsettled" per earlier SRAs). Min livestream age raised from 13 to 16 (2025). March 2025 expanded minor safeguards (financial advice, delinquency content, body image comparisons). SynthID watermarks rolled out on all Veo-generated content.',
    primaryDocStatus: 'Fully reviewed — GIL combined corpus: 2 SRAs (2024, 2025), 2 Audit Implementation Reports (Year 1, Year 2), 2 mis-filed Audit Reports (titled "Independent Audit on Google Maps" — not YouTube-specific)',
    benchmarkNotes: 'Defining corpus-wide distinction: Arts. 34.1, 34.2, 35.1 independently audited and verified — the ONLY VLOP where the core SRA and mitigation adequacy framework has been audited. TikTok and all Meta platforms have these unverifiable. Dual-capture finding (Art. 22.1 + HSC 2.2) from single infrastructure gap is unique regulatory structure. No EC proceedings = cleanest enforcement profile among video-category VLOPs. Structural anomaly: no standalone YouTube audit report; all findings require extraction from GIL combined documents.',
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

  const platforms = ['All', 'Snapchat', 'TikTok', 'Instagram', 'Facebook', 'X', 'Pinterest', 'YouTube'];

  const tabs = [
    { id: 'riskMap',        label: 'Matrix 1A: Risk Map' },
    { id: 'auditFindings',  label: 'Matrix 1B: Audit Findings' },
    { id: 'synthesis',      label: 'Thematic Synthesis' },
    { id: 'disconnect',     label: 'Scope vs Substance' },
    { id: 'benchmark',      label: '📊 Audit Benchmarks' },
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
  const isFacebookRow = (row) => row.platform === 'Facebook';
  const isYouTubeRow = (row) => row.platform === 'YouTube';

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
              : isFacebookRow(row)
              ? 'bg-amber-50 hover:bg-amber-100 border-l-4 border-amber-400'
              : isYouTubeRow(row)
              ? 'bg-green-50 hover:bg-teal-50 border-l-4 border-green-500'
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
                    : row[key] === 'Facebook'
                    ? 'bg-amber-200 text-amber-900'
                    : row[key] === 'YouTube'
                    ? 'bg-green-200 text-green-900'
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
                : b.platform === 'Facebook' && b.primaryDocStatus?.startsWith('Fully')
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : b.platform === 'YouTube' && b.primaryDocStatus?.startsWith('Fully')
                ? 'bg-green-50 text-green-900 border-green-300 hover:bg-green-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {b.platform}
            {b.primaryDocStatus?.startsWith('Fully') && (
              <span className={`ml-2 text-xs text-white px-1.5 py-0.5 rounded-full ${b.platform === 'Instagram' ? 'bg-purple-500' : b.platform === 'Facebook' ? 'bg-amber-500' : b.platform === 'YouTube' ? 'bg-green-600' : 'bg-pink-400'}`}>✓ Analyzed</span>
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
            QDA Analysis of VLOP SRAs & Audits · TikTok, Instagram, Facebook & YouTube primary docs integrated (2023–2025)
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
