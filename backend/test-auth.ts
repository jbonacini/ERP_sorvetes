
import axios from 'axios';

async function main() {
    try {
        console.log('1. Testing Login...');
        const loginRes = await axios.post('http://localhost:3000/auth/login', {
            email: 'admin@sorvete.com',
            password: '123456',
        });

        const token = loginRes.data.access_token;
        console.log('Login successful! Token:', token ? 'Received' : 'Missing');

        if (!token) throw new Error('No token received');

        console.log('\n2. Testing Protected Profile...');
        const profileRes = await axios.get('http://localhost:3000/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Profile Response:', profileRes.data);
    } catch (e: any) {
        console.error('Test Failed:', e.response?.data || e.message);
    }
}

main();
