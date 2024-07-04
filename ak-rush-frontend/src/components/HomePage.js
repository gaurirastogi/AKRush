import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [rushees, setRushees] = useState([]);
  const [filteredRushees, setFilteredRushees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRushees = async () => {
      const response = await axios.get('http://127.0.0.1:5000/api/rushees');
      setRushees(response.data);
      setFilteredRushees(response.data);
    };

    fetchRushees();
  }, []);

  useEffect(() => {
    const results = rushees.filter(rushee =>
      rushee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rushee.major.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRushees(results);
  }, [searchTerm, rushees]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-8">Rushees</h1>
      <input
        type="text"
        placeholder="Search by name or major..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div>
        {filteredRushees.map((rushee) => (
          <Link to={`/rushee/${rushee.id}`} key={rushee.id} className="block p-4 shadow border rounded mb-4 flex items-center hover:bg-gray-100">
            <img src={`http://127.0.0.1:5000/static/${rushee.photo}`} alt={rushee.name} className="h-16 w-16 rounded-full mr-4" />
            <div>
              <p className="text-xl font-semibold">{rushee.name}</p>
              <p>{rushee.major}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;