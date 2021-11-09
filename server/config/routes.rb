Rails.application.routes.draw do
  # resource :users, only: [:create]
  resources :about
    get "/about.json", to: "about#index"
  namespace :api do
    namespace :v1 do
      resources :area
      resources :users
        post "/login", to: "users#login"
        get "/auto_login", to: "users#auto_login"
    end
  end
end
