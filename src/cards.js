import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const SHUFFLE_URL = `https://deckofcardsapi.com/api/deck/new/shuffle/?count=1`

const Card = ()=>{
    const [currCard, setCurrCard] = useState(null)
    const [deck_id, setDeck_id] = useState(null)
    const [cardsE, setCardsE] = useState(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const timer = useRef(null)
    

    useEffect(()=>{
    async function get_deck(){
        let result = await axios.get(`${SHUFFLE_URL}`) 
        let deck_id = result.data.deck_id
        setDeck_id(deck_id)
    }
    get_deck()
}, [setDeck_id])

    useEffect(()=>{
        async function drawCard(){
            let result = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
    
                if(result.data.cards.length>0){
                let card = result.data.cards[0].image;
                setCurrCard(card)
                }
                else{
                setIsDrawing(false);
                setCardsE(<h2>no cards left, please refresh the page for a new deck!</h2>)
    }
}
    
    if(isDrawing && !timer.current){
        timer.current = setInterval(async()=>{ 
            await drawCard()
        },1000);
    }

        return ()=>{
            clearInterval(timer.current);
            timer.current = null
        };
    }, [isDrawing,setIsDrawing,deck_id]);
    

 const toggleAutoDraw = () =>{
        setIsDrawing(!isDrawing)
    }
 
        return(
    
            <div> 
             <button onClick={toggleAutoDraw}>{isDrawing ? "stop drawing" : "draw card"}</button>
             {cardsE ? <div style={{ color: 'red' }}>{cardsE}</div> : null}
             {currCard ?  <img src={currCard} alt="card " /> : <h2>loading...</h2> } 
            </div>
         )
}


export default Card