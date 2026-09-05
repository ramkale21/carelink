import prisma from "@/lib/prisma";
import { RiskLevel } from "@prisma/client";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export class MLService {
  /**
   * Symptom Risk Prediction (Calls FastAPI & persists immutable MLPrediction record)
   */
  static async predictSymptomRisk(patientId: string, payload: any) {
    try {
      const response = await fetch(`${ML_SERVICE_URL}/ml/v1/symptom-risk/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`ML Service returned HTTP ${response.status}`);
      }

      const prediction = await response.json();

      // Map risk string to Prisma RiskLevel enum
      let riskEnum: RiskLevel = RiskLevel.LOW;
      if (prediction.risk_level === "CRITICAL") riskEnum = RiskLevel.CRITICAL;
      else if (prediction.risk_level === "HIGH") riskEnum = RiskLevel.HIGH;
      else if (prediction.risk_level === "MEDIUM") riskEnum = RiskLevel.MEDIUM;

      // Persist prediction in DB for immutable auditing
      const savedPrediction = await prisma.mLPrediction.create({
        data: {
          patientId,
          modelName: prediction.model_name,
          modelVersion: prediction.model_version,
          inputHash: prediction.input_hash,
          prediction: prediction.probabilities,
          probability: prediction.confidence,
          riskLevel: riskEnum,
          explanation: {
            possible_conditions: prediction.possible_conditions,
            recommended_action: prediction.recommended_action,
          },
        },
      });

      return {
        predictionId: savedPrediction.id,
        ...prediction,
      };
    } catch (error: any) {
      console.warn("ML Service unavailable, falling back to local heuristic rule engine:", error?.message);
      
      // Fallback local heuristic
      return {
        model_name: "local-fallback-engine",
        model_version: "v1.0.0-fallback",
        input_hash: "fallback_hash",
        risk_level: payload.severity === "SEVERE" ? "HIGH" : "MEDIUM",
        confidence: 0.8,
        possible_conditions: ["Clinical Consultation Required"],
        recommended_action: "Schedule appointment with nearest PHC doctor.",
      };
    }
  }

  /**
   * Triage Priority Prediction
   */
  static async predictTriage(patientId: string, payload: any) {
    try {
      const response = await fetch(`${ML_SERVICE_URL}/ml/v1/triage/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`ML Service returned HTTP ${response.status}`);
      }

      const prediction = await response.json();

      let riskEnum: RiskLevel = RiskLevel.LOW;
      if (prediction.priority === "EMERGENCY") riskEnum = RiskLevel.CRITICAL;
      else if (prediction.priority === "HIGH") riskEnum = RiskLevel.HIGH;

      const savedPrediction = await prisma.mLPrediction.create({
        data: {
          patientId,
          modelName: prediction.model_name,
          modelVersion: prediction.model_version,
          inputHash: prediction.input_hash,
          prediction: { priority: prediction.priority },
          probability: prediction.confidence,
          riskLevel: riskEnum,
          explanation: { reason: prediction.escalation_reason },
        },
      });

      return {
        predictionId: savedPrediction.id,
        ...prediction,
      };
    } catch (error: any) {
      return {
        model_name: "triage-fallback-engine",
        model_version: "v1.0.0",
        priority: payload.symptoms?.length > 3 ? "HIGH" : "NORMAL",
        confidence: 0.75,
        escalation_reason: "Standard triage queue evaluation.",
      };
    }
  }

  /**
   * Chronic Disease Risk Assessment
   */
  static async predictChronicRisk(patientId: string, payload: any) {
    try {
      const response = await fetch(`${ML_SERVICE_URL}/ml/v1/risk/chronic-disease`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`ML Service returned HTTP ${response.status}`);
      }

      const prediction = await response.json();

      let riskEnum: RiskLevel = RiskLevel.LOW;
      if (prediction.overall_risk_category === "HIGH") riskEnum = RiskLevel.HIGH;
      else if (prediction.overall_risk_category === "MEDIUM") riskEnum = RiskLevel.MEDIUM;

      const savedPrediction = await prisma.mLPrediction.create({
        data: {
          patientId,
          modelName: prediction.model_name,
          modelVersion: prediction.model_version,
          inputHash: prediction.input_hash,
          prediction: {
            diabetes: prediction.diabetes_risk_score,
            hypertension: prediction.hypertension_risk_score,
          },
          probability: Math.max(prediction.diabetes_risk_score, prediction.hypertension_risk_score),
          riskLevel: riskEnum,
          explanation: { contributing_factors: prediction.contributing_factors },
        },
      });

      return {
        predictionId: savedPrediction.id,
        ...prediction,
      };
    } catch (error: any) {
      return {
        model_name: "chronic-fallback",
        model_version: "v1.0.0",
        overall_risk_category: "LOW",
        diabetes_risk_score: 0.15,
        hypertension_risk_score: 0.2,
        contributing_factors: [],
      };
    }
  }
}
