import * as SecureStore from "expo-secure-store";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/hooks/useColorScheme";
import "~/global.css";

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

const tokenCache = {
	async getToken(key: string) {
		try {
			const item = await SecureStore.getItemAsync(key);
			if (item) {
				console.log(`${key} was used 🔐 \n`);
			} else {
				console.log(`No values stored under key: ${key}`);
			}
			return item;
		} catch (error) {
			console.error("SecureStore get item error: ", error);
			await SecureStore.deleteItemAsync(key);
			return null;
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value);
		} catch (err) {
			return;
		}
	},
};

if (!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
	throw new Error(
		"Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
	);
}
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem("theme");
			if (Platform.OS === "web") {
				// Adds the background color to the html element to prevent white background on overscroll.
				document.documentElement.classList.add("bg-background");
			}
			if (!theme) {
				AsyncStorage.setItem("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);

				setIsColorSchemeLoaded(true);
				return;
			}
			setIsColorSchemeLoaded(true);
		})().finally(() => {
			SplashScreen.hideAsync();
		});
	}, []);

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
			<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
				<ClerkLoaded>
					<Slot />
				</ClerkLoaded>
			</ClerkProvider>
		</ThemeProvider>
	);
}

// Catch any errors in the router and display a fallback screen.
export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();
