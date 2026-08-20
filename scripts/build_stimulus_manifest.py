#!/usr/bin/env python3
"""Build the browser stimulus manifest from the fixed formula workbook.

The workbook supplies the 60 visible applicant profiles and counterbalance map.
Policy scores and cue assignments are deterministic and validated before output.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


DATASET_VERSION = "synthetic-loan-policy-no-error-v1"
MANIFEST_VERSION = f"{DATASET_VERSION}-manifest-v1"
GENERATION_SEED = 20260813
LEVELS = (70, 80, 90)
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"


def column_number(cell_reference: str) -> int:
    letters = "".join(char for char in cell_reference if char.isalpha())
    result = 0
    for char in letters:
        result = result * 26 + ord(char.upper()) - ord("A") + 1
    return result


def read_xlsx(workbook_path: Path) -> dict[str, list[list[object]]]:
    with zipfile.ZipFile(workbook_path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in root.findall("m:si", NS):
                shared_strings.append("".join(node.text or "" for node in item.iterfind(".//m:t", NS)))

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        targets = {
            relationship.attrib["Id"]: relationship.attrib["Target"]
            for relationship in relationships
        }

        result: dict[str, list[list[object]]] = {}
        sheets_node = workbook.find("m:sheets", NS)
        if sheets_node is None:
            raise ValueError("Workbook has no sheets")
        for sheet in sheets_node:
            name = sheet.attrib["name"]
            relationship_id = sheet.attrib[f"{{{REL_NS}}}id"]
            target = targets[relationship_id].lstrip("/")
            xml_path = target if target.startswith("xl/") else f"xl/{target}"
            root = ET.fromstring(archive.read(xml_path))
            rows: list[list[object]] = []
            for row_node in root.findall(".//m:sheetData/m:row", NS):
                values: dict[int, object] = {}
                for cell in row_node.findall("m:c", NS):
                    col = column_number(cell.attrib["r"])
                    cell_type = cell.attrib.get("t")
                    value_node = cell.find("m:v", NS)
                    if cell_type == "inlineStr":
                        value = "".join(node.text or "" for node in cell.iterfind(".//m:t", NS))
                    elif value_node is None:
                        value = None
                    elif cell_type == "s":
                        value = shared_strings[int(value_node.text or "0")]
                    elif cell_type == "b":
                        value = value_node.text == "1"
                    else:
                        raw = value_node.text or ""
                        try:
                            number = float(raw)
                            value = int(number) if number.is_integer() else number
                        except ValueError:
                            value = raw
                    values[col] = value
                max_col = max(values, default=0)
                rows.append([values.get(index) for index in range(1, max_col + 1)])
            result[name] = rows
        return result


def clip(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def normalize_condition(value: str) -> str:
    normalized = str(value).strip().replace("+", "_")
    return normalized.lower() if normalized.lower() in {"no_ai", "ai_only"} else normalized.upper()


def parse_counterbalance(rows: list[list[object]]) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    for row in rows:
        if not row or not isinstance(row[0], (int, float)) or len(row) < 7:
            continue
        list_id = str(int(row[0]))
        conditions = [normalize_condition(str(value)) for value in row[1:7]]
        if set(conditions) == {"no_ai", "ai_only", "W1_U1", "W1_U2", "W2_U1", "W2_U2"}:
            result[list_id] = conditions
    if len(result) != 6:
        raise ValueError(f"Expected six counterbalance lists, found {len(result)}")
    return result


def visible_signal(profile: dict[str, object], direction: str) -> tuple[str, float]:
    signals = {
        "affordability": float(profile["affordabilitySignal"]),
        "credit": float(profile["creditSignal"]),
        "savings": float(profile["savingsSignal"]),
    }
    ordered = sorted(signals.items(), key=lambda item: item[1], reverse=direction == "APPROVE")
    metric, strength = ordered[0]
    if (direction == "APPROVE" and strength <= 0) or (direction == "REJECT" and strength >= 0):
        raise ValueError(f"{profile['applicantId']} has no visible signal supporting {direction}")
    return metric, strength


def explanation_text(profile: dict[str, object], recommendation: str) -> tuple[str, str]:
    metric, _ = visible_signal(profile, recommendation)
    if metric == "affordability":
        value = float(profile["annualRepaymentBurdenPct"])
        text = f"Annual repayments equal {value:.1f}% of income, supporting {recommendation}."
    elif metric == "credit":
        text = f"The credit score is {int(profile['creditScore'])}, supporting {recommendation}."
    else:
        value = float(profile["savingsToLoanPct"])
        text = f"Savings equal {value:.1f}% of the loan, supporting {recommendation}."
    return metric, text


def level_assignments(block: int, metric: str, count: int = 10) -> list[int]:
    featured = LEVELS[(block - 1) % len(LEVELS)]
    values: list[int] = []
    for level in LEVELS:
        values.extend([level] * (4 if level == featured else 3))
    random.Random(f"{GENERATION_SEED}:{block}:{metric}").shuffle(values)
    if len(values) != count:
        raise AssertionError("Cue level assignment length mismatch")
    return values


def build_profiles(applicant_rows: list[list[object]]) -> list[dict[str, object]]:
    profiles: list[dict[str, object]] = []
    for row in applicant_rows:
        if not row or not isinstance(row[0], str) or not row[0].startswith("T") or len(row) < 22:
            continue
        (
            trial_id,
            applicant_id,
            block,
            _block_position,
            income,
            loan,
            term,
            credit,
            savings,
            workbook_burden,
            workbook_savings_ratio,
            workbook_affordability,
            workbook_credit_signal,
            workbook_savings_signal,
            workbook_policy_raw,
            workbook_policy_latent,
            workbook_policy_score,
            expected_class,
            difficulty,
            obvious,
            _target_quantile,
            _target_error,
        ) = row[:22]
        burden = float(loan) / (float(term) * float(income))
        savings_ratio = float(savings) / float(loan)
        affordability = clip((0.12 - burden) / 0.08, -1, 1)
        credit_signal = clip((float(credit) - 500) / 200, -1, 1)
        savings_signal = clip((savings_ratio - 0.25) / 0.20, -1, 1)
        policy_raw = 0.5 * affordability + 0.35 * credit_signal + 0.15 * savings_signal
        policy_latent = policy_raw / 0.362859017617954
        policy_score = 1 / (1 + math.exp(-policy_latent))
        policy_class = "APPROVE" if policy_latent >= 0 else "REJECT"
        if policy_class != str(expected_class).upper():
            raise ValueError(f"Workbook/model mismatch for {applicant_id}: {expected_class} vs {policy_class}")
        calculated = (burden, savings_ratio, affordability, credit_signal, savings_signal, policy_raw, policy_latent, policy_score)
        workbook_values = (
            workbook_burden,
            workbook_savings_ratio,
            workbook_affordability,
            workbook_credit_signal,
            workbook_savings_signal,
            workbook_policy_raw,
            workbook_policy_latent,
            workbook_policy_score,
        )
        if any(not math.isclose(float(left), float(right), rel_tol=1e-9, abs_tol=1e-9) for left, right in zip(calculated, workbook_values)):
            raise ValueError(f"Formula verification failed for {applicant_id}")
        is_obvious = str(obvious).upper() == "YES" or str(difficulty).lower() == "obvious"
        profiles.append(
            {
                "trialId": str(trial_id),
                "applicantId": str(applicant_id),
                "counterbalanceBlock": int(block),
                "income": int(income),
                "loanAmount": int(loan),
                "repaymentTermYears": int(term),
                "creditScore": int(credit),
                "savings": int(savings),
                "annualRepaymentBurdenPct": round(burden * 100, 4),
                "savingsToLoanPct": round(savings_ratio * 100, 4),
                "affordabilitySignal": round(affordability, 8),
                "creditSignal": round(credit_signal, 8),
                "savingsSignal": round(savings_signal, 8),
                "policyRawScore": round(policy_raw, 10),
                "policyLatentScore": round(policy_latent, 10),
                "policyScore": round(policy_score, 10),
                "policyGroundTruth": policy_class,
                "groundTruthStatus": "task_defined_fictional_policy",
                "difficultyBand": str(difficulty).lower(),
                "stimulusType": f"obvious_{policy_class.lower()}" if is_obvious else "grey_zone",
                "isObviousCase": is_obvious,
                "intendedObviousDirection": policy_class if is_obvious else "",
                "observedNoAiApproveRate": "",
                "sourceDatasetVersion": DATASET_VERSION,
            }
        )
    if len(profiles) != 60:
        raise ValueError(f"Expected 60 profiles, found {len(profiles)}")
    return profiles


def assign_ai_and_cues(profiles: list[dict[str, object]]) -> None:
    by_block = {block: [profile for profile in profiles if profile["counterbalanceBlock"] == block] for block in range(1, 7)}
    for block, block_profiles in by_block.items():
        if len(block_profiles) != 10:
            raise ValueError(f"Block {block} has {len(block_profiles)} profiles")
        false_approve_candidates = [
            profile
            for profile in block_profiles
            if profile["policyGroundTruth"] == "REJECT"
            and not profile["isObviousCase"]
            and max(profile["affordabilitySignal"], profile["creditSignal"], profile["savingsSignal"]) > 0
        ]
        false_reject_candidates = [
            profile
            for profile in block_profiles
            if profile["policyGroundTruth"] == "APPROVE"
            and not profile["isObviousCase"]
            and min(profile["affordabilitySignal"], profile["creditSignal"], profile["savingsSignal"]) < 0
        ]
        if not false_approve_candidates or not false_reject_candidates:
            raise ValueError(f"Block {block} cannot support plausible bidirectional AI mismatches")
        false_approve = min(false_approve_candidates, key=lambda item: abs(float(item["policyLatentScore"])))
        false_reject = min(false_reject_candidates, key=lambda item: abs(float(item["policyLatentScore"])))

        reliability = level_assignments(block, "W2")
        confidence = level_assignments(block, "U1")
        consensus = level_assignments(block, "U2")
        for index, profile in enumerate(block_profiles):
            recommendation = str(profile["policyGroundTruth"])
            if profile is false_approve:
                recommendation = "APPROVE"
            elif profile is false_reject:
                recommendation = "REJECT"
            profile["aiRecommendation"] = recommendation
            profile["aiMatchesPolicy"] = recommendation == profile["policyGroundTruth"]
            metric, text = explanation_text(profile, recommendation)
            profile["w1SupportingSignal"] = metric
            profile["cueBank"] = {
                "W1": {
                    "code": "W1",
                    "category": "warranted",
                    "type": "Feature Explanation",
                    "text": text,
                },
                "W2": {
                    "code": "W2",
                    "category": "warranted",
                    "type": "Historical Reliability",
                    "level": reliability[index],
                    "text": f"Historical reliability: {reliability[index]}% policy match in similar fictional cases.",
                },
                "U1": {
                    "code": "U1",
                    "category": "unwarranted",
                    "type": "Raw Confidence",
                    "level": confidence[index],
                    "text": f"AI confidence: {confidence[index]}%.",
                },
                "U2": {
                    "code": "U2",
                    "category": "unwarranted",
                    "type": "Social Consensus",
                    "level": consensus[index],
                    "text": f"Fixed consensus indicator: {consensus[index]}% agree with this recommendation.",
                },
            }


def validate(profiles: list[dict[str, object]], counterbalance: dict[str, list[str]]) -> None:
    ids = [profile["applicantId"] for profile in profiles]
    assert len(ids) == len(set(ids)) == 60
    assert sum(profile["policyGroundTruth"] == "APPROVE" for profile in profiles) == 30
    assert sum(profile["aiRecommendation"] == "APPROVE" for profile in profiles) == 30
    assert sum(bool(profile["aiMatchesPolicy"]) for profile in profiles) == 48
    obvious = [profile for profile in profiles if profile["isObviousCase"]]
    assert len(obvious) == 6
    assert sum(profile["policyGroundTruth"] == "APPROVE" for profile in obvious) == 3
    assert sum(profile["policyGroundTruth"] == "REJECT" for profile in obvious) == 3

    expected_conditions = {"no_ai", "ai_only", "W1_U1", "W1_U2", "W2_U1", "W2_U2"}
    for block in range(1, 7):
        block_profiles = [profile for profile in profiles if profile["counterbalanceBlock"] == block]
        assert len(block_profiles) == 10
        assert sum(bool(profile["isObviousCase"]) for profile in block_profiles) == 1
        assert sum(profile["policyGroundTruth"] == "APPROVE" for profile in block_profiles) == 5
        assert sum(profile["aiRecommendation"] == "APPROVE" for profile in block_profiles) == 5
        assert sum(bool(profile["aiMatchesPolicy"]) for profile in block_profiles) == 8
        for cue in ("W2", "U1", "U2"):
            counts = {level: sum(profile["cueBank"][cue]["level"] == level for profile in block_profiles) for level in LEVELS}
            assert sorted(counts.values()) == [3, 3, 4]
    for cue in ("W2", "U1", "U2"):
        assert all(sum(profile["cueBank"][cue]["level"] == level for profile in profiles) == 20 for level in LEVELS)

    assert len(counterbalance) == 6
    for conditions in counterbalance.values():
        assert set(conditions) == expected_conditions
    for block in range(6):
        assert {conditions[block] for conditions in counterbalance.values()} == expected_conditions


def write_manifest(output_path: Path, profiles: list[dict[str, object]], counterbalance: dict[str, list[str]], source_hash: str) -> None:
    payload = {
        "datasetVersion": DATASET_VERSION,
        "manifestVersion": MANIFEST_VERSION,
        "generationSeed": GENERATION_SEED,
        "sourceWorkbookSha256": source_hash,
        "counterbalanceLists": counterbalance,
        "profiles": profiles,
    }
    manifest_hash = hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    serialized_profiles = json.dumps(profiles, ensure_ascii=True, indent=2)
    serialized_counterbalance = json.dumps(counterbalance, ensure_ascii=True, indent=2)
    content = (
        "// Generated by scripts/build_stimulus_manifest.py. Do not hand-edit.\n"
        f"window.DATASET_VERSION = {json.dumps(DATASET_VERSION)};\n"
        f"window.STIMULUS_MANIFEST_VERSION = {json.dumps(MANIFEST_VERSION)};\n"
        f"window.STIMULUS_MANIFEST_HASH = {json.dumps(manifest_hash)};\n"
        f"window.STIMULUS_GENERATION_SEED = {GENERATION_SEED};\n"
        f"window.STIMULUS_SOURCE_WORKBOOK_SHA256 = {json.dumps(source_hash)};\n"
        f"window.COUNTERBALANCE_LISTS = {serialized_counterbalance};\n"
        f"window.FIXED_STIMULI = {serialized_profiles};\n"
    )
    output_path.write_text(content, encoding="ascii")
    print(json.dumps({"output": str(output_path), "profiles": len(profiles), "manifestSha256": manifest_hash}, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--output", type=Path, default=Path("fixed_stimuli.js"))
    args = parser.parse_args()
    workbook_path = args.workbook.resolve()
    sheets = read_xlsx(workbook_path)
    profiles = build_profiles(sheets["Applicant Data"])
    assign_ai_and_cues(profiles)
    counterbalance = parse_counterbalance(sheets["Counterbalance Map"])
    validate(profiles, counterbalance)
    write_manifest(args.output, profiles, counterbalance, hashlib.sha256(workbook_path.read_bytes()).hexdigest())


if __name__ == "__main__":
    main()
