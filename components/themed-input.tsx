import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface ThemedInputProps extends TextInputProps {
  lightColor?: string;
  darkColor?: string;
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
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TextInput
      {...rest}
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={color}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
