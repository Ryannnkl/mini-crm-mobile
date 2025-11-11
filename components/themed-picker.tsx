import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker, PickerProps } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

interface ThemedPickerProps extends PickerProps {
  items: { label: string; value : string }[];
  lightColor?: string;
  darkColor?: string;
}

export const ThemedPicker = ({
  items,
  lightColor,
  darkColor,
  ...rest
}: ThemedPickerProps) => {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Picker
      style={[styles.selectContainer, { color }]}
      {...rest}
      dropdownIconColor={color}
      selectionColor={color}
      dropdownIconRippleColor={color}
    >
      {items.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  );
};

const styles = StyleSheet.create({
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  selectText: {
    flex: 1,
  },
  selectIcon: {
    marginLeft: 8,
  },
  selectItem: {
    fontSize: 16,
    fontWeight: "600",
  },
});
