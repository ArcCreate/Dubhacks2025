import React, { useState } from "react";

// --- Hardcoded Demo Data ---
const data = {
  summary:
    "Based on recent conversion data and prior experiments, the drop in checkout completion appears linked to button visibility and visual salience. Experiment exp_one_click_checkout_color_2025Q4 showed that the red button improved conversions by 7.2% over the blue baseline. PredictIQ recommends implementing this proven variant globally.",
  topIdeas: [
    {
      id: 1,
      title: "Roll Out Red One-Click Checkout Button to 100% of Users",
      timeToValueDays: 4,
      rationale:
        "The Red Button variant in experiment exp_one_click_checkout_color_2025Q4 demonstrated a statistically significant +7.2% lift in purchases (p = 0.032) over the Blue Button baseline. No negative impact observed on add_to_cart or product_click metrics. Rolling it out to all users will recover lost conversions and streamline the checkout experience.",
      implementationSuggestion:
        "Update the checkout button color to red for all users in One-Click Checkout. Remove experiment gating logic. Archive the experiment after rollout.",
      details: {
        description:
          "Implement the Red Button variant for the One-Click Checkout flow, as determined by the Statsig experiment (exp_one_click_checkout_color_2025Q4). The Red Button demonstrated a statistically significant 7.2% lift in purchases (p = 0.032) over the baseline, outperforming the Blue Button. Secondary metrics (add_to_cart, product_click) showed no significant differences.",
        acceptanceCriteria: [
          "Update the checkout button color to red for all users.",
          "Update components: src/components/CheckoutButton.tsx, src/hooks/useCheckout.ts, src/experiments/oneClickCheckout.statsig.ts (archive gating logic).",
          "Monitor add_to_cart and product_click metrics post-rollout.",
          "Archive the experiment in Statsig after successful rollout.",
        ],
        notes: [
          "Coordinate with analytics to ensure post-rollout monitoring.",
          "Communicate change to relevant stakeholders.",
        ],
        references: [
          "Experiment ID: exp_one_click_checkout_color_2025Q4",
          "Attach Statsig experiment report link.",
        ],
      },
      metrics: {
        reach: {
          value: "100%",
          explanation: "Affects all checkout users globally.",
          color: "text-green-600",
        },
        impact: {
          value: 9,
          explanation: "Directly increases conversion rate by +7.2%.",
          color: "text-green-600",
        },
        confidence: {
          value: "95%",
          explanation:
            "Strong statistical confidence from prior experiment results.",
          color: "text-green-600",
        },
        effort: {
          value: "20 Hours",
          explanation: "UI update plus cleanup of experiment logic.",
          color: "text-green-600",
        },
      },
    },
    {
      id: 2,
      title: "Add Micro-Interaction to Checkout Button (Pulse Animation)",
      timeToValueDays: 10,
      rationale:
        "Visual hesitation may also stem from lack of perceived feedback. Adding a subtle pulse animation could improve engagement, though it needs validation.",
      implementationSuggestion:
        "Prototype using Framer Motion pulse animation in CheckoutButton.tsx. Validate accessibility and measure impact in new A/B test.",
      metrics: {
        reach: {
          value: "100%",
          explanation: "All users exposed if rolled out globally.",
          color: "text-green-600",
        },
        impact: {
          value: 6,
          explanation:
            "Potential moderate improvement if animation enhances attention.",
          color: "text-yellow-600",
        },
        confidence: {
          value: "65%",
          explanation:
            "Unvalidated hypothesis—no historical data on motion impact here.",
          color: "text-yellow-600",
        },
        effort: {
          value: "45 Hours",
          explanation:
            "Requires design sign-off, accessibility validation, and QA.",
          color: "text-red-600",
        },
      },
    },
    {
      id: 3,
      title: "Run A/B Test: Move Checkout Button Above Cart Summary",
      timeToValueDays: 14,
      rationale:
        "A small segment of users may be failing to see the button due to visual noise from the large cart summary below. Moving the button higher could improve 'above the fold' visibility, which requires an A/B test to validate.",
      implementationSuggestion:
        "Refactor CheckoutPageLayout.tsx to render the CheckoutButton component above the CartSummary component for the 'test' variant. Set up a 50/50 A/B test for 2 weeks to measure lift in purchases.",
      metrics: {
        reach: {
          value: "90%",
          explanation: "Affects all users on the checkout page.",
          color: "text-green-600",
        },
        impact: {
          value: 7,
          explanation:
            "High potential for improvement if placement is the key issue.",
          color: "text-green-600",
        },
        confidence: {
          value: "75%",
          explanation:
            "Based on heatmap data showing users scroll past the button.",
          color: "text-yellow-600",
        },
        effort: {
          value: "10 Hours",
          explanation: "Minor component re-ordering and experiment setup.",
          color: "text-green-600",
        },
      },
    },
  ],
  otherIdeas: [
    {
      title: "Add Checkout Tooltip for First-Time Users",
      reasonLower:
        "Low reach; affects <10% of users. Doesn’t address main hesitation issue.",
    },
    {
      title: "Re-run full UI redesign experiment",
      reasonLower:
        "High cost and long turnaround; unnecessary given clear existing signal from button color test.",
    },
  ],
};

// --- UI Components ---
const IdeaCard = ({ idea, index }) => {
  const {
    title,
    rationale,
    timeToValueDays,
    metrics,
    implementationSuggestion,
  } = idea;

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "1rem",
    borderLeft: "4px solid #0052CC",
  };

  return (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: "700",
          color: "#172B4D",
          marginBottom: "0.75rem",
        }}
      >
        Idea #{index + 1}: {title}
      </h2>
      <div
        style={{
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "#0052CC",
          borderBottom: "1px solid #EBECF0",
          paddingBottom: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        Time to Value:{" "}
        <span style={{ fontWeight: "700" }}>{timeToValueDays} Days</span>
      </div>

      {/* RICE Metrics - 4-box layout like Jira ticket */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "700",
            color: "#172B4D",
            marginBottom: "0.75rem",
          }}
        >
          📊 Core RICE Metrics
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          {Object.entries(metrics).map(([key, data]) => {
            const colorMap = {
              "text-green-600": "#1E7A33", // darker, muted green
              "text-yellow-600": "#D4AC0D", // darker, warm yellow
              "text-red-600": "#C2185B", // keep deep rose red
            };

            const borderColor = colorMap[data.color] || "#172B4D"; // keep fallback

            return (
              <div
                key={key}
                style={{
                  backgroundColor: "#F4F5F7",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  borderLeft: `3px solid ${borderColor}`,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#5E6C84",
                    fontWeight: "600",
                    marginBottom: "0.25rem",
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
                <div
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    color: borderColor,
                    marginBottom: "0.25rem",
                  }}
                >
                  {data.value}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#5E6C84",
                    lineHeight: "1.4",
                  }}
                >
                  {data.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rationale - Moved to be second */}
      <div
        style={{
          backgroundColor: "#F4F5F7",
          padding: "1rem",
          borderRadius: "6px",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#172B4D",
            marginBottom: "0.5rem",
          }}
        >
          Short Rationale
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#5E6C84",
            lineHeight: "1.4",
          }}
        >
          {rationale}
        </p>
      </div>

      {/* Implementation Suggestion - Moved to be third */}
      {implementationSuggestion && (
        <div
          style={{
            backgroundColor: "#E3FCEF",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "0",
          }}
        >
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#0B6E4F",
              marginBottom: "0.5rem",
            }}
          >
            💡 Implementation Suggestion
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#0B6E4F",
              lineHeight: "1.4",
            }}
          >
            {implementationSuggestion}
          </p>
        </div>
      )}
    </div>
  );
};

const OtherIdeaSummary = ({ idea }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      padding: "0.75rem 0",
      borderBottom: "1px dashed #EBECF0",
    }}
  >
    <div style={{ fontWeight: "600", color: "#172B4D" }}>{idea.title}</div>
    <div style={{ fontSize: "0.875rem", color: "#5E6C84" }}>
      <span style={{ fontWeight: "600" }}>Reason Lower:</span>{" "}
      {idea.reasonLower}
    </div>
  </div>
);

// --- UPDATED Jira Ticket Component for a nicer look ---
const JiraTicketCard = ({ ideaData }) => {
  const { title, details, metrics } = ideaData;
  const { description, acceptanceCriteria, references } = details;

  // Function to determine the color for the RICE values
  const getColor = (colorClass) => {
    switch (colorClass) {
      case "text-green-600":
        return "#0B6E4F"; // Dark Green
      case "text-yellow-600":
        return "#974F0C"; // Dark Yellow/Orange
      case "text-red-600":
        return "#BF2600"; // Dark Red
      default:
        return "#172B4D";
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "0 0 8px 8px", // Only bottom corners rounded as the top has the banner
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        padding: "1.5rem",
        borderLeft: "4px solid #5B7898", // Muted Blue Status Bar (Less bold than the Jira default blue)
      }}
    >
      {/* Header and Key Info (Adjusted) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          borderBottom: "1px solid #EBECF0",
          paddingBottom: "1rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "800",
            color: "#172B4D", // Fixed to be dark text for visibility
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              backgroundColor: "#EBEFF3", // Light grey/blue background (Less bold)
              padding: "0.25rem 0.5rem",
              borderRadius: "3px",
              fontSize: "0.875rem",
              fontWeight: "600", // Less bold
              color: "#172B4D", // Dark text on light background
            }}
          >
            FEAT-101
          </span>
          {title}
        </h3>
      </div>

      {/* RICE Summary Table */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "#172B4D",
            marginBottom: "0.75rem",
          }}
        >
          📊 RICE Score Analysis
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          {Object.entries(metrics).map(([key, data]) => (
            <div
              key={key}
              style={{
                padding: "0.75rem",
                backgroundColor: "#F4F5F7",
                borderRadius: "4px",
                borderLeft: `3px solid ${getColor(data.color)}`,
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#5E6C84",
                  fontWeight: "600",
                  marginBottom: "0.25rem",
                }}
              >
                {key.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "700",
                  color: getColor(data.color),
                }}
              >
                {data.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#5E6C84",
                  marginTop: "0.25rem",
                }}
              >
                {data.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Description */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "#172B4D",
            marginBottom: "0.5rem",
          }}
        >
          📝 Detailed Description
        </h4>
        <p style={{ fontSize: "0.9rem", color: "#42526E", lineHeight: "1.5" }}>
          {description}
        </p>
      </div>

      {/* Acceptance Criteria (Checklist) */}
      <div
        style={{
          marginBottom: "1.5rem",
          backgroundColor: "#EBEFF3", // Lighter background color
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        <h4
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "#172B4D", // Darker text for less blue emphasis
            marginBottom: "0.5rem",
          }}
        >
          ✅ Acceptance Criteria
        </h4>
        <ul
          style={{
            fontSize: "0.9rem",
            color: "#42526E", // Muted text color
            marginLeft: "1.5rem",
            padding: 0,
            listStyleType: "none",
          }}
        >
          {acceptanceCriteria.map((item, i) => (
            <li key={i} style={{ marginBottom: "0.25rem" }}>
              <span style={{ marginRight: "0.5rem" }}>•</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [ideaText, setIdeaText] = useState(
    "Checkout conversions have dropped slightly this week. Users seem to hesitate before completing purchases. I suspect something about the checkout button or design might be causing friction."
  );

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [experimentMessage, setExperimentMessage] = useState("");
  const [showJiraTicket, setShowJiraTicket] = useState(false);

  const analyzeIdea = () => {
    setAnalysisResult(null);
    setShowJiraTicket(false); // Hide ticket when running new analysis
    setLoading(true);
    setExperimentMessage("");

    // Simulate API delay for demo
    setTimeout(() => {
      setAnalysisResult(data);
      setLoading(false);
    }, 1500);
  };

  const createExperiment = () => {
    setExperimentMessage(
      "🚀 Deploying feature flag and generating Jira ticket..."
    );
    setShowJiraTicket(false);
    // Simulate experiment running for 3 seconds before showing Jira ticket
    setTimeout(() => {
      setExperimentMessage("✅ Jira ticket generated and ready for export!");
      setShowJiraTicket(true);
    }, 3000);
  };

  // Get the data for the first (highest priority) idea to populate the Jira ticket
  const jiraTicketData = analysisResult ? analysisResult.topIdeas[0] : null;

  return (
    <div
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        backgroundColor: "#f4f5f7",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "640px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      {/* Hidden Style Block for Animation */}
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .slide-in-up {
            animation: slideInUp 0.6s ease-out;
          }
        `}
      </style>

      <header style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem", color: "#172B4D" }}>
          PredictIQ Analysis
        </h1>
        <p style={{ color: "#5E6C84", marginTop: "0.25rem" }}>
          Paste a feature idea to see AI-powered RICE analysis
        </p>
      </header>

      <textarea
        value={ideaText}
        onChange={(e) => setIdeaText(e.target.value)}
        placeholder="Paste a feature idea here..."
        style={{
          width: "90%",
          height: "120px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          padding: "0.75rem",
          fontSize: "14px",
          resize: "none",
        }}
      />

      <button
        onClick={analyzeIdea}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#A7B2C6" : "#0052CC",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "0.65rem 1.4rem",
          fontSize: "14px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
        }}
      >
        {loading ? "Analyzing Feature..." : "Analyze Feature/Idea"}
      </button>

      {loading && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            textAlign: "center",
            color: "#172B4D",
            fontWeight: "600",
          }}
        >
          🔍 Analyzing data...
        </div>
      )}

      {analysisResult && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#172B4D",
                marginBottom: "1rem",
                borderBottom: "2px solid #EBECF0",
                paddingBottom: "0.5rem",
              }}
            >
              Analysis Results
            </h2>

            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#172B4D",
                marginBottom: "0.75rem",
              }}
            >
              Top 3 Recommended Ideas:
            </h3>

            {analysisResult.topIdeas.map((idea, index) => (
              <IdeaCard key={idea.id} idea={idea} index={index} />
            ))}

            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#172B4D",
                marginTop: "2rem",
                marginBottom: "0.5rem",
              }}
            >
              Other Ideas Analyzed
            </h3>

            <div
              style={{
                backgroundColor: "#FFF4F4", // light red tint
                borderRadius: "8px",
                padding: "0 1.5rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              }}
            >
              {analysisResult.otherIdeas.map((idea, index) => (
                <OtherIdeaSummary key={index} idea={idea} />
              ))}
            </div>

            <button
              onClick={createExperiment}
              disabled={showJiraTicket}
              style={{
                marginTop: "1.5rem",
                backgroundColor: showJiraTicket ? "#2684FF" : "#357ABD", // Brighter blue when ready
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.75rem 1.5rem",
                fontSize: "14px",
                fontWeight: "600",
                cursor: showJiraTicket ? "default" : "pointer",
                transition: "background-color 0.2s",
                opacity: showJiraTicket ? 0.8 : 1,
              }}
            >
              {showJiraTicket
                ? "Jira Ticket Created (Scroll Down)"
                : "Generate Code & Jira Ticket"}
            </button>

            {experimentMessage && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem 1rem",
                  backgroundColor: showJiraTicket ? "#E3FCEF" : "#DEEBFF",
                  color: showJiraTicket ? "#0B6E4F" : "#0747A6",
                  borderRadius: "6px",
                  fontWeight: "600",
                }}
              >
                {experimentMessage}
              </div>
            )}

            {/* UPDATED VISUAL INDICATOR + RENDER TICKET */}
            {showJiraTicket && jiraTicketData && (
              <div className="slide-in-up" style={{ marginTop: "2rem" }}>
                <div
                  style={{
                    backgroundColor: "#2C3E50", // Dark Charcoal (More subtle than bright Jira blue)
                    color: "#F4F5F7",
                    padding: "0.75rem 1.5rem", // Reduced padding
                    borderRadius: "8px 8px 0 0",
                    fontSize: "1rem", // Reduced font size
                    fontWeight: "600", // Reduced font weight
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Softer shadow
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>
                    TICKET READY | EXPORTABLE ARTIFACT
                  </span>
                </div>
                <JiraTicketCard ideaData={jiraTicketData} />
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "#006644", // Darker, more professional green
                    color: "white",
                    border: "none",
                    borderRadius: "0 0 8px 8px",
                    padding: "1rem 1.5rem",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    borderTop: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onClick={() =>
                    // Use document.execCommand('copy') for better compatibility
                    console.log("Simulating export to Jira/Clipboard...")
                  }
                >
                  <span></span>
                  Export to Jira Board
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
