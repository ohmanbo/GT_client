/* eslint-disable */
import React, { useState } from 'react';

function About() {

    let [likes,addLikes] = useState(0);

    let [내용,내용변경] = useState(
    ["Developer: SW, IGN: TimTam",
    "v0.3: update with Canvas and React for nicer look and more",
    "v0.2: Show recent griding info",
    "v0.1: Basic grid player info" ]); 

    function 제목바꾸기(){
      let newArray = [...내용];
      newArray[0] = "Test";
      내용변경(newArray);
    }

    return (
        <div className="About">
        
        <button className='button' onClick ={ 제목바꾸기 }>버튼</button>
      
        <div className="list">
          <h3> {내용} <span onClick={ ()=>{addLikes( likes + 1 );} }>👍</span> {likes} </h3>
          
  
  
        </div>
  
      </div>
    )
    
}

export default About;