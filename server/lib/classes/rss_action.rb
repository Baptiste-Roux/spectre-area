class RssFeed
    class_attribute :url, :reaction, :feed, :message

    def initialize(url, reaction)
        self.url = url
        self.reaction = reaction
        if self.reaction == -1
            return -1
        end
    end

    def getFeed()
        require 'rss'
        require 'open-uri'

        URI.open(url) do |rss|
            feed = RSS::Parser.parse(rss)
            self.message = feed.channel.title + " RSS\n" + feed.items[0].title + "\n" + feed.items[0].link
        end
    end

    def refresh()
        require 'rufus-scheduler'
        
        scheduler = Rufus::Scheduler.new
        self.feed = getFeed
        scheduler.every('30m') do
            check_feed = getFeed
            if check_feed != feed
                self.feed = check_feed
                reaction.react({ 'message': message })
            end
        end
    end
end