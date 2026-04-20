---
name: research-analysis
description: Advanced academic tool for auditing research methodologies, performing citation snowballing, and synthesizing literature into a gap-analysis matrix.
---

# Research Analysis Skill

Use this skill to deep-dive into academic papers (PDFs, ArXiv links, or text extracts) when you need a professional-grade literature review or methodological critique.

## Core Capabilities

1.  **Methodology Auditor**: A framework to extract and scrutinize the technical core of a paper (datasets, models, assumptions).
2.  **Synthesis Matrix**: A tool to compare multiple papers and identify specific "Research Gaps."
3.  **Citation Snowballing**: Logic to navigate from one paper to its references (backward) and its citations (forward).

## Usage Instructions

### 1. Methodology Audit
When tasked with "understanding" or "critiquing" a paper, follow this protocol:
- **Extract**: Identify the exact architecture (e.g., GRU layers, LightGBM parameters).
- **Assumptions**: List the unstated assumptions (e.g., "The dataset is stationary").
- **Critique**: Identify 3 potential failure points for real-world application.

### 2. Literature Synthesis
When given multiple papers, generate a comparison table with:
- **Objective**: What problem are they solving?
- **Dataset**: What was the scale/source?
- **Methodology**: What model was used?
- **Key Result**: What was the primary success?
- **Identified Gap**: What did they miss?

### 3. Citation Snowballing (Requires MCP)
Use the `arXiv` or `Semantic Scholar` MCP to:
- Find the "Parent" papers (references).
- Find the "Descendant" papers (citations since publication).

---

## Example Prompts

> *"Conduct a Methodology Audit on this paper [X]. Focus on the time-series decomposition steps."*

> *"Synthesize these 3 papers into a matrix and define the 'Unsolved Problem' for my retail forecasting project."*
