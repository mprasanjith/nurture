import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { Link } from "expo-router";

interface SignupFormProps {
	email: string;
	password: string;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	onSubmit?: () => void;
}

export const SignupForm = ({
	email,
	password,
	setEmail,
	setPassword,
	onSubmit,
}: SignupFormProps) => {
	return (
		<Card style={{ width: "100%", maxWidth: 350 }}>
			<CardHeader>
				<CardTitle>Create a Nurture Account</CardTitle>
			</CardHeader>
			<CardContent className="gap-4">
				<Input
					placeholder="Email"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
				/>
				<Input
					placeholder="Password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>
				<Button className="w-full text-primary-foreground" onPress={onSubmit}>
					<Text>Sign Up</Text>
				</Button>
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-2 w-full">
				<Button variant="outline" className="w-full">
					<Text>Sign Up with Google</Text>
				</Button>
				<Text className="text-center">
					Already have an account? <Link href="/sign-in">Sign In</Link>
				</Text>
			</CardFooter>
		</Card>
	);
};
