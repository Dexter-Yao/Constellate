// ABOUTME: Constellate iOS 应用入口
// ABOUTME: 配置 SwiftData ModelContainer 并挂载 TabView 根视图

import SwiftUI
import SwiftData

@main
struct ConstellateApp: App {
    let modelContainer: ModelContainer

    init() {
        do {
            modelContainer = try ModelContainerSetup.create()
        } catch {
            fatalError("ModelContainer 创建失败: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(modelContainer)
    }
}
