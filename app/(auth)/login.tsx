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
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChefHat, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useTheme } from "../../hooks/useTheme";

export default function LoginScreen() {
  const { colors } = useTheme();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error state for inline validation
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Input refs for sequential focus
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Clear errors when user starts typing
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
    if (generalError) setGeneralError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
    if (generalError) setGeneralError("");
  };

  const validateForm = (): boolean => {
    let isValid = true;

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
    }

    return isValid;
  };

  const handleLogin = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // La redirección se maneja automáticamente en _layout.tsx
    } catch (error: any) {
      let message = "Error al iniciar sesión. Intenta de nuevo.";
      if (error.code === "auth/user-not-found") {
        message = "No existe una cuenta con este correo";
        setEmailError(message);
      } else if (error.code === "auth/wrong-password") {
        message = "Contraseña incorrecta";
        setPasswordError(message);
      } else if (error.code === "auth/invalid-email") {
        message = "Correo electrónico inválido";
        setEmailError(message);
      } else if (error.code === "auth/too-many-requests") {
        message = "Demasiados intentos. Intenta más tarde";
        setGeneralError(message);
      } else if (error.code === "auth/invalid-credential") {
        message = "Credenciales inválidas. Verifica tus datos";
        setGeneralError(message);
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
            {/* Logo y título */}
            <View style={styles.header}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.logoContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ChefHat size={48} color="#fff" strokeWidth={1.5} />
              </LinearGradient>
              <Text style={[styles.title, { color: colors.text }]}>
                Chef Smart
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Inicia sesión para continuar
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
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
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

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                disabled={loading}
              >
                <Text
                  style={[styles.forgotPasswordText, { color: colors.primary }]}
                >
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              {/* Botón Login */}
              <TouchableOpacity
                onPress={handleLogin}
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
                  style={styles.loginButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.loginButtonText}>Ingresando...</Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Link a registro */}
              <View style={styles.registerContainer}>
                <Text
                  style={[styles.registerText, { color: colors.textSecondary }]}
                >
                  ¿No tienes cuenta?{" "}
                </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    disabled={loading}
                  >
                    <Text
                      style={[styles.registerLink, { color: colors.primary }]}
                    >
                      Regístrate
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
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Shadow for premium feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 20,
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    minHeight: 44,
    justifyContent: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
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
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    minHeight: 44,
  },
  registerText: {
    fontSize: 15,
  },
  registerLink: {
    fontSize: 15,
    fontWeight: "600",
  },
});
