import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface ThemedInputProps extends TextInputProps {
  lightColor?: string;
  darkColor?: string;
  showPasswordToggle?: boolean;
}

export const ThemedInput = ({
  style,
  placeholder,
  value,
  lightColor,
  darkColor,
  onChangeText,
  ...rest
}: ThemedInputProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = rest.secureTextEntry;

  return (
    <View style={styles.inputContainer}>
      <TextInput
        {...rest}
        style={[
          styles.input,
          style,
          { color },
          { paddingRight: isPasswordField ? 40 : 16 },
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={color}
        secureTextEntry={isPasswordField && !showPassword}
      />
      {isPasswordField && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color={color}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    position: "relative",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 0,
    height: "100%",
    justifyContent: "center",
  },
});
