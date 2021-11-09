# SPECTRE A-REA
Version : `v1.0`

![spectre-area](/spectre-area.png)

The "Specter A-rea" is a web platform of many utilities, designed to simplify the daily life of Epitech students by putting everything they need in one place.  
It works on the principle of actions and reactions, like [IFTTT](https://ifttt.com) or [Zapier](https://zapier.com).  
**Action**: Trigger a service according to an event  
**Reaction**: Setting up a corresponding response  
These two elements are linked together to form an A-rea.

Our app architecture is made of 3 parts :
- Web application : NodeJS & React
- Mobile application : React Native
- API Server : Ruby-on-Rails

## 🔗 Supported actions & reactions
> This list is bound to evolve.  

| Service | Actions | Reactions |
| ------- | ------- | --------- |
| Covid19 | News : *A covid19 report is generated at 8:30pm* | |
| Twitch | Live : *A streamer is going live*<br>ImLive : *I'm going live* | |
| Coinbase | Value : *A cryptocurrency hit a value* | |
| Discord | BotDM : *A message is sent to a bot* | Channel : *Something is sent to a channel by a bot*<br>DM : *Something is sent in DM by a bot*<br>Webhook : *Something is sent to a webhook* |
| RSS | Feed : *A new RSS article is posted* | |
| Github | Star : *A star is put on a repo*<br>PullRequest : *A new pull request is made on a repo*<br>Issue : *A new issue is submitted on a repo* | |
| Weather | Forecast : *A weather forecast report is generated everyday at 7am*<br>Alert : *A new weather alert occurs*<br>BadWeather : *Tomorrows weather is bad at 7pm* | |
| Slack | | Webhook : *Something is sent to a channel webhook* |
| Scheduler | Everyday : *A date is triggered*<br> EveryX : *An hour/minute is triggered* | |

## ⚙️ Install & Build
This project uses docker and docker-compose to run.  
You can also use it locally or on a server with the following commands at the root of this repository.

### Build the different images
```
docker build ./server -t spectre-area/server
docker build ./client_web -t spectre-area/client_web
docker build ./client_mobile -t spectre-area/client_mobile
```
> These step could be bypassed by jumping directly to the next step

### Launch the infrastructure
```
docker-compose up -d
```
> *The utilisation of `-d` (detached) flag make sens if you don't care about containers real-time logs.*  
> *You can find them at any time by doing `docker-compose logs`*

### Stop & Remove the containers
```
docker-compose down
```

## 📄 API Documentation
> The documentation for the REST API will be fill up soon.

```
Action : Create user
Route  : POST /api/v1/users
Requir : body(username, password)

Action : Login user
Route  : POST /api/v1/login
Requir : body(username, password)

Action : Update user
Route  : PUT /api/v1/users/uid
Requir : body(username | password), header(Authorization: Bearer)

Action : Delete user
Route  : DELETE /api/v1/users/uid
Requir : header(Authorization: Bearer)

Action : Get user id if already logged in
Route  : GET /api/v1/auto_login
Requir : header(Authorization: Bearer)

Action : Create an A-Rea
Route  : POST /api/v1/area
Requir : body(action_name, reaction_name, action_params{}, reaction_params{})
```
