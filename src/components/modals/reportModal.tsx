import { useState } from "react";
import { X } from "lucide-react";
import { message } from "antd";
import { reportAdvisor } from "@/services/user/userService";

interface IReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    advisorId: string | null;
    userId: string;
    setReport: (report: IReportData) => void;
    slotId: string
}

export interface IReportData {
    userId: string;
    advisorId: string;
    reason: "Spam" | "Inappropriate Content" | "Harassment" | "Other";
    status: "pending" | "reviewed" | "resolved";
    customReason?: string;
    createdAt?: string;
}

const REPORT_REASONS = ["Spam", "Inappropriate Content", "Harassment", "Other"];

const ReportModal: React.FC<IReportModalProps> = ({ isOpen, onClose, advisorId, userId, setReport, slotId }) => {
    const [reason, setReason] = useState<string>("");
    const [customReason, setCustomReason] = useState<string>("");

    const handleSubmitReport = async () => {
        if (!advisorId) {
            message.error("Invalid advisor ID.");
            return;
        }
        if (!reason) {
            message.error("Please select a reason.");
            return;
        }

        if (reason === "Other" && !customReason.trim()) {
            message.error("Please enter a custom reason.");
            return;
        }

        try {
            const reportData: IReportData = {
                userId,
                advisorId,
                reason: reason as "Spam" | "Inappropriate Content" | "Harassment" | "Other",
                status: "pending",
                customReason: reason === "Other" ? customReason : undefined,
            };
            const response = await reportAdvisor(slotId,reportData);
            setReport(response.report);
            message.success(response.message);
            setReason("");
            setCustomReason("");
            onClose();
        } catch (err) {
            console.error(err);
            message.error("Error submitting report.");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50 p-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md transition-transform transform scale-100 hover:scale-105 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Report Advisor</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition">
                        <X size={22} />
                    </button>
                </div>

                {/* Dropdown for selecting a reason */}
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Select a reason:</label>
                <select
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                >
                    <option value="">-- Select Reason --</option>
                    {REPORT_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                            {reason}
                        </option>
                    ))}
                </select>

                {/* Custom reason text area (only visible if "Other" is selected) */}
                {reason === "Other" && (
                    <div className="mt-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Custom reason:</label>
                        <textarea
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent transition duration-200"
                            placeholder="Enter your reason..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                )}

                <div className="mt-5 flex justify-end">
                    <button
                        onClick={handleSubmitReport}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;