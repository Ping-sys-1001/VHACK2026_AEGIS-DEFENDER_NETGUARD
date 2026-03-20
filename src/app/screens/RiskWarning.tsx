import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  AlertTriangle,
  Eye,
  Phone,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function RiskWarning({
  recipient,
  amount,
  riskData,
  onCancel,
  onProceed,
}: {
  recipient: any;
  amount: number;
  riskData: any;
  onCancel: () => void;
  onProceed: () => void;
}) {
  const [timer, setTimer] = useState(30);
  const [verificationAnswer, setVerificationAnswer] =
    useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(
      () => setTimer((prev) => prev - 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [timer]);

  const canProceed = timer === 0 && verificationAnswer !== "";

  return (
    <div className="min-h-screen bg-red-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Card className="p-5 border-red-300 bg-white rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-700">
                High Risk Warning
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                This transaction shows strong scam indicators
                and requires review before continuing.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <p className="font-semibold mb-3">
            Transaction Details
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Recipient</span>
              <span>{recipient?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span>{recipient?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span>
                RM{" "}
                {Number(amount).toLocaleString("en-MY", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Risk Score</span>
              <span className="text-red-600 font-semibold">
                {riskData?.riskScore}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <p className="font-semibold mb-3">
            Detected Risk Signals
          </p>
          <div className="space-y-3">
            {riskData?.reasons?.map((reason: string) => (
              <div
                key={reason}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-sm">{reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <p className="font-semibold">AI Driven Sandbox</p>
          </div>
          <p className="text-sm text-gray-600">
            The transaction was simulated in a secure sandbox
            and matched known scam-related behavioral patterns.
          </p>
        </Card>

        <Card className="p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-orange-600" />
            <p className="font-semibold">
              Ghost Overlay Detection
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Suspicious overlay behavior was detected. Another
            app may be attempting to capture or manipulate your
            input.
          </p>
        </Card>

        <Card className="p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="w-5 h-5 text-red-600" />
            <p className="font-semibold">Auto Report & Trace</p>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Phone number tracing shows {riskData?.reportCount}{" "}
            fraud reports and
            {riskData?.linkedAccounts} linked accounts.
          </p>
          <p className="text-sm text-gray-600">
            This number has been flagged for suspicious
            financial activity.
          </p>
        </Card>

        <Card className="p-4 rounded-2xl">
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            <span className="font-semibold">
              Scam Pattern Explanation
            </span>
            {showDetails ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {showDetails && (
            <div className="mt-3 text-sm text-gray-600 space-y-2">
              <p>
                This transaction resembles an investment scam
                pattern involving urgency, newly added contacts,
                and unusually large transfer requests.
              </p>
              <p>
                Users are often pressured to transfer money
                quickly without verifying the recipient through
                a trusted channel.
              </p>
            </div>
          )}
        </Card>

        <Card className="p-4 rounded-2xl">
          <p className="font-semibold mb-2">
            Cooling-Off Timer
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Demo mode uses 30 seconds. Production can use 12
            hours.
          </p>
          <div className="text-2xl font-bold text-red-600">
            {timer}s
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <p className="font-semibold mb-2">
            Verification Question
          </p>
          <p className="text-sm text-gray-600 mb-3">
            How do you know this recipient?
          </p>
          <select
            value={verificationAnswer}
            onChange={(e) =>
              setVerificationAnswer(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          >
            <option value="">Select an answer</option>
            <option value="friend">Friend or family</option>
            <option value="business">Business payment</option>
            <option value="online">Met online only</option>
            <option value="unknown">I am not sure</option>
          </select>
        </Card>

        <div className="grid grid-cols-2 gap-3 pb-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-12"
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            disabled={!canProceed}
            className="h-12"
          >
            {canProceed ? "Proceed" : "Proceed Locked"}
          </Button>
        </div>
      </div>
    </div>
  );
}