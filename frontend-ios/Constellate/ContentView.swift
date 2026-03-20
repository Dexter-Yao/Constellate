// ABOUTME: 应用根视图，TabView 承载三个页签
// ABOUTME: Phase 1 仅 Coach 页可用，Map/Journal 为占位

import SwiftUI
import SwiftData

struct ContentView: View {
    var body: some View {
        TabView {
            CoachView()
                .tabItem {
                    Label("COACH", systemImage: "message")
                }

            // Phase 3 实现
            Text("MAP")
                .tabItem {
                    Label("MAP", systemImage: "map")
                }

            // Phase 3 实现
            Text("JOURNAL")
                .tabItem {
                    Label("JOURNAL", systemImage: "book")
                }
        }
        .tint(StarpathTokens.obsidian)
    }
}

#Preview {
    ContentView()
        .modelContainer(for: ChatMessage.self, inMemory: true)
}
