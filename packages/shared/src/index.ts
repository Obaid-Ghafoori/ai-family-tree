export type RelationshipType =
  | "BIOLOGICAL_PARENT"
  | "ADOPTIVE_PARENT"
  | "STEP_PARENT"
  | "SPOUSE"
  | "PARTNER"
  | "CHILD"
  | "SIBLING";

export type EvidenceKind =
  | "USER_PROVIDED"
  | "BIRTH_RECORD"
  | "MARRIAGE_RECORD"
  | "DEATH_RECORD"
  | "CENSUS"
  | "CHURCH_RECORD"
  | "IMMIGRATION"
  | "MILITARY"
  | "NEWSPAPER"
  | "OTHER";

export interface Person {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  photoUrl?: string;
}

export interface Relationship {
  id: string;
  fromPersonId: string;
  toPersonId: string;
  type: RelationshipType;
  confidence?: number;
  verified: boolean;
}

export interface Evidence {
  id: string;
  title: string;
  kind: EvidenceKind;
  description: string;
  sourceUrl?: string;
}

export interface AncestorFinding {
  candidate: Person;
  relationship: RelationshipType;
  confidence: number;
  explanation: string;
  evidence: Evidence[];
  status: "REVIEW";
}
