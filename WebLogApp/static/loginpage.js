import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts"; // For validation
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"; // For password comparison
import client from '../db/db.js'; // Import the database client


const loginSchema = z.object({
    username: z.string().email({ message: "Invalid email address." }),
    // Additional fields can be added here
});

async function logLogin(userUUID, ipAddress) {
    try {
        await client.queryArray(
            `INSERT INTO login_logs (user_token, ip_address) VALUES ($1, $2)`,
            [userUUID, ipAddress],
        );
    } catch (error) {
        console.error("Error logging login: ", error);
    }
}

async function getUserByEmail(email) {
    try {
        const result = await client.queryArray(`SELECT username, password_hash, user_token, role FROM zephyr_users WHERE username = $1`,[email]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
}

export async function loginUser(req, info) {
    try {
        const body = await req.body().value;
        const { username, password } = body;

        loginSchema.parse({ username });

        const user = await getUserByEmail(username);
        if (!user) {
            return new Response("Invalid username or password.", { status: 400 });
        }

        const [storedUsername, storedPasswordHash, userUUID, role] = user;

        const passwordMatch = await bcrypt.compare(password, storedPasswordHash);
        if (!passwordMatch) {
            return new Response("Invalid username or password.", { status: 400 });
        }

        const ipAddress = info.remoteAddr.hostname;
        await logLogin(userUUID, ipAddress);

        return new Response(null, {
            status: 302,
            headers: {
                location: "/",
                "set-cookie": `user_token=${userUUID}; HttpOnly; Secure; SameSite=Strict; Path=/`,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                `Validation Error: ${error.errors.map((e) => e.message).join(", ")}`,
                { status: 400 },
            );
        }
        console.error("Error during login:", error);
        return new Response("Internal Server Error.", { status: 500 });
    }
}