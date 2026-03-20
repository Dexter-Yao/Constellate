// ABOUTME: API 配置，管理 LangGraph 后端 base URL 和 assistant ID
// ABOUTME: 本地开发使用局域网 IP，生产环境使用 LangGraph Cloud URL

import Foundation

enum APIConfiguration {
    /// LangGraph 后端 base URL
    /// 本地开发：http://192.168.x.x:2024（Mac 局域网 IP）
    /// 生产环境：LangGraph Cloud 部署 URL
    static var baseURL: URL {
        if let urlString = ProcessInfo.processInfo.environment["LANGGRAPH_API_URL"],
           let url = URL(string: urlString) {
            return url
        }
        return URL(string: "http://localhost:2024")!
    }

    static let assistantID = "coach"

    /// 持久化 Thread ID
    static var threadID: String? {
        get { UserDefaults.standard.string(forKey: "constellate_thread_id") }
        set { UserDefaults.standard.set(newValue, forKey: "constellate_thread_id") }
    }
}
