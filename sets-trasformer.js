//requiring path and fs modules
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const componentsPath='source/components'

const sets=[]

fs.readFile("figma-tokens.json", "utf-8", (err, data) => {
  if (err) {
    throw err;
  }

  const tokensObj = JSON.parse(data.toString());

  Object.entries(tokensObj).forEach(([setName, setValues]) => sets.push(setName));

  const allSets = sets.join(',')
  sets.map(set =>{
    const isComponent = set.includes('component')
    const exclude = sets.filter(s => s!==set).join(',')
    const path=isComponent?'components':'themes'
    const options=isComponent?'--preserveRawValue=true --resolveReferences=false':''
    const cmd= `token-transformer figma-tokens.json tokens/${path}/${set}.json ${allSets} ${exclude} ${options}`
    console.log(`Creating tokens/${path}/${set}.json`)
    exec(cmd)
  })
});