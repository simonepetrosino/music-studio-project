import React, {useContext} from "react";
import Header from "../components/Header";
import {AuthContext} from '../context/AuthContext';
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext);
    return (
        <div>
            <Header />
            <form onSubmit={loginUser}>
                <input type="text"  name="username" placeholder="enter username" />
                <input type="password" name="password" placeholder="enter password" />
                <input type="submit"/> 
            </form>
        </div>

    );

    {/*const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
          username: formData.get('username'),
          password: formData.get('password')
      };
      loginUser(data);
    };


    return (
        <>
          <Form onSubmit={handleSubmit}>
            <Form.Floating className="mb-3" >
              <Form.Control
                id="floatingUsername"
                type="text"
                name="username"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingUsername">Username</label>
            </Form.Floating>
            <Form.Floating>
              <Form.Control
                id="floatingPassword"
                type="password"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </Form.Floating>
            <Button type="submit" className="mt-3" variant="primary">
              Login
            </Button>
          </Form>
        </>
      );*/}
};

export default LoginPage;