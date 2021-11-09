class AboutController < ApplicationController
    skip_before_action :authorized
    def index
        require 'date'

        render json: { 
            client: { 
                host: request.remote_ip
            },
            server: {
                current_time: DateTime.now.to_time.to_i,
                services: [{
                    name: 'Meteo',
                    actions: [{
                        name: 'Forecast',
                        description: 'A weather forecast report is generated everyday at 7am'
                    }, {
                        name: 'Alert',
                        description: 'A new weather alert occurs'
                    }, {
                        name: 'BadWeather',
                        description: 'Tomorrows weather is bad at 7pm'
                    }],
                    reactions: []
                }, {
                    name: 'Covid19',
                    actions: [{
                        name: 'News',
                        description: 'A covid19 report is generated at 8:30pm'
                    }],
                    reactions: []
                }, {
                    name: 'RSS',
                    actions: [{
                        name: 'Feed',
                        description: 'A new RSS article is posted'
                    }],
                    reactions: []
                }, {
                    name: 'Github',
                    actions: [{
                        name: 'Star',
                        description: 'A star is put on a repo'
                    }, {
                        name: 'PullRequest',
                        description: 'A new pull request is made on a repo'
                    }, {
                        name: 'Issue',
                        description: 'A new issue is submitted on a repo'
                    }],
                    reactions: []
                }, {
                    name: 'Scheduler',
                    actions: [{
                        name: 'Everyday',
                        description: 'A date is triggered'
                    }, {
                        name: 'EveryX',
                        description: 'An hour/minute is triggered'
                    }],
                    reactions: []
                }, {
                    name: 'Twitch',
                    actions: [{
                        name: 'Live',
                        description: 'A streamer is going live'
                    }, {
                        name: 'ImLive',
                        description: 'I am going live'
                    }],
                    reactions: []
                }, {
                    name: 'Coinbase',
                    actions: [{
                        name: 'Value',
                        description: 'A cryptocurrency hit a value'
                    }],
                    reactions: []
                }, {
                    name: 'Discord',
                    actions: [{
                        name: 'BotDM',
                        description: 'A message is sent to a bot' 
                    }],
                    reactions: [{
                        name: 'Channel',
                        description: 'Something is sent to a channel by a bot'
                    }, {
                        name: 'DM',
                        description: 'Something is sent in DM by a bot'
                    }, {
                        name: 'Webhook',
                        description: 'Something is sent to a channel webhook'
                    }]
                }, {
                    name: 'Slack',
                    actions: [],
                    reactions: [{
                        name: 'Webhook',
                        description: 'Something is sent to a channel webhook'
                    }]
                }]
            }
        }
    end
end
