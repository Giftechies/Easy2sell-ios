import { useSelector } from "react-redux";
import { useColorScheme } from "react-native-appearance";

/**
 * Define Const color use for whole application
 */
export const BaseColor = {
  grayColor: "#9B9B9B",
  lightColor: "#f8f8f8",
  dividerColor: "#BDBDBD",
  whiteColor: "#FFFFFF",
  fieldColor: "#F5F5F5",
  yellowColor: "#FDC60A",
  lightGray: "#EEEEEE",
  navyBlue: "#3C5A99",
  kashmir: "#5D6D7E",
  orangeColor: "#E5634D",
  blueColor: "#0552A9",
  pinkColor: "#A569BD",
  greenColor: "#58D68D",
};

/**
 * Define Const list theme use for whole application
 */
export const ThemeSupport = [
  {
    theme: "orange",
    light: {
      dark: false,
      colors: {
        white: "#FFFFFF",
        primary: "#E5634D",
        primaryDark: "#C31C0D",
        primaryLight: "#0552A9",
        accent: "#4A90A4",
        background: "white",
        card: "#F5F5F5",
        text: "#212121",
        gray: "#9B9B9B",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        white: "#FFFFFF",
        primary: "#E5634D",
        primaryDark: "#C31C0D",
        primaryLight: "#0552A9",
        accent: "#4A90A4",
        background: "#010101",
        card: "#121212",
        gray: "#9B9B9B",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
  {
    theme: "pink",
    light: {
      dark: false,
      colors: {
        white: "#FFFFFF",
        primary: "#A569BD",
        primaryDark: "#C2185B",
        primaryLight: "#F8BBD0",
        accent: "#8BC34A",
        background: "white",
        card: "#F5F5F5",
        gray: "#9B9B9B",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        white: "#FFFFFF",
        primary: "#A569BD",
        primaryDark: "#C2185B",
        primaryLight: "#F8BBD0",
        accent: "#8BC34A",
        background: "#010101",
        card: "#121212",
        gray: "#9B9B9B",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
  {
    theme: "blue",
    light: {
      dark: false,
      colors: {
        white: "#FFFFFF",
        primary: "#0552A9",
        primaryDark: "#013E85",
        primaryLight: "#0C6CDA",
        accent: "#0552A9",
        background: "white",
        card: "#F5F5F5",
        gray: "#9B9B9B",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        white: "#FFFFFF",
        primary: "#0552A9",
        primaryDark: "#013E85",
        primaryLight: "#0C6CDA",
        accent: "#0552A9",
        background: "#010101",
        card: "#121212",
        gray: "#9B9B9B",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
  {
    theme: "green",
    light: {
      dark: false,
      colors: {
        white: "#FFFFFF",
        primary: "#58D68D",
        primaryDark: "#388E3C",
        primaryLight: "#C8E6C9",
        accent: "#607D8B",
        background: "white",
        card: "#F5F5F5",
        gray: "#9B9B9B",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        white: "#FFFFFF",
        primary: "#58D68D",
        primaryDark: "#388E3C",
        primaryLight: "#C8E6C9",
        accent: "#607D8B",
        background: "#010101",
        card: "#121212",
        gray: "#9B9B9B",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
  {
    theme: "yellow",
    light: {
      dark: false,
      colors: {
        white: "#FFFFFF",
        primary: "#FDC60A",
        primaryDark: "#FFA000",
        primaryLight: "#FFECB3",
        accent: "#795548",
        background: "white",
        card: "#F5F5F5",
        gray: "#9B9B9B",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        white: "#FFFFFF",
        primary: "#FDC60A",
        primaryDark: "#FFA000",
        primaryLight: "#FFECB3",
        accent: "#795548",
        background: "#010101",
        card: "#121212",
        gray: "#9B9B9B",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
];

/**
 * Define default theme use for whole application
 */
export const DefaultTheme = {
  theme: "blue",
  light: {
    dark: false,
    colors: {
      white: "#FFFFFF",
      primary: "#0552A9",
      primaryDark: "#013E85",
      primaryLight: "#0C6CDA",
      accent: "#0552A9",
      background: "white",
      card: "#F5F5F5",
      gray: "#9B9B9B",
      text: "#212121",
      border: "#c7c7cc",
    },
  },
  dark: {
    dark: true,
    colors: {
      white: "#FFFFFF",
      primary: "#0552A9",
      primaryDark: "#013E85",
      primaryLight: "#0C6CDA",
      accent: "#0552A9",
      background: "#010101",
      card: "#121212",
      gray: "#9B9B9B",
      text: "#e5e5e7",
      border: "#272729",
    },
  },
};

/**
 * Define list font use for whole application
 */
export const FontSupport = [ "Poppins","Roboto", "Merriweather"];

/**
 * Define font default use for whole application
 */
export const DefaultFont = "Poppins";

/**
 * export theme and colors for application
 * @returns theme,colors
 */
export const useTheme = () => {
  const isDarkMode = useColorScheme() === "dark";
  const forceDark = useSelector((state) => state.application.force_dark);
  const themeStorage = useSelector((state) => state.application.theme);
  const listTheme = ThemeSupport.filter((item) => item.theme == themeStorage);
  const theme = listTheme.length > 0 ? listTheme[0] : DefaultTheme;

  if (forceDark) {
    return { theme: theme.dark, colors: theme.dark.colors };
  }
  if (forceDark == false) {
    return { theme: theme.light, colors: theme.light.colors };
  }
  return isDarkMode
    ? { theme: theme.dark, colors: theme.dark.colors }
    : { theme: theme.light, colors: theme.light.colors };
};

/**
 * export font for application
 * @returns font
 */
export const useFont = () => {
  const font = useSelector((state) => state.application.font);
  return font ?? DefaultFont;
};
