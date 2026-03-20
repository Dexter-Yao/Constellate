// ABOUTME: 触觉反馈服务，遵循 Starpath "冷静、精准" 原则
// ABOUTME: light(滑块) / medium(提交) / success(卡片接受)，常规消息无触觉

import UIKit

enum HapticService {
    /// A2UI 滑块值变化
    static func light() {
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    /// A2UI 提交
    static func medium() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }

    /// 干预卡片被接受
    static func success() {
        UINotificationFeedbackGenerator().notificationOccurred(.success)
    }
}
