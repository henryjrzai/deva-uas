import { useEffect, useState } from 'react';
import Layout from "../../components/Layout/Layout"
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/service/auth.service'
import { getCurrentUser, isAdmin, logout } from '@/utils/auth';
import Loading from '../../components/Layout/Loading';
import Products from '../../components/Dashboard/Products';

const products = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (!isAuthenticated()) {
                router.push('/');
                return;
            }
            const currentUser = getCurrentUser();
            if (!currentUser || !isAdmin()) {
                router.push('/');
                return;
            }

            setUser(currentUser);

            setLoading(false);
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
          <Loading/>
        );
      }

    return (
        <Layout>
            <Products/>
        </Layout>
    )
}

export default products