'use client'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'

export default function SearchHero() {
  const [tab, setTab] = useState('hourly')
  const [location, setLocation] = useState(null)
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [startDate, endDate] = dateRange

  const handleSearch = () => {
    // You can send `location` and `dateRange` to your API here
    console.log({ location, startDate, endDate })
  }

  const locationOptions = async (inputValue) => {
    // Replace with real API call (Google, Mapbox, etc.)
    return [
      { value: 'chicago', label: 'Chicago, IL' },
      { value: 'newyork', label: 'New York, NY' },
    ].filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
  }

  return (
    <section className="max-w-xl mx-auto text-center py-10">
      <h1 className="text-3xl font-bold mb-4">Parking made easy, wherever you go</h1>
      <div className="flex justify-center mb-4">
        <button onClick={() => setTab('hourly')} className={`px-4 py-2 ${tab === 'hourly' ? 'bg-gray-300' : 'bg-gray-100'}`}>Hourly/Daily</button>
        <button onClick={() => setTab('monthly')} className={`px-4 py-2 ${tab === 'monthly' ? 'bg-gray-300' : 'bg-gray-100'}`}>Monthly</button>
      </div>
      <div className="mb-4">
        <Select
          placeholder="Where are you going?"
          loadOptions={locationOptions}
          onChange={setLocation}
          defaultOptions
          isClearable
        />
      </div>
      <div className="mb-4">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          showTimeSelect
          dateFormat="Pp"
          className="w-full border p-2"
        />
      </div>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-full" onClick={handleSearch}>
        Find Parking Spots
      </button>
    </section>
  )
}
