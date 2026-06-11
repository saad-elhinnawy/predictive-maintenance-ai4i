FROM node:20
WORKDIR /app
RUN node -e "require('fs').writeFileSync('s.js', \
  'const h=require(\"http\");' + \
  'const p=+(process.env.PORT||4000);' + \
  'h.createServer((_,r)=>{r.writeHead(200,{\"Content-Type\":\"application/json\"});r.end(\"{\\\"status\\\":\\\"ok\\\"}\");})' + \
  '.listen(p,()=>console.log(\"READY port\",p));' \
)"
CMD ["node", "s.js"]
