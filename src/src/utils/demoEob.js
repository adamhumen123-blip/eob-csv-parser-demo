// src/utils/demoEob.js
// A realistic sample EOB document used for demo / testing purposes.

const DEMO_EOB = `EXPLANATION OF BENEFITS
HealthFirst Insurance Company
Member Services: 1-800-555-0100

MEMBER INFORMATION
Patient Name: Sarah Johnson
Member ID: HF-2024-889231
Group Number: GRP-45821
Date of Issue: 03/01/2024

================================================================
CLAIM #: CLM-2024-001847
Service Date: 01/15/2024
Provider: Dr. Michael Chen, MD
Provider NPI: 1234567890
Facility: Riverside Medical Center

LINE ITEMS:
Procedure: 99213 - Office Visit, Established Patient
  Billed Amount: $285.00
  Allowed Amount: $195.00
  Plan Paid: $156.00
  Patient Responsibility (Copay): $39.00
  Status: PAID

Procedure: 85027 - Complete Blood Count
  Billed Amount: $120.00
  Allowed Amount: $68.00
  Plan Paid: $54.40
  Patient Responsibility (20% Coinsurance): $13.60
  Status: PAID

================================================================
CLAIM #: CLM-2024-002391
Service Date: 01/22/2024
Provider: Westside Radiology Group
Provider NPI: 9876543210

Procedure: 71046 - Chest X-Ray, 2 views
  Billed Amount: $450.00
  Allowed Amount: $0.00
  Plan Paid: $0.00
  Patient Responsibility: $0.00
  Status: DENIED
  Denial Reason: Service requires prior authorization. Please submit PA request with clinical documentation.

================================================================
CLAIM #: CLM-2024-003105
Service Date: 02/05/2024
Provider: Summit Physical Therapy
Provider NPI: 5551234567

Procedure: 97110 - Therapeutic Exercise, 15 min
  Billed Amount: $175.00
  Allowed Amount: $142.00
  Plan Paid: $99.40
  Patient Responsibility (30% after deductible): $42.60
  Status: PARTIAL
  Notes: Deductible partially met. Remaining deductible applied: $250.00

Procedure: 97140 - Manual Therapy, 15 min
  Billed Amount: $165.00
  Allowed Amount: $132.00
  Plan Paid: $0.00
  Patient Responsibility: $132.00
  Status: DENIED
  Denial Reason: Maximum benefit limit of 20 PT visits per year has been reached.

================================================================
END OF EXPLANATION OF BENEFITS
Questions? Call member services at 1-800-555-0100
`;

export default DEMO_EOB;
