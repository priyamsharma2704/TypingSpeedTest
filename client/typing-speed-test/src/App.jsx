import { useState, useEffect } from 'react'
import './App.css'

function App()
{
    const[quote,setQuote] = useState("");
    let charIndex = 0;
    async function getQuote()
    {
        const resp = await fetch('https://api.quotable.io/random');
        const responseQuote = await resp.json();
        console.log(responseQuote.content);
        setQuote(responseQuote.content);
    }

    function handleInputOnChange(e)
    {
        console.log(e.target.value);
        var quotesArray = quote.split("");
        var typedChar = e.target.value.split("")[charIndex];
        let charElement = document.querySelectorAll('[id=id_char]');
        if(typedChar == quotesArray[charIndex])
        {
            console.log("correct");
            charElement[charIndex].classList.add("correct");
            charElement[charIndex].classList.remove("incorrect");
        }
        else{
            console.log("incorrect");
            charElement[charIndex].classList.add("incorrect");
            charElement[charIndex].classList.remove("correct");
        }
        charIndex++;
    }

    useEffect(()=>
    {
        getQuote();
    },[])

    return (
        <>
        <div>
            <span id="stats">Time: 10</span> <span id="stats">WPM: 60</span><span id="stats">CPM: 58</span><span id="stats">Accuracy: 97</span>
        </div>
        <div className="quoteContainer">

            {quote.split('').map( (char, index) => (
                <span id='id_char' key={index}>{char}</span>
            ))}
        </div>
        <div>
            <input type='text' onChange={(e)=>handleInputOnChange(e)}></input>
        </div>
        </>
    )
}

export default App;