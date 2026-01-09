export const CATEGORIES = [
  'All',
  'Financial',
  'Insurance',
  'Credit/Debit Cards',
  'Media',
  'Bills',
  'Property',
  'Medical',
  'Wills',
  'Travel',
  'Subscriptions',
];

export const CATEGORY_CONTRACT_FIELDS = {
  Financial: [
    { key: 'institution', label: 'Institution', type: 'text', required: true },
    { key: 'accountNumber', label: 'Account Number', type: 'text' },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'frequency', label: 'Frequency', type: 'text' },
  ],
  Insurance: [
    { key: 'insurer', label: 'Insurer', type: 'text', required: true },
    { key: 'policyNumber', label: 'Policy Number', type: 'text' },
    { key: 'coverageType', label: 'Coverage Type', type: 'text' },
    { key: 'premium', label: 'Premium', type: 'number' },
    { key: 'renewalDate', label: 'Renewal Date', type: 'date', hint: 'renewal date' },
  ],
  'Credit/Debit Cards': [
    { key: 'issuer', label: 'Card Issuer', type: 'text', required: true },
    { key: 'last4', label: 'Last 4 Digits', type: 'text' },
    { key: 'limit', label: 'Credit Limit', type: 'number' },
    { key: 'apr', label: 'APR %', type: 'number' },
    { key: 'expirationDate', label: 'Expiration Date', type: 'date', hint: 'expiration date' },
  ],
  Media: [
    { key: 'serviceName', label: 'Service Name', type: 'text', required: true },
    { key: 'plan', label: 'Plan', type: 'text' },
    { key: 'accountEmail', label: 'Account Email', type: 'text' },
    { key: 'renewalDate', label: 'Renewal Date', type: 'date', hint: 'renewal date' },
  ],
  Bills: [
    { key: 'biller', label: 'Biller', type: 'text', required: true },
    { key: 'accountNumber', label: 'Account Number', type: 'text' },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'autopay', label: 'Autopay', type: 'text' },
  ],
  Property: [
    { key: 'address', label: 'Address', type: 'text', required: true },
    { key: 'landlord', label: 'Landlord', type: 'text' },
    { key: 'rent', label: 'Rent', type: 'number' },
    { key: 'leaseEnd', label: 'Lease End', type: 'date', hint: 'lease end date' },
  ],
  Medical: [
    { key: 'providerName', label: 'Provider', type: 'text', required: true },
    { key: 'appointmentDate', label: 'Appointment Date', type: 'date', hint: 'appointment date' },
    { key: 'policyNumber', label: 'Insurance Policy', type: 'text' },
  ],
  Wills: [
    { key: 'attorney', label: 'Attorney', type: 'text' },
    { key: 'executor', label: 'Executor', type: 'text' },
    { key: 'documentDate', label: 'Document Date', type: 'date', hint: 'document date' },
  ],
  Travel: [
    { key: 'destination', label: 'Destination', type: 'text', required: true },
    { key: 'startDate', label: 'Start Date', type: 'date', hint: 'start date' },
    { key: 'endDate', label: 'End Date', type: 'date', hint: 'end date' },
    { key: 'bookingRef', label: 'Booking Ref', type: 'text' },
  ],
  Subscriptions: [
    { key: 'serviceName', label: 'Service Name', type: 'text', required: true },
    { key: 'plan', label: 'Plan', type: 'text' },
    { key: 'cost', label: 'Cost', type: 'number' },
    { key: 'renewalDate', label: 'Renewal Date', type: 'date', hint: 'renewal date' },
    { key: 'cancelBy', label: 'Cancel By', type: 'date', hint: 'last date to cancel' },
  ],
};
