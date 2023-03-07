import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = (props) => {
  const [credentials,setcredentials]=useState({email:"",password:""});
  let history=useHistory();
    const handleSubmit=async(e)=>{ 
      e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({email:credentials.email,password:credentials.password})
      });
      const json=await response.json();
      console.log(json);
      if(json.success)
      {
        // Save the auth token and redirect..
        localStorage.setItem('token',json.authtoken);
        props.showAlert('Logged in successfully',"success");
        history.push("/");
      }else{
        props.showAlert('Invalid Credentials',"danger");
      }
    }
    const onChange=(e)=>{
      setcredentials({...credentials,[e.target.name]:e.target.value});
    }
  return (
    <div className="mt-3">
      <h2>Login to continue iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            value={credentials.email}
            className="form-control"
            name="email"
            id="email"
            aria-describedby="emailHelp"
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={credentials.password}
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
          />
        </div>
        
        <button type="submit" className="btn btn-primary my-3" >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
