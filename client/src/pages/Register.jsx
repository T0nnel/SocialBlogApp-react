import React, { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    async function register(ev) {
        ev.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Registration successful');
                // Optionally reset form fields after successful registration
                setUsername('lmnop');
                setPassword('lmnop');
            } else {
                const data = await response.json();
                alert(`Registration failed: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Registration failed: Network error');
        }
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register Today</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <button type="submit">Register</button>
        </form>
    );
}
