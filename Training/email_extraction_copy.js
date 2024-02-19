const fs= require('node:fs');
const prompt = require('prompt-sync')();


function readTextFile(){
    try{
        const data = fs.readFileSync('./test.txt','utf-8');
        return data;
    }
    catch(err){
        console.log(err);
    }
}

function emailExtraction(){
    const domains = regexSearch();
    const domainDict = domainsFrequency(domains)
    const dictKeys=top10Domains(domainDict)
    getUserInput(dictKeys);
    topLevelDomains(domains)

}   

function regexSearch(){
    const fileData = readTextFile();
    const regex = /\w+([.'_%+-]?\w+)@\w+([.'_%+-]?\w+)*(\.\w{2,3})/g
    const emails = fileData.match(regex);
    const domains = emails.map(domain=> domain.slice(domain.indexOf("@")));
    return domains;
}
function domainsFrequency(domains){
    const domainDict ={};
    domains.forEach(d=> domainDict[d]=domainDict[d]+1||1)
    console.log(domainDict);
    const highestDomain= Object.keys(domainDict).reduce((a,b)=> domainDict[a]>domainDict[b]?a:b)
    console.log("Highest repeated domain:",highestDomain);
    return domainDict;
}

function top10Domains(domainDict){
    const dictKeys = Object.keys(domainDict).map(key => [key, domainDict[key]]);
    dictKeys.sort((a, b) => b[1] - a[1] )
    let top10Domains=[]
    for (let i = 0; i < 10; i++){
        top10Domains.push(dictKeys[i][0]);
    }
    console.log("Top 10 Domains:\n",top10Domains);
    return dictKeys;
}

function topLevelDomains(domains){
    console.log("---topLevelDomains----")
    const regex = /@\w+(['_%+-]?\w+)/g
    const onlyTopDomains={}
    domains.map(d=>d.match(regex).pop()).forEach(d=> onlyTopDomains[d]=onlyTopDomains[d]+1||1)
    console.log(onlyTopDomains)

}
function getUserInput(dictKeys){
    const input = prompt('What frequency would you like to check? ');
    const intInput = parseInt(input);
    const sortArray = dictKeys.filter((d) => d[1] > intInput);
    console.log(sortArray);
    
}


function emailExtraction1(){

    const fileData = readTextFile();

    let counter = 0;
    const data = fileData.split(' ');
    // console.log(data);
    const domains = data.filter(domain => domain.endsWith('@softwire.com')).map(d=> d.slice(d.indexOf("@"))).length;
    console.log(domains);
}



emailExtraction();
