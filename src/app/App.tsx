import React, { useEffect, useMemo, useState } from "react";

type Recipient = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  isNew?: boolean;
  isFlagged?: boolean;
  reportCount?: number;
};

type RiskData = {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  ghostOverlayDetected: boolean;
  sandboxTriggered: boolean;
  reportCount: number;
  linkedAccounts: number;
  semakMulePrepared: boolean;
};

type Transaction = {
  id: string;
  name: string;
  phone: string;
  amount: number;
  type: "send" | "topup";
  time: string;
};

const INITIAL_BALANCE = 12450;

const mockRecipients: Recipient[] = [
  {
    id: "1",
    name: "Aisyah Rahman",
    phone: "+60 12-345 6789",
    avatar: "AR",
    isNew: false,
    isFlagged: false,
    reportCount: 0,
  },
  {
    id: "2",
    name: "Daniel Tan",
    phone: "+60 11-987 6543",
    avatar: "DT",
    isNew: false,
    isFlagged: false,
    reportCount: 0,
  },
  {
    id: "3",
    name: "Investment Advisor Pro",
    phone: "+60 17-888 1122",
    avatar: "IA",
    isNew: true,
    isFlagged: true,
    reportCount: 47,
  },
];

const initialTransactions: Transaction[] = [
  {
    id: "seed-1",
    name: "Aisyah Rahman",
    phone: "+60 12-345 6789",
    amount: 45,
    type: "send",
    time: "Today, 9:20 AM",
  },
  {
    id: "seed-2",
    name: "Top Up",
    phone: "-",
    amount: 100,
    type: "topup",
    time: "Yesterday, 8:05 PM",
  },
  {
    id: "seed-3",
    name: "Daniel Tan",
    phone: "+60 11-987 6543",
    amount: 80,
    type: "send",
    time: "Yesterday, 11:40 AM",
  },
];

function formatRM(value: number) {
  return `RM ${value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function buildAvatar(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");
}

function getCurrentTimeLabel() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-MY", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `Today, ${time}`;
}

export default function App() {
  const [screen, setScreen] = useState<
    | "home"
    | "select"
    | "amount"
    | "analysis"
    | "warning"
    | "decision"
    | "face"
    | "password"
    | "success"
    | "topup"
    | "topup-success"
  >("home");

  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<
    Transaction[]
  >(initialTransactions);
  const [recipients, setRecipients] =
    useState<Recipient[]>(mockRecipients);

  const [userType, setUserType] = useState("Gig Worker");
  const [protectedAmount, setProtectedAmount] = useState(4500);
  const [blockedTransfersCount, setBlockedTransfersCount] =
    useState(2);

  const [selectedRecipient, setSelectedRecipient] =
    useState<Recipient | null>(null);
  const [amount, setAmount] = useState(0);
  const [riskData, setRiskData] = useState<RiskData | null>(
    null,
  );
  const [transactionId, setTransactionId] = useState("");

  const resetFlow = () => {
    setScreen("home");
    setSelectedRecipient(null);
    setAmount(0);
    setRiskData(null);
    setTransactionId("");
  };

  const cancelRiskyTransfer = () => {
    if ((riskData?.riskScore || 0) >= 50 && amount > 0) {
      setProtectedAmount((prev) => prev + amount);
      setBlockedTransfersCount((prev) => prev + 1);
    }
    resetFlow();
  };

  const completeTransfer = () => {
    if (!selectedRecipient || amount <= 0) return;

    const id = `TXN${Date.now().toString().slice(-8)}`;
    setTransactionId(id);

    setBalance((prev) => prev - amount);

    const newTransaction: Transaction = {
      id,
      name: selectedRecipient.name,
      phone: selectedRecipient.phone,
      amount,
      type: "send",
      time: getCurrentTimeLabel(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setScreen("success");
  };

  const completeTopUp = () => {
    if (amount <= 0) return;

    const id = `TOP${Date.now().toString().slice(-8)}`;
    setTransactionId(id);

    setBalance((prev) => prev + amount);

    const newTransaction: Transaction = {
      id,
      name: "Top Up",
      phone: "-",
      amount,
      type: "topup",
      time: getCurrentTimeLabel(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setScreen("topup-success");
  };

  if (screen === "home") {
    return (
      <HomeScreen
        balance={balance}
        transactions={transactions}
        userType={userType}
        setUserType={setUserType}
        protectedAmount={protectedAmount}
        blockedTransfersCount={blockedTransfersCount}
        onSend={() => setScreen("select")}
        onTopUp={() => setScreen("topup")}
      />
    );
  }

  if (screen === "select") {
    return (
      <SelectRecipientScreen
        recipients={recipients}
        setRecipients={setRecipients}
        onBack={() => setScreen("home")}
        onContinue={(recipient) => {
          setSelectedRecipient(recipient);
          setScreen("amount");
        }}
      />
    );
  }

  if (screen === "amount") {
    return (
      <EnterAmountScreen
        recipient={selectedRecipient}
        balance={balance}
        onBack={() => setScreen("select")}
        onContinue={(enteredAmount) => {
          setAmount(enteredAmount);
          setScreen("analysis");
        }}
      />
    );
  }

  if (screen === "topup") {
    return (
      <TopUpScreen
        onBack={resetFlow}
        onContinue={(enteredAmount) => {
          setAmount(enteredAmount);
          completeTopUp();
        }}
      />
    );
  }

  if (screen === "topup-success") {
    return (
      <TopUpSuccessScreen
        amount={amount}
        transactionId={transactionId}
        newBalance={balance}
        onDone={resetFlow}
      />
    );
  }

  if (screen === "analysis") {
    return (
      <AIAnalysisScreen
        recipient={selectedRecipient}
        amount={amount}
        onComplete={(data) => {
          setRiskData(data);
          setScreen("warning");
        }}
      />
    );
  }

  if (screen === "warning") {
    return (
      <RiskWarningScreen
        recipient={selectedRecipient}
        amount={amount}
        riskData={riskData}
        userType={userType}
        onCancel={cancelRiskyTransfer}
        onProceed={() => setScreen("decision")}
      />
    );
  }

  if (screen === "decision") {
    return (
      <VerificationDecisionScreen
        onBack={() => setScreen("warning")}
        onYes={() => setScreen("face")}
        onNo={resetFlow}
      />
    );
  }

  if (screen === "face") {
    return (
      <FaceVerificationScreen
        onBack={() => setScreen("decision")}
        onComplete={() => setScreen("password")}
      />
    );
  }

  if (screen === "password") {
    return (
      <PasswordScreen
        onBack={() => setScreen("face")}
        onComplete={completeTransfer}
      />
    );
  }

  return (
    <SuccessScreen
      recipient={selectedRecipient}
      amount={amount}
      transactionId={transactionId}
      onDone={resetFlow}
    />
  );
}

function HomeScreen({
  balance,
  transactions,
  userType,
  setUserType,
  protectedAmount,
  blockedTransfersCount,
  onSend,
  onTopUp,
}: {
  balance: number;
  transactions: Transaction[];
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<string>>;
  protectedAmount: number;
  blockedTransfersCount: number;
  onSend: () => void;
  onTopUp: () => void;
}) {
  return (
    <Page>
      <div style={heroStyle}>
        <div style={containerStyle}>
          <div style={{ fontSize: 14, opacity: 0.9 }}>
            Available Balance
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              marginTop: 8,
            }}
          >
            {formatRM(balance)}
          </div>

          <div style={glassCardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Scam Shield Active
            </div>
            <div style={{ fontSize: 14, opacity: 0.95 }}>
              AI-driven fraud monitoring, recipient screening,
              SemakMule integration preparation, ghost overlay
              detection, and auto-report tracing are enabled.
            </div>
          </div>
        </div>
      </div>

      <div style={containerStyle}>
        <SectionCard title="Economic Protection (SDG 8)">
          <div style={{ ...smallTextStyle, marginBottom: 10 }}>
            Protecting livelihoods, wages, and business cash
            flow through safer digital payments.
          </div>

          <div style={fieldLabelStyle}>User Type</div>
          <select
            style={inputStyle}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option>Gig Worker</option>
            <option>Small Business Owner</option>
            <option>Salaried Worker</option>
            <option>Student</option>
            <option>Rural Merchant</option>
          </select>

          <SimpleRow
            left="Potential Loss Prevented"
            right={formatRM(protectedAmount)}
          />
          <SimpleRow
            left="Blocked Risky Transfers"
            right={`${blockedTransfersCount}`}
          />
        </SectionCard>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <button
            style={primaryButtonLargeStyle}
            onClick={onSend}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Send Money
            </div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              Start transfer
            </div>
          </button>

          <button
            style={primaryButtonLargeStyle}
            onClick={onTopUp}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              Top Up
            </div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              Add funds
            </div>
          </button>
        </div>

        <SectionCard title="Recent Transactions">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{tx.name}</div>
                <div style={smallTextStyle}>{tx.time}</div>
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color:
                    tx.type === "topup" ? "#16a34a" : "#dc2626",
                }}
              >
                {tx.type === "topup" ? "+ " : "- "}
                {formatRM(tx.amount)}
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </Page>
  );
}

function SelectRecipientScreen({
  recipients,
  setRecipients,
  onBack,
  onContinue,
}: {
  recipients: Recipient[];
  setRecipients: React.Dispatch<
    React.SetStateAction<Recipient[]>
  >;
  onBack: () => void;
  onContinue: (recipient: Recipient) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Recipient | null>(
    null,
  );
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return recipients.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.includes(search),
    );
  }, [search, recipients]);

  const useNewRecipient = () => {
    const trimmedName = newName.trim();
    const trimmedPhone = newPhone.trim();

    if (!trimmedName || !trimmedPhone) {
      setError(
        "Please enter both recipient name and phone number.",
      );
      return;
    }

    const newRecipient: Recipient = {
      id: `custom-${Date.now()}`,
      name: trimmedName,
      phone: trimmedPhone,
      avatar: buildAvatar(trimmedName),
      isNew: true,
      isFlagged: false,
      reportCount: 0,
    };

    setRecipients((prev) => [newRecipient, ...prev]);
    setSelected(newRecipient);
    setShowAdd(false);
    setError("");
    setNewName("");
    setNewPhone("");
    setSearch("");
  };

  return (
    <Page>
      <Header
        title="Send Money"
        subtitle="Select recipient"
        onBack={onBack}
      />

      <div style={containerStyle}>
        <input
          style={inputStyle}
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          style={outlineButtonStyle}
          onClick={() => {
            setShowAdd(!showAdd);
            setError("");
          }}
        >
          + Add new recipient
        </button>

        {showAdd && (
          <div style={cardStyle}>
            <div style={fieldLabelStyle}>
              Recipient full name
            </div>
            <input
              style={inputStyle}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter full name"
            />

            <div style={fieldLabelStyle}>Phone number</div>
            <input
              style={inputStyle}
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+60 12-345 6789"
            />

            {error ? (
              <div style={errorTextStyle}>{error}</div>
            ) : null}

            <button
              style={primaryButtonStyle}
              onClick={useNewRecipient}
            >
              Add this recipient
            </button>
          </div>
        )}

        <SectionCard title="Contacts">
          {filtered.map((recipient) => {
            const active = selected?.id === recipient.id;

            return (
              <button
                key={recipient.id}
                style={{
                  ...recipientRowStyle,
                  borderLeft: recipient.isFlagged
                    ? "4px solid #dc2626"
                    : "4px solid transparent",
                  background: active ? "#eff6ff" : "#fff",
                }}
                onClick={() => setSelected(recipient)}
              >
                <div
                  style={{
                    ...avatarStyle,
                    background: recipient.isFlagged
                      ? "#fee2e2"
                      : recipient.isNew
                        ? "#ffedd5"
                        : "#dbeafe",
                    color: recipient.isFlagged
                      ? "#b91c1c"
                      : recipient.isNew
                        ? "#c2410c"
                        : "#1d4ed8",
                  }}
                >
                  {recipient.avatar}
                </div>

                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontWeight: 700 }}>
                    {recipient.name}
                  </div>
                  <div style={smallTextStyle}>
                    {recipient.phone}
                  </div>

                  {recipient.isFlagged ? (
                    <div
                      style={{
                        ...smallTextStyle,
                        color: "#dc2626",
                      }}
                    >
                      {recipient.reportCount} Reports
                    </div>
                  ) : null}

                  {recipient.isNew ? (
                    <div
                      style={{
                        ...smallTextStyle,
                        color: "#ea580c",
                      }}
                    >
                      New recipient
                    </div>
                  ) : null}
                </div>

                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    border: active
                      ? "6px solid #2563eb"
                      : "2px solid #cbd5e1",
                  }}
                />
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div
              style={{ ...smallTextStyle, padding: "8px 0" }}
            >
              No matching contacts found.
            </div>
          )}
        </SectionCard>

        <button
          style={{
            ...primaryButtonStyle,
            opacity: selected ? 1 : 0.5,
            cursor: selected ? "pointer" : "not-allowed",
          }}
          disabled={!selected}
          onClick={() => selected && onContinue(selected)}
        >
          Continue
        </button>
      </div>
    </Page>
  );
}

function VerificationDecisionScreen({
  onBack,
  onYes,
  onNo,
}: {
  onBack: () => void;
  onYes: () => void;
  onNo: () => void;
}) {
  const [answer, setAnswer] = useState("");

  return (
    <Page>
      <Header
        title="Verification Question"
        subtitle="Final decision before transfer"
        onBack={onBack}
      />

      <div style={containerCenteredStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }}>
            Do you still want to continue with this transfer?
          </div>

          <div style={{ ...smallTextStyle, marginTop: 10, textAlign: "center" }}>
            Choose an answer below.
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={fieldLabelStyle}>Your answer</div>
            <select
              style={inputStyle}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {answer === "yes" && (
            <button style={primaryButtonStyle} onClick={onYes}>
              Proceed to Password Page
            </button>
          )}

          {answer === "no" && (
            <button style={outlineButtonStyle} onClick={onNo}>
              Return to Main Page
            </button>
          )}
        </div>
      </div>
    </Page>
  );
}

function EnterAmountScreen({
  recipient,
  balance,
  onBack,
  onContinue,
}: {
  recipient: Recipient | null;
  balance: number;
  onBack: () => void;
  onContinue: (amount: number) => void;
}) {
  const [amountText, setAmountText] = useState("");

  if (!recipient) {
    return (
      <Page>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              No recipient selected
            </div>
            <button style={primaryButtonStyle} onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      </Page>
    );
  }

  const numericAmount = Number(amountText || "0");
  const insufficient = numericAmount > balance;

  const addDigit = (value: string) => {
    setAmountText((prev) => {
      if (prev.length >= 8) return prev;
      if (prev === "0") return value;
      return prev + value;
    });
  };

  const removeDigit = () => {
    setAmountText((prev) => prev.slice(0, -1));
  };

  return (
    <Page>
      <Header
        title="Send Money"
        subtitle="Enter amount"
        onBack={onBack}
      />

      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={fieldLabelStyle}>Sending to</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                ...avatarStyle,
                background: "#dbeafe",
                color: "#1d4ed8",
              }}
            >
              {recipient.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>
                {recipient.name}
              </div>
              <div style={smallTextStyle}>
                {recipient.phone}
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={smallTextStyle}>Amount</div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              marginTop: 12,
            }}
          >
            {formatRM(numericAmount)}
          </div>
          <div style={{ ...smallTextStyle, marginTop: 10 }}>
            Available balance: {formatRM(balance)}
          </div>
          {insufficient ? (
            <div style={errorTextStyle}>
              Entered amount exceeds your available balance.
            </div>
          ) : null}
        </div>

        <div style={keypadStyle}>
          {[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "00",
            "0",
          ].map((key) => (
            <button
              key={key}
              style={keypadButtonStyle}
              onClick={() => addDigit(key)}
            >
              {key}
            </button>
          ))}
          <button
            style={keypadButtonStyle}
            onClick={removeDigit}
          >
            ⌫
          </button>
        </div>

        <button
          style={{
            ...primaryButtonStyle,
            opacity:
              numericAmount > 0 && !insufficient ? 1 : 0.5,
            cursor:
              numericAmount > 0 && !insufficient
                ? "pointer"
                : "not-allowed",
          }}
          disabled={numericAmount <= 0 || insufficient}
          onClick={() => onContinue(numericAmount)}
        >
          Continue
        </button>
      </div>
    </Page>
  );
}

function TopUpScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: (amount: number) => void;
}) {
  const [amountText, setAmountText] = useState("");

  const numericAmount = Number(amountText || "0");

  const addDigit = (value: string) => {
    setAmountText((prev) => {
      if (prev.length >= 8) return prev;
      if (prev === "0") return value;
      return prev + value;
    });
  };

  const removeDigit = () => {
    setAmountText((prev) => prev.slice(0, -1));
  };

  return (
    <Page>
      <Header
        title="Top Up"
        subtitle="Enter amount to add"
        onBack={onBack}
      />

      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={smallTextStyle}>Top Up Amount</div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              marginTop: 12,
            }}
          >
            {formatRM(numericAmount)}
          </div>
        </div>

        <div style={keypadStyle}>
          {[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "00",
            "0",
          ].map((key) => (
            <button
              key={key}
              style={keypadButtonStyle}
              onClick={() => addDigit(key)}
            >
              {key}
            </button>
          ))}
          <button
            style={keypadButtonStyle}
            onClick={removeDigit}
          >
            ⌫
          </button>
        </div>

        <button
          style={{
            ...primaryButtonStyle,
            opacity: numericAmount > 0 ? 1 : 0.5,
            cursor: numericAmount > 0 ? "pointer" : "not-allowed",
          }}
          disabled={numericAmount <= 0}
          onClick={() => onContinue(numericAmount)}
        >
          Confirm Top Up
        </button>
      </div>
    </Page>
  );
}

function TopUpSuccessScreen({
  amount,
  transactionId,
  newBalance,
  onDone,
}: {
  amount: number;
  transactionId: string;
  newBalance: number;
  onDone: () => void;
}) {
  return (
    <Page>
      <div style={containerCenteredStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#16a34a",
            }}
          >
            Top Up Successful
          </div>

          <div
            style={{
              ...secondaryCardStyle,
              marginTop: 18,
              textAlign: "left",
            }}
          >
            <SimpleRow
              left="Amount"
              right={formatRM(amount)}
            />
            <SimpleRow
              left="Transaction ID"
              right={transactionId}
            />
            <SimpleRow
              left="New Balance"
              right={formatRM(newBalance)}
            />
          </div>

          <button style={primaryButtonStyle} onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    </Page>
  );
}

function AIAnalysisScreen({
  recipient,
  amount,
  onComplete,
}: {
  recipient: Recipient | null;
  amount: number;
  onComplete: (data: RiskData) => void;
}) {
  const steps = [
    "Initializing AI security engine",
    "Running AI-driven sandbox transaction simulation",
    "Checking behavioral fraud signals",
    "Detecting ghost overlay threats",
    "Auto-report and trace account / phone number",
    "Preparing SemakMule integration verification",
    "Finalizing fraud risk decision",
  ];

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < steps.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 700);
      return () => clearTimeout(t);
    }

    let score = 0;
    const reasons: string[] = [];

    if (recipient?.isNew) {
      score += 15;
      reasons.push("New recipient");
    }

    if (recipient?.isFlagged) {
      score += 40;
      reasons.push("Recipient already has fraud reports");
    }

    if (amount >= 5000) {
      score += 20;
      reasons.push("Large transfer amount");
    } else if (amount >= 1000) {
      score += 10;
      reasons.push("Unusually high transfer amount");
    }

    if (reasons.length === 0) {
      reasons.push("No major scam indicators detected");
    }

    const riskScore = Math.min(score, 99);
    const riskLevel =
      riskScore >= 80
        ? "high"
        : riskScore >= 50
          ? "medium"
          : "low";

    const data: RiskData = {
      riskScore,
      riskLevel,
      reasons,
      ghostOverlayDetected: riskScore >= 50,
      sandboxTriggered: true,
      reportCount: recipient?.reportCount || 0,
      linkedAccounts: recipient?.isFlagged ? 12 : 1,
      semakMulePrepared: true,
    };

    const done = setTimeout(() => onComplete(data), 900);
    return () => clearTimeout(done);
  }, [
    step,
    steps.length,
    recipient,
    amount,
    onComplete,
  ]);

  const progress = Math.min((step / steps.length) * 100, 100);

  return (
    <Page>
      <div style={containerCenteredStyle}>
        <div style={cardStyle}>
          <div
            style={{ textAlign: "center", marginBottom: 18 }}
          >
            <div style={{ fontWeight: 800, fontSize: 22 }}>
              AI Security Analysis
            </div>
            <div style={{ ...smallTextStyle, marginTop: 6 }}>
              The system analyzes transaction risk before showing the warning.
            </div>
          </div>

          <div style={progressOuterStyle}>
            <div
              style={{
                ...progressInnerStyle,
                width: `${progress}%`,
              }}
            />
          </div>

          <div
            style={{ marginTop: 16, display: "grid", gap: 10 }}
          >
            {steps.map((item, index) => (
              <div
                key={item}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background:
                    index < step ? "#eff6ff" : "#f8fafc",
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                  fontWeight: index < step ? 700 : 500,
                  color: index < step ? "#1d4ed8" : "#6b7280",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

function RiskWarningScreen({
  recipient,
  amount,
  riskData,
  userType,
  onCancel,
  onProceed,
}: {
  recipient: Recipient | null;
  amount: number;
  riskData: RiskData | null;
  userType: string;
  onCancel: () => void;
  onProceed: () => void;
}) {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  const proceedLocked = timer !== 0;

  return (
    <Page>
      <div style={containerStyle}>
        <HighRiskHeader />
        <TransactionDetailsCard
          recipient={recipient}
          amount={amount}
          riskData={riskData}
        />
        <DetectedRiskSignalsCard riskData={riskData} />
        <ScamPatternCard />
        <EconomicImpactCard userType={userType} amount={amount} />
        <CoolingOffTimerCard timer={timer} />

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <button style={outlineButtonStyle} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={{
              ...primaryButtonStyle,
              opacity: proceedLocked ? 0.5 : 1,
              cursor: proceedLocked ? "not-allowed" : "pointer",
            }}
            disabled={proceedLocked}
            onClick={onProceed}
          >
            {proceedLocked ? "Proceed Locked" : "Continue"}
          </button>
        </div>
      </div>
    </Page>
  );
}

function HighRiskHeader() {
  return (
    <div
      style={{
        ...cardStyle,
        border: "2px solid #fca5a5",
        background: "#fff",
      }}
    >
      <div
        style={{
          color: "#b91c1c",
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        High Risk Warning
      </div>
      <div style={{ ...smallTextStyle, marginTop: 6 }}>
        This warning appears before the password page because
        the system detected multiple scam indicators.
      </div>
    </div>
  );
}

function TransactionDetailsCard({
  recipient,
  amount,
  riskData,
}: {
  recipient: Recipient | null;
  amount: number;
  riskData: RiskData | null;
}) {
  return (
    <SectionCard title="Transaction Details">
      <SimpleRow
        left="Recipient"
        right={recipient?.name || "-"}
      />
      <SimpleRow left="Phone" right={recipient?.phone || "-"} />
      <SimpleRow left="Amount" right={formatRM(amount)} />
      <SimpleRow
        left="Risk Score"
        right={`${riskData?.riskScore || 0}%`}
      />
      <SimpleRow
        left="Risk Level"
        right={riskData?.riskLevel || "-"}
      />
    </SectionCard>
  );
}

function DetectedRiskSignalsCard({
  riskData,
}: {
  riskData: RiskData | null;
}) {
  return (
    <SectionCard title="Detected Risk Signals">
      <ul style={listStyle}>
        {(riskData?.reasons || []).map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </SectionCard>
  );
}

function ScamPatternCard() {
  return (
    <SectionCard title="System Explains Scam Pattern">
      <div style={smallTextStyle}>
        This transfer resembles a common scam pattern involving
        newly added or suspicious recipients, investment-related
        claims, urgency, or contacts known only online.
      </div>
    </SectionCard>
  );
}

function EconomicImpactCard({
  userType,
  amount,
}: {
  userType: string;
  amount: number;
}) {
  return (
    <SectionCard title="Economic Impact (SDG 8)">
      <div style={smallTextStyle}>
        For a {userType.toLowerCase()}, losing{" "}
        {formatRM(amount)} to fraud may disrupt wages, savings,
        or business cash flow. This protection flow is designed
        to support safer participation in the digital economy.
      </div>
    </SectionCard>
  );
}

function CoolingOffTimerCard({ timer }: { timer: number }) {
  return (
    <SectionCard title="Cooling-Off Timer">
      <div style={smallTextStyle}>
        Demo mode uses 30 seconds. Production can be changed to
        12 hours.
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          color: "#dc2626",
          marginTop: 8,
        }}
      >
        {timer}s
      </div>
    </SectionCard>
  );
}

function FaceVerificationScreen({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) return;
    const t = setTimeout(() => setProgress((p) => p + 20), 500);
    return () => clearTimeout(t);
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <Page>
      <Header
        title="Identity Verification"
        subtitle="Face verification"
        onBack={onBack}
      />
      <div style={containerCenteredStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            Face Verification
          </div>
          <div style={{ ...smallTextStyle, marginTop: 8 }}>
            High-risk transactions require biometric
            verification.
          </div>

          <div style={progressOuterStyle}>
            <div
              style={{
                ...progressInnerStyle,
                width: `${progress}%`,
              }}
            />
          </div>

          <div style={{ ...smallTextStyle, marginTop: 12 }}>
            {progress < 40 &&
              "Align your face within the frame"}
            {progress >= 40 &&
              progress < 80 &&
              "Performing liveness detection"}
            {progress >= 80 &&
              progress < 100 &&
              "Matching identity"}
            {progress === 100 && "Verification complete"}
          </div>
        </div>
      </div>
    </Page>
  );
}

function PasswordScreen({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [password, setPassword] = useState("");

  return (
    <Page>
      <Header
        title="Final Security Confirmation"
        subtitle="Password page"
        onBack={onBack}
      />
      <div style={containerCenteredStyle}>
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            Enter Password
          </div>

          <div style={fieldLabelStyle}>Password</div>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <button
            style={{
              ...primaryButtonStyle,
              opacity: password ? 1 : 0.5,
              cursor: password ? "pointer" : "not-allowed",
            }}
            disabled={!password}
            onClick={onComplete}
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </Page>
  );
}

function SuccessScreen({
  recipient,
  amount,
  transactionId,
  onDone,
}: {
  recipient: Recipient | null;
  amount: number;
  transactionId: string;
  onDone: () => void;
}) {
  return (
    <Page>
      <div style={containerCenteredStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#16a34a",
            }}
          >
            Transaction Successful
          </div>

          <div
            style={{
              ...secondaryCardStyle,
              marginTop: 18,
              textAlign: "left",
            }}
          >
            <SimpleRow
              left="Recipient"
              right={recipient?.name || "-"}
            />
            <SimpleRow
              left="Phone"
              right={recipient?.phone || "-"}
            />
            <SimpleRow left="Amount" right={formatRM(amount)} />
            <SimpleRow
              left="Transaction ID"
              right={transactionId}
            />
          </div>

          <button style={primaryButtonStyle} onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#0f172a",
      }}
    >
      {children}
    </div>
  );
}

function Header({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={containerStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button style={backButtonStyle} onClick={onBack}>
            ←
          </button>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {title}
            </div>
            <div style={smallTextStyle}>{subtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SimpleRow({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "6px 0",
        fontSize: 14,
      }}
    >
      <span style={{ color: "#64748b" }}>{left}</span>
      <span style={{ fontWeight: 600, textAlign: "right" }}>
        {right}
      </span>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  margin: "0 auto",
  padding: 16,
  boxSizing: "border-box",
};

const containerCenteredStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  margin: "0 auto",
  padding: 16,
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
};

const heroStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
  color: "white",
  paddingTop: 20,
  paddingBottom: 12,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  marginBottom: 14,
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
};

const glassCardStyle: React.CSSProperties = {
  marginTop: 18,
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.25)",
};

const secondaryCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 14,
  padding: "14px 16px",
  fontWeight: 800,
  fontSize: 15,
  marginTop: 10,
};

const primaryButtonLargeStyle: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 18,
  padding: 18,
  minHeight: 92,
  textAlign: "left",
  boxShadow: "0 8px 18px rgba(37,99,235,0.18)",
};

const outlineButtonStyle: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: "14px 16px",
  fontWeight: 700,
  fontSize: 15,
  marginBottom: 14,
};

const backButtonStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 999,
  border: "1px solid #d1d5db",
  background: "#fff",
  fontSize: 18,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  fontSize: 14,
  boxSizing: "border-box",
  marginBottom: 10,
  background: "#fff",
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#475569",
  marginBottom: 6,
};

const smallTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#64748b",
  lineHeight: 1.5,
};

const errorTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#dc2626",
  marginBottom: 8,
};

const recipientRowStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 12,
  borderTop: "1px solid #f1f5f9",
  borderRight: "1px solid #f1f5f9",
  borderBottom: "1px solid #f1f5f9",
  background: "#fff",
  borderRadius: 14,
  marginBottom: 8,
};

const avatarStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
};

const keypadStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 12,
  marginBottom: 12,
};

const keypadButtonStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #dbe2ea",
  borderRadius: 14,
  minHeight: 60,
  fontSize: 24,
  fontWeight: 700,
};

const progressOuterStyle: React.CSSProperties = {
  width: "100%",
  height: 12,
  background: "#e5e7eb",
  borderRadius: 999,
  overflow: "hidden",
  marginTop: 16,
};

const progressInnerStyle: React.CSSProperties = {
  height: "100%",
  background: "#2563eb",
  borderRadius: 999,
  transition: "width 0.4s ease",
};

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  fontSize: 14,
  color: "#334155",
  lineHeight: 1.7,
};