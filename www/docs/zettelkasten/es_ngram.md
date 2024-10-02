🗓️ 02102024 1122
📎 #wip

# es_n_gram
## How N-grams Work in Elasticsearch

In Elasticsearch, [[n_gram]] are often used in custom analyzers to tokenize text at either the word or character level. These n-grams are then stored in the index, enabling more flexible and powerful search queries.

#### Example: N-gram Tokenization

Let’s say you’re indexing the word "Elasticsearch" using trigrams (3-grams):

- Trigrams (character-level): `["Ela", "las", "ast", "sti", "tic", "sea", "ear", "rch"]`

Now, if you search for "sea", Elasticsearch can match it against the trigram "sea" in "Elasticsearch" even though "sea" isn't a full word on its own. This is particularly useful for **substring matching**.

#### Edge N-grams

Edge n-grams are a specific type of n-gram that are built from the start (or end) of a token, making them very useful for **prefix matching**.

For the word "fox" with edge n-grams of length 1 to 3:

- Edge n-grams: `["f", "fo", "fox"]`

This allows Elasticsearch to match any prefix of the word "fox" in a search query, making it behave similarly to a **prefix trie**.

### Configuring N-grams in Elasticsearch

You can configure n-grams in Elasticsearch by defining a custom analyzer with an **n-gram tokenizer**. Here’s an example of how to configure character n-grams:



`PUT /my_index `
```json
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "ngram_tokenizer": { "type": "ngram", "min_gram": 2, "max_gram": 3 }
      },
      "analyzer": {
        "ngram_analyzer": { "type": "custom", "tokenizer": "ngram_tokenizer" }
      }
    }
  },
  "mappings": {
    "properties": {
      "text_field": { "type": "text", "analyzer": "ngram_analyzer" }
    }
  }
}

```

This creates a tokenizer that splits the text into n-grams of size 2 to 3, allowing Elasticsearch to perform substring searches efficiently.

---

# References
- ChatGPT