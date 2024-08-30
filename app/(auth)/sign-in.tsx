import React from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

const LoginScreen = () => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 16,
			}}
		>
			<Card style={{ width: "100%", maxWidth: 350 }}>
				<CardHeader>
					<CardTitle>
						<Text>Login to Nurture</Text>
					</CardTitle>
				</CardHeader>
				<CardContent className="gap-4">
					<Input placeholder="Email" keyboardType="email-address" />
					<Input placeholder="Password" secureTextEntry />
					<Button className="w-full text-primary-foreground">
						<Text>Sign In</Text>
					</Button>
				</CardContent>
				<CardFooter className="flex-col items-stretch gap-2 w-full">
					<Button variant="outline" className="w-full">
						<Text>Sign In with Google</Text>
					</Button>
					<Text className="text-center">
						Don't have an account?{" "}
						<Link href="/sign-up">
							<Text className="text-primary">Sign Up</Text>
						</Link>
					</Text>
				</CardFooter>
			</Card>
		</View>
	);
};

export default LoginScreen;
