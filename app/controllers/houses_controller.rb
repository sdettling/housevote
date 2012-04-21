class HousesController < ApplicationController
  def index
    @houses = House.all
    respond_to do |format|
      format.json { render json: @houses }
    end
  end
end
