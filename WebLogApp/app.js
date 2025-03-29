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

    // Route: Homepage page
    if (url.pathname === "/homepage" && req.method === "GET") {
        const response = await serveStaticFile('./views/homepage.html', 'text/html');
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

   // Route: Registration confirmation page
    if (url.pathname === "/registration-confirmation.html" && req.method === "GET") {
        const response = await serveStaticFile("./views/registration-confirmation.html", "text/html");
        response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://deno.land; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    }

    // Route: Weekly Confirmation Page
    if (url.pathname === "/confirmation-weekly" && req.method === "GET") {
        const response = await serveStaticFile('./views/weekly-confirmation.html', 'text/html');
        response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://deno.land; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    }

    // Route: Monthly Confirmation Page
    if (url.pathname === "/confirmation-monthly" && req.method === "GET") {
        const response = await serveStaticFile('./views/monthly-confirmation.html', 'text/html');
        response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://deno.land; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    }

    // Route: Weekly page
    if (url.pathname === "/weekly" && req.method === "GET") {
        const session = getSession(req); // Retrieve the session
    
        if (!session || !session.user_token) {
            // Redirect to login if session or user_token is missing
            return new Response(null, {
                status: 302,
                headers: { location: "/login" },
            });
        }
    
        // Read the weekly.html file
        let html = await Deno.readTextFile('./views/weekly.html');
    
        // Inject the user_token into the HTML
        html = html.replace(
            '<input type="hidden" id="user_token" name="user_token" value="">',
            `<input type="hidden" id="user_token" name="user_token" value="${session.user_token}">`
        );
    
        const response = new Response(html, {
            headers: { "Content-Type": "text/html" },
        });
    
        // Add security headers
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
        const formData = await req.formData(); // Parse the form data
        return await registerUser(formData); // Pass the formData to registerUser
    }

    // Route: Login
    if (url.pathname === "/login" && req.method === "POST") {
        const formData = await req.formData(); // Parse the form data
        const body = {}; // Convert formData to a plain object
        for (const [key, value] of formData.entries()) {
            body[key] = value;
        }
        return await loginUser(body, req); // Pass the plain object to loginUser
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
    
    // Route: Save monthly data
if (url.pathname === "/save-monthly-data" && req.method === "POST") {
    const body = await req.json();
    console.log("Data received from client:", body); // Log the received data

    const result = await saveMonthlyData(body);
    if (result) {
        return new Response("Monthly data saved successfully", { status: 200 });
    } else {
        return new Response("Failed to save monthly data", { status: 500 });
    }
}

// Function to save monthly data to the database
async function saveMonthlyData(data) {
    try {
        const userToken = data.user_token; // Assuming user_token is included in the data from session service
        const month = parseInt(data.month);
        const year = parseInt(data.year);
        const totalHours = parseFloat(data.totalHours);

        // Validate required fields
        if (!userToken || isNaN(month) || isNaN(year) || isNaN(totalHours)) {
            console.error("Invalid data received for monthly log:", data);
            return false;
        }

        console.log("Inserting monthly data:", {
            userToken,
            month,
            year,
            totalHours,
        });

        await client.queryArray(`
            INSERT INTO zephyr_monthly_logs (user_token, month, year, total_hours)
            VALUES ($1, $2, $3, $4)
        `, [userToken, month, year, totalHours]);

        return true;
    } catch (error) {
        console.error("Error saving monthly data:", error);
        return false;
    }
}

    // Route: Save weekly data
    if (url.pathname === "/save-weekly-data" && req.method === "POST") {
        const body = await req.json();
        console.log("Data received from client:", body); // Log the received data

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
            const date = data[`date${day}${weekNumber}`];
            let timeStarted = data[`timeStarted${day}${weekNumber}`];
            let timeEnded = data[`timeEnded${day}${weekNumber}`];
            const lunchBreak = data[`lunchBreak${day}${weekNumber}`] === 'on';
            const summary = data[`summary${day}${weekNumber}`];
            const projectCode = data[`projectCode${day}${weekNumber}`];
            const hoursWorked = parseFloat(data[`hoursWorked${day}${weekNumber}`]);

            // Validate the date field
            if (!date) {
                console.error(`Skipping ${day}: Missing date.`);
                continue; // Skip this day if the date is missing
            }

            // Handle empty time fields
            timeStarted = timeStarted ? `${timeStarted}:00` : null; // Append seconds if missing
            timeEnded = timeEnded ? `${timeEnded}:00` : null;

            console.log(`Inserting data for ${day}:`, {
                userToken,
                weekNumber,
                year,
                day,
                date,
                timeStarted,
                timeEnded,
                lunchBreak,
                summary,
                projectCode,
                hoursWorked,
            });

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
