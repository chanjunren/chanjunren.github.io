---
sidebar_position: 0
sidebar_label: Introduction
---
# Logical concepts
- Documents
	- Things you are searching for
	- Any structured JSON (not just text)
	- Has
		- unique ID
		- Type
- Index
	- Similar to a concept of table in relational databases
	- Contain 
		- inverted indices
		- mappings
	- Powers search into all documents within a collection of types
- Inverted index
	- ![[Pasted image 20230812154728.png]]
	 - ^ (VERY) Basic idea
  - Term Frequency: How often a term appears in a GIVEN document
  - Document Frequency: How often a term appears in ALL documents
  - Relevance: Term frequency / document frequency

# Term Frequency / Inverse Document Frequency

# Using Elasticsearch
# What's new in ES8

# How ES scales