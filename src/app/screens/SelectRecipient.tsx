function SelectRecipientScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: (recipient: Recipient) => void;
}) {
  const [search, setSearch] = useState("");
  const [recipients, setRecipients] =
    useState<Recipient[]>(mockRecipients);
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

    // auto continue to next page immediately:
    onContinue(newRecipient);

    // if you DO NOT want auto continue, remove the line above
    // and let the user press Continue manually
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
              Use this recipient
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