import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react'

const Home = ()=>{
  const [jokes, setJokes] = useState([]);

  useEffect(()=>{
    axios.get('/api/jokes')
    .then((res)=>{
      setJokes(res.data);
    })
    .catch((error)=>{
      console.log(error);
    })
  },[]);

  return (
     <>
      <h1> hello kripal</h1>
      <p>
        {
           jokes.map((joke,index) =>(
          <div key={joke.id}>
            <p>{joke.joke}</p>

          </div>
        ))
        }
       
      </p>
    </>
  )
}
export default Home;