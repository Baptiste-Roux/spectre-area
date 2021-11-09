class DiscordChannel
    require 'discordrb'
    class_attribute :bot, :channel
    private :bot
    def initialize(chan)
        self.bot = Discordrb::Bot.new token: 'TOKEN_HERE'
        self.channel = chan
    end

    def react(object)
        self.bot.run(true)
        self.bot.send_message(self.channel, object[:message])
    end
end

class DiscordDM
    require 'discordrb'
    class_attribute :bot, :user
    private :bot
    def initialize(user)
        self.bot = Discordrb::Bot.new token: 'TOKEN_HERE'
        self.user = self.bot.user(user)
    end

    def react(object)
        self.bot.run(true)
        self.user.pm(object[:message])
    end
end

class DiscordWebhook
    class_attribute :webhook
    def initialize(webhook)
        self.webhook = webhook
    end

    def react(object)
        require "uri"
        require "net/http"
        require "json"

        uri = URI(webhook)
        http = Net::HTTP.new(uri.host, uri.port)
        request = Net::HTTP::Post.new(uri.request_uri, 'Content-Type' => 'application/json')
        request.body = {username: 'Area Webhook', content: object[:message]}.to_json
        http.use_ssl = true
        http.request(request)
    end
end