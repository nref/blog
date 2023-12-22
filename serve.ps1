zola build --base-url  "http://localhost:8000"
pushd public
python -m http.server 8000
popd
