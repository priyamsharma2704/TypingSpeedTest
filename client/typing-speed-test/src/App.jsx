import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
    const [quote, setQuote] = useState("");
    const [timer, setTimer] = useState(60);
    const [cpm, setCpm] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const charIndexRef = useRef(0);
    const mistakesRef = useRef(0);
    const intervalRef = useRef(null);
    const inputRef = useRef(null); // Add a ref for the input element
    const maxTime = 60;

    async function fetchQuote() {
        const resp = await fetch('https://api.quotable.io/random');
        const responseQuote = await resp.json();
        setQuote(responseQuote.content);
        charIndexRef.current = 0;
        mistakesRef.current = 0;
        resetCharClasses();
        if (inputRef.current) {
            inputRef.current.value = ""; // Clear the input value
            inputRef.current.focus(); // Set focus to the input element
        }
    }

    async function getQuote() {
        await fetchQuote();
        if (timer === 0) {
            setTimer(maxTime);
        }
        setIsTyping(false);
        clearInterval(intervalRef.current);
    }

    function resetCharClasses() {
        const charElements = document.querySelectorAll('[id=id_char]');
        charElements.forEach(charElement => {
            charElement.classList.remove('correct', 'incorrect', 'active');
        });
    }

    function handleInputOnChange(e) {
        const quotesArray = quote.split("");
        const typedChar = e.target.value.split("")[charIndexRef.current];
        const charElement = document.querySelectorAll('[id=id_char]');

        if (!isTyping) {
            setIsTyping(true);
            intervalRef.current = setInterval(initTimer, 1000);
        }

        if (typedChar == null) {
            if (charIndexRef.current > 0) {
                charIndexRef.current--;
                charElement[charIndexRef.current].classList.remove("correct", "incorrect");
            }
        } else {
            if (typedChar === quotesArray[charIndexRef.current]) {
                charElement[charIndexRef.current].classList.add("correct");
                charElement[charIndexRef.current].classList.remove("incorrect");
            } else {
                mistakesRef.current++;
                charElement[charIndexRef.current].classList.add("incorrect");
                charElement[charIndexRef.current].classList.remove("correct");
            }
            charIndexRef.current++;
        }

        charElement.forEach(span => span.classList.remove("active"));
        if (charIndexRef.current < quotesArray.length) {
            charElement[charIndexRef.current].classList.add("active");
        }

        if (charIndexRef.current === quotesArray.length) {
            clearInterval(intervalRef.current);
            setCpm((charIndexRef.current - mistakesRef.current) / ((maxTime - timer) / 60));
            setIsTyping(false);
            setTimeout(() => {
                fetchQuote();
            }, 1000); // Load new quote after 1 second
        }
    }

    function initTimer() {
        setTimer(prevTimer => {
            if (prevTimer > 0) {
                return prevTimer - 1;
            } else {
                clearInterval(intervalRef.current);
                setIsTyping(false);
                return 0;
            }
        });
    }

    function resetGame() {
        setTimer(maxTime);
        setCpm(0);
        setIsTyping(false);
        clearInterval(intervalRef.current);
        fetchQuote();
    }

    useEffect(() => {
        fetchQuote();
    }, []);

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <>
            <div>
                <span id="stats" className='time'>Time: {timer}</span>
                <span id="stats">WPM: {(cpm / 5).toFixed(2)}</span>
                <span id="stats">CPM: {cpm.toFixed(2)}</span>
                <span id="stats">Accuracy: {charIndexRef.current > 0 ? (((charIndexRef.current - mistakesRef.current) / charIndexRef.current) * 100).toFixed(2) : 100}%</span>
            </div>
            <div className="quoteContainer">
                {quote.split('').map((char, index) => (
                    <span id='id_char' key={index}>{char}</span>
                ))}
            </div>
            <div>
                <input type='text' ref={inputRef} onChange={(e) => handleInputOnChange(e)}></input>
            </div>
            <div>
                <button onClick={resetGame}>Try Again</button>
            </div>
        </>
    );
}

export default App;
