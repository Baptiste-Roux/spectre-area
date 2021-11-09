class CovidNews
    class_attribute :reaction

    def initialize(reaction)
        self.reaction = reaction
        if self.reaction == -1
            return -1
        end
    end

    def getNews()
        require "json"
        require "net/http"
        require "uri"

        uri = URI('https://coronavirusapi-france.now.sh/FranceLiveGlobalData')
        response = Net::HTTP.get(uri)
        json = JSON.parse(response)
    end

    def refresh()
        require "rufus-scheduler"
        require "date"
        
        scheduler = Rufus::Scheduler.new
        scheduler.cron('30 20 * * * Europe/Paris') do
            news = getNews
            d = DateTime.parse(news["FranceGlobalLiveData"][0]["date"])
            hospi = news["FranceGlobalLiveData"][0]["hospitalises"].to_s
            new_hospi = news["FranceGlobalLiveData"][0]["nouvellesHospitalisations"].to_s
            rea = news["FranceGlobalLiveData"][0]["reanimation"].to_s
            new_rea = news["FranceGlobalLiveData"][0]["nouvellesReanimations"].to_s
            deces = news["FranceGlobalLiveData"][0]["deces"].to_s
            gueris = news["FranceGlobalLiveData"][0]["gueris"].to_s
            message = "Covid19 News - Voici les données en France, au " + d.strftime("%d %b %Y") + ".\nHospitalisations : " + hospi + " (+" + new_hospi + ")\nEn réanimation : " + rea + " (+" + new_rea + ")\nDécès : " + deces + "\nGuérisons : " + gueris
            reaction.react({ 'message': message })
        end
    end
end

# class CovidVaccins
# end