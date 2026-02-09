// ABOUTME: A2UI type definitions
// ABOUTME: Component interfaces, payload/response types, and type guards for the unified A2UI protocol

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
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
    layout: "half" | "full";
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
