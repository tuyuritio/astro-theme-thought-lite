const context: {
	locale: string;
	oauth: any[];
	turnstile?: string;
	push?: string;
	email: boolean;
	limitComment: number;
	limitEmail: number;
	drifter?: {
		id: string;
		provider: string;
		name: unknown;
		description: string | null;
		image: string | null;
		homepage: string | null;
		email: string | null;
		emailState: "pending" | "verified" | "bounced" | "suspended" | null;
		notify: boolean | null;
	};
	subscription?: number;
} = $state({
	locale: "",
	oauth: [],
	email: false,
	limitComment: 0,
	limitEmail: 0
});

export default context;

export function countdownComment() {
	context.limitComment = 5;
	const end = Date.now() + 1000 * context.limitComment;
	const interval = setInterval(() => (context.limitComment = (end - Date.now()) / 1000) <= 0 && clearInterval(interval), 100);
}

export function countdownEmail() {
	context.limitEmail = 60;
	const end = Date.now() + 1000 * context.limitEmail;
	const interval = setInterval(() => (context.limitEmail = (end - Date.now()) / 1000) <= 0 && clearInterval(interval), 100);
}
