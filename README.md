# This is a repository for Martin Yankov's personal website

## Gitlab CI is used to ensure proper Spelling and Markdown Linting 

### Spellchecking

1. Install & [spellchecker-cli](#https://github.com/tbroadley/spellchecker-cli.git), as well as retext plugins used:

```bash
npm install -g markdownlint-cli spellchecker-cli retext-spell retext-indefinite-article retext-repeated-words retext-syntax-mentions retext-syntax-urls
```

2.Check spelling and generate a dictionary of words

```bash
spellchecker --files '**/*.md' -p spell indefinite-article repeated-words syntax-mentions syntax-urls --generate-dictionary
```

- Check the generated dictionary.txt and ensure that these words are to be ignored

3. Check spelling and ignore words in dictionary.txt

```bash
spellchecker --files '**/*.md' -p spell indefinite-article repeated-words syntax-mentions syntax-urls -d dictionary.txt
```

### Linting

1. Install [markdownlint-cli](#https://github.com/igorshubovych/markdownlint-cli):

```bash
npm install -g markdownlint-cli spellchecker-cli retext-spell retext-indefinite-article retext-repeated-words retext-syntax-mentions retext-syntax-urls
```

2. Check and fix linting

- Detect errors

```bash
markdownlint-cli '**/*.md' --ignore node_modules
```

- Fix errors (*Note: line-length is not fixed automatically*):

```bash
markdownlint-cli --fix '**/*.md' --ignore node_modules
```

- Additionally, spellchecker-cli can be used with the remark-frontmatter plugin to fix additional problems:

```bash
spellchecker --files '**/*.md' -p frontmatter -d dictionary.txt
```
markd