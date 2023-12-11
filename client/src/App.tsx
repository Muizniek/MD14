import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface User {
  id?: number;
  name: string;
  age: number;
  country: string;
  hobby: string;
  image: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [country, setCountry] = useState<string>('');
  const [hobby, setHobby] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setName('');
    setAge(0);
    setCountry('');
    setHobby('');
    setImage('');
    setSelectedUserId(null);
  };

  const fetchUsers = () => {
    axios.get<User[]>('http://localhost:3001/users').then((response) => {
      setUsers(response.data);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserId) {
      axios.put(`http://localhost:3001/update/${selectedUserId}`, {
        name,
        age,
        country,
        hobby,
        image,
      }).then(() => {
        console.log('User updated!');
        fetchUsers();
        resetForm();
      });
    } else {
      axios.post('http://localhost:3001/create', {
        name,
        age,
        country,
        hobby,
        image,
      }).then(() => {
        console.log('User created!');
        fetchUsers();
        resetForm();
      });
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUserId(user.id || null);
    setName(user.name);
    setAge(user.age);
    setCountry(user.country);
    setHobby(user.hobby);
    setImage(user.image);
  };

  const handleDelete = (userId: number) => {
    axios.delete(`http://localhost:3001/delete/${userId}`).then(() => {
      console.log('User deleted!');
      fetchUsers();
    });
  };

  return (
    <>
      <form className="form-wrapper" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          required
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <label>Age:</label>
        <input
          type="number"
          required
          value={age}
          onChange={(event) => {
            setAge(Number(event.target.value));
          }}
        />
        <label>Country:</label>
        <input
          type="text"
          required
          value={country}
          onChange={(event) => {
            setCountry(event.target.value);
          }}
        />
        <label>Hobby:</label>
        <input
          type="text"
          required
          value={hobby}
          onChange={(event) => {
            setHobby(event.target.value);
          }}
        />
        <label>Image URL:</label>
        <input
          type="text"
          required
          value={image}
          onChange={(event) => {
            setImage(event.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img src={user.image} alt={`Image for ${user.name}`} />
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Age:</strong> {user.age} years old
            </p>
            <p>
              <strong>Country:</strong> {user.country}
            </p>
            <p>
              <strong>Hobby:</strong> {user.hobby}
            </p>
            <div className='edit-delete-buttons'>
              <button className='edit' onClick={() => handleEdit(user)}>Edit</button>
              <button className='delete' onClick={() => handleDelete(user.id || 0)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
