import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ThemedText } from "./themed-text";

interface ThemedButtonProps extends TouchableOpacityProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ThemedButton = ({
  text,
  disabled,
  isLoading,
  onPress,
  ...rest
}: ThemedButtonProps) => {
  return (
    <TouchableOpacity
      {...rest}
      style={[styles.button, disabled && styles.buttonDisabled, rest.style]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading && <ActivityIndicator size="small" color="white" />}
      {!isLoading && <ThemedText style={styles.buttonText}>{text}</ThemedText>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 44,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
