import React, { useState } from "react";
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Input,
    InputField,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorText,
    Card,
    Spinner,
} from "@gluestack-ui/themed";
import { Link as ExpoLink } from "expo-router";
import { Platform, ScrollView, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Palette } from "@/constants/theme";
import { API_CONFIG } from "@/constants/api";

export default function RegisterScreen() {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = t("validation.nameRequired");
        if (!email.trim()) newErrors.email = t("validation.emailRequired");
        if (!password.trim()) newErrors.password = t("validation.passwordRequired");
        if (password.length < 6) newErrors.password = t("validation.passwordMinLength");
        if (password !== confirmPassword) newErrors.confirmPassword = t("validation.passwordsNotMatch");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        setMessage(null);
        setIsError(false);

        if (!validate()) return;

        setIsLoading(true);
        const payload = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        };

        try {
            const res = await fetch(API_CONFIG.auth.register, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || JSON.stringify(json.errors || json));
            }

            setMessage(t("auth.registerSuccess"));
            setIsError(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setMessage(err.message || t("auth.registerFailed"));
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: Palette.backgroundLight }}>
            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingTop: 48,
                    paddingBottom: 24,
                }}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: Palette.backgroundLight }}>
                {/* Header */}
                <Box style={{ alignItems: "center", marginBottom: 40 }}>
                    <Heading
                        size="3xl"
                        style={{
                            color: Palette.primary,
                            fontWeight: "800",
                            textAlign: "center",
                            marginBottom: 8,
                            letterSpacing: -0.5,
                        }}>
                        {t("common.appNameNepali")}
                    </Heading>
                    <Text
                        size="lg"
                        style={{
                            color: "#6B7280",
                            fontWeight: "500",
                            textAlign: "center",
                        }}>
                        {t("auth.communityPlatform")}
                    </Text>
                </Box>

                {/* Form Card */}
                <Card
                    style={{
                        maxWidth: 440,
                        width: "100%",
                        alignSelf: "center",
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 32,
                        marginBottom: 0,
                    }}>
                    <VStack space="xl">
                        <Box>
                            <Heading size="2xl" style={{ color: "#1F2937", fontWeight: "700", marginBottom: 4 }}>
                                {t("auth.createAccount")}
                            </Heading>
                            <Text size="sm" style={{ color: "#6B7280" }}>
                                {t("auth.joinPlatform")}
                            </Text>
                        </Box>

                        {/* Name Field */}
                        <FormControl isInvalid={!!errors.name} isRequired>
                            <FormControlLabel>
                                <FormControlLabelText style={{ fontWeight: "600", color: "#374151" }}>
                                    {t("auth.fullName")}
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input
                                variant="outline"
                                size="lg"
                                style={{ borderColor: Palette.primary, borderWidth: 1.5 }}>
                                <InputField
                                    placeholder={t("auth.fullNamePlaceholder")}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    style={{ fontSize: 16 }}
                                />
                            </Input>
                            {errors.name && (
                                <FormControlError>
                                    <FormControlErrorText>{errors.name}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* Email Field */}
                        <FormControl isInvalid={!!errors.email} isRequired>
                            <FormControlLabel>
                                <FormControlLabelText style={{ fontWeight: "600", color: "#374151" }}>
                                    {t("auth.email")}
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input
                                variant="outline"
                                size="lg"
                                style={{ borderColor: Palette.primary, borderWidth: 1.5 }}>
                                <InputField
                                    placeholder={t("auth.emailPlaceholder")}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={{ fontSize: 16 }}
                                />
                            </Input>
                            {errors.email && (
                                <FormControlError>
                                    <FormControlErrorText>{errors.email}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* Password Field */}
                        <FormControl isInvalid={!!errors.password} isRequired>
                            <FormControlLabel>
                                <FormControlLabelText style={{ fontWeight: "600", color: "#374151" }}>
                                    {t("auth.password")}
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input
                                variant="outline"
                                size="lg"
                                style={{ borderColor: Palette.primary, borderWidth: 1.5 }}>
                                <InputField
                                    placeholder={t("auth.passwordPlaceholder")}
                                    value={password}
                                    onChangeText={setPassword}
                                    type="password"
                                    autoCapitalize="none"
                                    style={{ fontSize: 16 }}
                                />
                            </Input>
                            {errors.password && (
                                <FormControlError>
                                    <FormControlErrorText>{errors.password}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* Confirm Password Field */}
                        <FormControl isInvalid={!!errors.confirmPassword} isRequired>
                            <FormControlLabel>
                                <FormControlLabelText style={{ fontWeight: "600", color: "#374151" }}>
                                    {t("auth.confirmPassword")}
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input
                                variant="outline"
                                size="lg"
                                style={{ borderColor: Palette.primary, borderWidth: 1.5 }}>
                                <InputField
                                    placeholder={t("auth.confirmPasswordPlaceholder")}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    type="password"
                                    autoCapitalize="none"
                                    style={{ fontSize: 16 }}
                                />
                            </Input>
                            {errors.confirmPassword && (
                                <FormControlError>
                                    <FormControlErrorText>{errors.confirmPassword}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* Message Display */}
                        {message && (
                            <Box
                                style={{
                                    padding: 12,
                                    borderRadius: 12,
                                    backgroundColor: isError ? "#FEE2E2" : "#D1FAE5",
                                    borderWidth: 1,
                                    borderColor: isError ? "#FCA5A5" : "#6EE7B7",
                                }}>
                                <Text
                                    style={{
                                        color: isError ? "#991B1B" : "#065F46",
                                        fontWeight: "500",
                                    }}>
                                    {message}
                                </Text>
                            </Box>
                        )}

                        {/* Register Button */}
                        <Button
                            size="lg"
                            onPress={handleRegister}
                            isDisabled={isLoading}
                            style={{
                                backgroundColor: Palette.primary,
                                borderRadius: 12,
                                height: 56,
                                shadowColor: Palette.primary,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 4,
                            }}>
                            {isLoading ? (
                                <Spinner color="white" />
                            ) : (
                                <ButtonText style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}>
                                    {t("auth.createAccount")}
                                </ButtonText>
                            )}
                        </Button>

                        {/* Login Link */}
                        <HStack space="xs" style={{ justifyContent: "center", marginTop: 8 }}>
                            <Text size="md" style={{ color: "#6B7280" }}>
                                {t("auth.hasAccount")}
                            </Text>
                            <TouchableOpacity>
                                <ExpoLink href="/login">
                                    <Text size="md" style={{ color: Palette.accentStrong, fontWeight: "700" }}>
                                        {t("auth.signIn")}
                                    </Text>
                                </ExpoLink>
                            </TouchableOpacity>
                        </HStack>
                    </VStack>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
