import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ChevronLeft } from "lucide-react";

const AVAILABLE_BALANCE = 12450;

export function EnterAmount({
  recipient,
  onBack,
  onContinue,
}: {
  recipient: any;
  onBack: () => void;
  onContinue: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");

  if (!recipient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-6 text-center max-w-sm w-full">
          <p className="text-lg font-medium mb-2">
            No recipient selected
          </p>
          <Button onClick={onBack} className="w-full">
            Back
          </Button>
        </Card>
      </div>
    );
  }

  const handleNumberClick = (num: string) => {
    setAmount((prev) => {
      if (prev.length >= 8) return prev;
      if (prev === "0") return num;
      return `${prev}${num}`;
    });
  };

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const numericAmount = Number(amount || "0");
  const hasInsufficientBalance =
    numericAmount > AVAILABLE_BALANCE;

  const handleContinue = () => {
    if (!numericAmount || hasInsufficientBalance) return;
    onContinue(numericAmount);
  };

  const formattedAmount = numericAmount.toLocaleString(
    "en-MY",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                Send Money
              </h1>
              <p className="text-sm text-gray-500">
                Enter amount
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col p-4">
        <Card className="p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Sending to
          </p>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                recipient.isNew
                  ? "bg-orange-100"
                  : "bg-blue-100"
              }`}
            >
              <span
                className={
                  recipient.isNew
                    ? "text-orange-700"
                    : "text-blue-700"
                }
              >
                {recipient.avatar}
              </span>
            </div>
            <div>
              <p className="font-medium">{recipient.name}</p>
              <p className="text-sm text-gray-500">
                {recipient.phone}
              </p>
            </div>
          </div>
        </Card>

        <div className="flex-1 flex items-start justify-center pt-8">
          <div className="text-center w-full">
            <p className="text-gray-500 mb-4">Amount</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl text-gray-400 font-medium">
                RM
              </span>
              <div className="text-6xl font-light tabular-nums">
                {formattedAmount}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Available balance: RM{" "}
              {AVAILABLE_BALANCE.toLocaleString("en-MY", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            {hasInsufficientBalance && (
              <p className="text-sm text-red-600 mt-2">
                Entered amount exceeds your available balance.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
            (num) => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleNumberClick(num)}
                className="h-16 text-2xl bg-white hover:bg-gray-50"
              >
                {num}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            onClick={() => handleNumberClick("00")}
            className="h-16 text-2xl bg-white hover:bg-gray-50"
          >
            00
          </Button>

          <Button
            variant="outline"
            onClick={() => handleNumberClick("0")}
            className="h-16 text-2xl bg-white hover:bg-gray-50"
          >
            0
          </Button>

          <Button
            variant="outline"
            onClick={handleBackspace}
            className="h-16 text-xl bg-white hover:bg-gray-50"
          >
            ⌫
          </Button>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!numericAmount || hasInsufficientBalance}
          className="w-full h-12"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}