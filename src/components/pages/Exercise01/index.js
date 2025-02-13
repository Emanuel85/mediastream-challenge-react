/**
 * Exercise 01: The Retro Movie Store
 * Implement a shopping cart with the next features for the Movie Store that is selling retro dvds:
 * 1. Add a movie to the cart
 * 2. Increment or decrement the quantity of movie copies. If quantity is equal to 0, the movie must be removed from the cart
 * 3. Calculate and show the total cost of your cart. Ex: Total: $150
 * 4. Apply discount rules. You have an array of offers with discounts depending of the combination of movie you have in your cart.
 * You have to apply all discounts in the rules array (discountRules).
 * Ex: If m: [1, 2, 3], it means the discount will be applied to the total when the cart has all that products in only.
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import './assets/styles.css'
import { useState } from 'react'

export default function Exercise01() {
  const movies = [
    {
      id: 1,
      name: 'Star Wars',
      price: 20
    },
    {
      id: 2,
      name: 'Minions',
      price: 25
    },
    {
      id: 3,
      name: 'Fast and Furious',
      price: 10
    },
    {
      id: 4,
      name: 'The Lord of the Rings',
      price: 5
    }
  ]

  const discountRules = [
    {
      m: [3, 2],
      discount: 0.25
    },
    {
      m: [2, 4, 1],
      discount: 0.5
    },
    {
      m: [4, 2],
      discount: 0.1
    }
  ]

  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Star Wars',
      price: 20,
      quantity: 2
    }
  ])


  const handleChargeMovie = (movie) => {
    const itemIndex = cart.findIndex(item => item.id === movie.id)
    if (itemIndex !== -1) {
      const updatedCart = [...cart]
      updatedCart[itemIndex].quantity += 1
      setCart(updatedCart)
    } else {
      const newCartItem = {
        id: movie.id,
        name: movie.name,
        price: movie.price,
        quantity: 1
      }
      setCart([...cart, newCartItem])
    }
  }

  const handleIncrementQuantity = (movie) => {
    const itemIndex = cart.findIndex(item => item.id === movie.id)
    if (itemIndex !== -1) {
      const updatedCart = [...cart]
      updatedCart[itemIndex].quantity += 1
      setCart(updatedCart)
    }
  }

  const handleDecrementQuantity = (movie) => {
    const itemIndex = cart.findIndex(item => item.id === movie.id)
    if (itemIndex !== -1) {
      const updatedCart = [...cart]
      updatedCart[itemIndex].quantity -= 1
      if (updatedCart[itemIndex].quantity === 0) {
        updatedCart.splice(itemIndex, 1)
      }
      setCart(updatedCart.length > 0 ? updatedCart : [])
    }
  }


  const getTotal = () => {
    let total = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    discountRules.forEach(discountRule => {
      const { m, discount } = discountRule;
      const ruleMet = m.every(id => cart.some(item => item.id === id));
      if (ruleMet && m.length === cart.length) { total *= (1 - discount); }
    });

    return total;
  }; // TODO: Implement this

  return (
    <section className="exercise01">
      <div className="movies__list">
        <ul>
          {movies.map(m => (
            <li className='movies__list-card'>
              <ul>
                <li>
                  ID: {m.id}
                </li>
                <li>
                  Name: {m.name}
                </li>
                <li>
                  Price: ${m.price}
                </li>
              </ul>
              <button onClick={() => handleChargeMovie(m)}>
                Add to cart
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="movies__cart">
        <ul>
          {cart.map(x => (
            <li className="movies__cart-card">
              <ul>
                <li>
                  ID: {x.id}
                </li>
                <li>
                  Name: {x.name}
                </li>
                <li>
                  Price: ${x.price}
                </li>
              </ul>
              <div className="movies__cart-card-quantity">
                <button onClick={() => handleDecrementQuantity(x)}>
                  -
                </button>
                <span>
                  {x.quantity}
                </span>
                <button onClick={() => handleIncrementQuantity(x)}>
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="movies__cart-total">
          <p>Total: ${getTotal()}</p>
        </div>
      </div>
    </section>
  )
} 