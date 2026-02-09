// ABOUTME: 类型定义
// ABOUTME: 定义消息、HITL 交互、体验式干预审阅的数据结构与类型守卫

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// ── HITL 类型 ──

export interface ActionRequest {
    name: string;
    args: Record<string, unknown>;
}

export interface HITLRequest {
    action_requests: ActionRequest[];
    review_configs: Array<{
        action_name: string;
        allowed_decisions: string[];
    }>;
}

export interface HITLDecision {
    type: "approve" | "edit" | "reject";
    edited_action?: { name: string; args: Record<string, unknown> };
    message?: string;
}

export interface HITLResponse {
    decisions: HITLDecision[];
}

// ── 体验式干预审阅 ──

export interface ExperientialReview {
    type: "experiential_intervention_review";
    image_base64: string;
    mime_type: string;
    purpose: string;
    caption: string;
}

// ── 统一 Interrupt ──

export type InterruptPayload = HITLRequest | ExperientialReview;

export function isHITLRequest(data: unknown): data is HITLRequest {
    return (
        !!data &&
        typeof data === "object" &&
        "action_requests" in data
    );
}

export function isExperientialReview(data: unknown): data is ExperientialReview {
    return (
        !!data &&
        typeof data === "object" &&
        "type" in data &&
        (data as ExperientialReview).type === "experiential_intervention_review"
    );
}

// ── 组件 Props ──

export interface MealConfirmProps {
    time: string;
    items: string;
    kcal_estimate: number;
    confidence: string;
    tags: string[];
}

export interface StateCheckinProps {
    energy: number;
    hunger: number;
    stress: number;
    mood: number;
    note: string;
}

export interface ProtocolPromptProps {
    observation: string;
    question: string;
    option_a_label: string;
    option_a_value: string;
    option_b_label: string;
    option_b_value: string;
}

export interface ExperientialReviewProps {
    image_base64: string;
    mime_type: string;
    purpose: string;
    caption: string;
}
