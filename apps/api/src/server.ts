import express from "express";
import cors from "cors";

const app=express();
app.use(cors());
app.use(express.json());

app.get("/health",(_,res)=>res.json({ok:true,service:"ai-family-tree-api"}));

app.post("/research/ancestors",async(req,res)=>{
  const {personId}=req.body ?? {};
  if(!personId) return res.status(400).json({error:"personId is required"});
  res.json({
    findings:[],
    message:"Research provider not connected yet. Keep AI candidates unconfirmed until evidence is returned and reviewed."
  });
});

app.listen(process.env.PORT || 4000,()=>console.log("API listening on 4000"));
