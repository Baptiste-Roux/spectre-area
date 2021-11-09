class Api::V1::UsersController < ApplicationController
  before_action :authorized, only: ["auto_login", "update", "destroy"]

  # POST /users
  def create
    @user = User.find_by(username: params[:username])
    if @user
      render json: { error: "Username already taken" }, status: 400
    else
      @user = User.create(user_params)
      if @user.valid? 
        token = encode_token({ user_id: @user.id })
        render json: { uid: @user.id, token: token }, status: 200
      end
    end
  end

  # POST /login
  def login
    @user = User.find_by(username: params[:username])

    if @user && @user.authenticate(params[:password])
      token = encode_token({ user_id: @user.id })
      render json: { uid: @user.id, token: token }, status: 200
    else
      render json: { error: "Invalid username or password" }, status: 400
    end
  end

  def auto_login
    render json: { uid: @user.id, username: @user.username }, status: 200
  end

  # PUT /users/:uid
  def update
    @user = User.find(params[:id])
    if @user
      @user.update(user_params)
      render json: { message: 'User successfully updated.' }, status: 200
    else
      render json: { error: "Can't update User." }, status: 400
    end
  end

  # DELETE /users/:uid
  def destroy
    @user = User.find(params[:id])
    if @user
      @user.destroy
      render json: { message: 'User successfully deleted.' }, status: 200
    else
      render json: { error: "Can't delete User." }, status: 400
    end
  end

  private

  def user_params
    params.permit(:username, :password)
  end
end
