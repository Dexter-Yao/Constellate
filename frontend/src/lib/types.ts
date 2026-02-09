// ABOUTME: A2UI type definitions
// ABOUTME: Component interfaces, payload/response types, and type guards for the unified A2UI protocol

// ── Multimodal Content Parts ──

export interface TextContentPart {
    type: "text";
    text: string;
}

export interface ImageContentPart {
    type: "image_url";
    image_url: { url: string };
}

export type ContentPart = TextContentPart | ImageContentPart;

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string | ContentPart[];
    timestamp: Date;
}

export function getTextContent(message: Message): string {
    if (typeof message.content === "string") return message.content;
    return message.content
        .filter((p): p is TextContentPart => p.type === "text")
        .map((p) => p.text)
        .join("");
}

export function getImageUrls(message: Message): string[] {
    if (typeof message.content === "string") return [];
    return message.content
        .filter((p): p is ImageContentPart => p.type === "image_url")
        .map((p) => p.image_url.url);
}

// ── A2UI Component Types ──

export interface TextComponent {
    kind: "text";
    content: string;
}

export interface ImageComponent {
    kind: "image";
    src: string;
    alt?: string;
}

export interface SliderComponent {
    kind: "slider";
    name: string;
    label: string;
    min?: number;
    max?: number;
    step?: number;
    value?: number | null;
}

export interface TextInputComponent {
    kind: "text_input";
    name: string;
    label: string;
    placeholder?: string;
    value?: string;
}

export interface NumberInputComponent {
    kind: "number_input";
    name: string;
    label: string;
    unit?: string;
    value?: number | null;
}

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectComponent {
    kind: "select";
    name: string;
    label: string;
    options: SelectOption[];
    value?: string;
}

export interface MultiSelectComponent {
    kind: "multi_select";
    name: string;
    label: string;
    options: SelectOption[];
    value?: string[];
}

export type Component =
    | TextComponent
    | ImageComponent
    | SliderComponent
    | TextInputComponent
    | NumberInputComponent
    | SelectComponent
    | MultiSelectComponent;

// ── A2UI Payload & Response ──

export interface A2UIPayload {
    type: "a2ui";
    components: Component[];
    layout: "half" | "three-quarter" | "full";
}

export interface A2UIResponse {
    action: "submit" | "reject" | "skip";
    data: Record<string, unknown>;
}

// ── Type Guard ──

export function isA2UIPayload(data: unknown): data is A2UIPayload {
    return (
        !!data &&
        typeof data === "object" &&
        "type" in data &&
        (data as A2UIPayload).type === "a2ui"
    );
}

// ── Map Page Types ──

export interface InterventionCard {
    id: string;
    imageUrl: string;          // Base64 data URL
    caption: string;           // Coach 文案
    timestamp: Date;
    purpose: "future_self" | "scene_rehearsal" | "metaphor_mirror" |
    "reframe_contrast" | "identity_evolution";
}

export interface ChapterMetadata {
    identityStatement: string; // 身份宣言
    goal: string;              // e.g., "-8kg"
    currentDay: number;        // 第 N 天
    startDate: Date;
}

export interface MapPageData {
    chapter: ChapterMetadata;
    cards: InterventionCard[];
}

// ── Journal Event Types ──

export interface LedgerEvent {
    ts: string;
    type: string;
    summary?: string;
    evidence?: string;
    // Meal
    confidence?: number;
    kcal?: number;
    protein_g?: number;
    carb_g?: number;
    fat_g?: number;
    fiber_g?: number;
    // Exercise
    exercise_type?: string;
    duration_min?: number;
    kcal_burned?: number;
    intensity?: number | string; // number for craving (1-10), string for exercise ("light"/"moderate"/"high")
    // Weight
    weight_kg?: number;
    body_fat_pct?: number;
    // Water
    water_ml?: number;
    // State check-in
    energy?: number;
    mood?: number;
    stress?: number;
    // Sleep
    hours?: number;
    quality?: string;
    bedtime?: string;
    waketime?: string;
    // Goal
    scope?: string;
    details?: string;
    // Reflection
    insight?: string;
    trigger?: string;
    spdca_phase?: string;
    // Craving
    action_taken?: string;
    outcome?: string;
    action?: string;
    tags?: string[];
    [key: string]: unknown;
}

