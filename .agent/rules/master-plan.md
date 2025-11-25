---
trigger: always_on
---

# Antigravity Development Guide

This document outlines the workflow for Antigravity when working on the Abundance Effect project.

## Core Principle
**Focus ONLY on the `2. NEXT` section of `MASTER_PLAN.md`.**
**Don't use the terminal, it'll get you stuck. Write me the commands, I'll run them for you, and then we'll continue.
**Important! $200 tip bet: if you can do it on your first try. Take a deep breath and solve step by step.

## Workflow

1.  **Read `MASTER_PLAN.md`**:
    *   Locate the `2. NEXT (В разработке)` section.
    *   Identify the current active task(s).

2.  **Execute**:
    *   Implement the features/changes described in the active task.
    *   Follow the specific checklist items if present.
    *   **Do not** jump to `3. PLANS` unless the `NEXT` section is empty or explicitly instructed.

3.  **Update `MASTER_PLAN.md`**:
    *   **During Development**: You can mark checklist items as done `[x]` within the `NEXT` section.
    *   **Completion**: When a top-level task in `NEXT` is fully completed (including testing and deployment steps):
        1.  Move the task from `2. NEXT` to `1. DONE (Реализовано)`.
        2.  If the task is large, summarize it briefly in `DONE`.
        3.  Pull the next priority item from `3. PLANS` into `2. NEXT`.

4.  **Partial Completion / Blockers**:
    *   If a task cannot be fully completed, leave it in `NEXT`.
    *   Add notes or sub-items explaining what is left or what is blocking progress.
    *   Do not move to `DONE` until it is truly done.

5.  **New Tasks**:
    *   New ideas or requests go into `3. PLANS` (Backlog) first, unless they are critical fixes for the current `NEXT` item.

## Technical Rules
*   **Package Manager**: Use `npm` (unless instructed otherwise). *Note: `pnpm-lock.yaml` exists, clarify with user if we should switch.*
*   **Commits**: Keep commits atomic and related to the current `NEXT` task.