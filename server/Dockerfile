FROM ruby:alpine
RUN apk add --update --no-cache \
      build-base \
      libxml2-dev \
      libxslt-dev \
      nodejs \
      postgresql-dev \
      tzdata \
      shared-mime-info
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
ENTRYPOINT [ "/app/entrypoints/docker-entrypoint.sh" ]