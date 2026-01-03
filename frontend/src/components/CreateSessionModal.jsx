import React from "react";
import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);
  const [activeStarterCodeTab, setActiveStarterCodeTab] = React.useState("javascript");

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM TYPE TABS */}
          <div className="tabs tabs-boxed mb-4">
            <a 
              className={`tab ${!roomConfig.description ? "tab-active" : ""}`}
              onClick={() => setRoomConfig({ ...roomConfig, description: "", starterCode: "", problem: "", difficulty: "" })}
            >
              Standard Problem
            </a>
            <a 
              className={`tab ${roomConfig.description !== undefined && roomConfig.description !== "" ? "tab-active" : ""}`} // Logic is a bit loose here, simplify transition
              onClick={() => setRoomConfig({ ...roomConfig, description: " ", starterCode: "", problem: "", difficulty: "medium" })}
            >
              Custom Problem
            </a>
          </div>

          {/* STANDARD PROBLEM SELECTION */}
          {!roomConfig.description && (
             <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  ...roomConfig,
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                  description: "", // clear custom fields
                  starterCode: ""
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>
          )}

          {/* CUSTOM PROBLEM INPUTS */}
           {roomConfig.description !== "" && (
            <div className="space-y-4">
               {/* TITLE */}
               <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Problem Title</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. FizzBuzz Ultimate" 
                    className="input input-bordered" 
                    value={roomConfig.problem}
                    onChange={(e) => setRoomConfig({...roomConfig, problem: e.target.value})}
                  />
               </div>

                {/* DIFFICULTY */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Difficulty</span>
                  </label>
                  <select 
                    className="select select-bordered"
                     value={roomConfig.difficulty}
                     onChange={(e) => setRoomConfig({...roomConfig, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
               </div>

               {/* DESCRIPTION */}
               <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Description</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-24" 
                    placeholder="Describe the problem..."
                    value={roomConfig.description === " " ? "" : roomConfig.description} // Handle the " " init hack
                    onChange={(e) => setRoomConfig({...roomConfig, description: e.target.value})}
                  ></textarea>
               </div>

                {/* STARTER CODE (Optional) */}
               <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Starter Code (Optional)</span>
                  </label>
                  
                  {/* Starter Code Tabs */}
                  <div role="tablist" className="tabs tabs-bordered mb-2">
                    {["javascript", "python", "java"].map((lang) => (
                      <a 
                        key={lang}
                        role="tab" 
                        className={`tab ${activeStarterCodeTab === lang ? "tab-active" : ""}`}
                        onClick={() => setActiveStarterCodeTab(lang)}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </a>
                    ))}
                  </div>

                  <textarea 
                    className="textarea textarea-bordered font-mono text-sm h-32" 
                    placeholder={`// Write your ${activeStarterCodeTab} solution here...`}
                    value={roomConfig.starterCode?.[activeStarterCodeTab] || ""}
                    onChange={(e) => 
                      setRoomConfig({
                        ...roomConfig, 
                        starterCode: {
                          ...roomConfig.starterCode,
                          [activeStarterCodeTab]: e.target.value
                        }
                      })
                    }
                  ></textarea>
               </div>
            </div>
          )}

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
                 {roomConfig.description !== "" && roomConfig.description && (
                    <p className="text-xs mt-1">Custom Problem Configured</p>
                 )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
