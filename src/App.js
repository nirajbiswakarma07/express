import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 5000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };


  // our delete method that uses our backend api 
  // to remove existing database information
   deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    idTodelete = parseInt(idTodelete);
    this.state.data.forEach(dat => {
      if(idTodelete===""){
        return
      }
      else if (dat.id === idTodelete) {
        objIdToDelete = dat;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        obj: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat;
      }
    });

    axios.post("/api/updateData", {
      obj: objIdToUpdate,
      update: { message: updateToApply }
    });
  };


  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
       <div className="container-fluid"> 
       <h1 style={{backgroundColor:"purple",color:"yellow",textAlign:"center",border:"2px solid black"}}>DATA</h1>
       <ul style={{listStyleType:"square" ,backgroundColor:"pink",border:"2px solid black"}}>
          {data.length <= 0
            ? "NO DATA IN DATABASE YET"
            : data.map(dat => (
                <li style={{ padding: "15px" }} key={data.message}>
                  <span style={{ color: "blue" }}> Id: </span> {dat.id}&nbsp;=>
                  <span style={{ color: "purple" }}> Data: </span>
                  {dat.message}
                </li>
              ))}
        </ul>
  
      <span >
        <div style={{ padding: "10px" ,backgroundColor:"black"}}>
          <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="Enter some data"
            style={{ width: "300px" ,color:"black",border:"2px solid purple" }}
          />&nbsp;&nbsp;
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{ padding: "10px" ,backgroundColor:"black" }}>
          <input
            type="text"
            style={{ width: "300px",color:"black",border:"2px solid purple" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="Id of item to delete"
          />&nbsp;&nbsp;
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: "10px" ,backgroundColor:"black" }}>
          <input
            type="text"
            style={{ width: "300px" ,color:"black" ,border:"2px solid purple"}}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="Id of item to update"
          />&nbsp;&nbsp;
          <input
            type="text"
            style={{ width: "300px" ,color:"black",border:"2px solid purple"}}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />&nbsp;&nbsp;
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
          </div>
       </span>
     </div>
    );
  }
}

export default App;