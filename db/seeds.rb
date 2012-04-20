House.delete_all
Movie.delete_all
User.delete_all
Vote.delete_all

houses = [
  {name: 'Big and Boxy', slug: 'boxy', url: 'http://www.homeaway.com/vacation-rental/p192982', price: '1700', description: ''},
  {name: 'Hunter Lodge', slug: 'hunter', url: 'http://www.homeaway.com/vacation-rental/p144163', price: '1600', description: ''},
  {name: 'Quaint and Cosy', slug: 'quaint', url: 'http://www.homeaway.com/vacation-rental/p381053', price: '1100', description: ''},
  {name: 'Woodstock', slug: 'woodstock', url: 'http://www.homeaway.com/vacation-rental/p122468', price: '2000', description: ''},
  {name: 'Breathtaking Views', slug: 'breathtaking', url: 'http://www.homeaway.com/vacation-rental/p265490', price: '1754.5', description: ''},
  {name: 'Sassy Yellow House', slug: 'sassy', url: 'http://www.homeaway.com/vacation-rental/p157483', price: '950', description: ''},
  {name: 'Fine Farmhouse', slug: 'farmhouse', url: 'http://www.homeaway.com/vacation-rental/p309483', price: '1035', description: ''},
  {name: 'Pond and Pool', slug: 'pool', url: 'http://www.homeaway.com/vacation-rental/p168720', price: '2650', description: ''}
]

houses.each {|h| House.create!(*[h])}