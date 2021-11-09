class TwitchLive
  class_attribute :token, :streamer, :reaction, :user_id, :lives, :username, :live

  def initialize(token, streamer, reaction)
    self.reaction = reaction
    if self.reaction == -1
      return -1
    end
    self.token = token
    self.streamer = streamer
    self.username = getUsername
    self.user_id = getUserID
    self.lives = getLives
    self.live = false
  end

  def getUserID
    require 'json'
    require 'net/http'
    require 'uri'

    url = URI('https://api.twitch.tv/helix/users')

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["client-id"] = "l2de9mcxvq10f2s8wy3ufjk0c6kgmj"
    request["Authorization"] = "Bearer #{token}"

    response = https.request(request)

    json = JSON.parse(response.body)
    data = json['data'][0]
    data['id']
  end

  def getUsername
    require "uri"
    require "net/http"

    url = URI("https://api.twitch.tv/helix/users")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["client-id"] = "l2de9mcxvq10f2s8wy3ufjk0c6kgmj"
    request["Authorization"] = "Bearer #{token}"

    response = https.request(request)

    json = JSON.parse(response.body)
    data = json['data'][0]
    data['login']
  end

  def getLives
    require "uri"
    require "net/http"

    url = URI("https://api.twitch.tv/helix/users/follows?first=100&from_id=#{user_id}")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["client-id"] = "l2de9mcxvq10f2s8wy3ufjk0c6kgmj"
    request["Authorization"] = "Bearer #{token}"

    response = https.request(request)

    data = JSON.parse(response.body)['data']
    param = ''

    data.each do |follow|
      param += "user_login=#{follow['to_login']}&"
    end
    # https://api.twitch.tv/helix/streams?first=100&user_login=

    url2 = URI("https://api.twitch.tv/helix/streams?#{param}")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request2 = Net::HTTP::Get.new(url2)
    request2["client-id"] = "l2de9mcxvq10f2s8wy3ufjk0c6kgmj"
    request2["Authorization"] = "Bearer #{token}"

    response = https.request(request2)

    data = JSON.parse(response.body)['data']

    streamers = []
    data.each do |stream|
      streamers.push(stream['user_name'])
    end
    streamers
  end

  def refresh()
    require 'rufus-scheduler'
    scheduler = Rufus::Scheduler.new

    scheduler.interval('10s') do
      self.lives = getLives
      if lives.include? streamer
        unless live
          puts "#{streamer} is Live !"
          reaction.react({ 'message': "#{streamer} is Live !" })
        end
        self.live = true
      else
        self.live = false
      end
    end
  end
end

class TwitchImLive
  class_attribute :token, :reaction, :user_id, :lives, :username, :live

  def initialize(token, reaction)
    self.reaction = reaction
    if self.reaction == -1
      return -1
    end
    self.token = token
    self.username = getUsername
    self.user_id = getUserID
    self.lives = getLives
    self.live = false
  end

  def getUserID
    require 'json'
    require 'net/http'
    require 'uri'

    puts "userid"

    url = URI('https://api.twitch.tv/helix/users')

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["client-id"] = "l2de9mcxvq10f2s8wy3ufjk0c6kgmj"
    request["Authorization"] = "Bearer #{token}"

    response = https.request(request)

    json = JSON.parse(response.body)
    data = json['data'][0]
    data['id']
  end

  def getUsername
    require "uri"
    require "net/http"

    puts "username"

    url = URI("https://api.twitch.tv/helix/users")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["client-id"] = "l2de9mcxvq10f2s8wy3ufjk0c6kgmj"
    request["Authorization"] = "Bearer #{token}"

    response = https.request(request)

    json = JSON.parse(response.body)
    data = json['data'][0]
    data['login']
  end

  def getLives
    require "uri"
    require "net/http"

    # https://api.twitch.tv/helix/streams?first=100&user_login=

    url2 = URI("https://api.twitch.tv/helix/streams?user_login=#{username}")

    https = Net::HTTP.new(url2.host, url2.port)
    https.use_ssl = true

    request2 = Net::HTTP::Get.new(url2)
    request2["client-id"] = "l2de9mcxvq10f2s8wy3ufjk0c6kgmj"
    request2["Authorization"] = "Bearer #{token}"

    response = https.request(request2)

    response.body
  end

  def refresh()
    require 'rufus-scheduler'
    scheduler = Rufus::Scheduler.new

    scheduler.interval('10s') do
      self.lives = getLives

      if lives.include? username
        unless live
          puts "I'm Live !"
          reaction.react({ 'message': "I'm Live !" })
        end
        self.live = true
      else
        self.live = false
      end
    end
  end
end
