import { note } from "./note";
import { jotting } from "./jotting";
import { drifter } from "./drifter";
import { comment } from "./comment";
import { notification } from "./notification";

// This serves as the main entry point for all server-side actions
export const server = { note, jotting, drifter, comment, notification };
