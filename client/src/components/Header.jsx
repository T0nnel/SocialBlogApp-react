import React, { useContext, useEffect } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:3000/profile', {
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch user info');
        })
        .then(userInfo => {
            setUserInfo(userInfo);
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
    },  ); // Empty dependency array ensures this effect runs once on mount

    function logout() {
        fetch('http://localhost:3000/logout', {
            credentials: 'include',
            method: 'POST',
        })
        .then(response => {
            if (response.ok) {
                setUserInfo(null); // Clear user info after successful logout
            } else {
                console.error('Failed to logout');
            }
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    }

    const username = userInfo?.username;

    return (
        <main>
            <header>
                <Link to='/' className='logo'>Treasure <span className='span__logo'>Blogs 📚</span></Link>
                <nav>
                    {username ? (
                        <>
                            <Link to="/create">Create Post</Link>
                            <Link onClick={logout}>LogOut</Link>
                        </>
                    ) : (
                        <>
                            <Link to='/login'>Login</Link>
                            <Link to='/register' className=''>Register</Link> {/* Fixed className here */}
                        </>
                    )}
                </nav>
            </header>
        </main>
    );
}
