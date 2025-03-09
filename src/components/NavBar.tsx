'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false
      });
      toast.success('Cierre de sesión exitoso');
      router.push('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            {session?.user.is_hr && (
              <Link 
                href="/empleados" 
                className="text-white hover:text-gray-300 transition-colors"
              >
              Empleados
            </Link>
            )}
            {!session?.user.is_hr && (
              <Link 
                href="/mi-perfil" 
                className="text-white hover:text-gray-300 transition-colors"
              >
              Mi Perfil
            </Link>
            )}
          </div>
          {session && (
            <Button
              onClick={handleLogout}
              type="button"
              className="text-white hover:text-gray-300 transition-colors"
            >
              Cerrar Sesión
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
