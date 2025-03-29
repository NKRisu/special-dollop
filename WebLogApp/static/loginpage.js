import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts"; // For validation
import { createSession } from "./sessionService.js"; // For session management
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
        console.log("Executing query for email:", email);
        const result = await client.queryArray(
            `SELECT username, password_hash, user_token, role FROM zephyr_users WHERE username = $1`,
            [email]
        );
        console.log("Query result:", result);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
}

export async function loginUser(body, req) {
    try {
        console.log("Request body parsed:", body);

        const { username, password } = body;
        console.log("Username:", username, "Password:", password ? "******" : "undefined");

        loginSchema.parse({ username });

        console.log("Fetching user from database...");
        const user = await getUserByEmail(username);
        console.log("User fetched:", user);

        if (!user) {
            console.error("User not found.");
            return new Response("Invalid username or password.", { status: 400 });
        }

        const [storedUsername, storedPasswordHash, userUUID, role] = user;
        console.log("Stored username:", storedUsername, "Role:", role);

        console.log("Comparing passwords...");
        const passwordMatch = await bcrypt.compare(password, storedPasswordHash);
        console.log("Password match:", passwordMatch);

        if (!passwordMatch) {
            console.error("Password mismatch.");
            return new Response("Invalid username or password.", { status: 400 });
        }

        console.log("Creating session...");
        const sessionID = createSession({
            username: storedUsername,
            role: role,
            user_token: userUUID,
        });

        console.log("Login successful. Redirecting...");
        return new Response(null, {
            status: 302,
            headers: {
                location: "/homepage",
                "set-cookie": `session_id=${sessionID}; HttpOnly; Secure; SameSite=Strict; Path=/`,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
            return new Response(
                `Validation Error: ${error.errors.map((e) => e.message).join(", ")}`,
                { status: 400 },
            );
        }
        console.error("Error during login:", error);
        return new Response("Internal Server Error.", { status: 500 });
    }
}