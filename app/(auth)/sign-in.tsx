import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SigninForm } from "~/components/authentication/sign-in-form";

const LoginScreen = () => {
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const onSignInPress = React.useCallback(async () => {
		if (!isLoaded) {
			return;
		}

		try {
			const signInAttempt = await signIn.create({
				identifier: email,
				password,
			});

			if (signInAttempt.status === "complete") {
				await setActive({ session: signInAttempt.createdSessionId });
				router.replace("/app");
			} else {
				// See https://clerk.com/docs/custom-flows/error-handling
				// for more info on error handling
				console.error(JSON.stringify(signInAttempt, null, 2));
			}
		} catch (err) {
			console.error(JSON.stringify(err, null, 2));
		}
	}, [isLoaded, email, password, signIn, setActive, router]);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 16,
			}}
		>
			<SigninForm
				email={email}
				password={password}
				setEmail={setEmail}
				setPassword={setPassword}
				onSubmit={onSignInPress}
			/>
		</View>
	);
};

export default LoginScreen;
