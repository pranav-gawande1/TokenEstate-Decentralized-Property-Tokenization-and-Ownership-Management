const BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

type HTTPMethods =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

type ResponseType = "json" | "blob";

interface APIRequestOptions<TBody = unknown> {
    endpoint: string;
    method?: HTTPMethods;
    body?: FormData | TBody | null;
    headers?: Record<string, string>;
    responseType?: ResponseType;
}

export const apiRequest = async <TResponse, TBody = unknown>({
    endpoint,
    method = "GET",
    body = null,
    headers = {},
    responseType = "json",
}: APIRequestOptions<TBody>): Promise<TResponse> => {
    try {
        const options: RequestInit = {
            method,
            credentials: "include",
            headers: {
                ...headers,
            },
        };

        if (body instanceof FormData) {
            options.body = body;
        } else if (body !== null && body !== undefined) {
            (options.headers as Record<string, string>)["Content-Type"] =
                "application/json";

            options.body = JSON.stringify(body);
        }

        const res = await fetch(`${BASE_URL}${endpoint}`, options);

        // Handle API errors
        if (!res.ok) {
            let errorMessage = "API Error";

            try {
                const errorData = await res.json();

                errorMessage =
                    errorData?.detail ||
                    errorData?.message ||
                    errorMessage;
            } catch {
                // Response was not JSON
            }

            throw new Error(errorMessage);
        }

        // Handle Blob responses
        if (responseType === "blob") {
            return (await res.blob()) as TResponse;
        }

        // Handle normal JSON responses
        const data = await res.json();

        return data as TResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Unknown error occurred");
    }
};