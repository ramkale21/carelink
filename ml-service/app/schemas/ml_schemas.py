from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SymptomRiskInput(BaseModel):
    age: int = Field(..., ge=0, le=120)
    gender: str
    symptoms: List[str]
    duration_days: int = Field(1, ge=1)
    severity: str = Field("MODERATE", description="LIGHT, MODERATE, SEVERE")
    vitals: Optional[Dict[str, Any]] = None
    medical_history: Optional[List[str]] = None

class SymptomRiskOutput(BaseModel):
    model_name: str = "symptom-risk-model"
    model_version: str = "v1.0.0"
    input_hash: str
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    confidence: float
    probabilities: Dict[str, float]
    possible_conditions: List[str]
    recommended_action: str
    disclaimer: str = "Decision support signal only. Does not constitute medical diagnosis."

class TriageInput(BaseModel):
    symptoms: List[str]
    vitals: Optional[Dict[str, Any]] = None
    age: int
    duration_days: int = 1

class TriageOutput(BaseModel):
    model_name: str = "triage-model"
    model_version: str = "v1.0.0"
    input_hash: str
    priority: str  # NORMAL, HIGH, EMERGENCY
    confidence: float
    escalation_reason: str

class ChronicRiskInput(BaseModel):
    age: int
    bmi: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    blood_glucose: Optional[float] = None
    family_history: Optional[List[str]] = None
    lifestyle_factors: Optional[List[str]] = None

class ChronicRiskOutput(BaseModel):
    model_name: str = "chronic-disease-risk-model"
    model_version: str = "v1.0.0"
    input_hash: str
    diabetes_risk_score: float
    hypertension_risk_score: float
    overall_risk_category: str
    contributing_factors: List[str]

class HospitalRecommendInput(BaseModel):
    patient_district: str
    required_specialty: str
    emergency_needed: bool = False
    max_distance_km: float = 50.0

class HospitalRecommendation(BaseModel):
    hospital_id: str
    name: str
    match_score: float
    reason: List[str]

class HospitalRecommendOutput(BaseModel):
    model_name: str = "hospital-recommendation-engine"
    model_version: str = "v1.0.0"
    recommendations: List[HospitalRecommendation]
