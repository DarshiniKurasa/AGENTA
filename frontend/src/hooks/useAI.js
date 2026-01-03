import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useGenerateAIInsights = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sessionId) => {
            const res = await axiosInstance.post("/ai/analyze-session", { sessionId });
            return res.data;
        },
        onSuccess: () => {
            toast.success("AI Insights generated!");
            queryClient.invalidateQueries(["session"]);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to generate AI insights");
        },
    });
};
