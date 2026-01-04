import React, { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Textarea,
  TextareaInput,
  Card,
  Spinner,
  HStack,
} from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity, Alert } from "react-native";
import { Palette } from "@/constants/theme";
import * as DocumentPicker from "expo-document-picker";
import { API_CONFIG } from "@/constants/api";

export default function AdminUpload() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [status, setStatus] = useState("draft");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.size && file.size > 10 * 1024 * 1024) {
          Alert.alert("File too large", "Please select a file smaller than 10MB");
          return;
        }
        setSelectedFile(file);
        setMessage("File selected successfully!");
        setIsError(false);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const submit = async () => {
    if (!title.trim()) {
      setMessage("Title is required");
      setIsError(true);
      return;
    }

    setIsLoading(true);

    try {
      if (selectedFile) {
        // Upload with file using multipart/form-data
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("tags", tags);
        formData.append("description", description || "");
        formData.append("status", status);

        // @ts-ignore
        formData.append("file", {
          uri: selectedFile.uri,
          type: selectedFile.mimeType || "application/pdf",
          name: selectedFile.name,
        });

        const res = await fetch(API_CONFIG.admin.upload, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || JSON.stringify(json));

        setMessage("Notice created with file upload successfully!");
        setIsError(false);
      } else {
        // Upload without file using JSON
        const payload = {
          title: title.trim(),
          tags: tags
            ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
            : [],
          description: description || undefined,
          status,
        };

        const res = await fetch(API_CONFIG.admin.notices, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || JSON.stringify(json));

        setMessage("Notice created successfully!");
        setIsError(false);
      }

      // Reset form
      setTitle("");
      setTags("");
      setDescription("");
      setSelectedFile(null);
      setStatus("draft");
    } catch (err: any) {
      setMessage(`Error: ${err.message || err}`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setMessage("File removed");
    setIsError(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Palette.backgroundLight }}
      contentContainerStyle={{ padding: 24, paddingTop: 48, paddingBottom: 24 }}>
      {/* Admin Header */}
      <Box style={{ marginBottom: 24 }}>
        <Heading
          size="3xl"
          style={{
            color: "#1F2937",
            fontWeight: "800",
            marginBottom: 8,
          }}>
          Admin Portal
        </Heading>
        <Text
          size="md"
          style={{
            color: "#6B7280",
            fontWeight: "500",
          }}>
          Create and publish community notices with OCR processing
        </Text>
      </Box>

      <Card
        style={{
          maxWidth: 700,
          width: "100%",
          alignSelf: "center",
          backgroundColor: "white",
          borderRadius: 20,
          padding: 32,
          borderWidth: 2,
          borderColor: Palette.primary,
        }}>
        <VStack space="xl">
          {/* Title Field */}
          <FormControl isRequired>
            <FormControlLabel>
              <FormControlLabelText style={{ fontWeight: "700", color: "#1F2937", fontSize: 16 }}>
                Notice Title
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              variant="outline"
              size="lg"
              style={{
                borderColor: Palette.primary,
                borderWidth: 2,
                backgroundColor: "#FAFAFA",
              }}>
              <InputField
                placeholder="Enter notice title..."
                value={title}
                onChangeText={setTitle}
                style={{ fontSize: 16, fontWeight: "500" }}
              />
            </Input>
          </FormControl>

          {/* Tags Field */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText style={{ fontWeight: "700", color: "#1F2937", fontSize: 16 }}>
                Tags
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              variant="outline"
              size="lg"
              style={{
                borderColor: Palette.primary,
                borderWidth: 2,
                backgroundColor: "#FAFAFA",
              }}>
              <InputField
                placeholder="education, health, community, event"
                value={tags}
                onChangeText={setTags}
                style={{ fontSize: 16 }}
              />
            </Input>
            <Text size="xs" style={{ color: "#9CA3AF", marginTop: 6, fontStyle: "italic" }}>
              Separate multiple tags with commas
            </Text>
          </FormControl>

          {/* Description Field */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText style={{ fontWeight: "700", color: "#1F2937", fontSize: 16 }}>
                Description
              </FormControlLabelText>
            </FormControlLabel>
            <Textarea
              size="lg"
              style={{
                borderColor: Palette.primary,
                borderWidth: 2,
                minHeight: 140,
                backgroundColor: "#FAFAFA",
              }}>
              <TextareaInput
                placeholder="Enter detailed description of the notice..."
                value={description}
                onChangeText={setDescription}
                style={{ fontSize: 16 }}
              />
            </Textarea>
          </FormControl>

          {/* File Upload Section */}
          <Box style={{ marginTop: 8 }}>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText
                  style={{ fontWeight: "700", color: "#1F2937", fontSize: 16, marginBottom: 12 }}>
                  Upload Document
                </FormControlLabelText>
              </FormControlLabel>

              {selectedFile ? (
                <Box
                  style={{
                    backgroundColor: Palette.accent,
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: Palette.accentStrong,
                  }}>
                  <HStack style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Box style={{ flex: 1, marginRight: 12 }}>
                      <Text
                        style={{
                          fontWeight: "700",
                          color: "#1F2937",
                          fontSize: 15,
                          marginBottom: 4,
                        }}
                        numberOfLines={1}>
                        {selectedFile.name}
                      </Text>
                      <Text style={{ color: "#6B7280", fontSize: 13 }}>
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </Text>
                    </Box>
                    <TouchableOpacity
                      onPress={removeFile}
                      style={{
                        backgroundColor: "#EF4444",
                        padding: 10,
                        borderRadius: 8,
                      }}>
                      <Text style={{ color: "white", fontWeight: "700", fontSize: 14 }}>Remove</Text>
                    </TouchableOpacity>
                  </HStack>
                </Box>
              ) : (
                <TouchableOpacity
                  onPress={pickDocument}
                  style={{
                    borderWidth: 3,
                    borderColor: Palette.primary,
                    borderStyle: "dashed",
                    borderRadius: 12,
                    padding: 32,
                    alignItems: "center",
                    backgroundColor: "#FAFAFA",
                  }}>
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>📁</Text>
                  <Text style={{ fontWeight: "700", color: "#1F2937", fontSize: 16, marginBottom: 4 }}>
                    Choose File
                  </Text>
                  <Text style={{ color: "#6B7280", fontSize: 14, textAlign: "center" }}>
                    PDF or Image (Max 10MB)
                  </Text>
                </TouchableOpacity>
              )}

              <Text size="xs" style={{ color: "#9CA3AF", marginTop: 8, fontStyle: "italic" }}>
                Files will be automatically processed with OCR
              </Text>
            </FormControl>
          </Box>

          {/* Status Field */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText
                style={{ fontWeight: "700", color: "#1F2937", fontSize: 16, marginBottom: 12 }}>
                Publication Status
              </FormControlLabelText>
            </FormControlLabel>
            <HStack space="md">
              {["draft", "published", "archived"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setStatus(option)}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 3,
                    borderColor: status === option ? Palette.accentStrong : "#E5E7EB",
                    backgroundColor: status === option ? Palette.accent : "white",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      textTransform: "capitalize",
                      fontWeight: status === option ? "800" : "600",
                      color: status === option ? "#1F2937" : "#6B7280",
                      fontSize: 15,
                    }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </HStack>
          </FormControl>

          {/* Message Display */}
          {message && (
            <Box
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: isError ? "#FEE2E2" : "#D1FAE5",
                borderWidth: 2,
                borderColor: isError ? "#EF4444" : "#10B981",
              }}>
              <Text style={{ color: isError ? "#991B1B" : "#065F46", fontWeight: "700", fontSize: 15 }}>
                {message}
              </Text>
            </Box>
          )}

          {/* Submit Button */}
          <Button
            size="lg"
            onPress={submit}
            isDisabled={isLoading}
            style={{
              backgroundColor: Palette.primary,
              borderRadius: 12,
              height: 60,
              borderWidth: 3,
              borderColor: "#93C572",
            }}>
            {isLoading ? (
              <HStack space="sm" style={{ alignItems: "center" }}>
                <Spinner color="#1F2937" />
                <ButtonText style={{ fontSize: 18, fontWeight: "800", color: "#1F2937" }}>
                  Processing...
                </ButtonText>
              </HStack>
            ) : (
              <ButtonText style={{ fontSize: 18, fontWeight: "800", color: "#1F2937" }}>
                {selectedFile ? "Upload & Create Notice" : "Create Notice"}
              </ButtonText>
            )}
          </Button>
        </VStack>
      </Card>
    </ScrollView>
  );
}
