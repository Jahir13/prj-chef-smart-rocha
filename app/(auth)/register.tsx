import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChefHat,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
} from "lucide-react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useTheme } from "../../hooks/useTheme";

export default function RegisterScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error state for inline validation
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Input refs for sequential focus
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Clear errors when user starts typing
  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) setNameError("");
    if (generalError) setGeneralError("");
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
    if (generalError) setGeneralError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
    if (generalError) setGeneralError("");
    // Also check confirm password match when password changes
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
    } else if (confirmPasswordError === "Las contraseñas no coinciden") {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) setConfirmPasswordError("");
    if (generalError) setGeneralError("");
    // Real-time password match validation
    if (text && text !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset all errors first
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!name.trim()) {
      setNameError("El nombre es requerido");
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("El correo electrónico es requerido");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Ingresa un correo electrónico válido");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Confirma tu contraseña");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Clear previous errors
    setGeneralError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Crear usuario
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Actualizar el perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      // La redirección se maneja automáticamente en _layout.tsx
    } catch (error: any) {
      let message = "Error al crear la cuenta. Intenta de nuevo.";
      if (error.code === "auth/email-already-in-use") {
        message = "Ya existe una cuenta con este correo";
        setEmailError(message);
      } else if (error.code === "auth/invalid-email") {
        message = "Correo electrónico inválido";
        setEmailError(message);
      } else if (error.code === "auth/weak-password") {
        message = "La contraseña es muy débil. Usa al menos 6 caracteres";
        setPasswordError(message);
      } else {
        setGeneralError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Botón Atrás */}
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.surface }]}
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              disabled={loading}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>

            {/* Logo y título */}
            <View style={styles.header}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.logoContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ChefHat size={40} color="#fff" strokeWidth={1.5} />
              </LinearGradient>
              <Text style={[styles.title, { color: colors.text }]}>
                Crear Cuenta
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Únete a Chef Smart
              </Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              {/* General Error Message */}
              {generalError ? (
                <View
                  style={[
                    styles.generalErrorContainer,
                    { backgroundColor: colors.error + "15" },
                  ]}
                >
                  <Text style={[styles.generalErrorText, { color: colors.error }]}>
                    {generalError}
                  </Text>
                </View>
              ) : null}

              {/* Nombre */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Nombre
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: nameError ? colors.error : colors.border,
                    },
                  ]}
                >
                  <User size={20} color={nameError ? colors.error : colors.textMuted} />
                  <TextInput
                    ref={nameInputRef}
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Tu nombre"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={handleNameChange}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                    textContentType="name"
                    returnKeyType="next"
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                    blurOnSubmit={false}
                    editable={!loading}
                  />
                </View>
                {nameError ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {nameError}
                  </Text>
                ) : null}
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Correo electrónico
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: emailError ? colors.error : colors.border,
                    },
                  ]}
                >
                  <Mail size={20} color={emailError ? colors.error : colors.textMuted} />
                  <TextInput
                    ref={emailInputRef}
                    style={[styles.input, { color: colors.text }]}
                    placeholder="tu@email.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    blurOnSubmit={false}
                    editable={!loading}
                  />
                </View>
                {emailError ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Contraseña
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: passwordError ? colors.error : colors.border,
                    },
                  ]}
                >
                  <Lock size={20} color={passwordError ? colors.error : colors.textMuted} />
                  <TextInput
                    ref={passwordInputRef}
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password-new"
                    textContentType="newPassword"
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                    blurOnSubmit={false}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={colors.textMuted} />
                    ) : (
                      <Eye size={20} color={colors.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Confirmar contraseña
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.surface,
                      borderColor: confirmPasswordError ? colors.error : colors.border,
                    },
                  ]}
                >
                  <Lock size={20} color={confirmPasswordError ? colors.error : colors.textMuted} />
                  <TextInput
                    ref={confirmPasswordInputRef}
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Repite tu contraseña"
                    placeholderTextColor={colors.textMuted}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password-new"
                    textContentType="newPassword"
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={colors.textMuted} />
                    ) : (
                      <Eye size={20} color={colors.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {confirmPasswordError}
                  </Text>
                ) : null}
              </View>

              {/* Botón Registro */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
                style={[loading && styles.buttonDisabled]}
              >
                <LinearGradient
                  colors={
                    loading
                      ? [colors.textMuted, colors.textMuted]
                      : [colors.primary, colors.secondary]
                  }
                  style={styles.registerButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.registerButtonText}>Creando cuenta...</Text>
                    </View>
                  ) : (
                    <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Link a login */}
              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                  ¿Ya tienes cuenta?{" "}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    disabled={loading}
                  >
                    <Text style={[styles.loginLink, { color: colors.primary }]}>
                      Inicia sesión
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    // Subtle shadow for touch affordance
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    // Shadow for premium feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 18,
  },
  generalErrorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  generalErrorText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 4,
    marginTop: 2,
  },
  registerButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: 8,
    // Shadow for CTA prominence
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    minHeight: 44,
    paddingBottom: 16,
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: "600",
  },
});
