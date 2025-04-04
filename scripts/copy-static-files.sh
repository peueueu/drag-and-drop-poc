if [ ! -d dist ]; then
  mkdir dist
fi

if [ -f index.html ]; then
  cp index.html dist/
fi

if [ -d src/assets ]; then
  cp -r src/assets dist/
fi