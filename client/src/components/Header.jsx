import { useContext, useEffect } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header(){
    const {setUserInfo, userInfo} = useContext(UserContext)
    useEffect(() => {
        fetch('http://localhost:3000/profile', {
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch user profile');
            }
        })
        .then(userInfo => {
            setUserInfo(userInfo);
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            // Handle error state or retry logic as needed
        });
    }, []);

    function logout() {
        fetch('http://localhost:3000/logout', {
            credentials: 'include',
            method: 'POST',
        })
        .then(response => {
            if (response.ok) {
                setUserInfo(null); // Clear user info upon successful logout
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error logging out:', error);
            // Handle error state or retry logic as needed
        });
    }
    

    const username = userInfo?.username

    return(
        <main>
            <header>
                <Link to='/' className='logo'>Treasure <span className='span__logo'>Blogs 📚</span></Link>
                <nav>
                    {username && (
                        <>
                         <Link to="/create">Create Post</Link>
                         <Link onClick={logout}>LogOut</Link>
                        </>
                    )}
                     {!username && (
                            <>
                             <Link to='/login' className=''>Login</Link>
                             <Link to='/register' clLinkssName=''>Register</Link>
                            </>
                        )}
                   
                </nav>
            </header>
          {/*   <div class="iframe-container" id="iframeContainer">
        <iframe
            src="https://shellymimo-chatbot.hf.space"
            frameborder="0"
            width="100%"
            height="100%"
        ></iframe>
    </div> */}
    

        </main>
    )
}