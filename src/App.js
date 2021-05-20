import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState} from 'react';
import useAxios from  "./useAxios";

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

const useTitle=(initialTitle)=>{
  const [title, setTitle] = useState(initialTitle);
  const updateTitle=()=>{
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText=title;
  };
  useEffect(updateTitle, [title]);
  return setTitle;
}

const useClick = (onClick)=>{
  const element = useRef();
  useEffect(()=>{
    if(element.current){
      element.current.addEventListener("click", onClick);
    }
    return ()=>{
      if(element.current){
        element.current.removeEventListener("click", onClick);
      }
    };
  },[]);
  return element;
};

const useConfirm = (message="", onConfirm, onCancel) =>{
  if(!onConfirm && typeof onConfirm !== "function"){
    return;
  }
  if(!onCancel && typeof onCancel!== "function"){
    return;
  }
  const confirmAction = ()=>{
    if(window.confirm(message)){
      onConfirm();
    }else{
      onCancel();    
    }
  }
  return confirmAction;
};

const usePreventLeave =() =>{
    const lietener = event =>{
      event.preventDefault();
      event.returnValue="";
    }
    const enablePrevent = () =>  window.addEventListener("beforeunload", lietener);
    const disablePrevent = () =>window.removeEventListener("beforeunload", lietener);
    return {enablePrevent, disablePrevent};
}

const useBeforeLeave= onBefore=>{
  const handle = (event) =>{
    const {clientY} = event;
    if(clientY <= 0){
        onBefore();
    }
  }
  useEffect(()=>{
    document.addEventListener("mouseleave", handle);
    return ()=> document.removeEventListener("mouseleave", handle);
  }, []);
};

const useFadeIn = (duration =1, delay=0) =>{
  const element = useRef();
  useEffect(()=>{
    if(element.current){
      const { current} = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity=1;
    }
  },[]);
  return {ref:element, style:{opacity:0}};

}

const useNetwork = onChange =>{
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = ()=>{
    if(typeof onChange === "function"){
      onChange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };

  const removeListener =()=>{
    window.removeEventListener("online", handleChange);
    window.removeEventListener("offline",handleChange);
  }
  useEffect(()=>{
    window.addEventListener("online", handleChange);
    window.addEventListener("offline",handleChange);
    return removeListener;
  },[]);
  return status;

}

const useScroll =()=>{
  const [state, setState]= useState({
    x:0,
    y:0
  });

  const onScroll = (event)=>{
    console.log(event);
  }

  useEffect(()=>{
    window.addEventListener("scroll", onScroll);
    return ()=>window.removeEventListener("scroll", onScroll);
  }, [])
  return state;
}

const useFullScreen = (onFulls)=>{
  const element = useRef();
  const triggerFull = ()=>{
    if(element.current){
      element.current.requestFullscreen();
      if(onFulls && typeof onFulls ==="function"){
        onFulls(true);
      }
    }
  };
  const exitFull = ()=>{
    document.exitFullscreen();
    if(onFulls && typeof onFulls ==="function"){
      onFulls(false);
    }
  }
  return {element, triggerFull,exitFull};
}

const useNotification = (title, options)=>{
    if(!("Notification " in window)){
      return;
    }
    const fireNotif =()=>{
      if(Notification.permission !== "granted"){
        Notification.requestPermission().then(permission =>{
          if(permission === "granted"){
            new Notification(title,options);
          }else{
            return;
          }
        })
      }else{
        new Notification(title,options);
      }
    }
    return fireNotif;

};

const App=() =>{
  // const [item, setItem] = useState(1);
  // const incrementItem = () => setItem(item+1);
  // const decrementItem = () => setItem(item-1);
  const maxLen = value => value.length <10;
  const name = useInput("Mr.", maxLen);
  const {currentItem, changeItem} =useTabs(0, content);
  const [number, setNumber]= useState(0);
  const [aNumber, setAnumber]= useState(0);  
  const titleUpdater = useTitle("Loading ...");
  setTimeout(()=>titleUpdater("Home"), 5000);
  const sayHello = () => console.log("hello"); 
  useEffect(sayHello, [number]); 
  const input = useRef();
  const title = useClick(sayHello);
  const deleteTest = () =>console.log("Delete");
  const abort = ()=> console.log("abort");
  const confirmDelete = useConfirm("Are you Sure", deleteTest, abort);
  const {enablePrevent, disablePrevent} = usePreventLeave();
  const leave = () => console.log("leave");
  useBeforeLeave(leave);
  const el = useFadeIn(3,3);
  const handleNetowrkChange = online =>{
    console.log(online);
  }
  const onLine = useNetwork(handleNetowrkChange);
  const {y} = useScroll();
  const onFulls =(isFull) =>{
    console.log(isFull? "Full": "Small");
  }
  const {element, triggerFull,exitFull} = useFullScreen(onFulls);
  const triggerNotif = useNotification("Can you see this notification?");
  const {loading,data,error,refetch} = useAxios({url:"https://yts.mx/api/v2/list_movies.json"});
  console.log(loading,data,error, refetch);
  return ( 
    <div className="App" >
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 ref={title} style={{ color: y>100 ? "red":"blue"}}>Hello</h1>
        <h2 {...el}>Hooks</h2>
        <h3>{onLine? "online":"offline"}</h3>
        <input ref={input} placeholder="Name" {...name} />
        <button onClick={()=>setNumber(number+1)}>{number}</button>
        <button onClick={()=>setAnumber(aNumber+1)}>{aNumber}</button>
        <button onClick={confirmDelete}>Delete Confirm</button>
        <button onClick={enablePrevent}>Protect</button>
        <button onClick={ disablePrevent}>Unprotect</button>
        {content.map((section,index) => <button onClick={()=>changeItem(index)} key={section.id}>{section.tab}</button>)}
        {currentItem.content}
        {/* 
        <p>Hello {item} </p>
        <button onClick={incrementItem}>Increment</button>
        <button onClick={decrementItem}>Decrement</button> 
        */}
        <a 
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div  ref={element}>
        <img src="https://blog.kakaocdn.net/dn/p4J3g/btqwGiDHbAi/C3fRMHa1YPUb3tVlKG8Ouk/img.png"/>
        <button onClick={triggerFull}>Make full screen</button>
        <button onClick={exitFull}>Exit full screen</button>
        </div>
        <button onClick={triggerNotif}>Trigger Check</button>
        <button onClick ={refetch}>Reftech</button>
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


