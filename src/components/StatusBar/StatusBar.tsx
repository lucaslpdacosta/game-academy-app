import React from "react";
import { StatusBar as RNStatusBar, StatusBarProps } from "react-native";

interface CustomStatusBarProps extends StatusBarProps {
  backgroundColor?: string;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({
  backgroundColor = "#4747D1",
  barStyle = "light-content",
  translucent = true,
  ...props
}) => {
  return (
    <RNStatusBar
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      translucent={translucent}
      {...props}
    />
  );
};

export default CustomStatusBar;
