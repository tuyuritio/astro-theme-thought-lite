import { drifter } from "./drifter";
import { comment } from "./comment";
import { push } from "./push";
import { email } from "./email";

// This serves as the main entry point for all server-side actions
export const server = { drifter, comment, push, email };
