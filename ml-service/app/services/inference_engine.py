import hashlib
import json
from typing import Dict, Any
from app.schemas.ml_schemas import (
    SymptomRiskInput, SymptomRiskOutput,
    TriageInput, TriageOutput,
    ChronicRiskInput, ChronicRiskOutput,
    HospitalRecommendInput, HospitalRecommendOutput, HospitalRecommendation
)

def compute_input_hash(data: Dict[str, Any]) -> str:
    raw_bytes = json.dumps(data, sort_keys=True).encode("utf-8")
    return hashlib.sha256(raw_bytes).hexdigest()

class InferenceEngine:
    @staticmethod
    def predict_symptom_risk(input_data: SymptomRiskInput) -> SymptomRiskOutput:
        payload = input_data.model_dump()
        input_hash = compute_input_hash(payload)

        symptoms_lower = [s.lower() for s in input_data.symptoms]
        is_severe = input_data.severity.upper() == "SEVERE"
        
        red_flags = ["chest pain", "breathlessness", "unconscious", "severe bleeding", "rigid abdomen", "high fever with convulsion"]
        has_red_flag = any(rf in s for s in symptoms_lower for rf in red_flags)

        if has_red_flag or is_severe:
            risk_level = "CRITICAL" if has_red_flag else "HIGH"
            confidence = 0.92
            action = "Immediate medical evaluation required. Consult nearest PHC/District Hospital emergency room."
            conditions = ["Acute Emergency Condition", "Cardiovascular/Respiratory Distress"]
            probs = {"CRITICAL": 0.85, "HIGH": 0.10, "MEDIUM": 0.04, "LOW": 0.01}
        elif input_data.duration_days > 5:
            risk_level = "HIGH"
            confidence = 0.84
            action = "Priority consultation recommended within 24 hours."
            conditions = ["Subacute Clinical Illness", "Systemic Infection"]
            probs = {"CRITICAL": 0.05, "HIGH": 0.70, "MEDIUM": 0.20, "LOW": 0.05}
        else:
            risk_level = "MEDIUM" if len(symptoms_lower) >= 2 else "LOW"
            confidence = 0.88
            action = "Routine PHC consultation and symptomatic care."
            conditions = ["Viral Upper Respiratory Track Illness", "Mild Gastrointestinal Disturbance"]
            probs = {"CRITICAL": 0.01, "HIGH": 0.09, "MEDIUM": 0.40, "LOW": 0.50}

        return SymptomRiskOutput(
            input_hash=input_hash,
            risk_level=risk_level,
            confidence=confidence,
            probabilities=probs,
            possible_conditions=conditions,
            recommended_action=action
        )

    @staticmethod
    def predict_triage(input_data: TriageInput) -> TriageOutput:
        payload = input_data.model_dump()
        input_hash = compute_input_hash(payload)

        symptoms_lower = [s.lower() for s in input_data.symptoms]
        emergency_words = ["chest pain", "stroke", "severe abdominal pain", "head injury", "unconscious"]

        if any(w in s for s in symptoms_lower for w in emergency_words):
            return TriageOutput(
                input_hash=input_hash,
                priority="EMERGENCY",
                confidence=0.95,
                escalation_reason="Red flag symptom detected. Requires 108 Emergency Medical Response."
            )
        elif len(input_data.symptoms) >= 3 or input_data.duration_days >= 3:
            return TriageOutput(
                input_hash=input_hash,
                priority="HIGH",
                confidence=0.86,
                escalation_reason="Multiple acute symptoms present. Priority queue placement."
            )
        else:
            return TriageOutput(
                input_hash=input_hash,
                priority="NORMAL",
                confidence=0.90,
                escalation_reason="Routine consultation requirement."
            )

    @staticmethod
    def predict_chronic_risk(input_data: ChronicRiskInput) -> ChronicRiskOutput:
        payload = input_data.model_dump()
        input_hash = compute_input_hash(payload)

        score_diabetes = 0.1
        score_htn = 0.1
        factors = []

        if input_data.age > 45:
            score_diabetes += 0.25
            score_htn += 0.3
            factors.append("Age over 45")
        if input_data.blood_glucose and input_data.blood_glucose > 140:
            score_diabetes += 0.4
            factors.append("Elevated blood glucose (> 140 mg/dL)")
        if input_data.blood_pressure_systolic and input_data.blood_pressure_systolic > 135:
            score_htn += 0.4
            factors.append("Elevated systolic blood pressure (> 135 mmHg)")

        overall_score = max(score_diabetes, score_htn)
        category = "HIGH" if overall_score > 0.6 else ("MEDIUM" if overall_score > 0.3 else "LOW")

        return ChronicRiskOutput(
            input_hash=input_hash,
            diabetes_risk_score=round(min(score_diabetes, 0.99), 2),
            hypertension_risk_score=round(min(score_htn, 0.99), 2),
            overall_risk_category=category,
            contributing_factors=factors
        )
