import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import {
  Shield,
  ScanFace,
  Smartphone,
  Eye,
  Phone,
} from "lucide-react";

export function AIAnalysis({
  recipient,
  amount,
  onComplete,
}: {
  recipient: any;
  amount: number;
  onComplete: (riskData: any) => void;
}) {
  const [step, setStep] = useState(0);

  const steps = [
    "Initializing AI security engine",
    "Running sandbox transaction simulation",
    "Checking behavioral fraud signals",
    "Detecting ghost overlay threats",
    "Tracing account and phone activity",
    "Preparing fraud risk decision",
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => setStep(step + 1), 900);
      return () => clearTimeout(timer);
    } else {
      const riskScore =
        recipient?.isFlagged || amount >= 5000
          ? 92
          : amount >= 1000
            ? 65
            : 22;

      onComplete({
        riskScore,
        riskLevel:
          riskScore >= 80
            ? "high"
            : riskScore >= 50
              ? "medium"
              : "low",
        ghostOverlayDetected: true,
        sandboxTriggered: true,
        reportCount: recipient?.reportCount || 47,
        linkedAccounts: 12,
        reasons: [
          "New recipient",
          "Large transfer amount",
          "Unusual transaction speed",
          "Investment scam pattern detected",
        ],
      });
    }
  }, [step, steps.length, onComplete, recipient, amount]);

  const icons = [
    Shield,
    ScanFace,
    Smartphone,
    Eye,
    Phone,
    Shield,
  ];
  const progress = Math.min((step / steps.length) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 rounded-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-700" />
          </div>
          <h1 className="text-xl font-semibold">
            AI Security Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Analyzing transaction risk before proceeding
          </p>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3">
          {steps.map((label, index) => {
            const Icon = icons[index];
            const active = index <= step - 1;
            return (
              <div
                key={label}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  active ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p
                  className={`text-sm ${active ? "font-medium" : "text-gray-500"}`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}