// ABOUTME: 扇出面板路由组件
// ABOUTME: 根据 HITL action_request 的工具名称路由到对应的交互卡片

"use client";

import { MealConfirmCard } from "./MealConfirmCard";
import { StateCheckinCard } from "./StateCheckinCard";
import { ProtocolPromptCard } from "./ProtocolPromptCard";

interface FanOutRouterProps {
    componentName: string;
    props: Record<string, unknown>;
    onApprove: () => void;
    onEdit: (name: string, args: Record<string, unknown>) => void;
    onReject: () => void;
}

export function FanOutRouter({
    componentName,
    props,
    onApprove,
    onEdit,
    onReject,
}: FanOutRouterProps) {
    switch (componentName) {
        case "meal_confirm":
            return (
                <MealConfirmCard
                    time={(props.time as string) || ""}
                    items={(props.items as string) || ""}
                    kcal_estimate={(props.kcal_estimate as number) || 0}
                    confidence={(props.confidence as string) || ""}
                    tags={(props.tags as string[]) || []}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            );
        case "state_checkin":
            return (
                <StateCheckinCard
                    energy={(props.energy as number) || 0}
                    hunger={(props.hunger as number) || 0}
                    stress={(props.stress as number) || 0}
                    mood={(props.mood as number) || 0}
                    note={(props.note as string) || ""}
                    onApprove={onApprove}
                    onEdit={onEdit}
                    onReject={onReject}
                />
            );
        case "protocol_prompt":
            return (
                <ProtocolPromptCard
                    observation={(props.observation as string) || ""}
                    question={(props.question as string) || ""}
                    option_a_label={(props.option_a_label as string) || ""}
                    option_a_value={(props.option_a_value as string) || ""}
                    option_b_label={(props.option_b_label as string) || ""}
                    option_b_value={(props.option_b_value as string) || ""}
                    onEdit={onEdit}
                    onReject={onReject}
                />
            );
        default:
            return null;
    }
}
