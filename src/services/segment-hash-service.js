export async function sha256(input) {
    const text = typeof input === "string" ? input : JSON.stringify(input);
    const bytes = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export async function hashMessageRange(messages) {
    const payload = (messages || []).map((message) => ({
        is_user: !!message.is_user,
        is_system: !!message.is_system,
        name: message.name || "",
        mes: message.mes || "",
    }));

    return sha256(payload);
}
