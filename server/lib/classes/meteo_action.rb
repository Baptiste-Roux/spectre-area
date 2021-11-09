class MeteoForecast
    class_attribute :city, :reaction, :key, :forecast

    def initialize(city, reaction)
        self.city = city
        self.reaction = reaction
        self.key = 'c0583d6d4b8b43798c4191029210603'
        if self.reaction == -1
            return -1
        end
    end

    def getForecast()
        require "json"
        require "net/http"
        require "uri"

        uri = URI('http://api.weatherapi.com/v1/forecast.json?key=' + key + '&q=' + city + '&days=1&aqi=no&alerts=no')
        response = Net::HTTP.get(uri)
        json = JSON.parse(response)
        forecast = json["forecast"]["forecastday"][0]["day"]
    end

    def refresh()
        require 'rufus-scheduler'
        scheduler = Rufus::Scheduler.new
        scheduler.cron('0 7 * * * Europe/Paris') do
            self.forecast = getForecast
            today = forecast["condition"]["text"]
            max = forecast["maxtemp_c"]
            min = forecast["mintemp_c"]
            message = "This is your daily weather forecast in " + city + " !\nToday, the weather will be " + today.downcase + ".\nThe maximum temperature will be " + max.to_s + "°C, and the lower " + min.to_s + "°C."
            reaction.react({ 'message': message })
        end
    end
end

class MeteoAlert
    class_attribute :city, :reaction, :key, :alert

    def initialize(city, reaction)
        self.city = city
        self.reaction = reaction
        self.key = 'c0583d6d4b8b43798c4191029210603'
        if self.reaction == -1
            return -1
        end
    end

    def getAlert()
        require "json"
        require "net/http"
        require "uri"

        uri = URI('http://api.weatherapi.com/v1/forecast.json?key=' + key + '&q=' + city + '&days=3&aqi=no&alerts=yes')
        response = Net::HTTP.get(uri)
        json = JSON.parse(response)
        alert = json["alerts"]["alert"]
    end

    def refresh()
        require 'rufus-scheduler'
        scheduler = Rufus::Scheduler.new
        scheduler.every('1h') do
            self.alert = getAlert
            if alert[0]
                details = alert["headline"]
                severity = alert["severity"]
                event = alert["event"]
                instruction = alert["instruction"]
                message = "New weather alert in " + city + "\nDetails : " + details + "\nSeverity : " + severity + "\nInstructions : " + instruction
                reaction.react({ 'message': message })
            end
        end
    end
end

class MeteoBadWeather
    class_attribute :city, :reaction, :key, :bad_weather

    def initialize(city, reaction)
        self.city = city
        self.reaction = reaction
        self.key = 'c0583d6d4b8b43798c4191029210603'
        if self.reaction == -1
            return -1
        end
    end

    def getBadWeather()
        require "json"
        require "net/http"
        require "uri"

        uri = URI('http://api.weatherapi.com/v1/forecast.json?key=' + key + '&q=' + city + '&days=2&aqi=no&alerts=no')
        response = Net::HTTP.get(uri)
        json = JSON.parse(response)
        bad_weather = json["forecast"]["forecastday"][1]["day"]
    end

    def refresh()
        require 'rufus-scheduler'
        scheduler = Rufus::Scheduler.new
        scheduler.cron('0 19 * * * Europe/Paris') do
            self.bad_weather = getBadWeather
            tomorrow = bad_weather["condition"]["text"]
            code = bad_weather["condition"]["code"]
            if [1087, 1114, 1117, 1168, 1171, 1192, 1195, 1201, 1207, 1222, 1225, 1243, 1246, 1252, 1258, 1264, 1276, 1282].include? code
                message = "It's your bad weather check !\nTomorrow, it will be " + tomorrow.downcase + ".\nBe careful !"
            end
            reaction.react({ 'message': message })
        end
    end
end