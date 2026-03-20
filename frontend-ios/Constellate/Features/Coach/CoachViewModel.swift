// ABOUTME: Coach 对话页 ViewModel，管理流式消息和 A2UI 中断
// ABOUTME: 映射 Web 版 ChatContainer.tsx 的核心逻辑

import Foundation
import SwiftData
import Observation

@Observable
final class CoachViewModel {
    var messages: [ChatMessage] = []
    var isStreaming = false
    var errorMessage: String?

    private let api = LangGraphAPI()
    private var modelContext: ModelContext?
    private var streamTask: Task<Void, Never>?

    func configure(modelContext: ModelContext) {
        self.modelContext = modelContext
        loadMessages()
    }

    // MARK: - Send Message

    func sendMessage(_ text: String, imageData: Data? = nil) {
        guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        guard !isStreaming else { return }

        let threadID = APIConfiguration.threadID ?? ""

        // 添加用户消息到本地
        let userMessage = ChatMessage(
            role: "user",
            textContent: text,
            imageData: imageData,
            threadID: threadID
        )
        messages.append(userMessage)
        modelContext?.insert(userMessage)

        // 准备 assistant 占位消息
        let assistantMessage = ChatMessage(
            role: "assistant",
            textContent: "",
            threadID: threadID
        )
        messages.append(assistantMessage)

        isStreaming = true
        errorMessage = nil

        streamTask = Task { [weak self] in
            guard let self else { return }
            do {
                let threadID = try await api.ensureThread()

                // 更新 threadID（首次创建时）
                if userMessage.threadID.isEmpty {
                    userMessage.threadID = threadID
                    assistantMessage.threadID = threadID
                }

                let stream = await api.streamRun(
                    threadID: threadID,
                    message: text,
                    imageData: imageData
                )

                var fullContent = ""

                for await event in stream {
                    if Task.isCancelled { break }

                    switch event {
                    case .token(let content):
                        fullContent = content
                        await MainActor.run {
                            assistantMessage.textContent = fullContent
                        }

                    case .message(_, let content):
                        fullContent = content
                        await MainActor.run {
                            assistantMessage.textContent = fullContent
                        }

                    case .interrupt:
                        // Phase 2 处理 A2UI 中断
                        break

                    case .done:
                        break

                    case .error(let error):
                        await MainActor.run {
                            self.errorMessage = error.localizedDescription
                        }
                    }
                }

                await MainActor.run {
                    assistantMessage.textContent = fullContent
                    self.modelContext?.insert(assistantMessage)
                    self.isStreaming = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isStreaming = false
                    // 移除空的 assistant 占位消息
                    if assistantMessage.textContent.isEmpty {
                        self.messages.removeLast()
                    }
                }
            }
        }
    }

    // MARK: - Cancel

    func cancelStream() {
        streamTask?.cancel()
        isStreaming = false
    }

    // MARK: - Load from SwiftData

    private func loadMessages() {
        guard let modelContext else { return }
        let descriptor = FetchDescriptor<ChatMessage>(
            sortBy: [SortDescriptor(\.timestamp)]
        )
        if let saved = try? modelContext.fetch(descriptor) {
            messages = saved
        }
    }
}
