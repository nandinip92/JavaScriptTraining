function frizzbuzz(num){
    let n=1;
    let printMessage;
    while(n<=num){
        if(n%15===0) printMessage="FrizzBuzz";
        else if(n%3===0) printMessage = "Frizz";
        else if(n%5===0) printMessage="Buzz";
        else printMessage = n;
        n+=1;
        console.log(printMessage)
    }

}

frizzbuzz(100)