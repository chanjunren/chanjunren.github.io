🗓️ 02102024 1120
📎

# n_gram
## Definition
> A contiguous sequence of `n` items (or tokens) from a given text or speech


In the context of text processing, n-grams are typically sequences of words or characters

Commonly used in:
- **natural language processing (NLP)**
- search engines
- text analytics 

## Types
> Example sentence: The quick brown fox

| Type               | Description                                                                                                                                          | Example                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Unigram (1-grams)  | Single tokens / words                                                                                                                                | ["The", "quick", "brown", "fox"]                                      |
| Bigrams (2-grams)  | Sequences of two consecutive tokens / characters                                                                                                     | ["The quick", "quick brown", "brown fox"]                             |
| Trigrams (3-grams) | Sequences of three consecutive tokens / characters                                                                                                   | ["The quick brown", "quick brown fox"]                                |
| Character N-grams  | Instead of splitting the text into words, n-grams can also be generated at the **character** level<br><br>Useful for **substring matching / search** | Bigrams at the character level for the word "fox"<br><br>["fo", "ox"] |

## Why Use N-grams?

### Substring Matching
- Flexible substring matching >  [[es_ngram]]
-  By splitting text into smaller n-grams (such as character n-grams), you can match parts of a word or sentence even if the exact term isn’t present in the document

- Example: For the word "Elasticsearch", if you use trigrams, the following trigrams would be generated:
    - ["Ela", "las", "ast", "sti", "tic", "sea", "ear", "rch"]
- This allows you to match the word even if only part of the term is in the search query (e.g., "sea").

### Handling Typos and Variations

N-grams can help in **fuzzy searching**, where you need to find results that may contain spelling mistakes, typos, or variations of a word

By breaking the text into smaller tokens, a system can better handle these variations.
- Example: Searching for "quick fox" might still match "quikc fxo" if n-grams are used, as the system can recognize the similarity in the n-grams between the two phrases.

### Context and Word Co-occurrence
For NLP tasks, n-grams are useful for 
- analyzing the **context** in which words occur
- Bigrams or trigrams can be used to understand the relationships between words in a text.

- Example: "New York City" as a trigram carries more specific meaning than treating each word as a separate unit (unigrams).

### Improving Search Accuracy
In search engines, breaking down text into n-grams can allow more precise and varied matches

This is especially useful for **partial matches**, where you want the search to return relevant results even if the exact phrase isn’t found.

---

# References
