import { GoogleLogout } from 'react-google-login';
import { Button } from 'react-bootstrap'

const clientId = "787968430434-mtu879hfgpcmmddohca7p93uvgcg8m1a.apps.googleusercontent.com";

export default function Logout({ text }) {
    const onSuccess = (res) => {
        console.log(res);
    }

    return (
        <GoogleLogout
            clientId={clientId}
            render={renderProps => (
                <Button id="Google" variant="outline-danger" onClick={renderProps.onClick} disabled={renderProps.disabled} size="lg" block>
                    {text}
                </Button>
            )}
            buttonText={text}
            onSuccess={onSuccess}
        />
    );
}