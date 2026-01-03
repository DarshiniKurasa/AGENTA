import { BrainCircuitIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import Markdown from "react-markdown";
import { useGenerateAIInsights } from "../hooks/useAI";

const AIInsightsPanel = ({ session, isHost }) => {
  const { mutate: generateInsights, isPending } = useGenerateAIInsights();

  if (!isHost) return null;

  const handleGenerate = () => {
    generateInsights(session._id);
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-5 text-primary" />
          <h2 className="text-xl font-bold text-base-content">AI Interviewer Guide</h2>
        </div>
        {!session.aiInsights && (
          <button
            onClick={handleGenerate}
            disabled={isPending}
            className="btn btn-sm btn-primary gap-2"
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <BrainCircuitIcon className="size-4" />
            )}
            Generate Insights
          </button>
        )}
      </div>

      {session.aiInsights ? (
        <div className="prose prose-sm max-w-none bg-base-200 rounded-lg p-4">
          <Markdown>{session.aiInsights}</Markdown>
        </div>
      ) : (
        <div className="text-base-content/60 text-sm italic py-4 text-center bg-base-200/50 rounded-lg border border-dashed border-base-300">
          Click "Generate Insights" to get AI-powered tips, potential pitfalls, and interview
          questions for this problem.
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
