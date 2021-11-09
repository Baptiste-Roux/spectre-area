import { Component } from "react";
import styles from "../styles/login.module.css";
import Layout from '../components/layout';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import request from 'request';
import Router from 'next/router';
import Login from '../components/loginGoogle';

export default class login extends Component {
    state = {
        username: "",
        password: "",
    };

    componentDidMount() {
        if (typeof sessionStorage.getItem('jwt_token') !== null) {
            let tok = sessionStorage.getItem('jwt_token');
            if (tok != null) {
                Router.push('/area');
            }
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        let obj = {
            username: this.state.username,
            password: this.state.password
        }
        request.post(
            'http://localhost:8080/api/v1/login',
            {json: obj},
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    sessionStorage.setItem("jwt_token", body['token']);
                    Router.push('/area');
                } else
                    console.log(error);
            }
        )
    };

    render() {
        return (
            <Layout>
                <div className={styles.wrapper}>
                    <img className="logo_spectre" src="/static/spectre-area.png" alt="Sp3ctr3"/>
                    <div className={styles.form}>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control className="username" placeholder="Username" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} type="text"/>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control className="password" type="password" placeholder="Password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
                        </Form.Group>
                        <Button variant="outline-primary" type="submit" size="lg" block>LOGIN</Button>
                        <Button variant="outline-danger" size="lg" block onClick={() => {Router.push('/signup')}}>SIGN UP</Button>
                        <Button id="github" variant="outline-dark" size="lg" block href="https://github.com/login/oauth/authorize?client_id=4e75d136f2e8375afa53">Login w/ Github</Button>
                        <Login text="Login w/ Google"/>
                    </Form> 
                    </div>
                </div>
            </Layout>
        );
    }
}