require "#{Rails.root}/lib/classes/github_action.rb"
require "#{Rails.root}/lib/classes/coinbase_action.rb"
require "#{Rails.root}/lib/classes/twitch_action.rb"
require "#{Rails.root}/lib/classes/meteo_action.rb"
require "#{Rails.root}/lib/classes/discord_reaction.rb"
require "#{Rails.root}/lib/classes/discord_action.rb"
require "#{Rails.root}/lib/classes/scheduler_action.rb"
require "#{Rails.root}/lib/classes/slack_reaction.rb"
require "#{Rails.root}/lib/classes/rss_action.rb"
require "#{Rails.root}/lib/classes/covid_action.rb"

class ApplicationController < ActionController::API
    before_action :authorized

    def encode_token(payload)
        JWT.encode(payload, 'TuSucesTu')
    end

    def auth_header
        request.headers['Authorization']
    end

    def decoded_token
        if auth_header
            token = auth_header.split(' ')[1]
            begin
                JWT.decode(token, 'TuSucesTu', true, algorithm: 'HS256')
            rescue JWT::DecodeError
                nil
            end
        end
    end

    def logged_in_user
        if decoded_token
        user_id = decoded_token[0]['user_id']
        @user = User.find_by(id: user_id)
        end
    end

    def logged_in?
        !!logged_in_user
    end

    def authorized
        render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
    end

    #############
    #  A R E A  #
    #############

    def create_area(action_name, reaction_name, action_params, reaction_params)
        case action_name
        when "GithubIssue"
            g = GithubIssue.new(action_params[:token], create_reaction(reaction_name, reaction_params))
            g.refresh(action_params[:username], action_params[:repo])
        when "GithubStar"
            g = GithubStar.new(action_params[:token], create_reaction(reaction_name, reaction_params))
            g.refresh(action_params[:username], action_params[:repo])
        when "GithubPullRequest"
            g = GithubPullRequest.new(action_params[:token], create_reaction(reaction_name, reaction_params))
            g.refresh(action_params[:username], action_params[:repo])
        when "CoinbaseValue"
            c = Coinbase.new(action_params[:crypto], action_params[:value], create_reaction(reaction_name, reaction_params))
            c.refresh(action_params[:crypto])
        when "MeteoForecast"
            c = MeteoForecast.new(action_params[:city], create_reaction(reaction_name, reaction_params))
            c.refresh()
        when "MeteoAlert"
            c = MeteoAlert.new(action_params[:city], create_reaction(reaction_name, reaction_params))
            c.refresh()
        when "MeteoBadWeather"
            c = MeteoBadWeather.new(action_params[:city], create_reaction(reaction_name, reaction_params))
            c.refresh()
        when "DiscordBotDM"
            d = DiscordBotDM.new(action_params[:token], create_reaction(reaction_name, reaction_params))
            d.refresh
        when "SchedulerEveryday"
            s = SchedulerEveryday.new(action_params[:hour], create_reaction(reaction_name, reaction_params))
            s.refresh
        when "SchedulerEveryX"
            s = SchedulerEveryX.new(action_params[:interval], create_reaction(reaction_name, reaction_params))
            s.refresh
        when "TwitchLive"
            c = TwitchLive.new(action_params[:token], action_params[:streamer], create_reaction(reaction_name, reaction_params))
            c.refresh
        when "TwitchImLive"
            c = TwitchImLive.new(action_params[:token], create_reaction(reaction_name, reaction_params))
            c.refresh
        when "RssFeed"
            c = RssFeed.new(action_params[:url], create_reaction(reaction_name, reaction_params))
            c.refresh
        when "CovidNews"
            c = CovidNews.new(create_reaction(reaction_name, reaction_params))
            c.refresh
        else
            puts "what are you doing step bro"
            return -1
        end
    end

    def create_reaction(reaction_name, reaction_params)
        case reaction_name
        when "DiscordChannel"
            d = DiscordChannel.new(reaction_params[:id])
            return d
        when "DiscordDM"
            d = DiscordDM.new(reaction_params[:id])
            return d
        when "SlackWebhook"
            d = SlackWebhook.new(reaction_params[:channel])
            return d
        when "DiscordWebhook"
            d = DiscordWebhook.new(reaction_params[:url])
            return d
        else
            puts "what are you doing step bro"
            return -1
        end
    end
end
