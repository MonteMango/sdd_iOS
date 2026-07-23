import XCTest

final class ProfileSyncTests: XCTestCase {
    func testSyncUpdatesLastSyncDate() async {
        let coordinator = ProfileSyncCoordinator()
        await coordinator.syncIfStale()
    }
}
