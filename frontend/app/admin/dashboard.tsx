import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "@/constants/colors";

export default function AdminDashboardScreen() {
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFilePicker = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["image/*", "application/pdf"],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedFile(result.assets[0]);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick file");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            Alert.alert("Error", "Please select a file first");
            return;
        }

        setIsUploading(true);

        // TODO: Implement actual upload to backend
        // For now, just simulate upload
        setTimeout(() => {
            setIsUploading(false);
            Alert.alert("Success", "Notice uploaded successfully!");
            setSelectedFile(null);
        }, 2000);
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => router.replace("/"),
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Admin Dashboard</Text>
                        <Text style={styles.subtitle}>Upload Notices & Documents</Text>
                    </View>
                    <Pressable onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
                </View>

                {/* Upload Section */}
                <View style={styles.uploadSection}>
                    <Text style={styles.sectionTitle}>Upload New Notice</Text>

                    {/* File Picker */}
                    <Pressable
                        style={({ pressed }) => [styles.pickerButton, pressed && styles.buttonPressed]}
                        onPress={handleFilePicker}>
                        <Text style={styles.pickerIcon}>📄</Text>
                        <Text style={styles.pickerText}>{selectedFile ? "Change File" : "Select PDF or Image"}</Text>
                    </Pressable>

                    {/* Selected File Info */}
                    {selectedFile && (
                        <View style={styles.fileInfo}>
                            <Text style={styles.fileInfoTitle}>Selected File:</Text>
                            <Text style={styles.fileName}>{selectedFile.name}</Text>
                            <Text style={styles.fileSize}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Text>
                        </View>
                    )}

                    {/* Upload Button */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.uploadButton,
                            pressed && styles.buttonPressed,
                            (!selectedFile || isUploading) && styles.buttonDisabled,
                        ]}
                        onPress={handleUpload}
                        disabled={!selectedFile || isUploading}>
                        <Text style={styles.uploadButtonText}>{isUploading ? "Uploading..." : "Upload Notice"}</Text>
                    </Pressable>
                </View>

                {/* Instructions */}
                <View style={styles.instructions}>
                    <Text style={styles.instructionsTitle}>Instructions:</Text>
                    <Text style={styles.instructionText}>1. Select a PDF or image file</Text>
                    <Text style={styles.instructionText}>2. The file will be processed with OCR</Text>
                    <Text style={styles.instructionText}>3. AI will extract structured information</Text>
                    <Text style={styles.instructionText}>4. Notice will be published to users</Text>
                </View>

                {/* Recent Notices (Placeholder) */}
                <View style={styles.recentSection}>
                    <Text style={styles.sectionTitle}>Recent Notices</Text>
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>No notices uploaded yet</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.primaryDark,
    },
    subtitle: {
        fontSize: 14,
        color: colors.gray[600],
        marginTop: 4,
    },
    logoutButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.accent,
    },
    logoutText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "600",
    },
    uploadSection: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.gray[800],
        marginBottom: 16,
    },
    pickerButton: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: "dashed",
        borderRadius: 12,
        padding: 32,
        alignItems: "center",
        backgroundColor: colors.gray[50],
    },
    pickerIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    pickerText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    fileInfo: {
        marginTop: 16,
        padding: 16,
        backgroundColor: colors.primary,
        borderRadius: 12,
    },
    fileInfoTitle: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    fileName: {
        color: colors.white,
        fontSize: 16,
        marginBottom: 4,
    },
    fileSize: {
        color: colors.white,
        opacity: 0.8,
        fontSize: 14,
    },
    uploadButton: {
        backgroundColor: colors.primaryDark,
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 20,
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
        opacity: 0.5,
    },
    uploadButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    instructions: {
        marginHorizontal: 24,
        marginTop: 16,
        padding: 16,
        backgroundColor: colors.gray[100],
        borderRadius: 12,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.gray[800],
        marginBottom: 12,
    },
    instructionText: {
        fontSize: 14,
        color: colors.gray[600],
        marginBottom: 8,
    },
    recentSection: {
        padding: 24,
        marginTop: 16,
    },
    placeholder: {
        padding: 32,
        alignItems: "center",
        backgroundColor: colors.gray[50],
        borderRadius: 12,
    },
    placeholderText: {
        color: colors.gray[500],
        fontSize: 16,
    },
});
