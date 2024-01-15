function frizzbuzz(num){
    let n=1;
    
    while(n<=num){
        let printMessage='';
        // if(n%15===0) printMessage="FrizzBuzz";
        if(n%3===0) printMessage = "Frizz";
        if(n%5===0) printMessage+="Buzz";
        if(n%7===0) printMessage+="Bang";
        if(printMessage===''){
            console.log(n)
        }
        else{
            console.log(printMessage)
        }
        n+=1;
    }
}

frizzbuzz(30)