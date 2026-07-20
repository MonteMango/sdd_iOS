import SwiftUI

struct ProfileView: View {
    @State private var name: String = ""

    var body: some View {
        NavigationStack {
            List {
                Text(name)
            }
            .navigationTitle("Profile")
        }
    }
}
