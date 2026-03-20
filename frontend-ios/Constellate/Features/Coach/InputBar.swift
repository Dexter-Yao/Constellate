// ABOUTME: 底部输入栏，支持文本输入和发送
// ABOUTME: Phase 1 仅文本，Phase 3 新增语音和拍照

import SwiftUI

struct InputBar: View {
    var onSend: (String, Data?) -> Void
    var disabled: Bool = false

    @State private var text = ""
    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(alignment: .bottom, spacing: StarpathTokens.spacingSM) {
            // 文本输入
            TextField("", text: $text, axis: .vertical)
                .lineLimit(1...5)
                .font(.system(size: StarpathTokens.fontSizeSM))
                .foregroundStyle(StarpathTokens.obsidian)
                .padding(.horizontal, StarpathTokens.spacingSM)
                .padding(.vertical, StarpathTokens.spacingSM)
                .background(
                    RoundedRectangle(cornerRadius: 4)
                        .stroke(StarpathTokens.obsidian10, lineWidth: 1)
                )
                .focused($isFocused)

            // 发送按钮
            Button {
                send()
            } label: {
                Image(systemName: "arrow.up")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(StarpathTokens.parchment)
                    .frame(width: 32, height: 32)
                    .background(canSend ? StarpathTokens.obsidian : StarpathTokens.obsidian40)
                    .clipShape(Circle())
            }
            .disabled(!canSend)
        }
        .padding(.horizontal, StarpathTokens.spacingMD)
        .padding(.vertical, StarpathTokens.spacingSM)
        .background(StarpathTokens.parchment)
    }

    private var canSend: Bool {
        !disabled && !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private func send() {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        onSend(trimmed, nil)
        text = ""
    }
}
