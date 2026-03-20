// ABOUTME: HealthKit 权限请求视图，渐进式展示
// ABOUTME: 在上下文相关时机弹出，而非首次启动时请求

import SwiftUI

struct HealthPermissionView: View {
    let dataType: HealthDataType
    var onAllow: () async -> Void
    var onSkip: () -> Void

    enum HealthDataType {
        case weight
        case sleep
        case steps

        var title: String {
            switch self {
            case .weight: "同步体重数据"
            case .sleep: "同步睡眠数据"
            case .steps: "同步活动数据"
            }
        }

        var description: String {
            switch self {
            case .weight: "从 Apple 健康读取体重记录，Coach 可以追踪趋势变化"
            case .sleep: "从 Apple 健康读取睡眠数据，帮助 Coach 评估你的状态"
            case .steps: "从 Apple 健康读取步数和活动能量，作为行为参考"
            }
        }

        var icon: String {
            switch self {
            case .weight: "scalemass"
            case .sleep: "bed.double"
            case .steps: "figure.walk"
            }
        }
    }

    var body: some View {
        VStack(spacing: StarpathTokens.spacingLG) {
            Image(systemName: dataType.icon)
                .font(.system(size: 32))
                .foregroundStyle(StarpathTokens.obsidian40)

            Text(dataType.title)
                .starpathSerif(size: StarpathTokens.fontSizeLG)

            Text(dataType.description)
                .starpathSans()
                .foregroundStyle(StarpathTokens.obsidian40)
                .multilineTextAlignment(.center)

            Spacer()

            VStack(spacing: StarpathTokens.spacingSM) {
                ObsidianPill(label: "允许访问", style: .filled) {
                    Task { await onAllow() }
                }
                ObsidianPill(label: "暂不需要", style: .outline) {
                    onSkip()
                }
            }
        }
        .padding(StarpathTokens.spacingXL)
    }
}
