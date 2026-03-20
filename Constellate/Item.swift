//
//  Item.swift
//  Constellate
//
//  Created by Shuhao Yao on 2026/3/20.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
