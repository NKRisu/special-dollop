

import client from '../db/db.js';
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { z } from "https://deno.land/x/zod/mod.ts";

const registerSchema = z.object({
    username: z.string().email({ message: "Invalid email address." }).max(50, { message: "Email address is too long." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
    role: z.enum(["admin", "user"], { message: "Invalid role." }),
});

async function isUniqueUsername(email) {
    const result = await client.queryArray(`SELECT username FROM zephyr_users WHERE username = $1`, [email]);
    return result.rows.length === 0;
}

export async function registerUser(c) {
    const username = c.username;
    const password = c.password;
    const role = c.role;

    try {
        registerSchema.parse({ username, password, role });

        if (!(await isUniqueUsername(username))) {
            return new Response("Username already exists.", { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await client.queryArray(
            `INSERT INTO zephyr_users (username, password_hash, role) VALUES ($1, $2, $3)`,
            [username, hashedPassword, role],
        );
        return new Response(null, { status: 302, headers: { location: "/", }, });
    
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(`Validation Error: ${error.errors.map(e => e.message).join(", ")}`, { status: 400 });
        }
        console.error(error);
        return new Response("Error during registration.", { status: 500 });
    }
}

export async function getAccountInfo(username) {
    try {
        const result = await client.queryObject(`SELECT username, role FROM zephyr_users WHERE username = $1`, [username]);

        if (result.rows.length === 0) {
            return new Response("User not found.", { status: 404 });
        }

        return new Response(JSON.stringify(result.rows[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error fetching user info", error);
        return new Response("Error fetching user info", { status: 500 });
    }
}