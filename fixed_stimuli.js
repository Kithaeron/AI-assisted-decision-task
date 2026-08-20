(() => {
  "use strict";

  // EVIDENCE_REQUIRED: 54 profiles are model-estimated candidate high-conflict cases, not empirically validated 50/50 cases.
  // Six profiles are deliberately designed obvious cases with intended directions, not observed banking ground truth.
  // The v3 fixed manifest supplied the base set; runtime code does not generate applicant data or cue values.
  // EVIDENCE_REQUIRED: actualOutcome is a legacy alias of modelEstimatedClass in this generated source.
  // The experiment runtime and CSV export do not read it or describe it as observed ground truth.
  // aiIsCorrect means synthetic AI/model agreement only; it is not empirical AI accuracy.
  const STIMULUS_SET_VERSION = "fixed-60-counterbalanced-six-obvious-v4";
  const FIXED_STIMULI = [
  {
    "trialId": "T001",
    "applicant": {
      "applicantId": "A001",
      "income": 82000,
      "loanAmount": 12000,
      "repaymentTermYears": 3,
      "creditScore": 820,
      "savings": 15000,
      "annualRepaymentBurdenPct": 4.9,
      "loanToIncomePct": 14.6,
      "savingsToLoanPct": 125,
      "affordabilitySignal": 0.854,
      "creditSignal": 1,
      "savingsSignal": 1,
      "modelLatentScore": 0.927,
      "modelEstimatedApprovalPropensity": 0.865,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 125% of the requested loan as evidence supporting APPROVE.",
        "metric": 125,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "stimulusType": "obvious_approve",
    "isObviousCase": true,
    "intendedObviousDirection": "APPROVE",
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T002",
    "applicant": {
      "applicantId": "A002",
      "income": 41000,
      "loanAmount": 8500,
      "repaymentTermYears": 2,
      "creditScore": 395,
      "savings": 4000,
      "annualRepaymentBurdenPct": 10.4,
      "loanToIncomePct": 20.7,
      "savingsToLoanPct": 47.1,
      "affordabilitySignal": -0.061,
      "creditSignal": -0.35,
      "savingsSignal": 0.902,
      "modelLatentScore": -0.018,
      "modelEstimatedApprovalPropensity": 0.491,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 395 / 1000 as evidence supporting REJECT.",
        "metric": 395,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T003",
    "applicant": {
      "applicantId": "A003",
      "income": 88000,
      "loanAmount": 12000,
      "repaymentTermYears": 2,
      "creditScore": 380,
      "savings": 500,
      "annualRepaymentBurdenPct": 6.8,
      "loanToIncomePct": 13.6,
      "savingsToLoanPct": 4.2,
      "affordabilitySignal": 0.53,
      "creditSignal": -0.4,
      "savingsSignal": -0.528,
      "modelLatentScore": 0.046,
      "modelEstimatedApprovalPropensity": 0.523,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 4.2% of the requested loan as evidence supporting REJECT.",
        "metric": 4.2,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T004",
    "applicant": {
      "applicantId": "A004",
      "income": 42000,
      "loanAmount": 9500,
      "repaymentTermYears": 2,
      "creditScore": 635,
      "savings": 500,
      "annualRepaymentBurdenPct": 11.3,
      "loanToIncomePct": 22.6,
      "savingsToLoanPct": 5.3,
      "affordabilitySignal": -0.218,
      "creditSignal": 0.45,
      "savingsSignal": -0.491,
      "modelLatentScore": -0.025,
      "modelEstimatedApprovalPropensity": 0.487,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 5.3% of the requested loan as evidence supporting REJECT.",
        "metric": 5.3,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T005",
    "applicant": {
      "applicantId": "A005",
      "income": 86000,
      "loanAmount": 38000,
      "repaymentTermYears": 5,
      "creditScore": 370,
      "savings": 13000,
      "annualRepaymentBurdenPct": 8.8,
      "loanToIncomePct": 44.2,
      "savingsToLoanPct": 34.2,
      "affordabilitySignal": 0.194,
      "creditSignal": -0.433,
      "savingsSignal": 0.474,
      "modelLatentScore": 0.016,
      "modelEstimatedApprovalPropensity": 0.508,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 34.2% of the requested loan as evidence supporting APPROVE.",
        "metric": 34.2,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T006",
    "applicant": {
      "applicantId": "A006",
      "income": 84000,
      "loanAmount": 20500,
      "repaymentTermYears": 2,
      "creditScore": 535,
      "savings": 9000,
      "annualRepaymentBurdenPct": 12.2,
      "loanToIncomePct": 24.4,
      "savingsToLoanPct": 43.9,
      "affordabilitySignal": -0.367,
      "creditSignal": 0.117,
      "savingsSignal": 0.797,
      "modelLatentScore": -0.023,
      "modelEstimatedApprovalPropensity": 0.488,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 12.2% of income as evidence supporting REJECT.",
        "metric": 12.2,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T007",
    "applicant": {
      "applicantId": "A007",
      "income": 90000,
      "loanAmount": 30500,
      "repaymentTermYears": 3,
      "creditScore": 635,
      "savings": 5500,
      "annualRepaymentBurdenPct": 11.3,
      "loanToIncomePct": 33.9,
      "savingsToLoanPct": 18,
      "affordabilitySignal": -0.216,
      "creditSignal": 0.45,
      "savingsSignal": -0.066,
      "modelLatentScore": 0.04,
      "modelEstimatedApprovalPropensity": 0.52,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 635 / 1000 as evidence supporting APPROVE.",
        "metric": 635,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T008",
    "applicant": {
      "applicantId": "A008",
      "income": 67000,
      "loanAmount": 18000,
      "repaymentTermYears": 3,
      "creditScore": 370,
      "savings": 5500,
      "annualRepaymentBurdenPct": 9,
      "loanToIncomePct": 26.9,
      "savingsToLoanPct": 30.6,
      "affordabilitySignal": 0.174,
      "creditSignal": -0.433,
      "savingsSignal": 0.352,
      "modelLatentScore": -0.012,
      "modelEstimatedApprovalPropensity": 0.494,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 30.6% of the requested loan as evidence supporting APPROVE.",
        "metric": 30.6,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T009",
    "applicant": {
      "applicantId": "A009",
      "income": 55000,
      "loanAmount": 23500,
      "repaymentTermYears": 5,
      "creditScore": 465,
      "savings": 1500,
      "annualRepaymentBurdenPct": 8.5,
      "loanToIncomePct": 42.7,
      "savingsToLoanPct": 6.4,
      "affordabilitySignal": 0.242,
      "creditSignal": -0.117,
      "savingsSignal": -0.454,
      "modelLatentScore": 0.012,
      "modelEstimatedApprovalPropensity": 0.506,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 8.5% of income as evidence supporting APPROVE.",
        "metric": 8.5,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T010",
    "applicant": {
      "applicantId": "A010",
      "income": 55000,
      "loanAmount": 37000,
      "repaymentTermYears": 5,
      "creditScore": 640,
      "savings": 11500,
      "annualRepaymentBurdenPct": 13.5,
      "loanToIncomePct": 67.3,
      "savingsToLoanPct": 31.1,
      "affordabilitySignal": -0.576,
      "creditSignal": 0.467,
      "savingsSignal": 0.369,
      "modelLatentScore": -0.069,
      "modelEstimatedApprovalPropensity": 0.465,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 13.5% of income as evidence supporting REJECT.",
        "metric": 13.5,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T011",
    "applicant": {
      "applicantId": "A011",
      "income": 38000,
      "loanAmount": 11500,
      "repaymentTermYears": 4,
      "creditScore": 380,
      "savings": 1500,
      "annualRepaymentBurdenPct": 7.6,
      "loanToIncomePct": 30.3,
      "savingsToLoanPct": 13,
      "affordabilitySignal": 0.406,
      "creditSignal": -0.4,
      "savingsSignal": -0.232,
      "modelLatentScore": 0.028,
      "modelEstimatedApprovalPropensity": 0.514,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 7.6% of income as evidence supporting APPROVE.",
        "metric": 7.6,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T012",
    "applicant": {
      "applicantId": "A012",
      "income": 38000,
      "loanAmount": 30000,
      "repaymentTermYears": 2,
      "creditScore": 260,
      "savings": 500,
      "annualRepaymentBurdenPct": 39.5,
      "loanToIncomePct": 78.9,
      "savingsToLoanPct": 1.7,
      "affordabilitySignal": -1,
      "creditSignal": -0.8,
      "savingsSignal": -0.611,
      "modelLatentScore": -0.872,
      "modelEstimatedApprovalPropensity": 0.149,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 39.5% of income as evidence supporting REJECT.",
        "metric": 39.5,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "stimulusType": "obvious_reject",
    "isObviousCase": true,
    "intendedObviousDirection": "REJECT",
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T013",
    "applicant": {
      "applicantId": "A013",
      "income": 41000,
      "loanAmount": 19000,
      "repaymentTermYears": 5,
      "creditScore": 360,
      "savings": 8500,
      "annualRepaymentBurdenPct": 9.3,
      "loanToIncomePct": 46.3,
      "savingsToLoanPct": 44.7,
      "affordabilitySignal": 0.122,
      "creditSignal": -0.467,
      "savingsSignal": 0.825,
      "modelLatentScore": 0.021,
      "modelEstimatedApprovalPropensity": 0.511,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 360 / 1000 as evidence supporting REJECT.",
        "metric": 360,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T014",
    "applicant": {
      "applicantId": "A014",
      "income": 55000,
      "loanAmount": 12000,
      "repaymentTermYears": 2,
      "creditScore": 495,
      "savings": 3000,
      "annualRepaymentBurdenPct": 10.9,
      "loanToIncomePct": 21.8,
      "savingsToLoanPct": 25,
      "affordabilitySignal": -0.152,
      "creditSignal": -0.017,
      "savingsSignal": 0.167,
      "modelLatentScore": -0.057,
      "modelEstimatedApprovalPropensity": 0.472,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 10.9% of income as evidence supporting REJECT.",
        "metric": 10.9,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T015",
    "applicant": {
      "applicantId": "A015",
      "income": 68000,
      "loanAmount": 30000,
      "repaymentTermYears": 4,
      "creditScore": 500,
      "savings": 12500,
      "annualRepaymentBurdenPct": 11,
      "loanToIncomePct": 44.1,
      "savingsToLoanPct": 41.7,
      "affordabilitySignal": -0.172,
      "creditSignal": 0,
      "savingsSignal": 0.722,
      "modelLatentScore": 0.023,
      "modelEstimatedApprovalPropensity": 0.511,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 41.7% of the requested loan as evidence supporting APPROVE.",
        "metric": 41.7,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T016",
    "applicant": {
      "applicantId": "A016",
      "income": 75000,
      "loanAmount": 38000,
      "repaymentTermYears": 5,
      "creditScore": 555,
      "savings": 2000,
      "annualRepaymentBurdenPct": 10.1,
      "loanToIncomePct": 50.7,
      "savingsToLoanPct": 5.3,
      "affordabilitySignal": -0.022,
      "creditSignal": 0.183,
      "savingsSignal": -0.491,
      "modelLatentScore": -0.021,
      "modelEstimatedApprovalPropensity": 0.49,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 5.3% of the requested loan as evidence supporting REJECT.",
        "metric": 5.3,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T017",
    "applicant": {
      "applicantId": "A017",
      "income": 90000,
      "loanAmount": 28000,
      "repaymentTermYears": 4,
      "creditScore": 400,
      "savings": 2500,
      "annualRepaymentBurdenPct": 7.8,
      "loanToIncomePct": 31.1,
      "savingsToLoanPct": 8.9,
      "affordabilitySignal": 0.37,
      "creditSignal": -0.333,
      "savingsSignal": -0.369,
      "modelLatentScore": 0.013,
      "modelEstimatedApprovalPropensity": 0.507,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 7.8% of income as evidence supporting APPROVE.",
        "metric": 7.8,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T018",
    "applicant": {
      "applicantId": "A018",
      "income": 38000,
      "loanAmount": 22500,
      "repaymentTermYears": 5,
      "creditScore": 640,
      "savings": 3500,
      "annualRepaymentBurdenPct": 11.8,
      "loanToIncomePct": 59.2,
      "savingsToLoanPct": 15.6,
      "affordabilitySignal": -0.307,
      "creditSignal": 0.467,
      "savingsSignal": -0.148,
      "modelLatentScore": -0.012,
      "modelEstimatedApprovalPropensity": 0.494,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 640 / 1000 as evidence supporting APPROVE.",
        "metric": 640,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T019",
    "applicant": {
      "applicantId": "A019",
      "income": 65000,
      "loanAmount": 19500,
      "repaymentTermYears": 3,
      "creditScore": 565,
      "savings": 1500,
      "annualRepaymentBurdenPct": 10,
      "loanToIncomePct": 30,
      "savingsToLoanPct": 7.7,
      "affordabilitySignal": 0,
      "creditSignal": 0.217,
      "savingsSignal": -0.41,
      "modelLatentScore": 0.014,
      "modelEstimatedApprovalPropensity": 0.507,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 565 / 1000 as evidence supporting APPROVE.",
        "metric": 565,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T020",
    "applicant": {
      "applicantId": "A020",
      "income": 89000,
      "loanAmount": 28500,
      "repaymentTermYears": 3,
      "creditScore": 410,
      "savings": 12500,
      "annualRepaymentBurdenPct": 10.7,
      "loanToIncomePct": 32,
      "savingsToLoanPct": 43.9,
      "affordabilitySignal": -0.112,
      "creditSignal": -0.3,
      "savingsSignal": 0.795,
      "modelLatentScore": -0.042,
      "modelEstimatedApprovalPropensity": 0.479,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 410 / 1000 as evidence supporting REJECT.",
        "metric": 410,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T021",
    "applicant": {
      "applicantId": "A021",
      "income": 90000,
      "loanAmount": 15000,
      "repaymentTermYears": 4,
      "creditScore": 790,
      "savings": 18000,
      "annualRepaymentBurdenPct": 4.2,
      "loanToIncomePct": 16.7,
      "savingsToLoanPct": 120,
      "affordabilitySignal": 0.972,
      "creditSignal": 0.967,
      "savingsSignal": 1,
      "modelLatentScore": 0.974,
      "modelEstimatedApprovalPropensity": 0.875,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 120% of the requested loan as evidence supporting APPROVE.",
        "metric": 120,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "stimulusType": "obvious_approve",
    "isObviousCase": true,
    "intendedObviousDirection": "APPROVE",
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T022",
    "applicant": {
      "applicantId": "A022",
      "income": 47000,
      "loanAmount": 15500,
      "repaymentTermYears": 3,
      "creditScore": 465,
      "savings": 6500,
      "annualRepaymentBurdenPct": 11,
      "loanToIncomePct": 33,
      "savingsToLoanPct": 41.9,
      "affordabilitySignal": -0.165,
      "creditSignal": -0.117,
      "savingsSignal": 0.731,
      "modelLatentScore": -0.014,
      "modelEstimatedApprovalPropensity": 0.493,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 11% of income as evidence supporting REJECT.",
        "metric": 11,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T023",
    "applicant": {
      "applicantId": "A023",
      "income": 76000,
      "loanAmount": 18000,
      "repaymentTermYears": 2,
      "creditScore": 635,
      "savings": 4000,
      "annualRepaymentBurdenPct": 11.8,
      "loanToIncomePct": 23.7,
      "savingsToLoanPct": 22.2,
      "affordabilitySignal": -0.307,
      "creditSignal": 0.45,
      "savingsSignal": 0.074,
      "modelLatentScore": 0.015,
      "modelEstimatedApprovalPropensity": 0.508,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 11.8% of income as evidence supporting REJECT.",
        "metric": 11.8,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T024",
    "applicant": {
      "applicantId": "A024",
      "income": 43000,
      "loanAmount": 11500,
      "repaymentTermYears": 2,
      "creditScore": 625,
      "savings": 5000,
      "annualRepaymentBurdenPct": 13.4,
      "loanToIncomePct": 26.7,
      "savingsToLoanPct": 43.5,
      "affordabilitySignal": -0.562,
      "creditSignal": 0.417,
      "savingsSignal": 0.783,
      "modelLatentScore": -0.018,
      "modelEstimatedApprovalPropensity": 0.491,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 13.4% of income as evidence supporting REJECT.",
        "metric": 13.4,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T025",
    "applicant": {
      "applicantId": "A025",
      "income": 60000,
      "loanAmount": 26500,
      "repaymentTermYears": 4,
      "creditScore": 600,
      "savings": 5500,
      "annualRepaymentBurdenPct": 11,
      "loanToIncomePct": 44.2,
      "savingsToLoanPct": 20.8,
      "affordabilitySignal": -0.174,
      "creditSignal": 0.333,
      "savingsSignal": 0.025,
      "modelLatentScore": 0.034,
      "modelEstimatedApprovalPropensity": 0.517,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 600 / 1000 as evidence supporting APPROVE.",
        "metric": 600,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T026",
    "applicant": {
      "applicantId": "A026",
      "income": 78000,
      "loanAmount": 25500,
      "repaymentTermYears": 3,
      "creditScore": 515,
      "savings": 7000,
      "annualRepaymentBurdenPct": 10.9,
      "loanToIncomePct": 32.7,
      "savingsToLoanPct": 27.5,
      "affordabilitySignal": -0.15,
      "creditSignal": 0.05,
      "savingsSignal": 0.248,
      "modelLatentScore": -0.02,
      "modelEstimatedApprovalPropensity": 0.49,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 10.9% of income as evidence supporting REJECT.",
        "metric": 10.9,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T027",
    "applicant": {
      "applicantId": "A027",
      "income": 44000,
      "loanAmount": 27000,
      "repaymentTermYears": 5,
      "creditScore": 570,
      "savings": 12000,
      "annualRepaymentBurdenPct": 12.3,
      "loanToIncomePct": 61.4,
      "savingsToLoanPct": 44.4,
      "affordabilitySignal": -0.379,
      "creditSignal": 0.233,
      "savingsSignal": 0.815,
      "modelLatentScore": 0.014,
      "modelEstimatedApprovalPropensity": 0.507,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 44.4% of the requested loan as evidence supporting APPROVE.",
        "metric": 44.4,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T028",
    "applicant": {
      "applicantId": "A028",
      "income": 36000,
      "loanAmount": 12000,
      "repaymentTermYears": 3,
      "creditScore": 545,
      "savings": 2000,
      "annualRepaymentBurdenPct": 11.1,
      "loanToIncomePct": 33.3,
      "savingsToLoanPct": 16.7,
      "affordabilitySignal": -0.185,
      "creditSignal": 0.15,
      "savingsSignal": -0.111,
      "modelLatentScore": -0.057,
      "modelEstimatedApprovalPropensity": 0.472,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 545 / 1000 as evidence supporting APPROVE.",
        "metric": 545,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T029",
    "applicant": {
      "applicantId": "A029",
      "income": 61000,
      "loanAmount": 26500,
      "repaymentTermYears": 5,
      "creditScore": 385,
      "savings": 7500,
      "annualRepaymentBurdenPct": 8.7,
      "loanToIncomePct": 43.4,
      "savingsToLoanPct": 28.3,
      "affordabilitySignal": 0.219,
      "creditSignal": -0.383,
      "savingsSignal": 0.277,
      "modelLatentScore": 0.017,
      "modelEstimatedApprovalPropensity": 0.508,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 28.3% of the requested loan as evidence supporting APPROVE.",
        "metric": 28.3,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T030",
    "applicant": {
      "applicantId": "A030",
      "income": 52000,
      "loanAmount": 13000,
      "repaymentTermYears": 3,
      "creditScore": 435,
      "savings": 500,
      "annualRepaymentBurdenPct": 8.3,
      "loanToIncomePct": 25,
      "savingsToLoanPct": 3.8,
      "affordabilitySignal": 0.278,
      "creditSignal": -0.217,
      "savingsSignal": -0.538,
      "modelLatentScore": -0.018,
      "modelEstimatedApprovalPropensity": 0.491,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 3.8% of the requested loan as evidence supporting REJECT.",
        "metric": 3.8,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T031",
    "applicant": {
      "applicantId": "A031",
      "income": 52000,
      "loanAmount": 19500,
      "repaymentTermYears": 4,
      "creditScore": 450,
      "savings": 5000,
      "annualRepaymentBurdenPct": 9.4,
      "loanToIncomePct": 37.5,
      "savingsToLoanPct": 25.6,
      "affordabilitySignal": 0.104,
      "creditSignal": -0.167,
      "savingsSignal": 0.188,
      "modelLatentScore": 0.022,
      "modelEstimatedApprovalPropensity": 0.511,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 25.6% of the requested loan as evidence supporting APPROVE.",
        "metric": 25.6,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T032",
    "applicant": {
      "applicantId": "A032",
      "income": 42000,
      "loanAmount": 32000,
      "repaymentTermYears": 2,
      "creditScore": 280,
      "savings": 1000,
      "annualRepaymentBurdenPct": 38.1,
      "loanToIncomePct": 76.2,
      "savingsToLoanPct": 3.1,
      "affordabilitySignal": -1,
      "creditSignal": -0.733,
      "savingsSignal": -0.563,
      "modelLatentScore": -0.841,
      "modelEstimatedApprovalPropensity": 0.157,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 3.1% of the requested loan as evidence supporting REJECT.",
        "metric": 3.1,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "stimulusType": "obvious_reject",
    "isObviousCase": true,
    "intendedObviousDirection": "REJECT",
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T033",
    "applicant": {
      "applicantId": "A033",
      "income": 89000,
      "loanAmount": 15500,
      "repaymentTermYears": 2,
      "creditScore": 360,
      "savings": 5500,
      "annualRepaymentBurdenPct": 8.7,
      "loanToIncomePct": 17.4,
      "savingsToLoanPct": 35.5,
      "affordabilitySignal": 0.215,
      "creditSignal": -0.467,
      "savingsSignal": 0.516,
      "modelLatentScore": 0.022,
      "modelEstimatedApprovalPropensity": 0.511,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 360 / 1000 as evidence supporting REJECT.",
        "metric": 360,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T034",
    "applicant": {
      "applicantId": "A034",
      "income": 82000,
      "loanAmount": 21500,
      "repaymentTermYears": 3,
      "creditScore": 435,
      "savings": 2500,
      "annualRepaymentBurdenPct": 8.7,
      "loanToIncomePct": 26.2,
      "savingsToLoanPct": 11.6,
      "affordabilitySignal": 0.21,
      "creditSignal": -0.217,
      "savingsSignal": -0.279,
      "modelLatentScore": -0.013,
      "modelEstimatedApprovalPropensity": 0.494,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 11.6% of the requested loan as evidence supporting REJECT.",
        "metric": 11.6,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T035",
    "applicant": {
      "applicantId": "A035",
      "income": 65000,
      "loanAmount": 18000,
      "repaymentTermYears": 4,
      "creditScore": 365,
      "savings": 1000,
      "annualRepaymentBurdenPct": 6.9,
      "loanToIncomePct": 27.7,
      "savingsToLoanPct": 5.6,
      "affordabilitySignal": 0.513,
      "creditSignal": -0.45,
      "savingsSignal": -0.481,
      "modelLatentScore": 0.027,
      "modelEstimatedApprovalPropensity": 0.513,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 6.9% of income as evidence supporting APPROVE.",
        "metric": 6.9,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T036",
    "applicant": {
      "applicantId": "A036",
      "income": 90000,
      "loanAmount": 19000,
      "repaymentTermYears": 2,
      "creditScore": 585,
      "savings": 1000,
      "annualRepaymentBurdenPct": 10.6,
      "loanToIncomePct": 21.1,
      "savingsToLoanPct": 5.3,
      "affordabilitySignal": -0.093,
      "creditSignal": 0.283,
      "savingsSignal": -0.491,
      "modelLatentScore": -0.021,
      "modelEstimatedApprovalPropensity": 0.49,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 5.3% of the requested loan as evidence supporting REJECT.",
        "metric": 5.3,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T037",
    "applicant": {
      "applicantId": "A037",
      "income": 80000,
      "loanAmount": 33500,
      "repaymentTermYears": 5,
      "creditScore": 425,
      "savings": 5000,
      "annualRepaymentBurdenPct": 8.4,
      "loanToIncomePct": 41.9,
      "savingsToLoanPct": 14.9,
      "affordabilitySignal": 0.271,
      "creditSignal": -0.25,
      "savingsSignal": -0.169,
      "modelLatentScore": 0.023,
      "modelEstimatedApprovalPropensity": 0.511,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 8.4% of income as evidence supporting APPROVE.",
        "metric": 8.4,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T038",
    "applicant": {
      "applicantId": "A038",
      "income": 37000,
      "loanAmount": 20500,
      "repaymentTermYears": 5,
      "creditScore": 500,
      "savings": 6500,
      "annualRepaymentBurdenPct": 11.1,
      "loanToIncomePct": 55.4,
      "savingsToLoanPct": 31.7,
      "affordabilitySignal": -0.18,
      "creditSignal": 0,
      "savingsSignal": 0.39,
      "modelLatentScore": -0.032,
      "modelEstimatedApprovalPropensity": 0.484,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 31.7% of the requested loan as evidence supporting APPROVE.",
        "metric": 31.7,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T039",
    "applicant": {
      "applicantId": "A039",
      "income": 57000,
      "loanAmount": 8000,
      "repaymentTermYears": 2,
      "creditScore": 360,
      "savings": 1000,
      "annualRepaymentBurdenPct": 7,
      "loanToIncomePct": 14,
      "savingsToLoanPct": 12.5,
      "affordabilitySignal": 0.497,
      "creditSignal": -0.467,
      "savingsSignal": -0.25,
      "modelLatentScore": 0.048,
      "modelEstimatedApprovalPropensity": 0.524,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 7% of income as evidence supporting APPROVE.",
        "metric": 7,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T040",
    "applicant": {
      "applicantId": "A040",
      "income": 45000,
      "loanAmount": 17000,
      "repaymentTermYears": 3,
      "creditScore": 635,
      "savings": 4500,
      "annualRepaymentBurdenPct": 12.6,
      "loanToIncomePct": 37.8,
      "savingsToLoanPct": 26.5,
      "affordabilitySignal": -0.432,
      "creditSignal": 0.45,
      "savingsSignal": 0.216,
      "modelLatentScore": -0.026,
      "modelEstimatedApprovalPropensity": 0.487,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 12.6% of income as evidence supporting REJECT.",
        "metric": 12.6,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T041",
    "applicant": {
      "applicantId": "A041",
      "income": 74000,
      "loanAmount": 9000,
      "repaymentTermYears": 3,
      "creditScore": 760,
      "savings": 14000,
      "annualRepaymentBurdenPct": 4.1,
      "loanToIncomePct": 12.2,
      "savingsToLoanPct": 155.6,
      "affordabilitySignal": 0.991,
      "creditSignal": 0.867,
      "savingsSignal": 1,
      "modelLatentScore": 0.949,
      "modelEstimatedApprovalPropensity": 0.87,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 155.6% of the requested loan as evidence supporting APPROVE.",
        "metric": 155.6,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "stimulusType": "obvious_approve",
    "isObviousCase": true,
    "intendedObviousDirection": "APPROVE",
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T042",
    "applicant": {
      "applicantId": "A042",
      "income": 47000,
      "loanAmount": 19000,
      "repaymentTermYears": 5,
      "creditScore": 370,
      "savings": 3000,
      "annualRepaymentBurdenPct": 8.1,
      "loanToIncomePct": 40.4,
      "savingsToLoanPct": 15.8,
      "affordabilitySignal": 0.319,
      "creditSignal": -0.433,
      "savingsSignal": -0.14,
      "modelLatentScore": -0.013,
      "modelEstimatedApprovalPropensity": 0.493,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 370 / 1000 as evidence supporting REJECT.",
        "metric": 370,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T043",
    "applicant": {
      "applicantId": "A043",
      "income": 78000,
      "loanAmount": 34000,
      "repaymentTermYears": 4,
      "creditScore": 640,
      "savings": 3000,
      "annualRepaymentBurdenPct": 10.9,
      "loanToIncomePct": 43.6,
      "savingsToLoanPct": 8.8,
      "affordabilitySignal": -0.15,
      "creditSignal": 0.467,
      "savingsSignal": -0.373,
      "modelLatentScore": 0.033,
      "modelEstimatedApprovalPropensity": 0.516,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 8.8% of the requested loan as evidence supporting REJECT.",
        "metric": 8.8,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T044",
    "applicant": {
      "applicantId": "A044",
      "income": 64000,
      "loanAmount": 35500,
      "repaymentTermYears": 5,
      "creditScore": 485,
      "savings": 12000,
      "annualRepaymentBurdenPct": 11.1,
      "loanToIncomePct": 55.5,
      "savingsToLoanPct": 33.8,
      "affordabilitySignal": -0.182,
      "creditSignal": -0.05,
      "savingsSignal": 0.46,
      "modelLatentScore": -0.04,
      "modelEstimatedApprovalPropensity": 0.48,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 11.1% of income as evidence supporting REJECT.",
        "metric": 11.1,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T045",
    "applicant": {
      "applicantId": "A045",
      "income": 88000,
      "loanAmount": 33000,
      "repaymentTermYears": 3,
      "creditScore": 595,
      "savings": 14000,
      "annualRepaymentBurdenPct": 12.5,
      "loanToIncomePct": 37.5,
      "savingsToLoanPct": 42.4,
      "affordabilitySignal": -0.417,
      "creditSignal": 0.317,
      "savingsSignal": 0.747,
      "modelLatentScore": 0.015,
      "modelEstimatedApprovalPropensity": 0.507,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 42.4% of the requested loan as evidence supporting APPROVE.",
        "metric": 42.4,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T046",
    "applicant": {
      "applicantId": "A046",
      "income": 56000,
      "loanAmount": 31000,
      "repaymentTermYears": 5,
      "creditScore": 580,
      "savings": 4000,
      "annualRepaymentBurdenPct": 11.1,
      "loanToIncomePct": 55.4,
      "savingsToLoanPct": 12.9,
      "affordabilitySignal": -0.179,
      "creditSignal": 0.267,
      "savingsSignal": -0.237,
      "modelLatentScore": -0.031,
      "modelEstimatedApprovalPropensity": 0.484,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 12.9% of the requested loan as evidence supporting REJECT.",
        "metric": 12.9,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T047",
    "applicant": {
      "applicantId": "A047",
      "income": 39000,
      "loanAmount": 10500,
      "repaymentTermYears": 3,
      "creditScore": 400,
      "savings": 3000,
      "annualRepaymentBurdenPct": 9,
      "loanToIncomePct": 26.9,
      "savingsToLoanPct": 28.6,
      "affordabilitySignal": 0.171,
      "creditSignal": -0.333,
      "savingsSignal": 0.286,
      "modelLatentScore": 0.012,
      "modelEstimatedApprovalPropensity": 0.506,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 28.6% of the requested loan as evidence supporting APPROVE.",
        "metric": 28.6,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T048",
    "applicant": {
      "applicantId": "A048",
      "income": 64000,
      "loanAmount": 16000,
      "repaymentTermYears": 2,
      "creditScore": 585,
      "savings": 6000,
      "annualRepaymentBurdenPct": 12.5,
      "loanToIncomePct": 25,
      "savingsToLoanPct": 37.5,
      "affordabilitySignal": -0.417,
      "creditSignal": 0.283,
      "savingsSignal": 0.583,
      "modelLatentScore": -0.022,
      "modelEstimatedApprovalPropensity": 0.489,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 37.5% of the requested loan as evidence supporting APPROVE.",
        "metric": 37.5,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T049",
    "applicant": {
      "applicantId": "A049",
      "income": 77000,
      "loanAmount": 27000,
      "repaymentTermYears": 4,
      "creditScore": 365,
      "savings": 9000,
      "annualRepaymentBurdenPct": 8.8,
      "loanToIncomePct": 35.1,
      "savingsToLoanPct": 33.3,
      "affordabilitySignal": 0.206,
      "creditSignal": -0.45,
      "savingsSignal": 0.444,
      "modelLatentScore": 0.012,
      "modelEstimatedApprovalPropensity": 0.506,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 33.3% of the requested loan as evidence supporting APPROVE.",
        "metric": 33.3,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T050",
    "applicant": {
      "applicantId": "A050",
      "income": 73000,
      "loanAmount": 13000,
      "repaymentTermYears": 2,
      "creditScore": 415,
      "savings": 2500,
      "annualRepaymentBurdenPct": 8.9,
      "loanToIncomePct": 17.8,
      "savingsToLoanPct": 19.2,
      "affordabilitySignal": 0.183,
      "creditSignal": -0.283,
      "savingsSignal": -0.026,
      "modelLatentScore": -0.012,
      "modelEstimatedApprovalPropensity": 0.494,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the applicant's credit score of 415 / 1000 as evidence supporting REJECT.",
        "metric": 415,
        "metricName": "credit_score"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T051",
    "applicant": {
      "applicantId": "A051",
      "income": 71000,
      "loanAmount": 25500,
      "repaymentTermYears": 4,
      "creditScore": 500,
      "savings": 1500,
      "annualRepaymentBurdenPct": 9,
      "loanToIncomePct": 35.9,
      "savingsToLoanPct": 5.9,
      "affordabilitySignal": 0.17,
      "creditSignal": 0,
      "savingsSignal": -0.471,
      "modelLatentScore": 0.015,
      "modelEstimatedApprovalPropensity": 0.507,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 9% of income as evidence supporting APPROVE.",
        "metric": 9,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T052",
    "applicant": {
      "applicantId": "A052",
      "income": 45000,
      "loanAmount": 35000,
      "repaymentTermYears": 2,
      "creditScore": 300,
      "savings": 1000,
      "annualRepaymentBurdenPct": 38.9,
      "loanToIncomePct": 77.8,
      "savingsToLoanPct": 2.9,
      "affordabilitySignal": -1,
      "creditSignal": -0.667,
      "savingsSignal": -0.571,
      "modelLatentScore": -0.819,
      "modelEstimatedApprovalPropensity": 0.163,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 38.9% of income as evidence supporting REJECT.",
        "metric": 38.9,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "stimulusType": "obvious_reject",
    "isObviousCase": true,
    "intendedObviousDirection": "REJECT",
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T053",
    "applicant": {
      "applicantId": "A053",
      "income": 66000,
      "loanAmount": 12000,
      "repaymentTermYears": 2,
      "creditScore": 525,
      "savings": 500,
      "annualRepaymentBurdenPct": 9.1,
      "loanToIncomePct": 18.2,
      "savingsToLoanPct": 4.2,
      "affordabilitySignal": 0.152,
      "creditSignal": 0.083,
      "savingsSignal": -0.528,
      "modelLatentScore": 0.026,
      "modelEstimatedApprovalPropensity": 0.513,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 4.2% of the requested loan as evidence supporting REJECT.",
        "metric": 4.2,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T054",
    "applicant": {
      "applicantId": "A054",
      "income": 36000,
      "loanAmount": 8500,
      "repaymentTermYears": 2,
      "creditScore": 520,
      "savings": 3000,
      "annualRepaymentBurdenPct": 11.8,
      "loanToIncomePct": 23.6,
      "savingsToLoanPct": 35.3,
      "affordabilitySignal": -0.301,
      "creditSignal": 0.067,
      "savingsSignal": 0.51,
      "modelLatentScore": -0.051,
      "modelEstimatedApprovalPropensity": 0.475,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 11.8% of income as evidence supporting REJECT.",
        "metric": 11.8,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T055",
    "applicant": {
      "applicantId": "A055",
      "income": 60000,
      "loanAmount": 22000,
      "repaymentTermYears": 4,
      "creditScore": 395,
      "savings": 10000,
      "annualRepaymentBurdenPct": 9.2,
      "loanToIncomePct": 36.7,
      "savingsToLoanPct": 45.5,
      "affordabilitySignal": 0.139,
      "creditSignal": -0.35,
      "savingsSignal": 0.848,
      "modelLatentScore": 0.074,
      "modelEstimatedApprovalPropensity": 0.537,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 45.5% of the requested loan as evidence supporting APPROVE.",
        "metric": 45.5,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T056",
    "applicant": {
      "applicantId": "A056",
      "income": 90000,
      "loanAmount": 23000,
      "repaymentTermYears": 2,
      "creditScore": 625,
      "savings": 8000,
      "annualRepaymentBurdenPct": 12.8,
      "loanToIncomePct": 25.6,
      "savingsToLoanPct": 34.8,
      "affordabilitySignal": -0.463,
      "creditSignal": 0.417,
      "savingsSignal": 0.493,
      "modelLatentScore": -0.012,
      "modelEstimatedApprovalPropensity": 0.494,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated the estimated annual principal repayment burden of 12.8% of income as evidence supporting REJECT.",
        "metric": 12.8,
        "metricName": "annual_repayment_burden_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T057",
    "applicant": {
      "applicantId": "A057",
      "income": 87000,
      "loanAmount": 35000,
      "repaymentTermYears": 4,
      "creditScore": 435,
      "savings": 13500,
      "annualRepaymentBurdenPct": 10.1,
      "loanToIncomePct": 40.2,
      "savingsToLoanPct": 38.6,
      "affordabilitySignal": -0.01,
      "creditSignal": -0.217,
      "savingsSignal": 0.619,
      "modelLatentScore": 0.012,
      "modelEstimatedApprovalPropensity": 0.506,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 38.6% of the requested loan as evidence supporting APPROVE.",
        "metric": 38.6,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T058",
    "applicant": {
      "applicantId": "A058",
      "income": 53000,
      "loanAmount": 25000,
      "repaymentTermYears": 4,
      "creditScore": 550,
      "savings": 9000,
      "annualRepaymentBurdenPct": 11.8,
      "loanToIncomePct": 47.2,
      "savingsToLoanPct": 36,
      "affordabilitySignal": -0.299,
      "creditSignal": 0.167,
      "savingsSignal": 0.533,
      "modelLatentScore": -0.011,
      "modelEstimatedApprovalPropensity": 0.494,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 36% of the requested loan as evidence supporting APPROVE.",
        "metric": 36,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T059",
    "applicant": {
      "applicantId": "A059",
      "income": 36000,
      "loanAmount": 13500,
      "repaymentTermYears": 4,
      "creditScore": 410,
      "savings": 5500,
      "annualRepaymentBurdenPct": 9.4,
      "loanToIncomePct": 37.5,
      "savingsToLoanPct": 40.7,
      "affordabilitySignal": 0.104,
      "creditSignal": -0.3,
      "savingsSignal": 0.691,
      "modelLatentScore": 0.051,
      "modelEstimatedApprovalPropensity": 0.525,
      "modelEstimatedClass": "APPROVE",
      "actualOutcome": "APPROVE",
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 40.7% of the requested loan as evidence supporting APPROVE.",
        "metric": 40.7,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  },
  {
    "trialId": "T060",
    "applicant": {
      "applicantId": "A060",
      "income": 45000,
      "loanAmount": 8000,
      "repaymentTermYears": 2,
      "creditScore": 465,
      "savings": 500,
      "annualRepaymentBurdenPct": 8.9,
      "loanToIncomePct": 17.8,
      "savingsToLoanPct": 6.3,
      "affordabilitySignal": 0.185,
      "creditSignal": -0.117,
      "savingsSignal": -0.458,
      "modelLatentScore": -0.017,
      "modelEstimatedApprovalPropensity": 0.492,
      "modelEstimatedClass": "REJECT",
      "actualOutcome": "REJECT",
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "cueBank": {
      "W1": {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "The AI treated savings equal to 6.3% of the requested loan as evidence supporting REJECT.",
        "metric": 6.3,
        "metricName": "savings_to_loan_pct"
      },
      "W2": {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct"
      },
      "U1": {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct"
      },
      "U2": {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct"
      }
    },
    "conflictValidationStatus": "model_estimated_unvalidated",
    "observedNoAiApproveRate": ""
  }
];

  window.STIMULUS_SET_VERSION = STIMULUS_SET_VERSION;
  window.FIXED_STIMULI = FIXED_STIMULI;
})();
