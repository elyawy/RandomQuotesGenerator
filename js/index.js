// const alphabet = ["A","B","C","D","E–F","G","H","I–J","K","L","M","N–O","P","Q–R","S","T–V","W–Z"];
// const apiEndPoint = "https://en.wikiquote.org/w/api.php";
const apiRandQuote = "https://en.wikiquote.org/w/api.php?action=query&generator=random&prop=extracts&exchars=1200&format=json&grnnamespace=0&origin=*";
const apiTwitter = "https://twitter.com/intent/tweet?hashtags=randomquotes&text=";
// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
// }

async function getQuote(){
    const response = await fetch(apiRandQuote);
    const jsonText = await response.json();
    const toExtract = jsonText.query.pages;
    
    let author = "";
    let quote = "";
    let extracted = []
    Object.keys(toExtract).forEach(item => {
      author = toExtract[item].title;
      quote = toExtract[item].extract;
    });

    quote = quote.replace(/</gi, "<><");
    let res = quote.split("<>").filter(item => item != "");
    
    let liCounter = 0;
    let ulCounter = 0;
    parsedQuote = []

    for(let i = 0;i < res.length; i++){
      let current = res[i].replace(">",">~")
      current = current.split("~").filter(item => item != "");
      current = current.filter(item => item != " ");
      current = current.filter(item => item != "\n");
      parsedQuote.push(...current);
    }

    quoteStack = []
    let finalQuote = "";
    let finalOrigin = "";

    for(let i = 0;i < parsedQuote.length; i++){
      if(parsedQuote[i] == "</li>"){
        break;
      }
      if(parsedQuote[i] == "<ul>"){
        ulCounter++;
      }
      if(liCounter == 1 && ulCounter == 1){
        finalQuote += parsedQuote[i];
      }
      if(liCounter == 2 && ulCounter == 2){
        finalOrigin += parsedQuote[i];
      }
      if(parsedQuote[i] == "<li>"){
        liCounter++;
      }
      if(ulCounter > 2){
        break;
      }
    }

    console.log(finalQuote);
    if(finalQuote == ""){
      getQuote();
    } else {
      document.getElementById("author").innerText = "-"+ author;
      document.getElementById("text").innerHTML = finalQuote;
      // const quoteText = $("#text").html($(result).text());

      document.getElementById("tweet-quote").setAttribute("href", apiTwitter + finalQuote+ "-"+author);
    }
     // 
    // document.getElementById("text").innerHTML =  myChange[0];
}



