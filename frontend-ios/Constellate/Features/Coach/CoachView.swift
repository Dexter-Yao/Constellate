// ABOUTME: Coach 对话页主视图，承载 MessageList + InputBar
// ABOUTME: Phase 2 将增加 FanOutPanel sheet overlay

import SwiftUI
import SwiftData

struct CoachView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var viewModel = CoachViewModel()

    var body: some View {
        ZStack(alignment: .bottom) {
            // 背景色
            StarpathTokens.parchment
                .ignoresSafeArea()

            // 消息列表
            MessageList(
                messages: viewModel.messages,
                isStreaming: viewModel.isStreaming
            )

            // 输入栏
            VStack(spacing: 0) {
                StarpathDivider()
                InputBar(
                    onSend: { text, imageData in
                        viewModel.sendMessage(text, imageData: imageData)
                    },
                    disabled: viewModel.isStreaming
                )
            }
        }
        .onAppear {
            viewModel.configure(modelContext: modelContext)
        }
        .alert("连接错误", isPresented: showingError) {
            Button("确定") { viewModel.errorMessage = nil }
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
    }

    private var showingError: Binding<Bool> {
        Binding(
            get: { viewModel.errorMessage != nil },
            set: { if !$0 { viewModel.errorMessage = nil } }
        )
    }
}
