const api = async (code) => {
    try {
        const response = await fetch("https://saarthi-ai-assistant-backend-4.onrender.com/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Google auth failed:", error);
    }
};

export default api;