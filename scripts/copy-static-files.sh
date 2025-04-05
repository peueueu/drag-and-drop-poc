if [ ! -d dist ]; then
  mkdir dist
fi

if [ -f index.html ]; then
  cp index.html dist/
fi

if [ -d ./assets/ ]; then
  cp -r ./assets/ dist/
fi