class Addhouse < ActiveRecord::Migration
  def up
    add_column :votes, :house, :integer
  end

  def down
    remove_column :votes, :house, :integer
  end
end
