/**
 * Security Rules Specification Verification Suite for ReVogue Labs
 * Documents the 12 Dirty Dozen adversarial payload assertions verified against firestore.rules.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update';
  expectedOutcome: 'PERMISSION_DENIED';
  violatedPillar: string;
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Role self-escalation on user registration',
    collection: '/users/{uid}',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 2 & 4: Tiered Identity / Strict Role Enum',
  },
  {
    id: 2,
    name: 'Self-minting dropCredits on profile update',
    collection: '/users/{uid}',
    operation: 'update',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 4: Action-Based affectedKeys().hasOnly()',
  },
  {
    id: 3,
    name: 'Shadow field injection (isVerified: true)',
    collection: '/users/{uid}',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 2: Strict Keys hasOnly()',
  },
  {
    id: 4,
    name: 'Cross-user PII read attempt',
    collection: '/users/{otherUid}',
    operation: 'get',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 6: PII Isolation',
  },
  {
    id: 5,
    name: 'Unverified admin email spoof attack',
    collection: '/pickupBookings/{id}',
    operation: 'get',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Email Spoofing Guard (email_verified == true)',
  },
  {
    id: 6,
    name: 'Path variable ID poisoning (>128 chars or invalid chars)',
    collection: '/orders/{poisonId}',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 3: Path Variable Hardening',
  },
  {
    id: 7,
    name: 'Booking ownership spoofing (userId != auth.uid)',
    collection: '/pickupBookings/{id}',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 2: Identity Integrity',
  },
  {
    id: 8,
    name: 'Status shortcutting (creating booking directly as paid)',
    collection: '/pickupBookings/{id}',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 4: Initial State Enforcement',
  },
  {
    id: 9,
    name: 'Client timestamp forgery on order create',
    collection: '/orders/{id}',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Temporal Integrity (createdAt == request.time)',
  },
  {
    id: 10,
    name: 'Terminal state mutation on delivered order',
    collection: '/orders/{id}',
    operation: 'update',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Phase 4 Rule 6: Terminal State Locking',
  },
  {
    id: 11,
    name: 'Unbounded array payload on itemTitles',
    collection: '/orders/{id}',
    operation: 'create',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 5: Total Array Guarding',
  },
  {
    id: 12,
    name: 'Unfiltered collection list scrape on orders',
    collection: '/orders',
    operation: 'list',
    expectedOutcome: 'PERMISSION_DENIED',
    violatedPillar: 'Pillar 8: Secure List Queries',
  },
];
