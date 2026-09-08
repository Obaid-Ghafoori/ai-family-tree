import React, { useMemo, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import type { FamilyGraph, Person, ResearchFinding } from "./src/types";

const me: Person = { id:"me", givenName:"You", birthDate:"1990", birthPlace:"Your hometown" };
const father: Person = { id:"father", givenName:"Your Father", birthDate:"1960" };
const mother: Person = { id:"mother", givenName:"Your Mother", birthDate:"1963" };

const initialGraph: FamilyGraph = {
  people:[me,father,mother],
  relationships:[
    { id:"r1", fromPersonId:"father", toPersonId:"me", type:"parent", confirmed:true, sourceIds:[] },
    { id:"r2", fromPersonId:"mother", toPersonId:"me", type:"parent", confirmed:true, sourceIds:[] }
  ],
  evidence:[]
};

const demoFinding: ResearchFinding = {
  id:"demo-1",
  person:{ id:"candidate-grandfather", givenName:"Possible Grandfather", birthDate:"1932" },
  relationship:"parent",
  confidence:91,
  reasoning:"Demo candidate based on the known parent relationship. Production research must compare historical records and show sources.",
  evidence:[{id:"e1",title:"User-provided family information",source:"Family tree"}],
  status:"pending"
};

export default function App() {
  const [graph,setGraph]=useState<FamilyGraph>(initialGraph);
  const [screen,setScreen]=useState<"tree"|"discover"|"person">("tree");
  const [selectedId,setSelectedId]=useState("me");
  const [finding,setFinding]=useState<ResearchFinding|null>(null);
  const [loading,setLoading]=useState(false);
  const [adding,setAdding]=useState(false);
  const [name,setName]=useState("");
  const [birth,setBirth]=useState("");

  const selected=graph.people.find(p=>p.id===selectedId) ?? me;
  const parents=useMemo(
    ()=>graph.relationships
      .filter(r=>r.toPersonId==="me"&&r.type==="parent")
      .map(r=>graph.people.find(p=>p.id===r.fromPersonId))
      .filter(Boolean) as Person[],
    [graph]
  );
  const candidate=graph.people.find(p=>p.id==="candidate-grandfather");

  function discover() {
    setScreen("discover"); setLoading(true); setFinding(null);
    setTimeout(()=>{setFinding({...demoFinding,status:"pending"});setLoading(false)},600);
  }

  function accept() {
    if(!finding || graph.people.some(p=>p.id===finding.person.id)) return;
    setGraph(g=>({
      ...g,
      people:[...g.people,finding.person],
      relationships:[
        ...g.relationships,
        {id:"r-candidate",fromPersonId:finding.person.id,toPersonId:"father",type:"parent",confirmed:true,sourceIds:finding.evidence.map(e=>e.id)}
      ]
    }));
    setFinding(null);
    Alert.alert("Added to tree","The candidate is now confirmed in this demo tree.");
  }

  function addPerson() {
    if(!name.trim()) return Alert.alert("Name required","Enter a name.");
    const id=`p-${Date.now()}`;
    setGraph(g=>({...g,people:[...g.people,{id,givenName:name.trim(),birthDate:birth||undefined}]}));
    setName(""); setBirth(""); setAdding(false);
  }

  return <SafeAreaView style={s.safe}>
    <StatusBar style="dark"/>
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.header}>
        <View><Text style={s.eyebrow}>ANCESTORAI</Text><Text style={s.title}>{screen==="person"?selected.givenName:"Your family story"}</Text></View>
        <TouchableOpacity style={s.plus} onPress={()=>setAdding(true)}><Text style={s.plusText}>+</Text></TouchableOpacity>
      </View>

      {screen==="tree" && <>
        <Text style={s.subtitle}>Build what you know first. AI can then help investigate earlier generations.</Text>
        <View style={s.card}>
          <Text style={s.label}>FAMILY TREE</Text>
          <View style={s.row}>{parents.map(p=><TouchableOpacity key={p.id} style={s.person} onPress={()=>{setSelectedId(p.id);setScreen("person")}}>
            <View style={s.avatar}><Text>{p.givenName[0]}</Text></View><Text style={s.personName}>{p.givenName}</Text><Text style={s.meta}>{p.birthDate||"Year unknown"}</Text>
          </TouchableOpacity>)}</View>
          <Text style={s.arrow}>↓</Text>
          <TouchableOpacity style={s.you} onPress={()=>setScreen("person")}><Text style={s.kicker}>YOU</Text><Text style={s.youName}>You</Text><Text style={s.meta}>1990</Text></TouchableOpacity>
          {candidate && <><Text style={s.arrow}>↑</Text><TouchableOpacity style={s.ancestor} onPress={()=>{setSelectedId(candidate.id);setScreen("person")}}><Text style={s.kicker}>ANCESTOR</Text><Text style={s.personName}>{candidate.givenName}</Text><Text style={s.meta}>1932 · verified</Text></TouchableOpacity></>}
        </View>
        <TouchableOpacity style={s.ai} onPress={discover}><Text style={s.aiIcon}>✦</Text><View style={{flex:1}}><Text style={s.aiTitle}>Discover ancestors</Text><Text style={s.aiBody}>Research possible parents and review evidence before adding them.</Text></View><Text style={s.chevron}>›</Text></TouchableOpacity>
      </>}

      {screen==="discover" && <>
        <Text style={s.subtitle}>Findings are suggestions until you review and accept them.</Text>
        <TouchableOpacity style={s.primary} onPress={discover} disabled={loading}><Text style={s.primaryText}>{loading?"Researching…":"Research again"}</Text></TouchableOpacity>
        {loading && <View style={s.card}><Text style={s.body}>Comparing known family information…</Text><Text style={s.body}>Preparing evidence…</Text></View>}
        {finding && <View style={s.card}>
          <Text style={s.badge}>DEMO / VERIFY SOURCES</Text>
          <Text style={s.finding}>{finding.person.givenName}</Text>
          <Text style={s.body}>Possible parent of Your Father</Text>
          <View style={s.confRow}><Text>Confidence</Text><Text style={{fontWeight:"800"}}>{finding.confidence}%</Text></View>
          <View style={s.track}><View style={[s.fill,{width:`${finding.confidence}%`}]}/></View>
          <Text style={s.section}>Reasoning</Text><Text style={s.body}>{finding.reasoning}</Text>
          <Text style={s.section}>Evidence</Text>
          {finding.evidence.map(e=><Text key={e.id} style={s.evidence}>✓ {e.title} — {e.source}</Text>)}
          <View style={s.actions}>
            <TouchableOpacity style={s.secondary} onPress={()=>setFinding(null)}><Text>Reject</Text></TouchableOpacity>
            <TouchableOpacity style={s.primarySmall} onPress={accept}><Text style={s.primaryText}>Accept</Text></TouchableOpacity>
          </View>
        </View>}
        {!finding&&!loading&&<View style={s.card}><Text style={s.finding}>No pending findings</Text><Text style={s.body}>Start research to generate a candidate.</Text></View>}
      </>}

      {screen==="person" && <>
        <TouchableOpacity onPress={()=>setScreen("tree")}><Text style={s.back}>‹ Back to tree</Text></TouchableOpacity>
        <View style={s.profile}>
          <View style={s.largeAvatar}><Text style={{fontSize:28}}>{selected.givenName[0]}</Text></View>
          <Text style={s.profileName}>{selected.givenName} {selected.familyName||""}</Text>
          <Text style={s.subtitle}>{selected.birthDate?`Born ${selected.birthDate}`:"Birth year unknown"}</Text>
        </View>
        <TouchableOpacity style={s.primary} onPress={discover}><Text style={s.primaryText}>Find possible ancestors</Text></TouchableOpacity>
      </>}

      <View style={s.nav}>
        {(["tree","discover","person"] as const).map(k=>
          <TouchableOpacity key={k} style={s.navItem} onPress={()=>setScreen(k)}>
            <Text style={screen===k?s.active:s.navText}>{k[0].toUpperCase()+k.slice(1)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>

    {adding&&<View style={s.overlay}>
      <View style={s.modal}>
        <Text style={s.modalTitle}>Add family member</Text>
        <TextInput style={s.input} placeholder="Full name" value={name} onChangeText={setName}/>
        <TextInput style={s.input} placeholder="Birth year (optional)" value={birth} onChangeText={setBirth} keyboardType="number-pad"/>
        <TouchableOpacity style={s.primary} onPress={addPerson}><Text style={s.primaryText}>Add person</Text></TouchableOpacity>
        <TouchableOpacity style={s.cancel} onPress={()=>setAdding(false)}><Text>Cancel</Text></TouchableOpacity>
      </View>
    </View>}
  </SafeAreaView>
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:"#F6F4EF"},container:{padding:20,paddingBottom:40},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:12},
  eyebrow:{fontSize:11,fontWeight:"800",letterSpacing:2.4,color:"#6B665D"},title:{fontSize:30,fontWeight:"800",color:"#191814",marginTop:4},
  subtitle:{fontSize:15,lineHeight:23,color:"#69655D",marginBottom:18},plus:{width:44,height:44,borderRadius:22,backgroundColor:"#191814",alignItems:"center",justifyContent:"center"},plusText:{color:"#FFF",fontSize:25},
  card:{backgroundColor:"#FFF",borderRadius:22,padding:18,marginBottom:14,borderWidth:1,borderColor:"#E5E0D7"},label:{fontSize:10,fontWeight:"800",letterSpacing:1.5,color:"#8A847A",marginBottom:14},
  row:{flexDirection:"row",gap:10},person:{flex:1,backgroundColor:"#F1EEE7",borderRadius:17,padding:13},avatar:{width:34,height:34,borderRadius:17,backgroundColor:"#DDD7CA",alignItems:"center",justifyContent:"center",marginBottom:8},
  personName:{fontWeight:"800",fontSize:15,color:"#24211C"},meta:{fontSize:12,color:"#777168",marginTop:3},arrow:{textAlign:"center",fontSize:20,color:"#9A948A",marginVertical:5},
  you:{alignItems:"center",backgroundColor:"#E7EEE8",borderRadius:18,padding:15,width:"70%",alignSelf:"center"},kicker:{fontSize:9,fontWeight:"800",letterSpacing:1.4,color:"#607363"},youName:{fontSize:18,fontWeight:"800",color:"#243328",marginTop:3},
  ancestor:{width:"82%",alignSelf:"center",backgroundColor:"#F8F3E4",borderRadius:16,padding:14},ai:{flexDirection:"row",alignItems:"center",backgroundColor:"#191814",borderRadius:20,padding:16},
  aiIcon:{color:"#FFF",fontSize:22,marginRight:12},aiTitle:{color:"#FFF",fontWeight:"800",fontSize:16},aiBody:{color:"#C9C6BD",fontSize:12,lineHeight:18,marginTop:3},chevron:{color:"#FFF",fontSize:28},
  primary:{backgroundColor:"#191814",borderRadius:14,padding:16,alignItems:"center",marginBottom:14},primarySmall:{backgroundColor:"#191814",borderRadius:13,paddingVertical:12,paddingHorizontal:18},primaryText:{color:"#FFF",fontWeight:"800"},
  secondary:{backgroundColor:"#ECE9E2",borderRadius:13,paddingVertical:12,paddingHorizontal:18},actions:{flexDirection:"row",justifyContent:"flex-end",gap:10,marginTop:16},
  badge:{alignSelf:"flex-start",backgroundColor:"#F8F3E4",color:"#8C7850",padding:7,borderRadius:7,fontSize:9,fontWeight:"900",marginBottom:10},finding:{fontSize:21,fontWeight:"800",color:"#191814",marginBottom:4},
  body:{color:"#6A655D",lineHeight:21},confRow:{flexDirection:"row",justifyContent:"space-between",marginTop:15},track:{height:8,backgroundColor:"#ECE9E2",borderRadius:4,overflow:"hidden",marginTop:8,marginBottom:12},fill:{height:8,backgroundColor:"#6E7D6D"},
  section:{fontSize:12,fontWeight:"800",marginTop:8,marginBottom:5},evidence:{color:"#4D5D4E",lineHeight:22},back:{marginBottom:14},profile:{backgroundColor:"#FFF",borderRadius:22,padding:22,alignItems:"center",marginBottom:14},
  largeAvatar:{width:72,height:72,borderRadius:36,backgroundColor:"#E7EEE8",alignItems:"center",justifyContent:"center",marginBottom:12},profileName:{fontSize:25,fontWeight:"800",marginBottom:5},
  nav:{flexDirection:"row",backgroundColor:"#FFF",borderRadius:18,padding:6,marginTop:18,borderWidth:1,borderColor:"#E5E0D7"},navItem:{flex:1,alignItems:"center",paddingVertical:11},navText:{fontSize:13,fontWeight:"700",color:"#999289"},active:{fontSize:13,fontWeight:"800",color:"#191814"},
  overlay:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:"rgba(20,19,16,.42)",justifyContent:"flex-end"},modal:{backgroundColor:"#FFF",borderTopLeftRadius:26,borderTopRightRadius:26,padding:22,paddingBottom:34},
  modalTitle:{fontSize:22,fontWeight:"800",marginBottom:16},input:{backgroundColor:"#F3F1EC",borderRadius:13,padding:14,marginBottom:10,fontSize:15},cancel:{alignItems:"center",padding:13}
});
