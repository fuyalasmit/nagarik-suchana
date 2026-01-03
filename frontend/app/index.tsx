import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";

export default function LandingScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.content}>
                {/* App Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Nagarik Suchana</Text>
                    <Text style={styles.nepaliTitle}>नागरिक सूचना</Text>
                    <Text style={styles.subtitle}>Citizen Information Portal</Text>
                </View>

                {/* Buttons Container */}
                <View style={styles.buttonContainer}>
                    {/* Admin Button */}
                    <Link href="/admin/login" asChild>
                        <Pressable style={styles.adminButton}>
                            <Text style={styles.buttonTitle}>Admin Login</Text>
                            <Text style={styles.buttonSubtitle}>Manage notices and documents</Text>
                        </Pressable>
                    </Link>

                    {/* User Button */}
                    <Link href="/(tabs)" asChild>
                        <Pressable style={styles.userButton}>
                            <Text style={styles.buttonTitle}>User Portal</Text>
                            <Text style={styles.buttonSubtitle}>View notices and information</Text>
                        </Pressable>
                    </Link>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Government of Nepal</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    titleContainer: {
        marginBottom: 48,
        alignItems: "center",
    },
    mainTitle: {
        fontSize: 36,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "center",
        marginBottom: 8,
    },
    nepaliTitle: {
        fontSize: 20,
        color: colors.gray[600],
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray[500],
        textAlign: "center",
        marginTop: 16,
    },
    buttonContainer: {
        width: "100%",
        maxWidth: 400,
        marginTop: 20,
    },
    adminButton: {
        backgroundColor: "#3A6F43",
        borderColor: "#2D5534",
        borderWidth: 3,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    userButton: {
        backgroundColor: "#59AC77",
        borderColor: "#4A9165",
        borderWidth: 3,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 24,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    buttonSubtitle: {
        color: "#FFFFFF",
        opacity: 0.8,
        fontSize: 14,
        textAlign: "center",
        marginTop: 4,
    },
    footer: {
        position: "absolute",
        bottom: 32,
    },
    footerText: {
        color: colors.gray[400],
        fontSize: 14,
        textAlign: "center",
    },
});
