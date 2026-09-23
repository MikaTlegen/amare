---
target: кабинеты (CabinetShell)
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:\\\\wsl.localhost\\ubuntu\\home\\tlegen\\projects\\Amare\\packages\\ui\\src\\cabinet-shell.tsx"
target_fingerprint: "sha256:6937ce0c1dd667985d85b1eb87cadb5e186943bae0326b39c41be5a2096c36f0"
target_path: \\wsl.localhost\ubuntu\home\tlegen\projects\Amare\packages\ui\src\cabinet-shell.tsx
timestamp: 2026-09-23T17-21-13Z
slug: packages-ui-src-cabinet-shell-tsx
---
# Critique: кабинеты Amare (CabinetShell: пациент, опекун, staff)
Method: dual-agent. Score 24/40 (Acceptable).
Heuristics: 1-3, 2-3, 3-2, 4-2, 5-3, 6-2, 7-2, 8-2, 9-2, 10-3.
P0: на телефоне первое действие пациента («Выполнено») ~2.3 экрана ниже; шапка 290-324px + демо-полоса.
P0: 8 вкладок в ряд, на 375px видно 2; группировка (сделать/посмотреть/связь) не выражена визуально.
P1: красный повсюду (прогресс bg-accent, демо-полоса, info-алерты) — против «без тревожности».
P1: role=tab без стрелок/tabpanel; вкладка в useState — «Назад»/обновление сбрасывают раздел.
P2: KPI-стиль уместен у модератора, не у пациента; text-xs у модератора ниже базы.
Minor: «67 года»; опекун: «Куратор» = чат только для чтения; MedsPanel text-[0.95rem]; transition-[width] в TodayPlan; цели <44px: «Посмотреть упражнение» 27px, кнопки оценки 43px; line-through у выполненного.
Detector: 1 advisory (design-system-font-size MedsPanel.tsx:116); overlay: nested-cards (ложное, cabinet-shell:97), overused-font (вкус), layout animation (TodayPlan:68).
