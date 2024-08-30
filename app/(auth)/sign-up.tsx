import React from "react";
import { View } from "react-native";
import { Link, useRouter } from "expo-router";
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
import { useSignUp } from "@clerk/clerk-expo";
import { SignupForm } from "~/components/authentication/sign-up-form";
import Toast from "react-native-root-toast";
import { PendingVerificationForm } from "~/components/authentication/pending-veification-form";

const SignupScreen = () => {
	const { isLoaded, signUp, setActive } = useSignUp();

	const [emailAddress, setEmailAddress] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [pendingVerification, setPendingVerification] = React.useState(false);
	const [code, setCode] = React.useState("");

	const router = useRouter();
	const onSignUpPress = async () => {
		if (!emailAddress || !password) {
			Toast.show("Please fill in all fields.", {
				duration: Toast.durations.LONG,
			});
			return;
		}

		if (!isLoaded) {
			return;
		}

		try {
			await signUp.create({
				emailAddress,
				password,
			});

			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

			setPendingVerification(true);
		} catch (err) {
			console.log("Signup failed", JSON.stringify(err, null, 2));
			Toast.show("Something went wrong, please try again.", {
				duration: Toast.durations.LONG,
			});
		}
	};

	const onPressVerify = async () => {
		if (!isLoaded) {
			return;
		}

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			});

			if (completeSignUp.status === "complete") {
				await setActive({ session: completeSignUp.createdSessionId });
				router.replace("/app");
			} else {
				console.error(JSON.stringify(completeSignUp, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 16,
			}}
		>
			{pendingVerification ? (
				<PendingVerificationForm
					email={emailAddress}
					code={code}
					setCode={setCode}
					onSubmit={onPressVerify}
				/>
			) : (
				<SignupForm
					email={emailAddress}
					password={password}
					setEmail={setEmailAddress}
					setPassword={setPassword}
					onSubmit={onSignUpPress}
				/>
			)}
		</View>
	);
};

export default SignupScreen;
