# DEV ZONE, THIS SERVICE WILL NOT BE USED (DEPRECATED)

# class IntraNewActivity
#     class_attribute :token, :semester, :reaction

#     def initialize(token, semester, reaction)
#         self.token = token
#         self.semester = semester
#         self.reaction = reaction
#         if self.reaction == -1
#             return -1
#         end
#     end

#     def getActivity()
#         require "json"
#         require "net/http"
#         require "uri"
#         require "date"

#         actual = DateTime.now
#         week = actual + 7
#         start_date = actual.strftime("%Y-%m-%d")
#         end_date = week.strftime("%Y-%m-%d")
#         uri = URI('https://intra.epitech.eu/auth-' + token + '/planning/load?start=' + start_date + '&end=' + end_date + '&format=json')
#         response = Net::HTTP.get(uri)
#         json = JSON.parse(response)
#     end

#     def getActivitys()
#         require "json"
#         require "net/http"
#         require "uri"
#         require "date"

#         actual = DateTime.now
#         week = actual + 8
#         start_date = actual.strftime("%Y-%m-%d")
#         end_date = week.strftime("%Y-%m-%d")
#         uri = URI('https://intra.epitech.eu/auth-' + token + '/planning/load?start=' + start_date + '&end=' + end_date + '&format=json')
#         response = Net::HTTP.get(uri)
#         json = JSON.parse(response)
#     end

#     def refresh()
#         require 'rufus-scheduler'
#         require 'json-diff'
#         old_activity = getActivity
#         scheduler = Rufus::Scheduler.new
#         scheduler.every('5s') do
#             new_activity = getActivitys
#             if old_activity != new_activity
#                 diff = JsonDiff.diff(old_activity, new_activity)
#                 puts diff
#             end
            # puts activity[0]["instance_location"]
            # message = "This is your daily weather forecast !\nToday, the weather will be " + today.downcase + ".\nThe maximum temperature will be " + max.to_s + "°C, and the lower " + min.to_s + "°C."
            # reaction.react({ 'message': message })
#         end
#     end
# end

# class IntraNewModule
# end