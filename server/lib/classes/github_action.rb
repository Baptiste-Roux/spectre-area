class GithubIssue
    class_attribute :github, :reaction
    def initialize(token, reaction)
        self.reaction = reaction
        if self.reaction == -1
            return -1
        end
        self.github = Github.new :oauth_token => token
    end

    def compare_issues(current, previous)
        (current.length - previous.length)
    end

    def refresh(username, repo)
        require 'rufus-scheduler'
        scheduler = Rufus::Scheduler.new

        previous = nil
        scheduler.interval('10s') do
            issues = self.github.issues.list user: username, repo: repo
            if previous != nil
                diff = compare_issues(issues, previous)
                if diff > 0
                    i = 'issue'
                    it = 'it'
                    if diff > 1
                        i = 'issues'
                        it = 'them'
                    end
                    self.reaction.react({'message':'You have ' + diff.to_s + ' new ' + i + ' ! See ' + it + ' here: https://github.com/' + username + '/' + repo + '/issues/'})
                end
            end
            previous = issues
        end
    end
end

class GithubStar
    class_attribute :github, :reaction
    def initialize(token, reaction)
        self.reaction = reaction
        if self.reaction == -1
            return -1
        end
        self.github = Github.new :oauth_token => token
    end

    def compare_stars(current, previous)
        (current.length - previous.length)
    end

    def refresh(username, repo)
        require 'rufus-scheduler'
        scheduler = Rufus::Scheduler.new

        previous = nil
        scheduler.interval('10s') do
            stars = self.github.activity.starring.list user: username, repo: repo
            if previous != nil
                diff = compare_stars(stars, previous)
                if diff > 0
                    i = 'star'
                    it = 'it'
                    if diff > 1
                        i = 'stars'
                        it = 'them'
                    end
                    self.reaction.react({'message':'You have ' + diff.to_s + ' new ' + i + ' ! See ' + it + ' here: https://github.com/' + username + '/' + repo + '/stargazers/'})
                end
            end
            previous = stars
        end
    end
end

class GithubPullRequest
    class_attribute :github, :reaction
    def initialize(token, reaction)
        self.reaction = reaction
        if self.reaction == -1
            return -1
        end
        self.github = Github.new :oauth_token => token
    end

    def compare_pr(current, previous)
        (current.length - previous.length)
    end

    def refresh(username, repo)
        require 'rufus-scheduler'
        scheduler = Rufus::Scheduler.new

        previous = nil
        scheduler.interval('10s') do
            pr = self.github.pull_requests.list user: username, repo: repo
            if previous != nil
                diff = compare_pr(pr, previous)
                if diff > 0
                    i = 'pull request'
                    it = 'it'
                    if diff > 1
                        i = 'pull requests'
                        it = 'them'
                    end
                    self.reaction.react({'message':'You have ' + diff.to_s + ' new ' + i + ' ! See ' + it + ' here: https://github.com/' + username + '/' + repo + '/pulls/'})
                end
            end
            previous = pr
        end
    end
end