import { GoogleLogin } from 'react-google-login';
import { Button } from 'react-bootstrap';
import request from 'request';
import Router from 'next/router';

const clientId = "787968430434-mtu879hfgpcmmddohca7p93uvgcg8m1a.apps.googleusercontent.com";

const refreshTokenSetup = (res) => {
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

    const refreshToken = async () => {
        const newAuthRes = await res.reloadAuthResponse();
        refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
        setTimeout(refreshToken, refreshTiming);
    }

    setTimeout(refreshToken, refreshTiming);
}

export default function Login({ text }) {
    const onSuccess = (res) => {
        refreshTokenSetup(res);
        let obj = {
            username: toString(res.googleId),
            password: toString(res.googleId)
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
    }

    const onFailure = (res) => {
        console.log(res);
    }

    return (
        <GoogleLogin
            clientId={clientId}
            render={renderProps => (
                <Button id="Google" variant="outline-danger" onClick={renderProps.onClick} disabled={renderProps.disabled} size="lg" block>
                    {text}
                </Button>
            )}
            buttonText={text}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
        />
    );
}