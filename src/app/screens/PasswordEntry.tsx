import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ScanFace, ChevronLeft } from "lucide-react";

export function FaceVerification({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) return;
    const timer = setTimeout(
      () => setProgress((prev) => prev + 20),
      500,
    );
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      const done = setTimeout(() => onComplete(), 700);
      return () => clearTimeout(done);
    }
  }, [progress, onComplete]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 rounded-2xl text-center">
        <div className="flex justify-start mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-4">
          <ScanFace className="w-10 h-10 text-blue-700" />
        </div>

        <h1 className="text-xl font-semibold mb-2">
          Face Verification
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          High-risk transfers require identity verification
        </p>

        <div className="w-full h-3 bg-gray-200 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-600">
          {progress < 40 && "Align your face within the frame"}
          {progress >= 40 &&
            progress < 80 &&
            "Performing liveness detection"}
          {progress >= 80 &&
            progress < 100 &&
            "Matching identity"}
          {progress === 100 && "Verification complete"}
        </p>
      </Card>
    </div>
  );
}
c;