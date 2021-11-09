class DiscordBotDM
    require 'discordrb'
    class_attribute :bot, :reaction

    def initialize(token, reaction)
        self.reaction = reaction
        if self.reaction == -1
            return -1
        end
        self.bot = Discordrb::Bot.new token: token
    end

    def refresh
        self.bot.run(true)
        self.bot.pm do |event|
            self.reaction.react({ 'message':event.bot.profile.username + ' received a new message from ' + event.user.username })
        end
    end
end