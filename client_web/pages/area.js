import React from "react"
import styles from "../styles/area.module.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import {Alert, Button, Form, FormControl, InputGroup, ListGroup, Modal} from 'react-bootstrap'
import request from "request"
import Router from 'next/router'
import ReactModal from 'react-modal'

class App extends React.PureComponent {

    constructor(props) {
        super(props)
        let action_service = 'Coinbase'
        let action = 'Value'

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.state = {
            showModal: false,
            jwt: '',
            hash: '',
            action_service: action_service,
            action: action,
            actions: {
                "Meteo": {
                    "actions": ["Forecast", "Alert", "BadWeather"],
                    "inputs": ["city"],
                    "reaction": ["Discord", "Slack"]
                },
                "Covid": {
                    "actions": ["News"],
                    "inputs": [],
                    "reaction": ["Discord", "Slack"]
                },
                "Twitch": {
                    "actions": ["Live", "ImLive"],
                    "inputs": ["streamer", "OAuth"],
                    "reaction": ['Discord', "Slack"]
                },
                "Github": {
                    "actions": ["Star", "Issue", "PullRequest"],
                    "inputs": ['token', 'username', 'repo'],
                    "reaction": ['Discord', "Slack"]
                },
                "Coinbase": {
                    "actions": ["Value"],
                    "inputs": ['crypto', "value"],
                    "reaction": ['Discord', "Slack"]
                },
                "Scheduler": {
                    "actions": ["Everyday", "EveryX"],
                    "inputs": ['interval', 'hour'],
                    "reaction": ['Discord', "Slack"]
                },
                "Rss": {
                    "actions": ["Feed"],
                    "inputs": ["url"],
                    "reaction": ["Discord", "Slack"]
                },
                "DiscordBot": {
                    "actions": ["DM"],
                    "inputs": ['token'],
                    "reaction": ["Discord", "Slack"]
                }
            },
            reaction_service: 'Discord',
            reactions: {
                "Slack": {
                    "reactions": ["Webhook"],
                    "inputs": ["channel"]
                },
                "Discord": {
                    "reactions": ["Channel", "DM", "Webhook"],
                    "inputs": ['id', 'url']
                }
            },
            reaction: "Channel",
            inputs_action: {},
            inputs_reaction: {}
        }
    }

    handleOpenModal() {
        this.setState({showModal: true});
    }

    handleCloseModal() {
        this.setState({showModal: false});
    }


    componentDidMount() {
        if (typeof sessionStorage.getItem('jwt_token') !== null) {
            let jwt = sessionStorage.getItem('jwt_token');
            if (!jwt) {
                Router.push('/');
            } else this.setState({jwt})
        }
        if (typeof window !== "undefined") {
            if (window.location.hash !== '') {
                const action_service = 'Twitch'
                const action = 'Live'
                const hash = window.location.hash
                const code = hash.substring(hash.indexOf("=") + 1,
                    hash.indexOf("&"))
                this.setState({action_service, action})
                this.setInputAction("token", 0, code)
            }
        }
    }

    logout() {
        sessionStorage.removeItem('jwt_token');
        Router.push('/');
    }

    render() {
        const {reaction_service, reactions, actions, action_service} = this.state;
        const actions_name = Object.keys(actions)
        const reactions_filtered = []

        actions[action_service].reaction.forEach((service) => {
            reactions_filtered[service] = reactions[service]
        })

        const reactions_name = Object.keys(reactions_filtered)
        return (
            <div className={styles.container}>
                <Modal size="xl" show={this.state.showModal} dialogClassName="modal-90w"
                       onHide={this.handleCloseModal} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Areas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.listAreas()}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <nav className="navbar navbar-expand sticky-top navbar-dark bg-dark">
                    <a className="navbar-brand text-white ml-3" href="/">
                        Spectre Area</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a onClick={this.handleOpenModal} className="nav-link" href="#">Areas <span
                                    className="sr-only">(current)</span></a>
                            </li>
                        </ul>
                    </div>
                    <button className="btn btn-danger" onClick={this.logout}>Logout</button>
                </nav>
                <div className={styles.splitScreen}>
                    <div align="center" className={styles.topPane}>{
                        <div className="container h-100">
                            <div className="row align-items-center h-100">
                                <div className="col-6 mx-auto">
                                    <div className="justify-content-center">
                                        <div>
                                            <Form>
                                                <InputGroup className="mb-2">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text>Service</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control as="select" variant="secondary"
                                                                  value={this.state.action_service}
                                                                  onChange={(e) => {
                                                                      this.setState({
                                                                          action_service: e.target.value,
                                                                          action: this.state.actions[e.target.value].actions[0]
                                                                      })
                                                                      console.log("Select " + this.state.action_service)
                                                                  }}
                                                    >
                                                        {actions_name.map(name => (
                                                            <option
                                                                key={`${name}-action-name`}>{name}</option>
                                                        ))}
                                                    </Form.Control>
                                                </InputGroup>

                                                <InputGroup className="mb-2">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text>Action</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control as="select" variant="secondary"
                                                                  key={`${action_service}-actions`}
                                                                  value={this.state.action}
                                                                  onChange={(e) => {
                                                                      this.setState({action: e.target.value})
                                                                      console.log("Select " + this.state.action)
                                                                  }}>
                                                        {actions[action_service].actions.map((action) =>
                                                            (
                                                                <option key={`${action}-action`}>
                                                                    {action}
                                                                </option>
                                                            )
                                                        )}
                                                    </Form.Control>

                                                </InputGroup>

                                                {actions[action_service].inputs.map((input, index) => {
                                                        if (input !== "OAuth" && !(this.state.action === "ImLive" && input === "streamer")) return (
                                                            <InputGroup className="mb-2">
                                                                <InputGroup.Prepend>
                                                                    <InputGroup.Text id={input}>{input}</InputGroup.Text>
                                                                </InputGroup.Prepend>
                                                                <FormControl
                                                                    value={this.state.inputs_action[index]}
                                                                    onChange={(e) => this.setInputAction(input, index, e.target.value)}
                                                                    placeholder={input}
                                                                    aria-label={input}
                                                                    aria-describedby={input}
                                                                />
                                                            </InputGroup>
                                                        )
                                                    }
                                                )}
                                                {this.setOAuth()}

                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }</div>
                    <div align="center" className={styles.bottomPane}>
                        <div className="container h-100">
                            <div className="row align-items-center h-100">
                                <div className="col-6 mx-auto">
                                    <div className="justify-content-center">
                                        <Form>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Service</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control as="select" variant="secondary"
                                                              id={reaction_service}
                                                              onChange={(e) => {
                                                                  this.setState({
                                                                      reaction_service: e.target.value,
                                                                      reaction: this.state.reactions[e.target.value].reactions[0]
                                                                  })
                                                              }}
                                                >
                                                    {reactions_name.map(service_name => (
                                                        <option
                                                            key={`${service_name}-reaction-service`}>{service_name}</option>
                                                    ))}
                                                </Form.Control>
                                            </InputGroup>

                                            <InputGroup className="mb-2">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Reaction</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control as="select" variant="secondary"
                                                              key={`${reaction_service}-reactions`}
                                                              onChange={(e) => {
                                                                  this.setState({reaction: e.target.value})
                                                              }}>
                                                    {reactions_filtered[reaction_service].reactions.map((reaction) =>
                                                        (
                                                            <option key={`${reaction}-reaction`}>
                                                                {reaction}
                                                            </option>

                                                        )
                                                    )}
                                                </Form.Control>
                                            </InputGroup>

                                            {reactions_filtered[reaction_service].inputs.map((input, index) => {
                                                    if (((this.state.reaction === "DM" || this.state.reaction === "Channel") && input !== "url") || (this.state.reaction === "Webhook" && input !== "id") || (this.state.reaction_service !== "Discord"))
                                                        return (
                                                            <InputGroup className="mb-2">
                                                                <InputGroup.Prepend>
                                                                    <InputGroup.Text id={input}>{input}</InputGroup.Text>
                                                                </InputGroup.Prepend>
                                                                <FormControl
                                                                    onChange={(e) => this.setInputReaction(input, index, e.target.value)}
                                                                    placeholder={input}
                                                                    aria-label={input}
                                                                    aria-describedby={input}
                                                                />
                                                            </InputGroup>
                                                        )
                                                }
                                            )}
                                            {this.setInviteLink()}

                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button onClick={() => this.postArea()} variant="primary"
                        className={"input-block-level form-control p-8"} type="submit">
                    Submit
                </Button>
            </div>
        )
    }

    postArea() {

        if (this.state.action_service === "Twitch" && this.state.inputs_action["token"] === '') {
            alert("Il faut se login à Twitch ma parole")
            return
        }
        let obj = {
            action_name: this.state.action_service + this.state.action,
            reaction_name: this.state.reaction_service + this.state.reaction,
            action_params: this.state.inputs_action,
            reaction_params: this.state.inputs_reaction
        }

        /*for (const input of this.state.actions[this.state.action_service].inputs) {
            console.log(obj.action_params[input])
            if (obj.action_params[input] === undefined && input !== "streamer") {
                alert("You must fill all inputs")
                return
            }
        }*/


        request.post(
            'http://localhost:8080/api/v1/area',
            {
                json: obj, 'auth': {
                    'bearer': this.state.jwt
                }
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    alert(body.message);
                } else {
                    alert("An error orccured")
                    return
                }

            }
        )
        if (typeof window !== 'undefined') {
            const areas = JSON.parse(sessionStorage.getItem('area')) || []
            areas.push(obj)
            sessionStorage.setItem('area', JSON.stringify(areas));
        }

    }

    setInputAction(input_type, index, value) {
        const {inputs_action} = this.state
        inputs_action[input_type] = value
        this.setState({inputs_action})

    }

    setInputReaction(input_type, index, value) {
        const {inputs_reaction} = this.state

        inputs_reaction[input_type] = value
        this.setState({inputs_reaction})


    }

    setOAuth() {
        if (this.state.actions[this.state.action_service].inputs.includes('OAuth'))
            if (this.state.action_service === "Twitch") {
                const oauth_url = "https://id.twitch.tv/oauth2/authorize" +
                    "?client_id=l2de9mcxvq10f2s8wy3ufjk0c6kgmj&" +
                    "redirect_uri=http://localhost:8081/area&" +
                    "state=35ximmm9uwpix1367dvv0cvpjrvyll&" +
                    "response_type=token&" +
                    "scope=viewing_activity_read"
                return (
                    <Button href={oauth_url}>Login</Button>
                )
            }
    }

    listAreas() {
        if (typeof window !== "undefined" && sessionStorage.getItem('area') !== null) {
            return (JSON.parse(sessionStorage.getItem('area')).map((area, index) => (
                <div>
                    <ListGroup horizontal Key={area.action_name + area.reaction_name}>
                        <ListGroup.Item key={area.action_name}>{area.action_name}</ListGroup.Item>
                        {Object.keys(area.action_params).map(param => (
                            <ListGroup.Item
                                accessKey={area.action_name[param]}>{param + " : " + area.action_params[param]}</ListGroup.Item>
                        ))}

                        <ListGroup.Item key={area.reaction_name}>{area.reaction_name}</ListGroup.Item>
                        {Object.keys(area.reaction_params).map(param => (
                            <ListGroup.Item
                                accessKey={area.reaction_name[param]}>{param + " : " + area.reaction_name[param]}</ListGroup.Item>
                        ))}
                        <button id={"delete" + area} className="btn btn-danger"
                                onClick={() => this.deleteArea(index)}>Delete
                        </button>

                    </ListGroup>
                </div>
            )))
        }
    }

    deleteArea(index) {
        if (typeof window !== 'undefined') {
            const areas = JSON.parse(sessionStorage.getItem('area')) || []
            areas.splice(index, 1)
            sessionStorage.setItem('area', JSON.stringify(areas));
            this.setState({showModal: false});
        }
    }

    setInviteLink() {
        if (this.state.reaction_service === "Discord" && this.state.reaction === "Channel") {
            return (
                <Button
                    href={"https://discord.com/oauth2/authorize?client_id=813895937817575425&permissions=2048&scope=bot"}
                    target="_blank"
                >Add the Bot to your server</Button>
            )
        }
    }
}

export default App;

