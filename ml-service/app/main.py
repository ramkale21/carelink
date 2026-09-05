from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.ml_schemas import (
    SymptomRiskInput, SymptomRiskOutput,
    TriageInput, TriageOutput,
    ChronicRiskInput, ChronicRiskOutput
)
from app.services.inference_engine import InferenceEngine

app = FastAPI(
    title="CareLink ML & Decision Support Service",
    version="1.0.0",
    description="Python FastAPI Microservice for Clinical Triage, Symptom Risk, & Healthcare Recommendation Models"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "CareLink ML Engine",
        "version": "v1.0.0"
    }

@app.post("/ml/v1/symptom-risk/predict", response_model=SymptomRiskOutput)
def predict_symptom_risk(input_data: SymptomRiskInput):
    try:
        return InferenceEngine.predict_symptom_risk(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ml/v1/triage/predict", response_model=TriageOutput)
def predict_triage(input_data: TriageInput):
    try:
        return InferenceEngine.predict_triage(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ml/v1/risk/chronic-disease", response_model=ChronicRiskOutput)
def predict_chronic_risk(input_data: ChronicRiskInput):
    try:
        return InferenceEngine.predict_chronic_risk(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
