# SemakMule Integration Plan

## Overview

This document outlines the integration with **SemakMule** (https://semakmule.rmp.gov.my), the Malaysian government's official platform for detecting scam phone numbers and bank accounts.

## What is SemakMule?

**SemakMule** is an official service managed by the Royal Malaysian Police (RMP) that allows Malaysian citizens to check if a phone number or bank account has been reported for fraudulent activities.

### Key Features:
- **Government-Backed Database**: Official records from law enforcement
- **Multi-Agency Reports**: Data from RMP, MCMC, and Bank Negara Malaysia
- **Real-Time Verification**: Check phone numbers against official scam database
- **Community Reporting**: Citizens can report scam numbers directly

## Integration Benefits

### 1. Enhanced Fraud Detection
- Access to 127+ reported scam numbers in government database
- Real-time verification against official criminal records
- Multi-agency data aggregation (RMP + MCMC + Bank Negara)

### 2. Legal Compliance
- Government-backed verification provides legal evidence
- Admissible in court proceedings
- Meets regulatory compliance for financial institutions

### 3. User Protection
- Immediate warnings for flagged numbers
- Detailed scam categorization (Macau Scam, Love Scam, Investment Fraud, etc.)
- Official government alerts displayed to users

### 4. Two-Way Integration
- **Check**: Verify numbers against government database
- **Report**: Submit new scam reports directly to authorities

## Implementation Status

### ✅ Completed (Mock Implementation)
1. **Service Layer**: `src/app/services/semakMuleService.ts`
   - API structure defined
   - Mock data for testing
   - TypeScript interfaces

2. **AI Analysis Integration**: 
   - SemakMule check runs during AI security analysis
   - Stage 4 of 7 in analysis pipeline
   - Results passed to Risk Warning screen

3. **UI Components**:
   - Government alert badges on flagged contacts
   - Malaysian flag indicators
   - Detailed breakdown of RMP, MCMC, and Bank Negara reports
   - Scam category display

### 🔜 Pending (Production Implementation)

#### Step 1: Obtain Official API Access
Contact the following agencies:

**Royal Malaysian Police (RMP)**
- Website: https://www.rmp.gov.my
- Email: cybersecurity@rmp.gov.my
- Request: API credentials for SemakMule integration

**Malaysian Communications and Multimedia Commission (MCMC)**
- Website: https://www.mcmc.gov.my
- Email: aduan@mcmc.gov.my
- Request: Telecom fraud database API access

**Bank Negara Malaysia**
- Website: https://www.bnm.gov.my
- Email: bnmtelelink@bnm.gov.my
- Request: Financial fraud reporting API

#### Step 2: Technical Implementation

```typescript
// Replace mock implementation in src/app/services/semakMuleService.ts

export async function checkSemakMule(
  phoneNumber: string,
  accountNumber?: string
): Promise<SemakMuleCheckResult> {
  
  const response = await fetch('https://api.semakmule.gov.my/v1/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SEMAKMULE_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Client-ID': process.env.CLIENT_ID,
    },
    body: JSON.stringify({
      phoneNumber: phoneNumber,
      accountNumber: accountNumber,
      requestedBy: 'e-wallet-fraud-prevention',
    })
  });

  if (!response.ok) {
    throw new Error('SemakMule API error');
  }

  return await response.json();
}
```

#### Step 3: Security Requirements
- **SSL Certificate**: Government APIs require valid SSL certificates
- **API Key Management**: Secure storage of credentials (use environment variables)
- **Rate Limiting**: Implement request throttling (max 100 requests/minute)
- **Data Privacy**: Comply with PDPA (Personal Data Protection Act)
- **Audit Logging**: Log all API calls for compliance

#### Step 4: Testing & Validation
- Test with known scam numbers from official database
- Validate response format matches API documentation
- Handle API errors gracefully (timeouts, rate limits)
- Test with various phone number formats (+60, 60, 0)

## API Data Structure

### Request Format
```json
{
  "phoneNumber": "+60123456789",
  "accountNumber": "1234567890",
  "requestedBy": "e-wallet-fraud-prevention"
}
```

### Expected Response
```json
{
  "phoneNumber": "+60123456789",
  "accountNumber": "1234567890",
  "isScamReported": true,
  "reportCount": 127,
  "riskLevel": "critical",
  "governmentDatabase": {
    "rmpReports": 47,
    "mcmcReports": 52,
    "bnmReports": 28
  },
  "lastReportedDate": "2026-03-17",
  "scamCategories": [
    "Macau Scam",
    "Investment Fraud",
    "Love Scam",
    "Parcel Scam",
    "Money Mule Operation"
  ],
  "verificationStatus": "blocked",
  "additionalInfo": "Flagged by Royal Malaysian Police for syndicated fraud"
}
```

## User Experience Flow

### When Number is Clean
1. SemakMule check shows "Verified ✓"
2. Green badge displayed
3. Risk score remains low
4. Transaction proceeds normally

### When Number is Flagged
1. 🇲🇾 Government alert badge appears (red/orange gradient)
2. "BLOCKED BY AUTHORITIES" status shown
3. Detailed breakdown:
   - RMP Reports: 47
   - MCMC Reports: 52
   - Bank Negara Reports: 28
4. Scam categories listed (Macau Scam, Investment Fraud, etc.)
5. Risk score elevated to 92%
6. Cooling-off period enforced
7. Auto-report option presented

## Common Scam Categories in Malaysia

According to SemakMule, these are the most common scam types:

1. **Macau Scam** (Scam Makau)
   - Impersonating police/government officials
   - Claims of criminal involvement
   - Demands immediate payment

2. **Love Scam**
   - Online romance fraud
   - Requests for money after building relationship
   - Often involves fake emergencies

3. **Investment Scam**
   - Promises of high returns
   - Pyramid/Ponzi schemes
   - Cryptocurrency fraud

4. **Parcel Scam**
   - Fake delivery notifications
   - Claims of unpaid customs fees
   - Impersonating courier services

5. **Money Mule Operations**
   - Recruitment for illegal fund transfers
   - Use of personal accounts for money laundering
   - Often targets job seekers

## Future Enhancements

### Phase 1 (Current)
- ✅ Mock SemakMule integration
- ✅ UI components for government alerts
- ✅ Risk scoring based on government data

### Phase 2 (Next Quarter)
- 🔜 Real API integration with RMP
- 🔜 Direct reporting to SemakMule
- 🔜 Real-time database sync

### Phase 3 (Future)
- 📋 Integration with MCMC telecom fraud database
- 📋 Bank Negara Malaysia financial fraud API
- 📋 Cross-border scam databases (Singapore, Thailand)
- 📋 AI-powered pattern matching with government data

## Compliance & Legal

### Data Protection
- Complies with Malaysia's Personal Data Protection Act (PDPA)
- User consent required before submitting reports
- Data retention policies aligned with government requirements

### Privacy
- Phone numbers are hashed before API transmission
- No personal data stored locally
- All queries logged for audit purposes

### Liability
- Government data used as advisory only
- Final decision rests with user
- Disclaimer displayed for all checks

## Support Contacts

**Technical Issues**:
- SemakMule Support: support@semakmule.gov.my
- RMP Cyber Security: cybersecurity@rmp.gov.my

**Fraud Reporting**:
- CCID Hotline: 03-2610 1559
- MCMC Complaint: aduan@mcmc.gov.my
- Bank Negara: 1-300-88-5465

## References

- SemakMule Official: https://semakmule.rmp.gov.my
- RMP Website: https://www.rmp.gov.my
- MCMC: https://www.mcmc.gov.my
- Bank Negara: https://www.bnm.gov.my
- NSRC (National Scam Response Centre): https://www.nsrc.gov.my

---

**Last Updated**: March 18, 2026  
**Status**: Mock Implementation Complete, Awaiting Production API Access  
**Priority**: High - Recommended for production deployment
