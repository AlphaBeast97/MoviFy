import { useEffect, useState } from "react"

// automatically imported built in feature
// any thing that starts with use is a hook
// hook are special function that let you use react features like state management

// new and recommended way

// state is like a react components brain
// they are reset after reload
// these are components that can change our time
const Card = ({ title }) => {
  // const [varName, setVar] = hook();
  // setVar is function that changes the varName.
  const [hasLiked, setHasLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`${title} Is Liked? ${hasLiked}`);
  }, [hasLiked]);// in "[]" we pass the value on change of which the useEffect will take place

  // common Use case 
  // it runs only one when mounting this component
  // for now it will run each time the card func is called
  // useEffect(() => {
  //   console.log("CARD RENDERED");
  // },[])
  
  return (
    // inline styling in form of like in Java script
    <div className="card" onClick={() => setCount((prevState) => ++prevState)}>
      <h2>{title} <br/> {count || null}</h2> {/* example of conditional rendering */}
      <button onClick={() => setHasLiked((prevState) => !prevState)}>{hasLiked? '❤️':'🤍'}</button>
    </div>
  )
}

// useEffect hook
// it lets you fetch data or delete component


// "<>" are called react fragments we can just use a normal div in place as well.
// i am already hating the debugging :(
  const App = () => {
    return (
    <div className="card-container"> 
      <Card title="Annabelle" rating={5.5} isCool={true} />
      <Card title="Star Wars: Episode IV - A New Hope" />
      <Card title="The Lion King" />
      {/* passing properties "title" is called "props" */}
      {/* the below thing is just like calling a function "Card" and passing a var "title" to it noice. */}
      {/* to pass something as a bool write it in {} */}
      {/* we can also pass objects like this (idk why i am surprised its a literal func call :) */}
    </div>
  )
}

export default App


