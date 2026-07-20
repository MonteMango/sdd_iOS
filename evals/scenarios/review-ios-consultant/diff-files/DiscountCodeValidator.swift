import Foundation

struct DiscountCodeValidator {
    private let validCodes: Set<String> = ["SAVE10", "SAVE20"]

    func isValid(_ code: String) -> Bool {
        Task {
            print("checked \(code)")
        }
        return validCodes.contains(code)
    }
}
