
# NetGuard Prototype
Our project is an AI-powered e-wallet fraud prevention system designed to detect and stop suspicious transactions before they are completed. The system integrates real-time risk analysis, user verification steps, and external fraud databases to create a secure and intelligent transaction flow. By combining AI detection with user-centric security mechanisms, the application transforms traditional e-wallets into proactive fraud prevention platforms.

The core component is the AI fraud detection engine, which performs behavioral profiling, pattern detection, and assigns a risk score in real time. We also integrate external trusted systems such as SemakMule and scam databases to enhance detection accuracy. All transaction and behavioral data are stored securely for future analysis and model improvement. Additionally, cross-layer security controls such as ghost overlay detection, biometric authentication, and cooling-off timers ensure that fraud is prevented proactively, not just detected.

Digital payment scams are rapidly increasing, especially targeting users with low digital literacy. Most existing systems are reactive — they detect fraud only after the transaction is completed, when the money is already lost. Scammers exploit urgency, trust, and lack of awareness, causing significant financial loss and reducing trust in digital financial services. This issue directly impacts economic stability and financial inclusion, aligning with challenges addressed in SDG 8. We propose a proactive fraud prevention system embedded within the e-wallet transaction flow. The system uses a simulated AI risk engine to analyze transaction data such as recipient risk, transfer amount, and behavioral patterns in real time.

If a transaction is identified as high-risk, the system:
•	Displays a clear fraud warning with explanations
•	Enforces a cooling-off period to prevent impulsive decisions
•	Requires user verification through guided questions
•	Applies additional authentication such as password or biometric checks

The system also integrates external databases like SemakMule and includes features such as ghost overlay detection and auto-reporting to enhance security. This approach ensures that fraud is not just detected, but actively prevented before financial loss occurs.

The original project is available at https://www.figma.com/design/AprYZxA1r6XzTcLJXQiWWv/NetGuard-Prototype.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
