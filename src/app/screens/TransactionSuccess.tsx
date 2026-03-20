import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ChevronLeft, Lock } from "lucide-react";

export function PasswordEntry({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 rounded-2xl">
        <div className="flex justify-start mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-blue-700" />
        </div>

        <h1 className="text-xl font-semibold text-center mb-2">
          Final Security Confirmation
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your password to complete the transaction
        </p>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <Button
          onClick={onComplete}
          disabled={!password}
          className="w-full h-12"
        >
          Confirm Transfer
        </Button>
      </Card>
    </div>
  );
}