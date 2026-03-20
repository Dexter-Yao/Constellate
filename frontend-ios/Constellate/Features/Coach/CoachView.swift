// ABOUTME: Coach 对话页主视图，承载 MessageList + InputBar + FanOutPanel
// ABOUTME: A2UI 中断时以 sheet 形式弹出扇出面板

import SwiftUI
import SwiftData

struct CoachView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var viewModel = CoachViewModel()

    var body: some View {
        ZStack(alignment: .bottom) {
            StarpathTokens.parchment
                .ignoresSafeArea()

            MessageList(
                messages: viewModel.messages,
                isStreaming: viewModel.isStreaming
            )

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
        .sheet(item: $viewModel.activeInterrupt) { payload in
            FanOutPanel(
                payload: payload,
                onSubmit: { data in
                    viewModel.submitA2UIResponse(data)
                },
                onReject: {
                    viewModel.rejectA2UI()
                },
                onSkip: {
                    viewModel.skipA2UI()
                }
            )
            .presentationDetents(payload.layout.detents)
            .presentationDragIndicator(.hidden)
            .presentationBackground(StarpathTokens.parchment.opacity(0.98))
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
