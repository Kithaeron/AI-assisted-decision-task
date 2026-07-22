(() => {
  "use strict";

  // EVIDENCE_REQUIRED: The fixed applicant profiles are candidate high-conflict stimuli. A separate no-AI validation study is required to estimate approval rates for all 60 profiles.
  // candidateConflictScore is a deterministic screening index, not an acceptance probability or validation result.
  // actualOutcome, aiIsCorrect, and aiRecommendation are synthetic task labels, not observed human ground truth.
  const STIMULUS_SET_VERSION = "fixed-60-v2";
  const FIXED_STIMULI = [
  {
    "trialId": "T001",
    "applicant": {
      "applicantId": "A001",
      "income": 46000,
      "loanAmount": 12000,
      "repaymentTermYears": 2,
      "creditScore": 665,
      "savings": 2500,
      "loanToIncome": 26,
      "savingsToLoan": 21,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.32,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T002",
    "applicant": {
      "applicantId": "A002",
      "income": 53000,
      "loanAmount": 11000,
      "repaymentTermYears": 2,
      "creditScore": 645,
      "savings": 3500,
      "loanToIncome": 21,
      "savingsToLoan": 32,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.25,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T003",
    "applicant": {
      "applicantId": "A003",
      "income": 60000,
      "loanAmount": 14000,
      "repaymentTermYears": 3,
      "creditScore": 675,
      "savings": 2000,
      "loanToIncome": 23,
      "savingsToLoan": 14,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.65,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T004",
    "applicant": {
      "applicantId": "A004",
      "income": 67000,
      "loanAmount": 18000,
      "repaymentTermYears": 4,
      "creditScore": 655,
      "savings": 4500,
      "loanToIncome": 27,
      "savingsToLoan": 25,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.68,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T005",
    "applicant": {
      "applicantId": "A005",
      "income": 74000,
      "loanAmount": 21500,
      "repaymentTermYears": 5,
      "creditScore": 685,
      "savings": 2500,
      "loanToIncome": 29,
      "savingsToLoan": 12,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.28,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T006",
    "applicant": {
      "applicantId": "A006",
      "income": 48000,
      "loanAmount": 9000,
      "repaymentTermYears": 2,
      "creditScore": 615,
      "savings": 1000,
      "loanToIncome": 19,
      "savingsToLoan": 11,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.55,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T007",
    "applicant": {
      "applicantId": "A007",
      "income": 55000,
      "loanAmount": 15500,
      "repaymentTermYears": 3,
      "creditScore": 695,
      "savings": 4500,
      "loanToIncome": 28,
      "savingsToLoan": 29,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.35,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T008",
    "applicant": {
      "applicantId": "A008",
      "income": 62000,
      "loanAmount": 14500,
      "repaymentTermYears": 3,
      "creditScore": 625,
      "savings": 4000,
      "loanToIncome": 23,
      "savingsToLoan": 28,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.98,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T009",
    "applicant": {
      "applicantId": "A009",
      "income": 69000,
      "loanAmount": 14000,
      "repaymentTermYears": 3,
      "creditScore": 705,
      "savings": 2000,
      "loanToIncome": 20,
      "savingsToLoan": 14,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.25,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T010",
    "applicant": {
      "applicantId": "A010",
      "income": 76000,
      "loanAmount": 22000,
      "repaymentTermYears": 5,
      "creditScore": 635,
      "savings": 5500,
      "loanToIncome": 29,
      "savingsToLoan": 25,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.08,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "trialType": "no_ai_baseline",
    "trialPhase": "phase_1_no_ai",
    "cueCombination": "none",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T011",
    "applicant": {
      "applicantId": "A011",
      "income": 50000,
      "loanAmount": 13000,
      "repaymentTermYears": 3,
      "creditScore": 665,
      "savings": 1500,
      "loanToIncome": 26,
      "savingsToLoan": 12,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.78,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T012",
    "applicant": {
      "applicantId": "A012",
      "income": 57000,
      "loanAmount": 12000,
      "repaymentTermYears": 2,
      "creditScore": 645,
      "savings": 2000,
      "loanToIncome": 21,
      "savingsToLoan": 17,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.65,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": false
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T013",
    "applicant": {
      "applicantId": "A013",
      "income": 64000,
      "loanAmount": 19000,
      "repaymentTermYears": 4,
      "creditScore": 675,
      "savings": 5500,
      "loanToIncome": 30,
      "savingsToLoan": 29,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.35,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T014",
    "applicant": {
      "applicantId": "A014",
      "income": 71000,
      "loanAmount": 14000,
      "repaymentTermYears": 3,
      "creditScore": 655,
      "savings": 3500,
      "loanToIncome": 20,
      "savingsToLoan": 25,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.78,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T015",
    "applicant": {
      "applicantId": "A015",
      "income": 78000,
      "loanAmount": 17000,
      "repaymentTermYears": 4,
      "creditScore": 685,
      "savings": 2000,
      "loanToIncome": 22,
      "savingsToLoan": 12,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.98,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T016",
    "applicant": {
      "applicantId": "A016",
      "income": 52000,
      "loanAmount": 13500,
      "repaymentTermYears": 3,
      "creditScore": 615,
      "savings": 3000,
      "loanToIncome": 26,
      "savingsToLoan": 22,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.78,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T017",
    "applicant": {
      "applicantId": "A017",
      "income": 59000,
      "loanAmount": 16500,
      "repaymentTermYears": 4,
      "creditScore": 695,
      "savings": 3000,
      "loanToIncome": 28,
      "savingsToLoan": 18,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.88,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T018",
    "applicant": {
      "applicantId": "A018",
      "income": 66000,
      "loanAmount": 15000,
      "repaymentTermYears": 3,
      "creditScore": 625,
      "savings": 2500,
      "loanToIncome": 23,
      "savingsToLoan": 17,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.65,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T019",
    "applicant": {
      "applicantId": "A019",
      "income": 73000,
      "loanAmount": 19500,
      "repaymentTermYears": 4,
      "creditScore": 705,
      "savings": 5000,
      "loanToIncome": 27,
      "savingsToLoan": 26,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.15,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T020",
    "applicant": {
      "applicantId": "A020",
      "income": 47000,
      "loanAmount": 10500,
      "repaymentTermYears": 2,
      "creditScore": 635,
      "savings": 2500,
      "loanToIncome": 22,
      "savingsToLoan": 24,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.72,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_only_baseline",
    "trialPhase": "phase_2_ai_only",
    "cueCombination": "ai_only",
    "cues": [],
    "warrantedCue": null,
    "unwarrantedCue": null,
    "askRetrospectiveReport": false,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T021",
    "applicant": {
      "applicantId": "A021",
      "income": 54000,
      "loanAmount": 10500,
      "repaymentTermYears": 2,
      "creditScore": 665,
      "savings": 1000,
      "loanToIncome": 19,
      "savingsToLoan": 10,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.22,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Loan is 19% of income, within the 24% threshold; this supports APPROVE.",
        "metric": 19,
        "metricName": "loan_to_income_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Loan is 19% of income, within the 24% threshold; this supports APPROVE.",
      "metric": 19,
      "metricName": "loan_to_income_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 70%.",
      "metric": 70,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T022",
    "applicant": {
      "applicantId": "A022",
      "income": 61000,
      "loanAmount": 17000,
      "repaymentTermYears": 4,
      "creditScore": 645,
      "savings": 5000,
      "loanToIncome": 28,
      "savingsToLoan": 29,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.15,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Credit score 645 is below the 660 threshold; this supports REJECT.",
        "metric": 645,
        "metricName": "credit_score",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Credit score 645 is below the 660 threshold; this supports REJECT.",
      "metric": 645,
      "metricName": "credit_score"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 80%.",
      "metric": 80,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T023",
    "applicant": {
      "applicantId": "A023",
      "income": 68000,
      "loanAmount": 20500,
      "repaymentTermYears": 5,
      "creditScore": 675,
      "savings": 3500,
      "loanToIncome": 30,
      "savingsToLoan": 17,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.95,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Loan is 30% of income, above the 24% threshold; this supports REJECT.",
        "metric": 30,
        "metricName": "loan_to_income_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Loan is 30% of income, above the 24% threshold; this supports REJECT.",
      "metric": 30,
      "metricName": "loan_to_income_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 90%.",
      "metric": 90,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T024",
    "applicant": {
      "applicantId": "A024",
      "income": 75000,
      "loanAmount": 15000,
      "repaymentTermYears": 3,
      "creditScore": 655,
      "savings": 2000,
      "loanToIncome": 20,
      "savingsToLoan": 13,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.92,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Savings are 13% of the loan, below the 20% threshold; this supports REJECT.",
        "metric": 13,
        "metricName": "savings_to_loan_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Savings are 13% of the loan, below the 20% threshold; this supports REJECT.",
      "metric": 13,
      "metricName": "savings_to_loan_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 70%.",
      "metric": 70,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T025",
    "applicant": {
      "applicantId": "A025",
      "income": 49000,
      "loanAmount": 14000,
      "repaymentTermYears": 3,
      "creditScore": 685,
      "savings": 3500,
      "loanToIncome": 29,
      "savingsToLoan": 25,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.08,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Credit score 685 is above the 660 threshold; this supports APPROVE.",
        "metric": 685,
        "metricName": "credit_score",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Credit score 685 is above the 660 threshold; this supports APPROVE.",
      "metric": 685,
      "metricName": "credit_score"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 80%.",
      "metric": 80,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T026",
    "applicant": {
      "applicantId": "A026",
      "income": 56000,
      "loanAmount": 10500,
      "repaymentTermYears": 2,
      "creditScore": 615,
      "savings": 2500,
      "loanToIncome": 19,
      "savingsToLoan": 24,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.22,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Savings are 24% of the loan, above the 20% threshold; this supports APPROVE.",
        "metric": 24,
        "metricName": "savings_to_loan_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Savings are 24% of the loan, above the 20% threshold; this supports APPROVE.",
      "metric": 24,
      "metricName": "savings_to_loan_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 90%.",
      "metric": 90,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T027",
    "applicant": {
      "applicantId": "A027",
      "income": 63000,
      "loanAmount": 13000,
      "repaymentTermYears": 3,
      "creditScore": 695,
      "savings": 2500,
      "loanToIncome": 21,
      "savingsToLoan": 19,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.72,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Loan is 21% of income, within the 24% threshold; this supports APPROVE.",
        "metric": 21,
        "metricName": "loan_to_income_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Loan is 21% of income, within the 24% threshold; this supports APPROVE.",
      "metric": 21,
      "metricName": "loan_to_income_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 70%.",
      "metric": 70,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T028",
    "applicant": {
      "applicantId": "A028",
      "income": 70000,
      "loanAmount": 21000,
      "repaymentTermYears": 5,
      "creditScore": 625,
      "savings": 6000,
      "loanToIncome": 30,
      "savingsToLoan": 29,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.55,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Credit score 625 is below the 660 threshold; this supports REJECT.",
        "metric": 625,
        "metricName": "credit_score",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Credit score 625 is below the 660 threshold; this supports REJECT.",
      "metric": 625,
      "metricName": "credit_score"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 80%.",
      "metric": 80,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T029",
    "applicant": {
      "applicantId": "A029",
      "income": 77000,
      "loanAmount": 21000,
      "repaymentTermYears": 5,
      "creditScore": 705,
      "savings": 3000,
      "loanToIncome": 27,
      "savingsToLoan": 14,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.15,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Loan is 27% of income, above the 24% threshold; this supports REJECT.",
        "metric": 27,
        "metricName": "loan_to_income_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Loan is 27% of income, above the 24% threshold; this supports REJECT.",
      "metric": 27,
      "metricName": "loan_to_income_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 90%.",
      "metric": 90,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T030",
    "applicant": {
      "applicantId": "A030",
      "income": 51000,
      "loanAmount": 11000,
      "repaymentTermYears": 2,
      "creditScore": 635,
      "savings": 1500,
      "loanToIncome": 22,
      "savingsToLoan": 14,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.85,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Savings are 14% of the loan, below the 20% threshold; this supports REJECT.",
        "metric": 14,
        "metricName": "savings_to_loan_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Savings are 14% of the loan, below the 20% threshold; this supports REJECT.",
      "metric": 14,
      "metricName": "savings_to_loan_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 70%.",
      "metric": 70,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T031",
    "applicant": {
      "applicantId": "A031",
      "income": 58000,
      "loanAmount": 15000,
      "repaymentTermYears": 3,
      "creditScore": 665,
      "savings": 3500,
      "loanToIncome": 26,
      "savingsToLoan": 23,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.45,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Credit score 665 is above the 660 threshold; this supports APPROVE.",
        "metric": 665,
        "metricName": "credit_score",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Credit score 665 is above the 660 threshold; this supports APPROVE.",
      "metric": 665,
      "metricName": "credit_score"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "60% of prior decision makers agreed with the AI.",
      "metric": 60,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T032",
    "applicant": {
      "applicantId": "A032",
      "income": 65000,
      "loanAmount": 13500,
      "repaymentTermYears": 3,
      "creditScore": 645,
      "savings": 4000,
      "loanToIncome": 21,
      "savingsToLoan": 30,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.12,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Savings are 30% of the loan, above the 20% threshold; this supports APPROVE.",
        "metric": 30,
        "metricName": "savings_to_loan_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Savings are 30% of the loan, above the 20% threshold; this supports APPROVE.",
      "metric": 30,
      "metricName": "savings_to_loan_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "90% of prior decision makers agreed with the AI.",
      "metric": 90,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T033",
    "applicant": {
      "applicantId": "A033",
      "income": 72000,
      "loanAmount": 16500,
      "repaymentTermYears": 4,
      "creditScore": 675,
      "savings": 2500,
      "loanToIncome": 23,
      "savingsToLoan": 15,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.58,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Loan is 23% of income, within the 24% threshold; this supports APPROVE.",
        "metric": 23,
        "metricName": "loan_to_income_pct",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Loan is 23% of income, within the 24% threshold; this supports APPROVE.",
      "metric": 23,
      "metricName": "loan_to_income_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "30% of prior decision makers agreed with the AI.",
      "metric": 30,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T034",
    "applicant": {
      "applicantId": "A034",
      "income": 46000,
      "loanAmount": 12500,
      "repaymentTermYears": 3,
      "creditScore": 655,
      "savings": 3500,
      "loanToIncome": 27,
      "savingsToLoan": 28,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.88,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Credit score 655 is below the 660 threshold; this supports REJECT.",
        "metric": 655,
        "metricName": "credit_score",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Credit score 655 is below the 660 threshold; this supports REJECT.",
      "metric": 655,
      "metricName": "credit_score"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "60% of prior decision makers agreed with the AI.",
      "metric": 60,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T035",
    "applicant": {
      "applicantId": "A035",
      "income": 53000,
      "loanAmount": 15500,
      "repaymentTermYears": 3,
      "creditScore": 685,
      "savings": 2000,
      "loanToIncome": 29,
      "savingsToLoan": 13,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.22,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Loan is 29% of income, above the 24% threshold; this supports REJECT.",
        "metric": 29,
        "metricName": "loan_to_income_pct",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Loan is 29% of income, above the 24% threshold; this supports REJECT.",
      "metric": 29,
      "metricName": "loan_to_income_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "90% of prior decision makers agreed with the AI.",
      "metric": 90,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T036",
    "applicant": {
      "applicantId": "A036",
      "income": 60000,
      "loanAmount": 11500,
      "repaymentTermYears": 2,
      "creditScore": 615,
      "savings": 1000,
      "loanToIncome": 19,
      "savingsToLoan": 9,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.68,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Savings are 9% of the loan, below the 20% threshold; this supports REJECT.",
        "metric": 9,
        "metricName": "savings_to_loan_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Savings are 9% of the loan, below the 20% threshold; this supports REJECT.",
      "metric": 9,
      "metricName": "savings_to_loan_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "30% of prior decision makers agreed with the AI.",
      "metric": 30,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T037",
    "applicant": {
      "applicantId": "A037",
      "income": 67000,
      "loanAmount": 19000,
      "repaymentTermYears": 4,
      "creditScore": 695,
      "savings": 5500,
      "loanToIncome": 28,
      "savingsToLoan": 29,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.35,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Credit score 695 is above the 660 threshold; this supports APPROVE.",
        "metric": 695,
        "metricName": "credit_score",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Credit score 695 is above the 660 threshold; this supports APPROVE.",
      "metric": 695,
      "metricName": "credit_score"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "60% of prior decision makers agreed with the AI.",
      "metric": 60,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T038",
    "applicant": {
      "applicantId": "A038",
      "income": 74000,
      "loanAmount": 17000,
      "repaymentTermYears": 4,
      "creditScore": 625,
      "savings": 5000,
      "loanToIncome": 23,
      "savingsToLoan": 29,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.05,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Savings are 29% of the loan, above the 20% threshold; this supports APPROVE.",
        "metric": 29,
        "metricName": "savings_to_loan_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Savings are 29% of the loan, above the 20% threshold; this supports APPROVE.",
      "metric": 29,
      "metricName": "savings_to_loan_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "90% of prior decision makers agreed with the AI.",
      "metric": 90,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T039",
    "applicant": {
      "applicantId": "A039",
      "income": 48000,
      "loanAmount": 9500,
      "repaymentTermYears": 2,
      "creditScore": 705,
      "savings": 1500,
      "loanToIncome": 20,
      "savingsToLoan": 16,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.12,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Loan is 20% of income, within the 24% threshold; this supports APPROVE.",
        "metric": 20,
        "metricName": "loan_to_income_pct",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Loan is 20% of income, within the 24% threshold; this supports APPROVE.",
      "metric": 20,
      "metricName": "loan_to_income_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "30% of prior decision makers agreed with the AI.",
      "metric": 30,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T040",
    "applicant": {
      "applicantId": "A040",
      "income": 55000,
      "loanAmount": 16000,
      "repaymentTermYears": 3,
      "creditScore": 635,
      "savings": 4000,
      "loanToIncome": 29,
      "savingsToLoan": 25,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.08,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W1_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W1",
        "category": "warranted",
        "type": "Feature Explanation",
        "text": "Credit score 635 is below the 660 threshold; this supports REJECT.",
        "metric": 635,
        "metricName": "credit_score",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W1",
      "category": "warranted",
      "type": "Feature Explanation",
      "text": "Credit score 635 is below the 660 threshold; this supports REJECT.",
      "metric": 635,
      "metricName": "credit_score"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "60% of prior decision makers agreed with the AI.",
      "metric": 60,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T041",
    "applicant": {
      "applicantId": "A041",
      "income": 62000,
      "loanAmount": 16000,
      "repaymentTermYears": 3,
      "creditScore": 665,
      "savings": 1500,
      "loanToIncome": 26,
      "savingsToLoan": 9,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.98,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 90% of the time.",
      "metric": 90,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 90%.",
      "metric": 90,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T042",
    "applicant": {
      "applicantId": "A042",
      "income": 69000,
      "loanAmount": 14500,
      "repaymentTermYears": 3,
      "creditScore": 645,
      "savings": 2500,
      "loanToIncome": 21,
      "savingsToLoan": 17,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.65,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 70% of the time.",
      "metric": 70,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 70%.",
      "metric": 70,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T043",
    "applicant": {
      "applicantId": "A043",
      "income": 76000,
      "loanAmount": 23000,
      "repaymentTermYears": 5,
      "creditScore": 675,
      "savings": 6500,
      "loanToIncome": 30,
      "savingsToLoan": 28,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.28,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 80% of the time.",
      "metric": 80,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 80%.",
      "metric": 80,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T044",
    "applicant": {
      "applicantId": "A044",
      "income": 50000,
      "loanAmount": 10000,
      "repaymentTermYears": 2,
      "creditScore": 655,
      "savings": 2500,
      "loanToIncome": 20,
      "savingsToLoan": 25,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.78,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 90% of the time.",
      "metric": 90,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 90%.",
      "metric": 90,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T045",
    "applicant": {
      "applicantId": "A045",
      "income": 57000,
      "loanAmount": 12500,
      "repaymentTermYears": 3,
      "creditScore": 685,
      "savings": 1500,
      "loanToIncome": 22,
      "savingsToLoan": 12,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.98,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 70% of the time.",
      "metric": 70,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 70%.",
      "metric": 70,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T046",
    "applicant": {
      "applicantId": "A046",
      "income": 64000,
      "loanAmount": 16500,
      "repaymentTermYears": 4,
      "creditScore": 615,
      "savings": 3500,
      "loanToIncome": 26,
      "savingsToLoan": 21,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.72,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 80% of the time.",
      "metric": 80,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 80%.",
      "metric": 80,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T047",
    "applicant": {
      "applicantId": "A047",
      "income": 71000,
      "loanAmount": 20000,
      "repaymentTermYears": 4,
      "creditScore": 695,
      "savings": 3500,
      "loanToIncome": 28,
      "savingsToLoan": 18,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.88,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 90% of the time.",
      "metric": 90,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 90%.",
      "metric": 90,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T048",
    "applicant": {
      "applicantId": "A048",
      "income": 78000,
      "loanAmount": 18000,
      "repaymentTermYears": 4,
      "creditScore": 625,
      "savings": 3000,
      "loanToIncome": 23,
      "savingsToLoan": 17,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.65,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 70%.",
        "metric": 70,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 70% of the time.",
      "metric": 70,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 70%.",
      "metric": 70,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T049",
    "applicant": {
      "applicantId": "A049",
      "income": 52000,
      "loanAmount": 14000,
      "repaymentTermYears": 3,
      "creditScore": 705,
      "savings": 3500,
      "loanToIncome": 27,
      "savingsToLoan": 25,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.08,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 80%.",
        "metric": 80,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 80% of the time.",
      "metric": 80,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 80%.",
      "metric": 80,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T050",
    "applicant": {
      "applicantId": "A050",
      "income": 59000,
      "loanAmount": 13000,
      "repaymentTermYears": 3,
      "creditScore": 635,
      "savings": 3000,
      "loanToIncome": 22,
      "savingsToLoan": 23,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.65,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U1",
    "cues": [
      {
        "id": "U1",
        "category": "unwarranted",
        "type": "Raw Confidence Score",
        "text": "AI confidence: 90%.",
        "metric": 90,
        "metricName": "raw_confidence_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 90% of the time.",
      "metric": 90,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U1",
      "category": "unwarranted",
      "type": "Raw Confidence Score",
      "text": "AI confidence: 90%.",
      "metric": 90,
      "metricName": "raw_confidence_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T051",
    "applicant": {
      "applicantId": "A051",
      "income": 66000,
      "loanAmount": 12500,
      "repaymentTermYears": 3,
      "creditScore": 665,
      "savings": 1500,
      "loanToIncome": 19,
      "savingsToLoan": 12,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.08,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 70% of the time.",
      "metric": 70,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "30% of prior decision makers agreed with the AI.",
      "metric": 30,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T052",
    "applicant": {
      "applicantId": "A052",
      "income": 73000,
      "loanAmount": 20500,
      "repaymentTermYears": 5,
      "creditScore": 645,
      "savings": 6000,
      "loanToIncome": 28,
      "savingsToLoan": 29,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.15,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 80% of the time.",
      "metric": 80,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "60% of prior decision makers agreed with the AI.",
      "metric": 60,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T053",
    "applicant": {
      "applicantId": "A053",
      "income": 47000,
      "loanAmount": 14000,
      "repaymentTermYears": 3,
      "creditScore": 675,
      "savings": 2000,
      "loanToIncome": 30,
      "savingsToLoan": 14,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.15,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 90% of the time.",
      "metric": 90,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "90% of prior decision makers agreed with the AI.",
      "metric": 90,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T054",
    "applicant": {
      "applicantId": "A054",
      "income": 54000,
      "loanAmount": 11000,
      "repaymentTermYears": 2,
      "creditScore": 655,
      "savings": 1500,
      "loanToIncome": 20,
      "savingsToLoan": 14,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 0.85,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 70% of the time.",
      "metric": 70,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "30% of prior decision makers agreed with the AI.",
      "metric": 30,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T055",
    "applicant": {
      "applicantId": "A055",
      "income": 61000,
      "loanAmount": 17500,
      "repaymentTermYears": 4,
      "creditScore": 685,
      "savings": 4000,
      "loanToIncome": 29,
      "savingsToLoan": 23,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.95,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 80% of the time.",
      "metric": 80,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "60% of prior decision makers agreed with the AI.",
      "metric": 60,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T056",
    "applicant": {
      "applicantId": "A056",
      "income": 68000,
      "loanAmount": 13000,
      "repaymentTermYears": 3,
      "creditScore": 615,
      "savings": 3000,
      "loanToIncome": 19,
      "savingsToLoan": 23,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 1.15,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 90% of the time.",
      "metric": 90,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "90% of prior decision makers agreed with the AI.",
      "metric": 90,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T057",
    "applicant": {
      "applicantId": "A057",
      "income": 75000,
      "loanAmount": 16000,
      "repaymentTermYears": 3,
      "creditScore": 695,
      "savings": 3000,
      "loanToIncome": 21,
      "savingsToLoan": 19,
      "actualOutcome": "APPROVE",
      "candidateConflictScore": 0.72,
      "aiRecommendation": "APPROVE",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 70% of the time.",
      "metric": 70,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "30% of prior decision makers agreed with the AI.",
      "metric": 30,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T058",
    "applicant": {
      "applicantId": "A058",
      "income": 49000,
      "loanAmount": 14500,
      "repaymentTermYears": 3,
      "creditScore": 625,
      "savings": 4000,
      "loanToIncome": 30,
      "savingsToLoan": 28,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.48,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "60% of prior decision makers agreed with the AI.",
        "metric": 60,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 80% of the time.",
        "metric": 80,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 80% of the time.",
      "metric": 80,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "60% of prior decision makers agreed with the AI.",
      "metric": 60,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T059",
    "applicant": {
      "applicantId": "A059",
      "income": 56000,
      "loanAmount": 15000,
      "repaymentTermYears": 3,
      "creditScore": 705,
      "savings": 2000,
      "loanToIncome": 27,
      "savingsToLoan": 13,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.22,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 90% of the time.",
        "metric": 90,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 1
      },
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "90% of prior decision makers agreed with the AI.",
        "metric": 90,
        "metricName": "social_consensus_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 90% of the time.",
      "metric": 90,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "90% of prior decision makers agreed with the AI.",
      "metric": 90,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  },
  {
    "trialId": "T060",
    "applicant": {
      "applicantId": "A060",
      "income": 63000,
      "loanAmount": 14000,
      "repaymentTermYears": 3,
      "creditScore": 635,
      "savings": 1500,
      "loanToIncome": 22,
      "savingsToLoan": 11,
      "actualOutcome": "REJECT",
      "candidateConflictScore": 1.05,
      "aiRecommendation": "REJECT",
      "aiIsCorrect": true
    },
    "trialType": "ai_plus_cues",
    "trialPhase": "phase_3_ai_plus_cues",
    "cueCombination": "W2_U2",
    "cues": [
      {
        "id": "U2",
        "category": "unwarranted",
        "type": "Social Consensus",
        "text": "30% of prior decision makers agreed with the AI.",
        "metric": 30,
        "metricName": "social_consensus_pct",
        "presentationPosition": 1
      },
      {
        "id": "W2",
        "category": "warranted",
        "type": "Historical Reliability",
        "text": "For similar credit scores, the AI was right 70% of the time.",
        "metric": 70,
        "metricName": "historical_reliability_pct",
        "presentationPosition": 2
      }
    ],
    "warrantedCue": {
      "id": "W2",
      "category": "warranted",
      "type": "Historical Reliability",
      "text": "For similar credit scores, the AI was right 70% of the time.",
      "metric": 70,
      "metricName": "historical_reliability_pct"
    },
    "unwarrantedCue": {
      "id": "U2",
      "category": "unwarranted",
      "type": "Social Consensus",
      "text": "30% of prior decision makers agreed with the AI.",
      "metric": 30,
      "metricName": "social_consensus_pct"
    },
    "askRetrospectiveReport": true,
    "conflictValidationStatus": "candidate_unvalidated",
    "pilotApproveRate": ""
  }
];

  window.STIMULUS_SET_VERSION = STIMULUS_SET_VERSION;
  window.FIXED_STIMULI = FIXED_STIMULI;
})();
