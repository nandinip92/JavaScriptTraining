function frizzbuzz(num){
    let counter =1;
    let n=1;
    while(n<=num){
        if(n%15===0){
            console.log("FrizzBuzz")
        }
        else if(n%3===0){
            console.log("Frizz")
        }
        else if(n%5===0){
            console.log("Buzz")
        }
        else{
            console.log(n)
        }
        n+=1;
    }

}

frizzbuzz(100)