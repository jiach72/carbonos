"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    tenant_id?: string | null;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Decode token payload manually to avoid extra dependencies
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);

            // Map payload claims to User object
            let role = payload.role;
            if (typeof role === 'string') {
                role = role.toLowerCase();
            }

            const userData: User = {
                id: payload.sub, // Assuming 'sub' is user ID
                email: payload.email || "user@scdc.cloud", // Adjust claim keys as needed
                name: payload.name,
                role: role,
                tenant_id: payload.tenant_id
            };

            setUser(userData);
        } catch (e) {
            console.error("Failed to decode token", e);
            localStorage.removeItem("access_token");
        } finally {
            setLoading(false);
        }
    }, []);

    return { user, loading };
}
