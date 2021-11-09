class Coinbase
  class_attribute :crypto, :value, :ceil, :reaction, :done

  def initialize(crypto, value, reaction)
    self.reaction = reaction
    self.crypto = crypto
    self.ceil = value.to_f
    self.done = false
    if self.reaction == -1
      return -1
    end
    self.value = getValue
  end

  def getValue()
    require "json"
    require "net/http"
    require "uri"

    uri = URI('https://data.messari.io/api/v1/assets/' + crypto + '/metrics')

    response = Net::HTTP.get(uri)

    json = JSON.parse(response)

    json["data"]["market_data"]["price_usd"]
  end

  def refresh(crypto)
    require 'rufus-scheduler'
    scheduler = Rufus::Scheduler.new

    scheduler.interval('10s') do
      self.value = getValue
      if value > ceil && done == false
        puts crypto + 'is now at ' + value.to_s + " $"
        reaction.react({ 'message': crypto + ' is now at ' + value.to_s + "$" })
        self.done = true
      elsif value < ceil * 0.9
        self.done = false
      end
    end
  end
end