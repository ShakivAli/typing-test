import React, { useState, useRef, useEffect } from 'react'
import { quotesArray, random, allowedKeys } from './Helper'
import ItemList from './components/ItemList'
import './App.css'

let interval = null

const App = () => {
	const inputRef = useRef(null)
	const outputRef = useRef(null)
	const [ duration, setDuration ] = useState(60)
	const [ started, setStarted ] = useState(false)
	const [ ended, setEnded ] = useState(false)
	const [ index, setIndex ] = useState(0)
	const [ correctIndex, setCorrectIndex ] = useState(0)
	const [ errorIndex, setErrorIndex ] = useState(0)
	const [ quote, setQuote ] = useState({})
	const [ input, setInput ] = useState('')
	const [ cpm, setCpm ] = useState(0)
	const [ wpm, setWpm ] = useState(0)
	const [ accuracy, setAccuracy ] = useState(0)
	const [ isError, setIsError ] = useState(false)
	const [ lastScore, setLastScore ] = useState('0')

	useEffect(() => {
		const newQuote = random(quotesArray)
		setQuote(newQuote)
		setInput(newQuote.quote)
	}, [])

	const handleEnd = () => {
		setEnded(true)
		setStarted(false)
		clearInterval(interval)
	}

	const setTimer = () => {
		const now = Date.now()
		const seconds = now + duration * 1000
		interval = setInterval(() => {
			const secondLeft = Math.round((seconds - Date.now()) / 1000)
			setDuration(secondLeft)
			if (secondLeft === 0) {
				handleEnd()
			}
		}, 1000)
	}

	const handleStart = () => {
		setStarted(true)
		setEnded(false)
		setInput(quote.quote)
		inputRef.current.focus()
		setTimer()
	}

	const handleKeyDown = e => {
		e.preventDefault()
		const { key } = e
		const quoteText = quote.quote

		if (key === quoteText.charAt(index)) {
			setIndex(index + 1)
			const currenChar = quoteText.substring(index + 1, index + quoteText.length)
			setInput(currenChar)
			setCorrectIndex(correctIndex + 1)
			setIsError(false)
			outputRef.current.innerHTML += key
		} else {
			if (allowedKeys.includes(key)) {
				setErrorIndex(errorIndex + 1)
				setIsError(true)
				outputRef.current.innerHTML += `<span class="text-danger">${key}</span>`
			}
		}

		const timeRemains = ((60 - duration) / 60).toFixed(2)
		const _accuracy = Math.floor((index - errorIndex) / index * 100)
		const _wpm = Math.round(correctIndex / 5 / timeRemains)

		if (index > 5) {
			setAccuracy(_accuracy)
			setCpm(correctIndex)
			setWpm(_wpm)
		}

		if (index + 1 === quoteText.length || errorIndex > 50) {
			handleEnd()
		}
	}

	useEffect(
		() => {
			if (ended) localStorage.setItem('wpm', wpm)
		},
		[ ended, wpm ]
	)
	useEffect(() => {
		const stroedScore = localStorage.getItem('wpm')
		if (stroedScore) setLastScore(stroedScore)
	}, [])

	return (
		<div className="App">
			<div className="container-fluid pt-4">
				<div className="row" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
					{/* Body */}
					<div className="">
						<div className="container">
							
							{ended ? (
								<div className="bg-dark text-light p-4 mt-5 lead rounded">
									<span>"{quote.quote}"</span>
									<span className="d-block mt-2 text-muted small">- {quote.author}</span>
								</div>
							) : started ? (
								<div
									className={`text-light mono quotes${started ? ' active' : ''}${isError
										? ' is-error'
										: ''}`}
									tabIndex="0"
									onKeyDown={handleKeyDown}
									ref={inputRef}
								>
									{input}
								</div>
							) : (
								<div className="mono quotes text-muted" tabIndex="-1" ref={inputRef}>
									{input}
								</div>
							)}

							<div className="text-center mt-4 header">
								<div className="">
									{ended ? (
										<button
											className="btn btn-outline-danger"
											onClick={() => window.location.reload()}
											style={{background:"#501b1d", padding:"10px 90px"}}
										>
											RESTART
										</button>
									) : started ? (
										<button className="btn btn-outline-success" style={{background:"#eb4841", padding:"10px 90px"}} disabled>
											HURRY
										</button>
									) : (
										<button className="btn btn-outline-success" style={{background:"rgb(124,194,173)", padding:"10px 90px"}} onClick={handleStart}>
											START!
										</button>
									)}
									<span className="btn-circle-animation" />
								</div>
							</div>

							<div className="p-4 mt-4 bg-dark text-light rounded lead" ref={outputRef} />

							<hr className="my-4" style={{backgroundColor:"white"}} />
							<div className="mb-5">
								<h6 className="py-2" style={{color:"white"}}>Average Typing Speeds</h6>
								<div className="d-flex text-white meter-gauge">
									<span className="col" style={{ background: '#eb4841' }}>
										0 - 20 Slow
									</span>
									<span className="col" style={{ background: '#f48847' }}>
										20 - 40 Average
									</span>
									<span className="col" style={{ background: '#ffc84a' }}>
										40 - 60 Fast
									</span>
									<span className="col" style={{ background: '#a6c34c' }}>
										60 - 80 Professional
									</span>
									<span className="col" style={{ background: '#4ec04e' }}>
										80 - 100+ Top
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className='master-row' style={{display:"flex", gap:"5px"}}>

					{/* Left */}
					<div className="">
						<ul className="list-unstyled text-center small" style={{display:"flex", flexDirection:"row", gap:"5px"}}>
							<ItemList
								name="WPM"
								data={wpm}
								style={
									wpm > 0 && wpm < 20 ? (
										{ color: 'white', backgroundColor: '#eb4841' , padding: "50px"}
									) : wpm >= 20 && wpm < 40 ? (
										{ color: 'white', backgroundColor: '#f48847' , padding: "50px"}
									) : wpm >= 40 && wpm < 60 ? (
										{ color: 'white', backgroundColor: '#ffc84a' , padding: "50px"}
									) : wpm >= 60 && wpm < 80 ? (
										{ color: 'white', backgroundColor: '#a6c34c' , padding: "50px"}
									) : wpm >= 80 ? (
										{ color: 'white', backgroundColor: '#4ec04e' , padding: "50px"}
									) : (
										{ padding: "50px", color:"white"}
									)
								}
							/>
							<ItemList name="CPM" data={cpm} style={{padding: "50px", color:"white"}}/>
							<ItemList name="Last Score" data={lastScore} style={{padding: "50px", color:"white"}}/>
						</ul>
					</div>

					{/*Right*/}

					<div className="">
						<ul className="list-unstyled text-center small" style={{display:"flex", flexDirection:"row", gap:"5px"}}>
							<ItemList style={{padding:"50px", color:"white"}} name="Timer" data={duration} />
							<ItemList style={{padding:"50px", color:"white"}} name="Errors" data={errorIndex} />
							<ItemList style={{padding:"50px", color:"white"}} name="Acuracy" data={accuracy} symble="%" />
						</ul>
					</div>

                    </div>  

				</div>
			</div>
		</div>
	)
}

export default App
