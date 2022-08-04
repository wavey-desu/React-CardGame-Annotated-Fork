import { useState, useEffect } from 'react'
import './App.css'
import SingleCard from './components/SingleCard'

const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false },
]

function App() {
  const [cards, setCards] = useState([]) //suffled cards state
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)

  // shuffle cards for new game
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages] //Spread syntax on prev arrays to combine and make new one
      .sort(() => Math.random() - 0.5) //Shuffle cards with .sort (<0 is remain in order | >0 is change order)
      .map((card) => ({ ...card, id: Math.random() })) //Give each card state a random id
      
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
  }

  // handle a choice
  const handleChoice = (card) => {
    console.log(card)
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card) //if choiceOne=null then setChoiceOne fires (:right) else (left:)
  }

  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) { //if there was 2 cards selected
      setDisabled(true) //set to true while comparing cards

      if (choiceOne.src === choiceTwo.src) { //if .src(url) is equal
        setCards(prevCards => { // use prevstate of cards to set new state
          return prevCards.map(card => { //return new array of cards | map through cards object
            if (card.src === choiceOne.src) { //checks if iterated card === choice cards
              return { ...card, matched: true } //return a new card object with the spreaded card properties (src,matched) and set matched=>true
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else { //choices not equal
        setTimeout(() => resetTurn(), 1000) //1s delay to see both choices
      }

    }
  }, [choiceOne, choiceTwo]) //fires everytime choiceOne or choiceTwo changes

  // reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1) //using a function to update prev value of state
    setDisabled(false)
  }

  // start new game automatically
  useEffect(() => {
    shuffleCards()
  }, []) //fires only once, at document laod

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map(card => ( //map cards state 
          <SingleCard //pass card props
            key={card.id}
            card={card}
            handleChoice={handleChoice} //pass handlechoice function as prop
            flipped={card === choiceOne || card === choiceTwo || card.matched} //set flipped true if any condition
            disabled={disabled}
          />
        ))}
      </div>

      <p>Turns: {turns}</p>
    </div>
  );
}

export default App
