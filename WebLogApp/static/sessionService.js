import { getCookie, setCookie, deleteCookie } from "https://deno.land/x/hono@v4.3.11/helper.ts";

const sessionStore = new Map(); // just for dev, replace with a database in production if ever gets there

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

export function createSession(user) {
    const sessionID = crypto.randomUUID();
    const sessionData = {
        username: user.username,
        role: user.role,
        createdAt: Date.now(),
    };
    sessionStore.set(sessionID, sessionData);

    return sessionID;
}

export function getSession(req) {
    const cookies = req.headers.get("Cookie") || "";
    const sessionID = getCookieValue(cookies, "session_id");

    if (!sessionID) return null;

    const sessionData = sessionStore.get(sessionID);
    if (sessionData && Date.now() - sessionData.createdAt < SESSION_EXPIRATION_TIME) {
        return sessionData;
    }

    sessionStore.delete(sessionID);
    return null;
}

export function getCookieValue(cookies, name) {
    const cookieArr = cookies.split(";").map(cookie => cookie.trim());
    for (const cookie of cookieArr) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null;
}

export function destroySession(sessionID) {
    if (!sessionID) {
        sessionStore.delete(sessionID);
    }
}
