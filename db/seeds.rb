House.delete_all
Movie.delete_all
User.delete_all
Vote.delete_all

houses = [
  {name: 'Big and Boxy', slug: 'boxy', url: 'http://www.homeaway.com/vacation-rental/p192982', price: '$1,700', description: 'Friday the 13th Part I: Jason takes us to the Double Decker of Death'},
  {name: 'Hunter Lodge', slug: 'hunter', url: 'http://www.homeaway.com/vacation-rental/p144163', price: '$1,600', description: 'Friday the 13th Part II: Jason firepit + fireplace house to set us on fire!'},
  {name: 'Quaint and Cosy', slug: 'quaint', url: 'http://www.homeaway.com/vacation-rental/p381053', price: '$1,100', description: 'Friday the 13th Part III: Jason\'s tiny white house of destruction!'},
  {name: 'Woodstock', slug: 'woodstock', url: 'http://www.homeaway.com/vacation-rental/p122468', price: '$2,000', description: 'Friday the 13th Part IV: Jason\'s house with a pool... to drown us!'},
  {name: 'Breathtaking Views', slug: 'breathtaking', url: 'http://www.homeaway.com/vacation-rental/p265490', price: '$1,754.50', description: 'Friday the 13th Part V: Jason\'s Cabin on a Cliff... to throw you off of!'},
  {name: 'Sassy Yellow House', slug: 'sassy', url: 'http://www.homeaway.com/vacation-rental/p157483', price: '$950', description: 'Friday the 13th Part VI: Jason\'s Victorian house... It\'s time for tea and death!'},
  {name: 'Fine Farmhouse', slug: 'farmhouse', url: 'http://www.homeaway.com/vacation-rental/p309483', price: '$1,035', description: 'Friday the 13th Part VII: Jason\'s Renovated farmhouse... of mild annoyance!'}
]

houses.each {|h| House.create!(*[h])}