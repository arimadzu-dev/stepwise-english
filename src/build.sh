#!/bin/bash
set -e
cd "$(dirname "$0")"
python3 - <<'PY'
t=open('template.html').read()
css=open('style.css').read()
js="\n".join(open(f).read() for f in ['vocab_a.js','vocab_b.js','grammar.js','content.js','core.js','views1.js','views2.js','views3.js','app.js'])
open('../index.html','w').write(t.replace('/*CSS*/',css).replace('/*JS*/',js))
PY
