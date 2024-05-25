import { useState, useEffect } from 'react'
import './App.css'

function App()
{
    const[quote,setQuote] = useState("");
    const[timer,setTimer] = useState(0);
    const[cpm,setCpm] = useState(0);

    let currenTimer;
    let charIndex = 0;
    const maxTime = 60;
    let timeLeft = maxTime;
    let isTyping = false;
    let mistakes = 0;

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

        if(!isTyping)
        {
            currenTimer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        if(typedChar == null)
        {
            charIndex--;
            charElement[charIndex].classList.remove("correct", "incorrect");
        }
        else 
        {
            if(typedChar == quotesArray[charIndex])
            {
                console.log("correct");
                charElement[charIndex].classList.add("correct");
                charElement[charIndex].classList.remove("incorrect");
            }
            else
            {
                mistakes++;
                console.log("incorrect");
                charElement[charIndex].classList.add("incorrect");
                charElement[charIndex].classList.remove("correct");
            }
            charIndex++;
        }

        charElement.forEach(span=> span.classList.remove("active"));
        charElement[charIndex].classList.add("active");
        //let currCPM = charIndex - mistakes;
        //setCpm(currCPM);
    }

    function initTimer()
    {
        if(timeLeft > 0)
        {
            timeLeft--;
            //set timer state
            setTimer(timeLeft);
        }
        else
        {
            clearInterval(currenTimer);
            //clear timer state
            setTimer(0);
        }
    }

    useEffect(()=>
    {
        getQuote();
    },[])

    return (
        <>
        <div>
            <span id="stats" className='time'>Time: {timer}</span> <span id="stats">WPM: 60</span><span id="stats">CPM: {cpm}</span><span id="stats">Accuracy: 97</span>
        </div>
        <div className="quoteContainer">

            {quote.split('').map( (char, index) => (
                <span id='id_char' key={index}>{char}</span>
            ))}
        </div>
        <div>
            <input type='text' onChange={(e)=>handleInputOnChange(e)}></input>
        </div>
        <div>
            <button>Try Again</button>
        </div>
        </>
    )
}

export default App;