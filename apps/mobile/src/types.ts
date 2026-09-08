export type Person = {
  id: string;
  givenName: string;
  familyName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  notes?: string;
};

export type RelationshipType = "parent" | "spouse" | "child" | "sibling";

export type Relationship = {
  id: string;
  fromPersonId: string;
  toPersonId: string;
  type: RelationshipType;
  confirmed: boolean;
  sourceIds: string[];
};

export type Evidence = {
  id: string;
  title: string;
  source: string;
  url?: string;
  excerpt?: string;
};

export type ResearchFinding = {
  id: string;
  person: Person;
  relationship: RelationshipType;
  confidence: number;
  reasoning: string;
  evidence: Evidence[];
  status: "pending" | "accepted" | "rejected";
};

export type FamilyGraph = {
  people: Person[];
  relationships: Relationship[];
  evidence: Evidence[];
};
