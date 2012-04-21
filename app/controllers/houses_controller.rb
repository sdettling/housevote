class HousesController < ApplicationController
  def index
    @houses = House.all
    @houses.each_with_index do |house, index|
      house[price] = number_to_currency(house[price])
    end
    respond_to do |format|
      format.json { render json: @houses }
    end
  end
end
