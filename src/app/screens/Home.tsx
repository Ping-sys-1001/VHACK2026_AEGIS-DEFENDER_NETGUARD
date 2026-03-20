import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Send, Shield, Wallet, Clock } from "lucide-react";

export function Home({
  goToSelect,
}: {
  goToSelect: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-b from-blue-900 to-blue-700 text-white">
        <div className="max-w-md mx-auto px-4 pt-8 pb-6">
          <p className="text-sm opacity-80 mb-2">
            Available Balance
          </p>
          <h1 className="text-4xl font-bold mb-4">
            RM 12,450.00
          </h1>

          <Card className="bg-white/10 border-white/20 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-300" />
              </div>
              <div>
                <p className="font-medium">
                  Scam Shield Active
                </p>
                <p className="text-sm opacity-80">
                  AI-driven fraud monitoring enabled
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={goToSelect}
            className="h-20 flex flex-col gap-2 rounded-2xl"
          >
            <Send className="w-5 h-5" />
            <span>Send Money</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2 rounded-2xl"
          >
            <Wallet className="w-5 h-5" />
            <span>Request</span>
          </Button>
        </div>

        <Card className="p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold">
              Recent Transactions
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Aisyah Rahman</p>
                <p className="text-sm text-gray-500">
                  Today, 9:20 AM
                </p>
              </div>
              <p className="font-medium text-red-600">
                - RM 45.00
              </p>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Top Up</p>
                <p className="text-sm text-gray-500">
                  Yesterday, 8:05 PM
                </p>
              </div>
              <p className="font-medium text-green-600">
                + RM 100.00
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daniel Tan</p>
                <p className="text-sm text-gray-500">
                  Yesterday, 11:40 AM
                </p>
              </div>
              <p className="font-medium text-red-600">
                - RM 80.00
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}