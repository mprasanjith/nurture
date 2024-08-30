import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { Link } from "expo-router";

interface PendingVerificationFormProps {
	email: string;
	code: string;
	setCode: (code: string) => void;
	onSubmit?: () => void;
}

export const PendingVerificationForm = ({
	email,
	code,
	setCode,
	onSubmit,
}: PendingVerificationFormProps) => {
	return (
		<Card style={{ width: "100%", maxWidth: 350 }}>
			<CardHeader>
				<CardTitle>Check your email</CardTitle>
				<CardDescription>
					We sent a verification code to {email}. Please enter it
					below to continue.
				</CardDescription>
			</CardHeader>
			<CardContent className="gap-4">
				<Input
					placeholder="Code"
					keyboardType="number-pad"
					value={code}
					onChangeText={setCode}
				/>
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-2 w-full">
				<Button className="w-full text-primary-foreground" onPress={onSubmit}>
					<Text>Verify</Text>
				</Button>
			</CardFooter>
		</Card>
	);
};
