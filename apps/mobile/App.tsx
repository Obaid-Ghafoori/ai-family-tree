import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";

type Person = {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  place?: string;
};

const seedPeople: Person[] = [
  { id: "me", name: "You", birthYear: 1990, place: "Your hometown" },
  { id: "father", name: "Your Father", birthYear: 1960, place: "Unknown" },
  { id: "mother", name: "Your Mother", birthYear: 1963, place: "Unknown" }
];

const mockFindings = [
  {
    id: "finding-1",
    name: "Possible grandfather",
    birthYear: 1932,
    confidence: 91,
    explanation:
      "This is a demonstration finding. In production, the app will only score a candidate using connected historical sources and user-provided evidence.",
    evidence: ["User-provided family information", "Demo census record"]
  }
];

export default function App() {
  const [people, setPeople] = useState(seedPeople);
  const [selected, setSelected] = useState<Person | null>(null);
  const [discovering, setDiscovering] = useState(false);
  const [findings, setFindings] = useState<typeof mockFindings>([]);

  const parents = useMemo(() => people.filter(p => p.id !== "me"), [people]);

  const discover = () => {
    setDiscovering(true);
    setTimeout(() => {
      setFindings(mockFindings);
      setDiscovering(false);
    }, 700);
  };

  const acceptFinding = () => {
    const f = findings[0];
    if (!f) return;
    setPeople(current => [
      ...current,
      { id: "grandfather-demo", name: f.name, birthYear: f.birthYear }
    ]);
    setFindings([]);
  };

  if (selected) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => setSelected(null)}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selected.name}</Text>
          <Text style={styles.subtitle}>
            {selected.birthYear ? `Born ${selected.birthYear}` : "Birth year unknown"}
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Family</Text>
            <Text style={styles.body}>Parents and relationships will appear here.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI research</Text>
            <Text style={styles.body}>
              Ask the research engine to look for possible parents. Every result will require review.
            </Text>
            <TouchableOpacity style={styles.primary} onPress={discover}>
              <Text style={styles.primaryText}>{discovering ? "Researching…" : "Find possible ancestors"}</Text>
            </TouchableOpacity>
          </View>

          {findings.map(f => (
            <View key={f.id} style={styles.finding}>
              <Text style={styles.badge}>DEMO FINDING</Text>
              <Text style={styles.cardTitle}>{f.name}</Text>
              <Text style={styles.confidence}>{f.confidence}% confidence</Text>
              <Text style={styles.body}>{f.explanation}</Text>
              <Text style={styles.cardTitle}>Evidence</Text>
              {f.evidence.map(e => <Text key={e} style={styles.body}>• {e}</Text>)}
              <View style={styles.row}>
                <TouchableOpacity style={styles.secondary} onPress={() => setFindings([])}>
                  <Text>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primarySmall} onPress={acceptFinding}>
                  <Text style={styles.primaryText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>ANCESTORAI</Text>
        <Text style={styles.title}>Discover your family story</Text>
        <Text style={styles.subtitle}>Start with what you know. AI helps you investigate what came before.</Text>

        <View style={styles.tree}>
          <Text style={styles.generation}>PARENTS</Text>
          <View style={styles.row}>
            {parents.map(p => (
              <TouchableOpacity key={p.id} style={styles.person} onPress={() => setSelected(p)}>
                <Text style={styles.personName}>{p.name}</Text>
                <Text style={styles.personYear}>{p.birthYear}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.connector}>│</Text>
          <Text style={styles.connector}>▼</Text>

          <TouchableOpacity style={styles.you} onPress={() => setSelected(people[0])}>
            <Text style={styles.youName}>You</Text>
            <Text>1990</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Discover</Text>
          <Text style={styles.body}>
            Research missing generations, compare possible matches, and review evidence before adding anyone.
          </Text>
          <TouchableOpacity style={styles.primary} onPress={discover}>
            <Text style={styles.primaryText}>{discovering ? "Researching…" : "Find ancestors"}</Text>
          </TouchableOpacity>
        </View>

        {findings.map(f => (
          <View key={f.id} style={styles.finding}>
            <Text style={styles.badge}>DEMO FINDING</Text>
            <Text style={styles.cardTitle}>{f.name}</Text>
            <Text style={styles.confidence}>{f.confidence}% confidence</Text>
            <Text style={styles.body}>{f.explanation}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.secondary} onPress={() => setFindings([])}>
                <Text>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primarySmall} onPress={acceptFinding}>
                <Text style={styles.primaryText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },
  container: { padding: 20, paddingBottom: 48 },
  eyebrow: { fontSize: 12, fontWeight: "700", letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: "800", lineHeight: 38, marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 24, color: "#5E6470", marginBottom: 20 },
  back: { fontSize: 18, marginBottom: 18 },
  tree: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, marginBottom: 16, alignItems: "center" },
  generation: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, marginBottom: 12 },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  person: { backgroundColor: "#EEF1F5", borderRadius: 16, padding: 14, minWidth: 125 },
  personName: { fontWeight: "700", marginBottom: 4 },
  personYear: { color: "#6B7280" },
  connector: { fontSize: 18, color: "#737985", lineHeight: 20 },
  you: { backgroundColor: "#E8EEF9", borderRadius: 18, padding: 18, minWidth: 140, alignItems: "center" },
  youName: { fontWeight: "800", fontSize: 18 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18, marginBottom: 14 },
  finding: { backgroundColor: "#FFFDF7", borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: "#E7E0C8" },
  cardTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  body: { color: "#5E6470", lineHeight: 22, marginBottom: 10 },
  primary: { backgroundColor: "#111827", borderRadius: 14, padding: 15, alignItems: "center", marginTop: 8 },
  primarySmall: { backgroundColor: "#111827", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  primaryText: { color: "#FFFFFF", fontWeight: "700" },
  secondary: { backgroundColor: "#EEF1F5", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  badge: { fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  confidence: { fontWeight: "800", marginBottom: 8 }
});
