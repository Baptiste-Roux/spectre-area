import { Component } from "react";
import axios from 'axios';
import request from 'request';
import Router from 'next/router';

export default class github extends Component {
    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        axios({
            method: 'post',
            url: '/api/github',
            data: {
                client_id: "4e75d136f2e8375afa53",
                client_secret: "df05845f5c4dce31d4dd1634eb86364b544631d9",
                code: code
            }
        })
        .then(res => {
            let obj = {
                username: toString(res.data.user_id),
                password: toString(res.data.user_id)
            }
            request.post(
                'http://localhost:8080/api/v1/login',
                {json: obj},
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        sessionStorage.setItem("jwt_token", body['token']);
                        Router.push('/area');
                    } else {
                        request.post(
                            'http://localhost:8080/api/v1/users',
                            {json: obj},
                            function (error, response, body) {
                                if (!error && response.statusCode === 200) {
                                    sessionStorage.setItem("jwt_token", body['token']);
                                    Router.push('/area');
                                } else
                                    Router.push('/');
                            }
                        )
                    }
                }
            )
        })
    }

    render() {
        return (
            <span>Redirection</span>
        );
    }
}