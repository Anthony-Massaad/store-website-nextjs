export interface ProductsData {
  id: number;
  name: string;
  quantity: number;
  category: string;
  image: string;
  rating: number;
  numOfPeopleRated: number;
  price: number;
  description: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
}
