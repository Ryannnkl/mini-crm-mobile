import { StyleSheet, TextInput, TextInputProps } from "react-native";

export const ThemedInput = ({
  style,
  placeholder,
  value,
  onChangeText,
  ...rest
}: TextInputProps) => {
  return (
    <TextInput
      {...rest}
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
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
    marginBottom: 16,
    fontSize: 16,
    color: "#fff",
  },
});
