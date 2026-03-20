import { createBrowserRouter } from "react-router-dom";
import { Home } from "./screens/Home";
import { SelectRecipient } from "./screens/SelectRecipient";
import { EnterAmount } from "./screens/EnterAmount";
import { AIAnalysis } from "./screens/AIAnalysis";
import { RiskWarning } from "./screens/RiskWarning";
import { FaceVerification } from "./screens/FaceVerification";
import { PasswordEntry } from "./screens/PasswordEntry";
import { TransactionSuccess } from "./screens/TransactionSuccess";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/select-recipient", Component: SelectRecipient },
  { path: "/enter-amount", Component: EnterAmount },
  { path: "/ai-analysis", Component: AIAnalysis },
  { path: "/risk-warning", Component: RiskWarning },
  { path: "/face-verification", Component: FaceVerification },
  { path: "/password", Component: PasswordEntry },
  { path: "/success", Component: TransactionSuccess },
]);