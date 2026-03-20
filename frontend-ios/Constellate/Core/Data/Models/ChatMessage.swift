// ABOUTME: 对话消息 SwiftData 模型
// ABOUTME: 映射 LangGraph 流式消息，支持文本和图片附件

import Foundation
import SwiftData

@Model
final class ChatMessage {
    var id: String
    var role: String
    var textContent: String
    var imageData: Data?
    var timestamp: Date
    var threadID: String

    init(
        id: String = UUID().uuidString,
        role: String,
        textContent: String,
        imageData: Data? = nil,
        timestamp: Date = .now,
        threadID: String
    ) {
        self.id = id
        self.role = role
        self.textContent = textContent
        self.imageData = imageData
        self.timestamp = timestamp
        self.threadID = threadID
    }
}
