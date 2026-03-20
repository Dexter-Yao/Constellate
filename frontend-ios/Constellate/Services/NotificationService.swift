// ABOUTME: 本地通知服务，管理教练节奏通知
// ABOUTME: 每日晚间复盘 + 每周趋势 + 预测性风险预警

import Foundation
import UserNotifications

enum NotificationService {

    // MARK: - Authorization

    static func requestAuthorization() async throws -> Bool {
        let center = UNUserNotificationCenter.current()
        return try await center.requestAuthorization(options: [.alert, .sound, .badge])
    }

    // MARK: - Schedule

    /// 每日晚间复盘通知
    static func scheduleDailySummary(hour: Int = 21, minute: Int = 0) {
        let content = UNMutableNotificationContent()
        content.title = "Constellate"
        content.body = "今日复盘已准备好"
        content.sound = .default

        var dateComponents = DateComponents()
        dateComponents.hour = hour
        dateComponents.minute = minute

        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(
            identifier: "daily_summary",
            content: content,
            trigger: trigger
        )

        UNUserNotificationCenter.current().add(request)
    }

    /// 每周趋势通知
    static func scheduleWeeklyTrends(dayOfWeek: Int = 1, hour: Int = 10) {
        let content = UNMutableNotificationContent()
        content.title = "Constellate"
        content.body = "本周趋势已生成"
        content.sound = .default

        var dateComponents = DateComponents()
        dateComponents.weekday = dayOfWeek
        dateComponents.hour = hour

        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(
            identifier: "weekly_trends",
            content: content,
            trigger: trigger
        )

        UNUserNotificationCenter.current().add(request)
    }

    /// 取消所有通知
    static func cancelAll() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
    }
}
