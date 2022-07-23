java -jar compiler.jar --js_output_file script.js *.js
call javascript-obfuscator script.js -o ../script.js --self-defending true --log true
del script.js