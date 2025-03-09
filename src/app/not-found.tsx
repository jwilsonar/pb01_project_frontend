'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

export default function NotFound() {
  const router = useRouter();

  return (
    <div>
      <h1>No encontrado</h1>
      <p>La página que estás buscando no existe.</p>
      <Button onClick={() => router.push('/')}>Volver al inicio</Button>    
    </div>
  );
}
