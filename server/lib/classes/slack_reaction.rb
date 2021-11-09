class SlackWebhook
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
        request.body = {username: 'Area Webhook', text: object[:message]}.to_json
        http.use_ssl = true
        http.request(request)
    end
end