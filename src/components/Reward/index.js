import React, { useState, useEffect } from 'react'
import { fetchTransactions } from '../../api/api'

const calculateRewards = (amount) => {
  let rewards = 0
  if (amount > 100) {
    rewards += (amount - 100) * 2
    amount = 100
  }
  if (amount > 50) {
    rewards += amount - 50
  }
  return rewards
}

const Rewards = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchTransactions().then((transactions) => {
      const rewardsPerCustomerPerMonth = transactions.reduce((acc, cur) => {
        const currentDate = new Date(cur.date)
        const monthYear = `0${
          currentDate.getMonth() + 1
        }-${currentDate.getFullYear()}`.substring(-2)

        const reward = calculateRewards(cur.purchaseAmount)
        if (!acc[cur.customerId]) {
          acc[cur.customerId] = { monthlyRewards: {} }
        }
        if (!acc[cur.customerId].monthlyRewards[monthYear]) {
          acc[cur.customerId].monthlyRewards[monthYear] = 0
        }
        acc[cur.customerId].monthlyRewards[monthYear] += reward

        // Calculate total rewards
        if (!acc[cur.customerId].totalRewards) {
          acc[cur.customerId].totalRewards = 0
        }
        acc[cur.customerId].totalRewards += reward
        return acc
      }, {})
      setData(rewardsPerCustomerPerMonth)
    })
  }, [])

  return (
    <div>
      <h1>Rewards per customer per month</h1>
      {Object.keys(data).map((customerId) => (
        <div key={customerId}>
          <h2>Customer {customerId}</h2>
          {Object.keys(data[customerId].monthlyRewards).map((monthYear) => (
            <div key={monthYear}>
              {monthYear}: {data[customerId].monthlyRewards[monthYear]} points
            </div>
          ))}
          <h3>Total Rewards: {data[customerId].totalRewards} points</h3>
        </div>
      ))}
    </div>
  )
}

export default Rewards
