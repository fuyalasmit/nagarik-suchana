import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";

export default function AdminLoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setIsLoading(true);

        // Get credentials from env or use defaults
        const ADMIN_EMAIL = process.env.EXPO_PUBLIC_ADMIN_EMAIL || "admin@admin.com";
        const ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD || "admin123";

        // Check credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setIsLoading(false);
            router.push("/admin/dashboard");
        } else {
            setIsLoading(false);
            Alert.alert("Error", "Invalid email or password");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <Text style={styles.backText}>← Back</Text>
                        </Pressable>
                        <Text style={styles.title}>Admin Login</Text>
                        <Text style={styles.subtitle}>नागरिक सूचना प्रशासन</Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="admin@admin.com"
                                placeholderTextColor={colors.gray[400]}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.gray[400]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="password"
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.loginButton,
                                pressed && styles.buttonPressed,
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={handleLogin}
                            disabled={isLoading}>
                            <Text style={styles.loginButtonText}>{isLoading ? "Logging in..." : "Login"}</Text>
                        </Pressable>

                        {/* Hint for development */}
                        <View style={styles.hint}>
                            <Text style={styles.hintText}>Default: admin@admin.com / admin123</Text>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        marginBottom: 40,
    },
    backButton: {
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    backText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: colors.primaryDark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: colors.gray[600],
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.gray[700],
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: colors.white,
    },
    loginButton: {
        backgroundColor: colors.primaryDark,
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    hint: {
        marginTop: 20,
        padding: 12,
        backgroundColor: colors.gray[100],
        borderRadius: 8,
    },
    hintText: {
        color: colors.gray[600],
        fontSize: 12,
        textAlign: "center",
    },
});
