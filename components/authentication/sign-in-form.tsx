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

interface SigninFormProps {
	email: string;
	password: string;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	onSubmit?: () => void;
}

export const SigninForm = ({
	email,
	password,
	setEmail,
	setPassword,
	onSubmit,
}: SigninFormProps) => {
	return (
		<Card style={{ width: "100%", maxWidth: 350 }}>
			<CardHeader>
				<CardTitle>Login to Nurture</CardTitle>
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
					<Text>Sign In</Text>
				</Button>
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-2 w-full">
				<Text className="text-center">
					Don't have an account?{" "}
					<Link href="/sign-up">
						<Text className="text-primary">Sign Up</Text>
					</Link>
				</Text>
			</CardFooter>
		</Card>
	);
};
