import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';


const content =[
  {
    id:0,
    tab:"section 1",
    content:"I'm the content of the section1"
  },
  {
    id:1,
    tab:"section 2",
    content:"I'm the content of the section2"
  },
];

const useTabs = (initialTab, allTabs)=>{
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  if(!allTabs || !Array.isArray(allTabs)){
    return;
  }
  return{
    currentItem: allTabs[currentIndex],
    changeItem: setCurrentIndex,
  };
}

const useInput = (initialValue, validator)=>{
  const [value,setValue] =useState(initialValue);
  const onChange = event =>{
    const {
      target:{value}
    }=event;
    let willUpdate =true;
    if(typeof validator === "function"){
      willUpdate=validator(value);
    }
    if(willUpdate){
      setValue(value);
    }
  };
  return {value, onChange};
}

const App=() =>{
  // const [item, setItem] = useState(1);
  // const incrementItem = () => setItem(item+1);
  // const decrementItem = () => setItem(item-1);
  const maxLen = value => value.length <10;
  const name = useInput("Mr.", maxLen);
  const {currentItem, changeItem} =useTabs(0, content);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello</p>
        <input placeholder="Name" {...name} />
        {content.map((section,index) => <button onClick={()=>changeItem(index)} key={section.id}>{section.tab}</button>)}
        {currentItem.content}
        {/* <p>Hello {item} </p>
        <button onClick={incrementItem}>Increment</button>
        <button onClick={decrementItem}>Decrement</button> */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App;

// class AppComponent extends React.Component{
//   state={
//     item:1
//   }
//   render(){
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>Hello {this.state.item} </p>
//           <button onClick={this.incrementItem}>Increment</button>
//           <button onClick={this.decrementItem}>Decrement</button>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
   
//   incrementItem=()=>{
//     this.setState(state =>{
//       return{
//         item:state.item+1
//       };
//     });
//   };

//   decrementItem=()=>{
//     this.setState(state =>{
//       return{
//         item:state.item-1
//       };
//     });
//   }

// }


