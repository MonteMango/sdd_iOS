import Foundation

actor ProfileSyncCoordinator {
    private var lastSync: Date?

    func syncIfStale() async {
        Task {
            await performSync()
        }
    }

    private func performSync() async {
        lastSync = Date()
    }
}
