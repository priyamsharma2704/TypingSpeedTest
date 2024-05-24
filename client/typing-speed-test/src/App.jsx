import { useState, useEffect } from 'react'
import './App.css'

function App()
{
    const[quote,setQuote] = useState("");
    
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
                <span key={index}>{char}</span>
            ))}
        </div>
        <div>
            <input type='text' onChange={(e)=>handleInputOnChange(e)}></input>
        </div>
        </>
    )
}

export default App;