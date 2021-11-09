class SchedulerEveryday
    class_attribute :hour, :minutes, :reaction
    def initialize(hour, reaction)
        self.reaction = reaction
        if self.reaction == -1
            return -1
        end
        self.hour = hour.partition(':')[0]
        self.minutes = hour.partition(':')[2]
    end

    def refresh
        require 'rufus-scheduler'
        scheduler = Rufus::Scheduler.new

        scheduler.cron "#{self.minutes} #{self.hour} * * * Europe/Paris" do
            self.reaction.react({ 'message':"It is #{self.hour}:#{self.minutes}" })
        end
    end
end

class SchedulerEveryX
    class_attribute :interval, :reaction, :map, :number, :unit, :plural
    def initialize(interval, reaction)
        self.map = {
            's' => 'second',
            'm' => 'minute',
            'h' => 'hour',
            'd' => 'day'
        }
        self.reaction = reaction
        if self.reaction == -1
            return -1
        end
        self.interval = interval
        self.number = interval[0..-2]
        self.unit = map[interval.split(//).last(1).join]
        if self.number != 1.to_s
            self.plural = 's'
        else
            self.plural = ''
        end
    end

    def refresh
        require 'rufus-scheduler'
        scheduler = Rufus::Scheduler.new

        scheduler.interval(self.interval) do
            self.reaction.react({ 'message':"It's been #{self.number} #{self.unit}#{self.plural} since last time." })
        end
    end
end