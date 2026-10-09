import { useState } from "react";
import { apiRequest } from "../services/api";

type Status = "idle" | "loading" | "success" | "error";

const useManualFetch = <T>() => {
    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [err, setErr] = useState<string | null>(null);

    const execute = async (
        endpoint: string,
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        body?: FormData | object | null
    ): Promise<T> => {
        setStatus("loading");
        setErr(null);

        try {
            const result = await apiRequest<T>({
                endpoint,
                method,
                body,
            });

            setData(result);
            setStatus("success");

            return result;
        } catch (err) {
            const errMessage =
                err instanceof Error
                    ? err.message
                    : "Something went wrong";

            setErr(errMessage);
            setStatus("error");

            throw err;
        }
    };

    const executeBlob = async (
        endpoint: string,
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        body?: FormData | object | null
    ): Promise<Blob> => {
        setStatus("loading");
        setErr(null);

        try {
            const result = await apiRequest<Blob>({
                endpoint,
                method,
                body,
                responseType: "blob",
            });

            setStatus("success");

            return result;
        } catch (err) {
            const errMessage =
                err instanceof Error
                    ? err.message
                    : "Something went wrong";

            setErr(errMessage);
            setStatus("error");

            throw err;
        }
    };

    return {
        execute,
        executeBlob,
        data,
        status,
        err,
    };
};

export default useManualFetch;