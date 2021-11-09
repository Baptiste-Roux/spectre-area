import axios from 'axios';

export default function handler(req, res) {
    if (req.method == 'POST') {
        const body = {
            client_id: req.body.client_id,
            client_secret: req.body.client_secret,
            code: req.body.code
        };
        const opts = { headers: { accept: 'application/json' } };
        var xcess_token = "";
        axios
            .post('https://github.com/login/oauth/access_token', body, opts)
            .then(_res => {
                xcess_token = _res.data.access_token;
                var Bearer = "Bearer".concat(' ', xcess_token);
                var config = {
                    method: 'get',
                    url: 'https://api.github.com/user',
                    headers: { 
                        'Authorization': 'Bearer'+' '+xcess_token
                    }
                };
                axios(config)
                .then(function (response) {
                    res.status(200).json({ user_id: response.data.id })
                })
                .catch(function (error) {
                    console.log(error);
                });
            });
    }
}