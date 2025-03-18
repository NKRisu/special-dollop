import { serve } from "https://deno.land/std@0.199.0/http/server.ts";
import client from './db/db.js'; // Import the database client
import { loginUser } from "./static/loginpage.js";
import { registerUser } from "./static/registerpage.js";
import { getSession, destroySession, getCookieValue } from "./static/sessionService.js"; // For sessions

let connectionInfo = {};

// Serve static files
async function serveStaticFile(path, contentType) {
    try {
        const data = await Deno.readFile(path);
        return new Response(data, {
            headers: { "Content-Type": contentType },
        });
    } catch {
        return new Response("File not found", { status: 404 });
    }
}

// Handle incoming requests
async function handler(req) {
    const url = new URL(req.url);

    // Route: Serve static files
    if (url.pathname.startsWith("/static/")) {
        const filePath = `.${url.pathname}`;
        const contentType = getContentType(filePath);
        return await serveStaticFile(filePath, contentType);
    }

    // Route: Serve db.js
    if (url.pathname === "/db/db.js" && req.method === "GET") {
        return await serveStaticFile('./db/db.js', 'application/javascript');
    }
    // GET
    // Route: Index page
    if (url.pathname === "/" && req.method === "GET") {
        const response = await serveStaticFile('./views/index.html', 'text/html');
        response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://deno.land; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    }

    // Route: Login page
    if (url.pathname === "/login" && req.method === "GET") {
        const response = await serveStaticFile('./views/login.html', 'text/html');
        response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://deno.land; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    }

    // Route: Register page
    if (url.pathname === "/register" && req.method === "GET") {
        const response = await serveStaticFile('./views/register.html', 'text/html');
        response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://deno.land; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    }

    // Route: Weekly page
    if (url.pathname === "/weekly" && req.method === "GET") {
        const response = await serveStaticFile('./views/weekly.html', 'text/html');
        response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://deno.land; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    }

    // Route: Monthly page
    if (url.pathname === "/monthly" && req.method === "GET") {
        const response = await serveStaticFile('./views/monthly.html', 'text/html');
        response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://deno.land; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    }

    // POST
    // Route: Registration
    if (url.pathname === "/register" && req.method === "POST") {
        const formData = await req.formData();
        return await registerUser(formData);
    }

    // Route: Login
    if (url.pathname === "/login" && req.method === "POST") {
        const formData = await req.formData();
        return await loginUser(formData, connectionInfo);
    }

    // Route: Sign out
    if (url.pathname === "/signout" && req.method === "GET") {
        // Destroy session
        const cookies = req.headers.get("Cookie") || "";
        const sessionId = getCookieValue(cookies, "session_id");

        if (sessionId) {
            destroySession(sessionId); // Remove the session from the store
        }

        // Clear the session cookie and redirect to the index page
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
                "Set-Cookie": "session_id=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
            },
        });
    }
    

    // Route: Save weekly data
    if (url.pathname === "/save-weekly-data" && req.method === "POST") {
        const body = await req.json();
        const result = await saveWeeklyData(body);
        if (result) {
            return new Response("Weekly data saved successfully", { status: 200 });
        } else {
            return new Response("Failed to save weekly data", { status: 500 });
        }
    }
    
    return new Response("Not Found", { status: 404 });
}
    
// Function to save weekly data to the database
async function saveWeeklyData(data) {
    try {
        const userToken = data.user_token; // Assuming user_token is included in the data from session service
        const weekNumber = parseInt(data.week_number);
        const year = parseInt(data.year);

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        for (const day of daysOfWeek) {
            const date = data[`date${day}`];
            const timeStarted = data[`timeStarted${day}`];
            const timeEnded = data[`timeEnded${day}`];
            const lunchBreak = data[`lunchBreak${day}`] === 'Yes';
            const summary = data[`summary${day}`];
            const projectCode = data[`projectCode${day}`];
            const hoursWorked = parseFloat(data[`hoursWorked${day}`]);

            await client.queryArray(`
                INSERT INTO zephyr_weekly_logs (user_token, week_number, year, day, date, time_started, time_ended, lunch_break, summary, project_code, hours_worked)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `, [userToken, weekNumber, year, day, date, timeStarted, timeEnded, lunchBreak, summary, projectCode, hoursWorked]);
        }
        return true;
    } catch (error) {
        console.error('Error saving weekly data:', error);
        return false;
    }
}

// Utility: Get content type for static files
function getContentType(filePath) {
    const ext = filePath.split(".").pop();
    const mimeTypes = {
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        mjs: "application/javascript",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        json: "application/json",
    };
    return mimeTypes[ext] || "application/octet-stream";
}

// Start the server
serve(handler, { port: 8000 });
//serve(handler, { port: 80, hostname: "0.0.0.0" });

// Run: deno run --allow-net --allow-env --allow-read --watch app.js
