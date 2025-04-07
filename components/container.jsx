import Die from "./die"
import { useState, useRef, useEffect } from "react";
import Confetti from 'react-confetti'

export default function Container() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [count, setCount] = useState(0)
    const buttonRef = useRef(null)

    let gameWon = (dice.every(die => die.isHeld) && dice.every(die => die.value == dice[0].value))
    
    useEffect(()=>{gameWon ? buttonRef.current.focus():null},[gameWon])

    function hold(theID){
        let newdice = dice.map((element) => 
            element.key === theID ? {...element, isHeld: !element.isHeld} : {...element}
        )
        setDice(newdice)
    }

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                key: crypto.randomUUID()
            }));
    }

    function rollDice() {
        if(gameWon){
            setDice(generateAllNewDice())
            setCount(0)
        }else{
            setDice(olddie => 
                olddie.map( element => element.isHeld ? element: {...element, value: Math.ceil(Math.random() * 6) })
            )
            setCount(last => last+1)
        }
    }

    const diceElements = dice.map(dieObject => (
        <Die 
            key={dieObject.key}
            value={dieObject.value} 
            isHeld={dieObject.isHeld}
            hold={() => hold(dieObject.key)}
        />
    ));

    return (
        <main>
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <div className="titlee">
                <img src="Tenzies.svg"/>
                <h1 className="title">Tenzies Game</h1>
            </div>
            <div className="middle">
                <span className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</span>
                {!gameWon && <span className="counter">{count}</span>}
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            {gameWon && <span><b>Congrats!</b> You Won the game in <b> {count} </b> Rolls </span>}
            <button ref={buttonRef} className="roll-button" onClick={rollDice}>{gameWon?"New Game ?":"Roll"}</button>
            {gameWon && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
        </main>
    );
}
