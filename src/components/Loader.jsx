"use client";

import { motion } from "framer-motion";

/**
 * Loader component - multi-step progress indicator with animations.
 * Shows which step of the analysis pipeline is currently running.
 */
const STEPS = [
    { label: "Fetching movie details", icon: "🎬" },
    { label: "Retrieving audience reviews", icon: "💬" },
    { label: "Analyzing sentiment with AI", icon: "🤖" },
];

export default function Loader({ currentStep = 0 }) {
    return (
        <motion.div
            className="loader-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="loader-spinner" />

            <div className="loader-steps">
                {STEPS.map((step, i) => {
                    let status = "pending";
                    if (i < currentStep) status = "completed";
                    else if (i === currentStep) status = "active";

                    return (
                        <motion.div
                            key={step.label}
                            className={`loader-step ${status}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                            <div className="loader-step-icon">
                                {status === "completed" ? "✓" : step.icon}
                            </div>
                            <span>{step.label}</span>
                            {status === "active" && (
                                <motion.span
                                    style={{
                                        marginLeft: "auto",
                                        fontSize: "0.75rem",
                                        color: "var(--primary)",
                                    }}
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    Processing...
                                </motion.span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
