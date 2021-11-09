class Api::V1::AreaController < ApplicationController
  #POST /area
  def create
    ret = create_area(params[:action_name], params[:reaction_name], params[:action_params], params[:reaction_params])
    if ret == -1
      render json: { error: 'What are you doin step bruh' }, status: 400
    else
      render json: { message: 'AREA successfully created.' }, status: 200
    end
  end
end
