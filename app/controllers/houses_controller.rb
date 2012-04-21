class HousesController < ApplicationController
  def index
    @houses = House.all
    @houses.each { |house|
      house.price = number_to_currency(house.price)
     } 
    respond_to do |format|
      format.json { render json: @houses }
    end
  end
end
