// ABOUTME: Mock behavioral events for demo/hackathon
// ABOUTME: 40+ realistic events simulating a 12-day user journey with S-PDCA pattern

import type { LedgerEvent } from "./types";

/**
 * Generate mock events for the Journal page.
 * Simulates a realistic 12-day journey of a knowledge worker named Alex
 * who is using Constellate to lose 8kg over 21 days.
 *
 * Events follow the S-PDCA methodology:
 * - State: state_checkin, sleep
 * - Plan: goal
 * - Do: meal, exercise, water_intake
 * - Check: weigh_in, reflection
 * - Act: craving (with coping strategies)
 */

const BASE_DATE = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000);

function dayOffset(days: number, hours: number = 0, minutes: number = 0): string {
    const d = new Date(BASE_DATE);
    d.setDate(d.getDate() + days);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
}

export const MOCK_EVENTS: LedgerEvent[] = [
    // ===== Day 1: Chapter Start =====
    {
        ts: dayOffset(0, 8, 0),
        type: "goal",
        scope: "chapter",
        summary: "Lose 8kg in 21 days while maintaining energy for work",
        details: "Focus on sustainable choices, not restriction. Identity: someone who makes clear choices in complex environments.",
        evidence: "I want to feel in control of my eating habits. Work stress has been driving me to snack mindlessly.",
    },
    {
        ts: dayOffset(0, 8, 30),
        type: "state_checkin",
        energy: 6,
        mood: 7,
        stress: 4,
        evidence: "Feeling cautiously optimistic about this new approach.",
    },
    {
        ts: dayOffset(0, 12, 30),
        type: "meal",
        summary: "Grilled chicken salad with olive oil dressing",
        confidence: 0.9,
        kcal: 450,
        protein_g: 35,
        evidence: "Had lunch at the office cafeteria. Chose the salad station instead of the pasta bar.",
    },
    {
        ts: dayOffset(0, 19, 0),
        type: "meal",
        summary: "Salmon with steamed vegetables",
        confidence: 0.85,
        kcal: 520,
        protein_g: 40,
        evidence: "Cooked at home. Avoided the temptation to order delivery.",
    },

    // ===== Day 2 =====
    {
        ts: dayOffset(1, 6, 45),
        type: "sleep",
        hours: 7.5,
        quality: "good",
        bedtime: "23:00",
        waketime: "06:30",
        evidence: "Woke up before the alarm. Felt rested.",
    },
    {
        ts: dayOffset(1, 7, 30),
        type: "exercise",
        summary: "Morning run in the park",
        exercise_type: "running",
        duration_min: 25,
        kcal_burned: 280,
        intensity: "moderate",
        evidence: "First morning run in weeks. Felt surprisingly good.",
    },
    {
        ts: dayOffset(1, 13, 0),
        type: "meal",
        summary: "Vegetable soup and whole grain bread",
        confidence: 0.9,
        kcal: 380,
        evidence: "Light lunch because I wasn't very hungry after the morning run.",
    },
    {
        ts: dayOffset(1, 22, 0),
        type: "reflection",
        insight: "Exercise in the morning makes my food choices throughout the day feel more intentional.",
        trigger: "Noticed I wasn't tempted by the office snacks today",
        spdca_phase: "check",
    },

    // ===== Day 3: First Challenge =====
    {
        ts: dayOffset(2, 8, 0),
        type: "state_checkin",
        energy: 4,
        mood: 5,
        stress: 7,
        evidence: "Deadline pressure. Didn't sleep well.",
    },
    {
        ts: dayOffset(2, 15, 30),
        type: "craving",
        trigger: "Stressful meeting",
        intensity: 8,
        action_taken: "Took a 5-min walk around the building",
        outcome: "Craving reduced to 4, didn't snack",
        evidence: "Wanted to grab cookies from the break room but remembered the walk strategy.",
    },
    {
        ts: dayOffset(2, 19, 30),
        type: "meal",
        summary: "Pizza delivery (2 slices) + side salad",
        confidence: 0.7,
        kcal: 650,
        evidence: "Too tired to cook. But ordered salad with it which I wouldn't have done before.",
    },

    // ===== Day 4 =====
    {
        ts: dayOffset(3, 7, 0),
        type: "weigh_in",
        weight_kg: 84.2,
        evidence: "Starting to track weight more consistently.",
    },
    {
        ts: dayOffset(3, 12, 0),
        type: "meal",
        summary: "Bento box with rice, grilled fish, and vegetables",
        confidence: 0.9,
        kcal: 520,
        protein_g: 28,
        evidence: "Tried the Japanese place near office. Portion was perfect.",
    },
    {
        ts: dayOffset(3, 16, 0),
        type: "water_intake",
        water_ml: 500,
        evidence: "Set a reminder to drink water every 2 hours.",
    },

    // ===== Day 5: Weekend =====
    {
        ts: dayOffset(4, 9, 30),
        type: "sleep",
        hours: 8.5,
        quality: "excellent",
        bedtime: "00:00",
        waketime: "08:30",
        evidence: "Finally caught up on sleep.",
    },
    {
        ts: dayOffset(4, 11, 0),
        type: "exercise",
        summary: "Yoga session at home",
        exercise_type: "yoga",
        duration_min: 45,
        kcal_burned: 200,
        intensity: "light",
        evidence: "Followed a YouTube video. Felt calmer afterwards.",
    },
    {
        ts: dayOffset(4, 19, 0),
        type: "meal",
        summary: "Dinner party at friend's house - various dishes",
        confidence: 0.5,
        kcal: 900,
        evidence: "Social dinner. Tried to focus on protein and veg but had some dessert too.",
    },
    {
        ts: dayOffset(4, 23, 0),
        type: "reflection",
        insight: "Social eating doesn't have to be all-or-nothing. I can enjoy the moment while being mindful.",
        spdca_phase: "check",
    },

    // ===== Day 6 =====
    {
        ts: dayOffset(5, 8, 0),
        type: "state_checkin",
        energy: 7,
        mood: 8,
        stress: 3,
        evidence: "Weekend recovery complete. Ready for the week.",
    },
    {
        ts: dayOffset(5, 13, 0),
        type: "meal",
        summary: "Homemade chicken stir-fry with brown rice",
        confidence: 0.95,
        kcal: 480,
        protein_g: 32,
        evidence: "Meal prepped for the week. Five containers ready.",
    },

    // ===== Day 7: One Week Mark =====
    {
        ts: dayOffset(6, 7, 0),
        type: "weigh_in",
        weight_kg: 83.5,
        evidence: "Down 0.7kg from day 4. Steady progress.",
    },
    {
        ts: dayOffset(6, 8, 0),
        type: "goal",
        scope: "weekly",
        summary: "Week 2: Maintain meal prep habit, add one more exercise day",
        details: "The meal prep is working. Want to try morning runs 3x this week instead of 2x.",
        evidence: "Week 1 reflection: the structure is helping more than willpower ever did.",
    },

    // ===== Day 8 =====
    {
        ts: dayOffset(7, 6, 30),
        type: "exercise",
        summary: "Morning run - longer route",
        exercise_type: "running",
        duration_min: 35,
        kcal_burned: 380,
        intensity: "moderate",
        evidence: "Tried a new route. Discovered a nice cafe on the way.",
    },
    {
        ts: dayOffset(7, 12, 30),
        type: "meal",
        summary: "Meal prep container #1 - chicken stir-fry",
        confidence: 0.95,
        kcal: 480,
        protein_g: 32,
        evidence: "Meal prep is saving me from decision fatigue at lunch.",
    },

    // ===== Day 9: Difficult Day =====
    {
        ts: dayOffset(8, 7, 0),
        type: "sleep",
        hours: 5.5,
        quality: "poor",
        bedtime: "01:30",
        waketime: "07:00",
        evidence: "Stayed up late working on project deadline.",
    },
    {
        ts: dayOffset(8, 8, 0),
        type: "state_checkin",
        energy: 3,
        mood: 4,
        stress: 8,
        evidence: "Exhausted. Today will be challenging.",
    },
    {
        ts: dayOffset(8, 15, 0),
        type: "craving",
        trigger: "Low energy + afternoon slump",
        intensity: 7,
        action_taken: "Had a coffee and walked for 10 minutes",
        outcome: "Craving down to 3",
        evidence: "The walk helped more than I expected. Didn't need the candy bar.",
    },
    {
        ts: dayOffset(8, 19, 0),
        type: "meal",
        summary: "Meal prep container #2 + extra vegetables",
        confidence: 0.9,
        kcal: 550,
        evidence: "Added more broccoli because I was extra hungry. Still a reasonable choice.",
    },

    // ===== Day 10 =====
    {
        ts: dayOffset(9, 7, 0),
        type: "sleep",
        hours: 8,
        quality: "good",
        bedtime: "22:30",
        waketime: "06:30",
        evidence: "Prioritized sleep after yesterday's crash.",
    },
    {
        ts: dayOffset(9, 6, 45),
        type: "exercise",
        summary: "HIIT workout at home",
        exercise_type: "hiit",
        duration_min: 20,
        kcal_burned: 250,
        intensity: "high",
        evidence: "Short but intense. Perfect for a busy morning.",
    },
    {
        ts: dayOffset(9, 22, 0),
        type: "reflection",
        insight: "Sleep quality directly impacts my ability to make good food choices. This isn't about willpower - it's about setting myself up for success.",
        spdca_phase: "check",
    },

    // ===== Day 11 =====
    {
        ts: dayOffset(10, 7, 0),
        type: "weigh_in",
        weight_kg: 82.9,
        evidence: "Another 0.6kg down. The system is working.",
    },
    {
        ts: dayOffset(10, 12, 0),
        type: "meal",
        summary: "Poke bowl with salmon and avocado",
        confidence: 0.85,
        kcal: 580,
        protein_g: 35,
        evidence: "Team lunch out. Chose the healthiest option on the menu.",
    },
    {
        ts: dayOffset(10, 18, 0),
        type: "water_intake",
        water_ml: 2100,
        evidence: "New daily record! The reminder system is working.",
    },

    // ===== Day 12 (Today) =====
    {
        ts: dayOffset(11, 6, 30),
        type: "exercise",
        summary: "Morning run in light rain",
        exercise_type: "running",
        duration_min: 30,
        kcal_burned: 320,
        intensity: "moderate",
        evidence: "Almost skipped because of rain. Glad I didn't - felt great after.",
    },
    {
        ts: dayOffset(11, 8, 0),
        type: "state_checkin",
        energy: 8,
        mood: 8,
        stress: 3,
        evidence: "Feeling strong. The morning run really sets the tone.",
    },
    {
        ts: dayOffset(11, 12, 30),
        type: "meal",
        summary: "Last meal prep container + fresh fruit",
        confidence: 0.95,
        kcal: 520,
        protein_g: 30,
        evidence: "Finished the week's meal prep. Time to cook for next week.",
    },
    {
        ts: dayOffset(11, 21, 0),
        type: "reflection",
        insight: "12 days in and I'm noticing a shift. I'm not fighting against myself anymore - I'm just making choices that align with who I want to be.",
        spdca_phase: "act",
    },
];
